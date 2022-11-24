//
//  NatTypeDetection.swift
//  iOSSDKStreaming
//
//  Created by Sohaib Hussain on 25/09/2022.
//

import Foundation

public enum NatBehaviourType: String  {
    case UnknownBehavior = "unknown-behavior"
    case DirectMapping = "Direct-Mapping"
    case EndpointIndependentMapping = "Endpoint-Independent"
    case AddressDependentMapping = "Address-Dependent"
    case AddressAndPortDependentMapping = "Port-Dependent"
    
}

public enum NatFilteringType: String {
    case UnknownFiltering = "unknown-filtering"
    case DirectConnectionFiltering = "Direct-Connection-Filtering"
    case EndpointIndependentFiltering = "Endpoint-Independent"
    case AddressDependentFiltering = "Address-Dependent"
    case AddressAndPortDependentFiltering = "Port-Dependent"

}

public class IPAddress: CustomStringConvertible {
    
    public var description: String {
        let des = "ipAddress:\(ipAddress) port:\(port)"
        return des
    }
    
    public var ipAddress: String
    public var port: Int
    init(ipAddress: String = "", port: Int = -1) {
        self.ipAddress = ipAddress
        self.port = port
    }
    
    func isSameIPAndPort(for ipAddress: IPAddress) -> Bool {
        return self.ipAddress == ipAddress.ipAddress && self.port == ipAddress.port
    }
    
    func isDefaulted() -> Bool {
        return ipAddress.isEmpty && port == -1
    }
}


class NatTypeDetectionConfiguration {
    var serverAdress: IPAddress
    var timeOutIsInstant: Bool
    var timeoutInMilliSeconds: TimeInterval
    var maxAttempts: Int
    var behaviourTest: Bool
    var filetringTest: Bool
    init(serverAdress: IPAddress, timeOutIsInstant: Bool = false,
         timeoutInMilliSeconds: TimeInterval = 100, maxAttempts: Int = 2,
         behviourTest: Bool = true , filetringTest: Bool = true) {
        self.serverAdress = serverAdress
        self.timeOutIsInstant = timeOutIsInstant
        self.timeoutInMilliSeconds = timeoutInMilliSeconds
        self.maxAttempts = maxAttempts
        self.behaviourTest = behviourTest
        self.filetringTest = filetringTest
    }
}

public class NatTypeResult : CustomStringConvertible {
    
    public var description: String {
        let des = """
    Binding Test Result \n
    bindingTestSucceeded: \(bindingTestSucceeded)\n
    isOpenToInternet: \(isOpenToInternet)\n
    serverAdress: \(serverAdress)\n
    localIPAndPort: \(localIPAndPort)\n
    mappedIPAndPort: \(mappedIPAndPort)\n
    otherAddressIsAvailable: \(otherAddressIsAvailable)\n
    paAddress: \(paAddress)\n
    apAddress: \(apAddress)\n
    aaAddress: \(aaAddress) \n
    Nat Behavior Test Result \n
    behaviorTestSucceeded: \(behaviorTestSucceeded) \n
    natBehaviorType: \(natBehaviorType) \n
    apAddressMapping: \(apAddressMapping) \n
    aaAddressMapping: \(aaAddressMapping) \n
    Nat Filtering Test Result \n
    filteringTestSucceeded: \(filteringTestSucceeded)\n
    natFilteringType: \(natFilteringType)\n
    didReceiveResponseForTest2: \(didReceiveResponseForTest2)\n
    didReceiveResponseForTest3: \(didReceiveResponseForTest3)\n

"""
        return des
    }
    
    // Initial binding Test
    var bindingTestSucceeded: Bool
    var isOpenToInternet: Bool
    var serverAdress: IPAddress
    var localIPAndPort: IPAddress
    public var mappedIPAndPort: IPAddress
    var otherAddressIsAvailable: Bool
    
    var paAddress: IPAddress
    var apAddress: IPAddress
    var aaAddress: IPAddress
    
    // Nat behavior test
    var behaviorTestSucceeded: Bool
   public var natBehaviorType: NatBehaviourType
    public var apAddressMapping: IPAddress
    public  var aaAddressMapping: IPAddress
    
    public var publicIps: String {
        
        let publicAddress1 = aaAddressMapping.ipAddress + ":" + "\(aaAddressMapping.port)"
        let publicAddress2 = mappedIPAndPort.ipAddress + ":" + "\(mappedIPAndPort.port)"
        let publicAddress3 = apAddressMapping.ipAddress + ":" + "\(apAddressMapping.port)"
        
        return !aaAddressMapping.isDefaulted() ? publicAddress1 + "," + publicAddress2 + "," + publicAddress3 : publicAddress2 + "," + publicAddress3
        
    }
    
    // Nat filtering test
    var filteringTestSucceeded: Bool
   public var natFilteringType: NatFilteringType
    var didReceiveResponseForTest2: Bool
    var didReceiveResponseForTest3: Bool
    
    
    init(bindingTestSucceeded: Bool = false, isOpenToInternet: Bool = false, serverAdress: IPAddress = IPAddress(),localIPAndPort: IPAddress = IPAddress(), mappedIPAndPort: IPAddress = IPAddress(), otherAddressIsAvailable: Bool = false, paAddress: IPAddress = IPAddress(), apAddress: IPAddress = IPAddress(), aaAddress: IPAddress = IPAddress(), behaviorTestSucceeded: Bool = false, natBehaviorType: NatBehaviourType = .UnknownBehavior, apAddressMapping: IPAddress = IPAddress(), aaAddressMapping: IPAddress = IPAddress(), filteringTestSucceeded: Bool = false, natFilteringType: NatFilteringType = .UnknownFiltering, didReceiveResponseForTest2: Bool = false, didReceiveResponseForTest3: Bool = false) {
        self.bindingTestSucceeded = bindingTestSucceeded
        self.isOpenToInternet = isOpenToInternet
        self.serverAdress = serverAdress
        self.localIPAndPort = localIPAndPort
        self.mappedIPAndPort = mappedIPAndPort
        self.otherAddressIsAvailable = otherAddressIsAvailable
        self.paAddress = paAddress
        self.apAddress = apAddress
        self.aaAddress = aaAddress
        self.behaviorTestSucceeded = behaviorTestSucceeded
        self.natBehaviorType = natBehaviorType
        self.apAddressMapping = apAddressMapping
        self.aaAddressMapping = aaAddressMapping
        self.filteringTestSucceeded = filteringTestSucceeded
        self.natFilteringType = natFilteringType
        self.didReceiveResponseForTest2 = didReceiveResponseForTest2
        self.didReceiveResponseForTest3 = didReceiveResponseForTest3
    }
    
}




enum NatTypeDetectionCallBackType {
    case Waiting
    case Results
    case TimeOut
}


class NatTypeDetection {
    
    var config: NatTypeDetectionConfiguration
    var results: NatTypeResult
    
    var timeForPreviousMsg: TimeInterval!
    var msgCount: Int
    var preCheckRunTest: Bool
    
    var bindingTest1: BindingTest
    var behaviourTest2: BehaviourTest
    var behaviourTest3: BehaviourTest
    var filteringTest4: FilteringTest
    var filteringTest5: FilteringTest
    
    var testsArray: [NatTypeTest]
    
    var currentIndex: Int
    
    var natTypeDetectionCallBack: ((NatTypeDetectionCallBackType) -> Void)?
    
    var completed: Bool
    
    init(config: NatTypeDetectionConfiguration, results: NatTypeResult,
         timeForPreviousMsg: TimeInterval! = 0, msgCount: Int = 0,
         preCheckRunTest: Bool = false, testsArray: [NatTypeTest] = [],
         currentIndex: Int = 0, completed: Bool = false) {
        self.completed = completed
        self.config = config
        self.results = results
        self.timeForPreviousMsg = timeForPreviousMsg
        self.msgCount = msgCount
        self.preCheckRunTest = preCheckRunTest
        self.testsArray = testsArray
        
        self.bindingTest1 = BindingTest(config: config, results: results)
        self.testsArray.append(self.bindingTest1)
        
        self.behaviourTest2 = BehaviourTest(config: self.config, results: self.results)
        self.testsArray.append(self.behaviourTest2)
        
        self.behaviourTest3 = BehaviourTest(config: self.config, results: self.results)
        self.behaviourTest3.runAs(test3: true)
        self.testsArray.append(self.behaviourTest3)
        
        self.filteringTest4 = FilteringTest(config: self.config, results: self.results)
        self.testsArray.append(self.filteringTest4)
        
        self.filteringTest5 = FilteringTest(config: self.config, results: self.results)
        self.filteringTest5.runAs(test3: true)
        self.testsArray.append(self.filteringTest5)
        
        self.currentIndex = currentIndex
    }
    
    
    func getStunPacketAndIPAddress() -> StunPacketAndServerAddress! {
        
        var diff: TimeInterval = 0
        var currentTest: NatTypeTest!
        
        var returnWhenReady = false
        
        while !returnWhenReady {
            print("currentIndex: \(currentIndex)")
            if currentIndex >= testsArray.count {
                self.completed = true
                natTypeDetectionCallBack?(.Results)
                break
            }
            
            currentTest = testsArray[currentIndex]
            
            if !preCheckRunTest {
                currentTest.preRunCheck()
                preCheckRunTest = true
            }
            
            if currentTest.isCompleted() || !currentTest.isReadyToRun(){
                currentIndex += 1
                msgCount = 0
                preCheckRunTest = false
                continue
            }
            
            diff  = (Date().timeIntervalSince1970*1000) - timeForPreviousMsg
            if diff < config.timeoutInMilliSeconds && msgCount != 0 {
                natTypeDetectionCallBack?(.Waiting)
                break
            }
            
            if msgCount > config.maxAttempts {
                currentTest.notifyTimeOut()
                continue
            }
            
            let stunPacketAndIPAddress = currentTest.getStunPacket()
            
            msgCount += 1
            timeForPreviousMsg = Date().timeIntervalSince1970*1000
            
            return stunPacketAndIPAddress
            
        }
        
        return nil
        
    }
    
    func process(stunPacket: StunPacket) {
        let currentTest = testsArray[currentIndex]
        currentTest.process(stunPacket: stunPacket)
    }
    
    func errorFor(stunPacket: StunPacket?, error: StunError){
        guard currentIndex < testsArray.count else { return }
        let currentTest = testsArray[currentIndex]
        currentTest.notifyTimeOut()
    }
    
    func testResult() -> NatTypeResult {
        return self.results
    }
    
}
