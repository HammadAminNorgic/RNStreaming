//
//  NatManagerBridge.m
//  Vdotokstreaming
//
//  Created by Hammad on 06/11/2022.
//  Copyright © 2022 Facebook. All rights reserved.
//

//#import <Foundation/Foundation.h>
#import <React/RCTBridgeModule.h>

@interface RCT_EXTERN_MODULE(NatManager, NSObject)

RCT_EXTERN_METHOD(natTest:(NSString *)stunaddress
                  stunport:(nonnull NSNumber *)stunport
                  withResolver:(RCTPromiseResolveBlock)resolve
                  withRejecter:(RCTPromiseRejectBlock)reject)
                  
//                  :(NSString *)name location:(NSString *)location date:(nonnull NSNumber *)date)

@end
