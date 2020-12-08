//
//  IOSVibration.swift
//  three_thoughts
//
//  Created by Shafayeat Kabir on 7/12/20.
//  Copyright © 2020 Facebook. All rights reserved.
//

import Foundation
import CoreHaptics


@available(iOS 13.0, *)
@objc(IOSVibration)
class IOSVibration: NSObject {
  private var engine: CHHapticEngine!
  private var continuousPlayer: CHHapticPatternPlayer!
  @objc
  static var hasHaptics = true
  
  @objc
  func getHapticStatus(_ callback: RCTResponseSenderBlock) {
    callback([NSNull(), IOSVibration.hasHaptics])
  }


  @objc
  func cancelVibration() {
    do {
        print("+++++++++++++continuous cancel+++++++++++++++")
        try continuousPlayer.stop(atTime: CHHapticTimeImmediate)
    } catch let error {
        print("Error stopping the continuous haptic player: \(error)")
    }

  }

    
  @objc
  func prepareHaptics(){
    guard CHHapticEngine.capabilitiesForHardware().supportsHaptics else {
      IOSVibration.hasHaptics = false
      return
    }
    do{
      self.engine = try CHHapticEngine();
      try engine?.start()
      print("SUCCESS")
    }catch{
      print("there was an error engine")
    }
  }
  
  
  @objc(startVibration:)
  func startVibration(duration: Int) -> Void {
    print("Duration ====> \(duration)")
    
    var events = [CHHapticEvent]()
    let intensity = CHHapticEventParameter(parameterID: .hapticIntensity, value: 0.4)
    let sharpness = CHHapticEventParameter(parameterID: .hapticSharpness, value: 1)
    let event = CHHapticEvent(eventType: .hapticContinuous, parameters: [intensity, sharpness], relativeTime: 0, duration: TimeInterval(duration))
    events.append(event)
    do{
      let pattern = try CHHapticPattern(events: events, parameters: [])
      continuousPlayer = try engine?.makePlayer(with: pattern)
      try continuousPlayer?.start(atTime: 0)
    }catch{
      print("Failed to play: \(error.localizedDescription)")
    }
  }

  @objc
  static func requiresMainQueueSetup() -> Bool {
    return true
  }
}
