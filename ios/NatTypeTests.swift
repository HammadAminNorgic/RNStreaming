//
//  NatTests.swift
//  iOSSDKStreaming
//
//  Created by Sohaib Hussain on 25/09/2022.
//

import Foundation


extension NatTypeTest{
    func preRunCheck() { }
    func isReadyToRun()-> Bool { return true }
    func isCompleted() -> Bool { return false }
    func runAs(test3: Bool) { }
}

typealias StunPacketAndServerAddress = (stunPacket: StunPacket, severAddress: IPAddress)

protocol NatTypeTest: AnyObject {
    
    var config: NatTypeDetectionConfiguration {get set}
    var results: NatTypeResult {get set}
    var completed: Bool {get set}
    var transactionId: [UInt8] {get set}
    var sentStunPacket: StunPacket! {get set}
    
    init(config: NatTypeDetectionConfiguration, results: NatTypeResult)
    func preRunCheck()
    func isReadyToRun()-> Bool
    func getStunPacket() -> StunPacketAndServerAddress
    func process(stunPacket: StunPacket)
    func notifyTimeOut()
    func isCompleted() -> Bool
    func runAs(test3: Bool)
}


class BindingTest: NatTypeTest {
    
    var config: NatTypeDetectionConfiguration
    var results: NatTypeResult
    var completed: Bool
    var transactionId: [UInt8]
    var sentStunPacket: StunPacket!
    
    required init(config: NatTypeDetectionConfiguration, results: NatTypeResult) {
        self.transactionId = RandomTransactionID.getTransactionID()
        self.completed = false
        self.results = results
        self.config = config
    }
    
    func getStunPacket() -> StunPacketAndServerAddress {
        print("BindingTest getStunPacket()")
        sentStunPacket = StunPacket(msgRequestType: [0x00, 0x01],
                                    bodyLength:  [0x00, 0x00],
                                    magicCookie: MagicCookie,
                                    transactionIdBindingRequest: self.transactionId,
                                    body: nil)
        return (sentStunPacket, config.serverAdress)
    }
    
    func process(stunPacket: StunPacket) {
        
        guard let sentPacket = sentStunPacket, sentPacket.isCorrectResponse(stunPacket) else {
            return
        }
        
        print("Binding request Attributes for Basic Binding")
        sentPacket.attributes().forEach { att in
            print("\(att.getDescription(with: self.transactionId))")
        }
        
        print("Binding response Attributes for Basic Binding")
        stunPacket.attributes().forEach { att in
            print("\(att.getDescription(with: self.transactionId))")
        }
        
        completed = true
        results.bindingTestSucceeded = true
        
        for stunAttribute in stunPacket.attributes() {
            guard let generalAttribute = stunAttribute.attributeType.getAttribute(from: Data(stunAttribute.attributeBodyData), transactionId: self.transactionId, magicCookie: MagicCookie) as? NORMAL_ADDRESS_ATTRIBUTE else { continue }
            switch stunAttribute.attributeType {
                
            case .MAPPED_ADDRESS:
                results.isOpenToInternet = results.localIPAndPort.isSameIPAndPort(for: IPAddress(ipAddress: generalAttribute.ipAddress.description, port: Int(generalAttribute.port)))
                results.mappedIPAndPort = IPAddress(ipAddress: generalAttribute.ipAddress.description, port: Int(generalAttribute.port))
                
            case .OTHER_ADDRESS:
                results.otherAddressIsAvailable = true
                
                let aaAddr = IPAddress(ipAddress: generalAttribute.ipAddress.description, port: Int(generalAttribute.port))
                results.aaAddress = aaAddr
                
                let paAddr = IPAddress()
                paAddr.ipAddress = config.serverAdress.ipAddress
                paAddr.port = aaAddr.port
                results.paAddress = paAddr
                
                let apAddr = IPAddress(ipAddress: aaAddr.ipAddress)  
                apAddr.port = config.serverAdress.port
                results.apAddress = apAddr
                
            default :
                break
            }
        }
        
    }
    
    func notifyTimeOut() {
        completed = true
        results.bindingTestSucceeded = false
    }
    
    func isCompleted() -> Bool{
        return completed
    }
    
}



class BehaviourTest: NatTypeTest {
    
    var config: NatTypeDetectionConfiguration
    var results: NatTypeResult
    var completed: Bool
    var transactionId: [UInt8]
    var sentStunPacket: StunPacket!
    var isTest3: Bool
    
    required init(config: NatTypeDetectionConfiguration, results: NatTypeResult) {
        self.transactionId = RandomTransactionID.getTransactionID()
        self.completed = false
        self.results = results
        self.config = config
        self.isTest3 = false
    }
    
    func preRunCheck() {
        if !isTest3 {
            if results.bindingTestSucceeded && results.isOpenToInternet {
                completed = true
                results.natBehaviorType = .DirectMapping
                results.behaviorTestSucceeded = true
            }
        }
    }
    
    func isReadyToRun() -> Bool {
        var ready = !completed && results.bindingTestSucceeded && results.otherAddressIsAvailable && !results.behaviorTestSucceeded
        if isTest3 {
            ready = ready && !results.apAddressMapping.isDefaulted()
        }
        return ready
    }
    
    func getStunPacket() -> StunPacketAndServerAddress {
        print("getStunPacket() for Behavior test : \(isTest3 ? "3" : "2")")
        sentStunPacket = StunPacket(msgRequestType: [0x00, 0x01],
                                    bodyLength:  [0x00, 0x00],
                                    magicCookie: MagicCookie,
                                    transactionIdBindingRequest: self.transactionId,
                                    body: nil)
        let ipAddr : IPAddress
        
        if isTest3 {
            ipAddr = results.aaAddress
        } else {
            ipAddr = results.apAddress
        }
        
        return (sentStunPacket, ipAddr)
    }
    
    
    func process(stunPacket: StunPacket) {
        print("Behavior test: \(isTest3 ? "3" : "2")")
        guard let sentPacket = sentStunPacket, sentPacket.isCorrectResponse(stunPacket) else {
            return
        }
        print("Binding request Attributes for Behavior Test")
        sentPacket.attributes().forEach { att in
            print("\(att.getDescription(with: self.transactionId))")
        }
        
        print("Binding response Attributes Behavior Test")
        stunPacket.attributes().forEach { att in
            print("\(att.getDescription(with: self.transactionId))")
        }
        
        completed = true
        
        
        let mappedAddr = IPAddress()
        
        for stunAttribute in stunPacket.attributes() {
            guard let generalAttribute = stunAttribute.attributeType.getAttribute(from: Data(stunAttribute.attributeBodyData), transactionId: self.transactionId, magicCookie: MagicCookie) as? NORMAL_ADDRESS_ATTRIBUTE else { continue }
            switch stunAttribute.attributeType {
            case .MAPPED_ADDRESS, .XOR_MAPPED_ADDRESS:
                mappedAddr.ipAddress = generalAttribute.ipAddress.description
                mappedAddr.port = Int(generalAttribute.port)
            default :
                break
            }
            
            if isTest3 {
                results.aaAddressMapping = mappedAddr
                results.behaviorTestSucceeded = true
                if mappedAddr.isSameIPAndPort(for: results.apAddressMapping){
                    results.natBehaviorType = .AddressDependentMapping
                } else {
                    results.natBehaviorType = .AddressAndPortDependentMapping
                }
            } else {
                results.apAddressMapping = mappedAddr
                if (mappedAddr.isSameIPAndPort(for: results.mappedIPAndPort)) {
                    results.behaviorTestSucceeded = true
                    results.natBehaviorType = .EndpointIndependentMapping;
                }
            }
        }
        
    }
    
    func notifyTimeOut() {
        completed = true
        results.behaviorTestSucceeded = false
    }
    
    func runAs(test3: Bool) {
        isTest3 = test3
    }
    
    func isCompleted() -> Bool{
        return completed
    }
}



class FilteringTest: NatTypeTest {
    var config: NatTypeDetectionConfiguration
    
    var results: NatTypeResult
    
    var completed: Bool
    
    var transactionId: [UInt8]
    
    var sentStunPacket: StunPacket!
    
    var isTest3: Bool
    
    required init(config: NatTypeDetectionConfiguration, results: NatTypeResult) {
        self.transactionId = RandomTransactionID.getTransactionID()
        self.completed = false
        self.results = results
        self.config = config
        self.isTest3 = false
    }
    
    func preRunCheck() {
        if !isTest3 {
            if results.bindingTestSucceeded && results.isOpenToInternet {
                completed = true
                results.natFilteringType = .EndpointIndependentFiltering
                results.filteringTestSucceeded = true
            }
        }
    }
    
    func isReadyToRun() -> Bool {
        let check = !completed && results.bindingTestSucceeded && results.otherAddressIsAvailable && !results.filteringTestSucceeded && !results.didReceiveResponseForTest2
        return check

    }
    
    func getStunPacket() -> StunPacketAndServerAddress {
        let change : CHANGE_REQUEST
        if !isTest3 {
            change = CHANGE_REQUEST(protocolFamily: .ipv4, changeType: .Both)
        } else {
            change = CHANGE_REQUEST(protocolFamily: .ipv4, changeType: .P)
        }
        sentStunPacket = StunPacket(msgRequestType: [0x00, 0x01], bodyLength: [0x00, 0x08], magicCookie: MagicCookie, transactionIdBindingRequest: self.transactionId, body: change.toData())
        return (sentStunPacket,config.serverAdress)
    }
    
    func process(stunPacket: StunPacket) {
        
        guard let sentPacket = sentStunPacket, sentPacket.isCorrectResponse(stunPacket) else {
            return
        }
        
        print("Binding request Attributes for Filtering Test")
        sentPacket.attributes().forEach { att in
            print("\(att.getDescription(with: self.transactionId))")
        }
        
        print("Binding response Attributes for Filtering Test")
        stunPacket.attributes().forEach { att in
            print("\(att.getDescription(with: self.transactionId))")
        }
        
        
        
        completed = true
        
        if isTest3{
            results.didReceiveResponseForTest3 = true
            results.filteringTestSucceeded = true
            results.natFilteringType = .AddressDependentFiltering
        } else {
            results.didReceiveResponseForTest2 = true
            results.filteringTestSucceeded = true
            results.natFilteringType = .EndpointIndependentFiltering
        }
        
    }
    
    func notifyTimeOut() {
        //MARK: for filtering type tests test2 and test3 might not come back with a response
           completed = true
        //MARK: we don't run test3 if we get a response from test2
        //MARK: if test3 fails (no response) this means test 2 also failed
           if isTest3 {
               results.filteringTestSucceeded = true
               results.natFilteringType = .AddressAndPortDependentFiltering;
           }
    }
    
    
    func runAs(test3: Bool) {
        isTest3 = test3
    }
    
    func isCompleted() -> Bool{
        return completed
    }
    
}
