import NIO
import Foundation

//public enum NatType {
//    case noNat
//    case blocked
//    case fullCone
//    case symmetric
//    case portRestricted
//    case coneRestricted
//}

//public struct NatParams {
//    let myExternalIP: String
//    let myExternalPort: Int
//    let natType: NatType
//    public var description: String { return "External IP: \(myExternalIP) \n External Port: \(myExternalPort) \n NAT Type: \(natType) \n" }
//}

public enum StunError: Error, Equatable {
    case cantConvertValue
    case cantPreparePacket
    case cantRunUdpSocket(String)
    case cantResolveStunServerAddress
    case stunServerError(StunServerError)
    case cantRead(String)
    case wrongResponse
    case readTimeout
    
    public var errorDescription: String {
        switch self {
        case .cantRunUdpSocket(let lowLevelError), .cantRead(let lowLevelError): return "\(self), \(lowLevelError)"
        case .stunServerError(let lowLevelError): return "\(self), \(lowLevelError)"
        default: return "\(self)"
        }
    }
}

fileprivate enum StunState {
    case initial
    case firstRequest
    case secondRequestWithAnotherPort
}

open class StunClient {
    private enum ClientMode {
        case whoAmI
        case natTypeDiscovery
    }
    
    private let stunIpAddress: String
    private let stunPort: UInt16
    private let localPort: UInt16
    private let timeoutInMilliseconds: Int64
    private var successCallback: ((String, Int) -> ())?
//    private var natTypeCallback: ((NatParams) -> ())?
    private var natTypeResultCallback: ((NatTypeResult) -> ())?
    private var errorCallback: ((StunError) -> ())?
    private var verboseCallback: ((String) -> ())?
    private var mode: ClientMode = .whoAmI
    
    private var group: MultiThreadedEventLoopGroup?
    private var bootstrap: DatagramBootstrap?
    
    private var stunHandler : StunInboundHandler!
    
    private var serverAddr: IPAddress!
    private var localAddr: IPAddress!
    
    private var natTypeDetection: NatTypeDetection!
    
    
    
    private func initBootstrap() {
        group = MultiThreadedEventLoopGroup(numberOfThreads: 1)
        
        bootstrap = DatagramBootstrap(group: group!)
            .channelOption(ChannelOptions.socketOption(.so_reuseaddr), value: 1)
            .channelInitializer { channel in
                channel.pipeline.addHandlers([
                    EnvelopToByteBufferConverter(errorHandler: self.errorHandler),
                    ByteToMessageHandler(StunCodec()),
                    IdleStateHandler(readTimeout: TimeAmount.milliseconds(self.timeoutInMilliseconds)),
                    self.stunHandler
                ])
            }
    }
    
    private func closeBootstrap() {
        try! self.group?.syncShutdownGracefully()
    }
    
    private func closeBootstrapSync() {
        try! self.group?.syncShutdownGracefully()
    }
    
    required public init(stunIpAddress: String, stunPort: UInt16, localPort: UInt16 = 0, timeoutInMilliseconds: Int64 = 100) {
        self.stunIpAddress = stunIpAddress
        self.stunPort = stunPort
        self.localPort = localPort == 0 ? UInt16.random(in: 10000..<55000) : localPort
        self.timeoutInMilliseconds = timeoutInMilliseconds
        self.serverAddr = IPAddress(ipAddress: stunIpAddress, port: Int(stunPort))
        self.localAddr = IPAddress(ipAddress: getIPAddress(), port: Int(self.localPort))
    }
    
    public func whoAmI() -> StunClient {
        mode = .whoAmI
        stunHandler = StunInboundHandler(errorHandler: self.errorHandler,
                                         attributesHandler: self.attributesHandler, stunPacketHandler: nil)
        return self
    }
    
    public func discoverNatType() -> StunClient {
        mode = .natTypeDiscovery
        stunHandler = StunInboundHandler(errorHandler: self.errorHandler,
                                                       attributesHandler: nil, stunPacketHandler: self.stunPacketHandler)
        return self
    }
    
    public func ifWhoAmISuccessful(_ callback: @escaping (String, Int) -> ()) -> StunClient {
        guard successCallback == nil else { fatalError("successCallback can be assigned only once") }
        
        successCallback = callback
        return self
    }
    
       public func ifNatTypeDetectingSuccessful(_ callback: @escaping (NatTypeResult) -> ()) -> StunClient {
                guard natTypeResultCallback == nil else { fatalError("natTypeResultCallback can be assigned only once") }
                
                natTypeResultCallback = callback
                return self
            }


    
//    public func ifNatTypeSuccessful(_ callback: @escaping (NatParams) -> ()) -> StunClient {
//        guard natTypeCallback == nil else { fatalError("natTypeCallback can be assigned only once") }
//
//        natTypeCallback = callback
//        return self
//    }
    
    public func ifError(_ callback: @escaping (StunError) -> ()) -> StunClient {
        guard errorCallback == nil else { fatalError("errorCallback can be assigned only once") }
        
        errorCallback = callback
        return self
    }
    
    public func verbose(_ callback: @escaping (String) -> ()) -> StunClient {
        guard verboseCallback == nil else { fatalError("verboseCallback can be assigned only once") }
        
        verboseCallback = callback
        return self
    }
    
    public func start() {
      print("in Nat start ")
        switch mode {
        case .whoAmI:
            startWhoAmI()
        case .natTypeDiscovery:
            let config = NatTypeDetectionConfiguration(serverAdress: self.serverAddr)
            let results = NatTypeResult(serverAdress: self.serverAddr, localIPAndPort: self.localAddr)
            self.natTypeDetection = NatTypeDetection(config: config, results: results)
            natTypeDetection.natTypeDetectionCallBack = { natTypeDetectionCallBackType in
                switch natTypeDetectionCallBackType {
                case .Waiting:
                    break
                case .Results:
                    self.natTypeResultCallback?(self.natTypeDetection.testResult())
                    DispatchQueue.global().async {
                        self.closeBootstrap()
                    }
                case .TimeOut:
                    self.natTypeDetection.errorFor(stunPacket: nil, error: .readTimeout)
                    self.startNatTypeDiscovery()
                }
            }
            startNatTypeDiscovery()
        }
    }
    
    private func errorHandler(_ error: StunError) {
        switch mode {
        case .natTypeDiscovery:
            natTypeDetection?.errorFor(stunPacket: nil, error: error)
            startNatTypeDiscovery()
            break
        case .whoAmI:
            errorCallback?(error)
            closeBootstrap()
        }
        
    }
    
    private func stunPacketHandler(_ packet: StunPacket, responseWithError: Bool) {
        natTypeDetection.process(stunPacket: packet)
        startNatTypeDiscovery()
    }
    
    private func attributesHandler(_ attributes: [StunAttribute],
                                   responseWithError: Bool,
                                   transactionId: [UInt8]) {
        defer {
            DispatchQueue.global().async {
                self.closeBootstrap()
            }
            
        }
        
        if let verboseCallback = verboseCallback {
            attributes.forEach { attribute in
                verboseCallback(attribute.getDescription(with: transactionId))
            }
        }
        
        if responseWithError {
            if let attribute = attributes.filter({ $0.attributeType == AttributeType.ERROR_CODE}).first,
               let errorPacket = attribute.attributeType.getAttribute(from: Data((attribute.attributeBodyData)),
                                                                      transactionId: transactionId,
                                                                      magicCookie: MagicCookie) as? ERROR_CODE_ATTRIBUTE {
                errorCallback?(StunError.stunServerError(errorPacket.errorCode))
                return
            }
            errorCallback?(StunError.stunServerError(.unknown))
        }
        
        guard let attribute = attributes.filter({ $0.attributeType.getAttribute(from: Data(($0.attributeBodyData)),
                                                                                transactionId: transactionId,
                                                                                magicCookie: MagicCookie) is GeneralAddressAttribute}).first,
              let addressPacket = attribute.attributeType.getAttribute(from: Data((attribute.attributeBodyData)),
                                                                       transactionId: transactionId,
                                                                       magicCookie: MagicCookie) as? GeneralAddressAttribute else {
                errorCallback?(StunError.cantConvertValue)
                return
        }
        
        successCallback?(addressPacket.address, Int(addressPacket.port))
    }
    
    private func startWhoAmI() {
        DispatchQueue.global(qos: .default).async {
            self.verboseCallback?("Start Who Am I procedure with Stun server \(self.stunIpAddress):\(self.stunPort) from local port \(self.localPort)")
            
            self.closeBootstrapSync()
            
            self.initBootstrap()
            
            let _ = self.startStunBindingProcedure()!.always({ result in
                    switch result {
                    case .success(let channel):
                        self.stunHandler.sendBindingRequest(channel: channel,
                                                            toStunServerAddress: self.stunIpAddress,
                                                            toStunServerPort: Int(self.stunPort))
                    case .failure(let error):
                        self.errorCallback?(.cantRunUdpSocket((error as? NIO.IOError)?.description ?? error.localizedDescription))
                    }
                })
            
        }
      
    }
    
    private func startNatTypeDiscovery() {
        print("startNatTypeDiscovery when natTypeDetection.currentIndex: \(natTypeDetection.currentIndex)")
        guard self.natTypeDetection.completed == false else {return}
        DispatchQueue.global(qos: .default).async {
            self.closeBootstrapSync()
            self.initBootstrap()
            let _ = self.startStunBindingProcedure()!.always({ result in
                switch result {
                case .success(let channel):
                    guard let data = self.natTypeDetection.getStunPacketAndIPAddress() else {
                        return
                    }
                    self.stunHandler.sendBindingRequest(channel: channel, serverAddr: data.severAddress, packet: data.stunPacket)
                case .failure(let error):
                    self.errorCallback?(.cantRunUdpSocket((error as? NIO.IOError)?.description ?? error.localizedDescription))
                }
            })
        }
       
    }
    
    private func startStunBindingProcedure() -> EventLoopFuture<Channel>?  {
        let ipv4LocalAddress = "0.0.0.0"
        let ipv6LocalAddress = "::"
        
        let remoteAddress: SocketAddress
        do {
            remoteAddress = try SocketAddress.makeAddressResolvingHost(stunIpAddress,
                                                                       port: Int(stunPort))
        } catch {
            return self.bootstrap?.bind(host: ipv4LocalAddress,
                                        port: Int(self.localPort))
        }

        let localAddress = remoteAddress.protocol == .inet ? ipv4LocalAddress : ipv6LocalAddress
        return self.bootstrap?.bind(host: localAddress,
                                    port: Int(self.localPort))
    }
    
    
    private func getIPAddress() -> String {
        var address: String?
        var ifaddr: UnsafeMutablePointer<ifaddrs>? = nil
        if getifaddrs(&ifaddr) == 0 {
            var ptr = ifaddr
            while ptr != nil {
                defer { ptr = ptr?.pointee.ifa_next }

                guard let interface = ptr?.pointee else { return "" }
                let addrFamily = interface.ifa_addr.pointee.sa_family
                if addrFamily == UInt8(AF_INET) || addrFamily == UInt8(AF_INET6) {

                    // wifi = ["en0"]
                    // wired = ["en2", "en3", "en4"]
                    // cellular = ["pdp_ip0","pdp_ip1","pdp_ip2","pdp_ip3"]

                    let name: String = String(cString: (interface.ifa_name))
                    if  name == "en0" || name == "en2" || name == "en3" || name == "en4" || name == "pdp_ip0" || name == "pdp_ip1" || name == "pdp_ip2" || name == "pdp_ip3" {
                        var hostname = [CChar](repeating: 0, count: Int(NI_MAXHOST))
                        getnameinfo(interface.ifa_addr, socklen_t((interface.ifa_addr.pointee.sa_len)), &hostname, socklen_t(hostname.count), nil, socklen_t(0), NI_NUMERICHOST)
                        address = String(cString: hostname)
                    }
                }
            }
            freeifaddrs(ifaddr)
        }
        print("my ip: \(address ?? "0.0.0.0")")
        return address ?? "0.0.0.0"
    }
}
