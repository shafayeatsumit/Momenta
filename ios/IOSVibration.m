//
//  IOSVibration.m
//  three_thoughts
//
//  Created by Shafayeat Kabir on 7/12/20.
//  Copyright © 2020 Facebook. All rights reserved.
//

#import <Foundation/Foundation.h>
#import "React/RCTBridgeModule.h"

@interface RCT_EXTERN_MODULE(IOSVibration, NSObject)
  RCT_EXTERN_METHOD(cancelVibration)
  RCT_EXTERN_METHOD(prepareHaptics)
  RCT_EXTERN_METHOD(getHapticStatus: (RCTResponseSenderBlock)callback)
  RCT_EXTERN_METHOD(startVibration:(NSInteger)duraion)
@end
