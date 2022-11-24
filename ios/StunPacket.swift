
import Foundation

let MagicCookie: [UInt8] = [0x21, 0x12, 0xA4, 0x42]

struct RandomTransactionID {
    static func getTransactionID() -> Array<UInt8> {
        var transactionID: Array = Array<UInt8>()
        for _ in 0...11 {
            transactionID.append(UInt8(arc4random_uniform(UInt32(UInt8.max))))
        }
        return transactionID
    }
}

struct StunPacket {
    public static let stunHeaderLength: UInt16 = 20
    let msgRequestType: [UInt8] //2 bytes
    let bodyLength: [UInt8] //2 bytes
    let magicCookie: [UInt8] //4 bytes
    let transactionIdBindingRequest: [UInt8] //12 bytes
    let body: [UInt8]? //attributes
    
    init(msgRequestType: [UInt8],
         bodyLength: [UInt8],
         magicCookie: [UInt8],
         transactionIdBindingRequest: [UInt8],
         body: [UInt8]?) {
        
        self.msgRequestType = msgRequestType
        self.bodyLength = bodyLength
        self.magicCookie = magicCookie
        self.transactionIdBindingRequest = transactionIdBindingRequest
        self.body = body
    }
    
    func toData() -> Data {
        let dataArry : [UInt8]
        if let body = self.body {
            dataArry = msgRequestType + bodyLength + magicCookie + transactionIdBindingRequest + body
        } else {
            dataArry = msgRequestType + bodyLength + magicCookie + transactionIdBindingRequest
        }
        return Data(dataArry)
    }
    
    
    static func bytes<U: FixedWidthInteger,V: FixedWidthInteger>(
        of value    : U,
        to type     : V.Type,
        droppingZeros: Bool
        ) -> [V]{

        let sizeInput = MemoryLayout<U>.size
        let sizeOutput = MemoryLayout<V>.size

        precondition(sizeInput >= sizeOutput, "The input memory size should be greater than the output memory size")

        var value = value
        let a =  withUnsafePointer(to: &value, {
            $0.withMemoryRebound(
                to: V.self,
                capacity: sizeInput,
                {
                    Array(UnsafeBufferPointer(start: $0, count: sizeInput/sizeOutput))
            })
        })

        let lastNonZeroIndex =
            (droppingZeros ? a.lastIndex { $0 != 0 } : a.indices.last) ?? a.startIndex

        return Array(a[...lastNonZeroIndex].reversed())
    }
    
    static func makeBindingRequest(with family: ProtocolFamily) -> StunPacket  {
     
        return StunPacket(msgRequestType: [0x00, 0x01],
                                bodyLength:  [0x00, 0x00],
                                magicCookie: MagicCookie,
                                transactionIdBindingRequest: RandomTransactionID.getTransactionID(),
                                body: nil
        )
       REQUESTED_ADDRESS_FAMILY(protocolFamily: family).toData()
    }
    
    static func parse(from data: Data) -> StunPacket? {
        guard data.count >= stunHeaderLength, data.count == Int(data[2])*256 + Int(data[3]) + 20 else {
            return nil
        }
        
        return StunPacket(msgRequestType: [UInt8](data[0..<2]),
                          bodyLength:  [UInt8](data[2..<4]),
                          magicCookie: [UInt8](data[4..<8]),
                          transactionIdBindingRequest: [UInt8](data[8..<20]),
                          body: [UInt8](data[20..<data.count]))
    }
    
    func attributes() ->  [StunAttribute] {
        var attributes: [StunAttribute] = []
        guard var body: Array<UInt8> = self.body else { return attributes }
        repeat {
            guard let attribute = StunAttribute.getAttribute(from: body) else { break }
            
            body.removeFirst(attribute.attributeLength)
            attributes.append(attribute)
            
            if attribute.attributeType == .ERROR_CODE { break }
        } while (body.count >= 4)
        
        return attributes
    }
    
    func isCorrectResponse(_ response: StunPacket) -> Bool {
        guard let requestType = StunMessageType.fromData(Data(msgRequestType)),
            let responseType = StunMessageType.fromData(Data(response.msgRequestType)),
            requestType.isCorrectResponse(responseType),
            magicCookie == MagicCookie,
            transactionIdBindingRequest == response.transactionIdBindingRequest else {
                return false
        }
               
        return true
    }
    
    func isError() -> Bool {
        if let responseType = StunMessageType.fromData(Data(msgRequestType)),
            responseType.isErrorType() { return true }
        
        return false
    }
}

struct StunAttribute {
    private let attributeTypeData: [UInt8]
    private let attributeLengthData: [UInt8]
    let attributeBodyData: [UInt8]
    
    var attributeLength: Int {
        return attributeTypeData.count + attributeLengthData.count + attributeBodyData.count
    }
    
    var attributeType: AttributeType {
        return AttributeType(rawValue: UInt16(self.attributeTypeData[0]) * 256 + UInt16(self.attributeTypeData[1])) ?? .UNKNOWN
    }
    
    func toArray() -> [UInt8] {
        return self.attributeTypeData + self.attributeLengthData + self.attributeBodyData
    }
    
    func getDescription(with transactionId: [UInt8]) -> String {
        let atrribute = attributeType.getAttribute(from: Data(self.attributeBodyData),
                                                   transactionId: transactionId,
                                                   magicCookie: MagicCookie)
        return "\(attributeType) \n \(atrribute?.description ?? "description unavailable")"
    }
    
    static func getAttribute(from data: [UInt8]) -> StunAttribute? {
        guard data.count > 4,
              data.count >= Int(data[2]) * 256 + Int(data[3]) else { return nil }
        
        return StunAttribute(attributeTypeData: [UInt8](data[0..<2]),
                             attributeLengthData:  [UInt8](data[2..<4]),
                             attributeBodyData: [UInt8](data[4..<4 + Int(data[2]) * 256 + Int(data[3])]))
    }
    
    static func formAttribute(type: AttributeType, body:[UInt8]) -> StunAttribute {
        return StunAttribute(attributeTypeData: [UInt8(type.rawValue / 256), UInt8(type.rawValue % 256)],
                             attributeLengthData: [UInt8(body.count / 256), UInt8(body.count % 256)],
                             attributeBodyData: body
        )
    }
}
