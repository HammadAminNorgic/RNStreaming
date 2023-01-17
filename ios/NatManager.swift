// CalendarManager.swift
import Foundation
import AVFoundation 
@objc(NatManager)
class NatManager: NSObject {
    
    lazy var client:StunClient = {
    
    
    
                let resultsCallback: (NatTypeResult) -> () = {
                  
                    [weak self] (result) in
    
                    guard let self = self else {return}
    
                    print("NatType Results: \n\(result)")
    
                   
//                    namenumb=result
    
    
    //                let publicAddress =  [result.publicIps]
    //
    //                let natFiltering = result.natFilteringType.rawValue
    //
    //                let natBehaviorType = result.natBehaviorType.rawValue
    //
    //                guard let user = VDOTOKObject<UserResponse>().getData(), let url = user.mediaServerMap?.completeAddress else {return}
    //
    //                let request = RegisterRequest(type: Constants.Request,
    //
    //                                              requestType: "Register",
    //
    //                                              referenceID: user.refID!,
    //
    //                                              authorizationToken: user.authorizationToken!,
    //
    //                                              requestID: self.getRequestId(),
    //
    //                                              projectID: UserDefaults.projectId)
    //
    //
    //
    //                self.configureVdotTok(request: request)
    
                }
    
    
    
                let successCallback: (String, Int) -> () = { [weak self] (myAddress: String, myPort: Int) in
    
                    DispatchQueue.main.async {
    
                        guard let self = self else { return }
    
                        print("ABC" + "\n\n" + "COMPLETED, my address: " + myAddress + " my port: " + String(myPort))
    
                    }
    
                }
    
                    let errorCallback: (StunError) -> () = { [weak self] error in
    
                            DispatchQueue.main.async {
    
                                guard let self = self else { return }
    
                                print("ERROR: " + error.errorDescription)
    
                            }
    
                        }
    
                    let verboseCallback: (String) -> () = { [weak self] logText in
    
                            DispatchQueue.main.async {
    
                                guard let self = self else { return }
    
                                print(logText)
    
                            }
    
                        }
    
                    //18.219.110.18
    
                    //stun.stunprotocol.org
    
        //        guard let user = VDOTOKObject<UserResponse>().getData(), let host = user.stunServerMap?.host,let user.stunServerMap?.port  else {return}
    
    
    
                let stunIpAddress = "r-stun2.vdotok.dev"
    
                let stunPort = 3478
                let localPort = 0
          
    
          return StunClient(stunIpAddress: stunIpAddress, stunPort: UInt16(exactly: stunPort)! , localPort: UInt16(localPort), timeoutInMilliseconds: 500)
    
                        .discoverNatType()
    
                        .ifNatTypeDetectingSuccessful(resultsCallback)
    
                        .ifWhoAmISuccessful(successCallback)
    
                        .ifError(errorCallback)
    
                        .verbose(verboseCallback)
    
                    //discoverNatType()
    
    
    
                }()

// @objc(natTest:location:date:)
    @objc(natTest:stunport:withResolver:withRejecter:)
 func natTest(_ stunaddress: String, stunport: NSNumber, resolve:RCTPromiseResolveBlock,reject:RCTPromiseRejectBlock) -> Void {
    client.start()
    //  let seconds = 4.0
    //  DispatchQueue.main.asyncAfter(deadline: .now() + seconds) {
    //      // Put your code which should be executed with a delay here
    //      resolve(stunport)
    //  }
    resolve(stunport)
   // Date is ready to use!
 }
    
 @objc(setSpeakerOn)
    func setSpeakerOn() -> Void {
        // Switch to speaker do
        let audioSession = AVAudioSession.sharedInstance()
        do { try audioSession.overrideOutputAudioPort(AVAudioSession.PortOverride.speaker) } catch { // handle error
            
            //    client.start()
            //  let seconds = 4.0
            //  DispatchQueue.main.asyncAfter(deadline: .now() + seconds) {
            //      // Put your code which should be executed with a delay here
            //      resolve(stunport)
            //  }
            
            // Date is ready to use!
        }}
    @objc(setSpeakerOff)
    func setSpeakerOff() -> Void {
        let audioSession = AVAudioSession.sharedInstance()
        do { try audioSession.setCategory(AVAudioSession.Category.playAndRecord) }
        catch {
            // handle error
            
        }

   //    client.start()
       //  let seconds = 4.0
       //  DispatchQueue.main.asyncAfter(deadline: .now() + seconds) {
       //      // Put your code which should be executed with a delay here
       //      resolve(stunport)
       //  }

      // Date is ready to use!
    }
        // Switch to speaker
   
    
    

    
    
 @objc
 func constantsToExport() -> [String: Any]! {
   return ["someKey": "someValue"]
 }
}
