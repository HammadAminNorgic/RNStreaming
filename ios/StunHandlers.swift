
import Foundation
import NIO

/// Decode byte buffer to Stun packet
final class StunCodec: ByteToMessageDecoder {
    public typealias InboundIn = ByteBuffer
    public typealias InboundOut = StunPacket
        
    public func decode(context: ChannelHandlerContext, buffer: inout ByteBuffer) throws -> DecodingState {
        guard let packet = buffer.withUnsafeReadableBytes({pointer in StunPacket.parse(from: pointer)}) else {
             return .needMoreData
        }
        
        buffer.moveReaderIndex(to: packet.toData().count)
        context.fireChannelRead(self.wrapInboundOut(packet))
        return .continue
    }
}

/// Convert AddressEnvelope to Byte buffer  for ByteToMessageDecoder
final class EnvelopToByteBufferConverter: ChannelInboundHandler {
    public typealias InboundIn = AddressedEnvelope<ByteBuffer>
    public typealias InboundOut = ByteBuffer
    public typealias ErrorHandler = ((StunError) -> ())?
    
    private let errorHandler: ErrorHandler
    
    init(errorHandler: ErrorHandler) {
        self.errorHandler = errorHandler
    }
    
    public func channelRead(context: ChannelHandlerContext, data: NIOAny) {
        let envelope = self.unwrapInboundIn(data)
        let byteBuffer = envelope.data
        context.fireChannelRead(self.wrapInboundOut(byteBuffer))
    }
    
    public func errorCaught(context: ChannelHandlerContext, error: Error) {
        errorHandler?(.cantRead(error.localizedDescription))
        context.close(promise: nil)
    }
}

/// Handle reading attributes and errors
final class StunInboundHandler: ChannelInboundHandler {
    public typealias InboundIn = StunPacket
    public typealias OutboundOut = AddressedEnvelope<ByteBuffer>
    public typealias ErrorHandler = ((StunError) -> ())?
    public typealias StunPacketHandler = ((StunPacket, Bool) -> Void)?
    public typealias AttributesHandler = (([StunAttribute], Bool, [UInt8]) -> ())?
     
    private let errorHandler: ErrorHandler
    private let attributesHandler:  AttributesHandler
    private let stunPacketHandler: StunPacketHandler
    private var sentPacket: StunPacket?
    
    init(errorHandler: ErrorHandler, attributesHandler: AttributesHandler,  stunPacketHandler: StunPacketHandler) {
        self.errorHandler = errorHandler
        self.attributesHandler = attributesHandler
        self.stunPacketHandler = stunPacketHandler
    }
    
    public func sendBindingRequest(channel: Channel, toStunServerAddress address: String, toStunServerPort port: Int) {
        let remoteAddress: SocketAddress
        do {
            remoteAddress = try SocketAddress.makeAddressResolvingHost(address, port: port)
        } catch {
            errorHandler?(.cantResolveStunServerAddress)
            return
        }

        let protocolFamily = remoteAddress.protocol == .inet ? ProtocolFamily.ipv4 : ProtocolFamily.ipv6
        sentPacket = StunPacket.makeBindingRequest(with: protocolFamily)
        let requestData = sentPacket!.toData()
 
        var buffer = channel.allocator.buffer(capacity: requestData.count)
        buffer.writeBytes(requestData)

        let envolope = AddressedEnvelope<ByteBuffer>(remoteAddress: remoteAddress, data: buffer)
        
        channel.writeAndFlush(self.wrapOutboundOut(envolope), promise: nil)
    }
    
    
    
    public func sendBindingRequest(channel: Channel, serverAddr: IPAddress, packet: StunPacket) {
        let remoteAddress: SocketAddress
        do {
            remoteAddress = try SocketAddress.makeAddressResolvingHost(serverAddr.ipAddress, port: serverAddr.port)
        } catch {
            errorHandler?(.cantResolveStunServerAddress)
            return
        }
        sentPacket = packet
        let requestData = sentPacket!.toData()
        var buffer = channel.allocator.buffer(capacity: requestData.count)
        buffer.writeBytes(requestData)
        let envolope = AddressedEnvelope<ByteBuffer>(remoteAddress: remoteAddress, data: buffer)
        channel.writeAndFlush(self.wrapOutboundOut(envolope), promise: nil)
    }
    
    
    public func channelRead(context: ChannelHandlerContext, data: NIOAny) {
        let packet = self.unwrapInboundIn(data)
       
        guard let sentPacket = sentPacket, sentPacket.isCorrectResponse(packet) else {
            errorHandler?(.wrongResponse)
            return
        }
        
        stunPacketHandler?(packet, packet.isError())
        
        attributesHandler?(packet.attributes(), packet.isError(), sentPacket.transactionIdBindingRequest)
        
    }
    
    public func errorCaught(context: ChannelHandlerContext, error: Error) {
        errorHandler?(.cantRead(error.localizedDescription))
        context.close(promise: nil)
    }
    
    public func userInboundEventTriggered(context: ChannelHandlerContext, event: Any) {
        guard event is IdleStateHandler.IdleStateEvent else { return }
        
        errorHandler?(.readTimeout)
        context.close(promise: nil)
    }
}

extension StunPacket {
    static func parse(from data: UnsafeRawBufferPointer) -> StunPacket? {
        guard data.count >= StunPacket.stunHeaderLength, data.count == Int(data[2])*256 + Int(data[3]) + 20 else {
            return nil
        }
        
        return StunPacket(msgRequestType: [UInt8](data[0..<2]),
                                bodyLength:  [UInt8](data[2..<4]),
                                magicCookie: [UInt8](data[4..<8]),
                                transactionIdBindingRequest: [UInt8](data[8..<20]),
                                body: [UInt8](data[20..<data.count]))
    }
}
