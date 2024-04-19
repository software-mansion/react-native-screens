//
//  File.swift
//  RNScreens
//
//  Created by Maciej Stosio on 09/04/2024.
//

import Foundation
import UIKit

class RNSSwiftView: RCTView {
  

    @objc var title: NSString = ""

    @objc var name: NSString = ""
    
    
    override func didSetProps(_ changedProps: [String]!) {
        NSLog("\(title) \(name)")
    }
 
}

@objc(RNSSwiftViewManager)
class RNSSwiftViewManager: RCTViewManager {
    override static func requiresMainQueueSetup() -> Bool {
        return true
    }

    override func view() -> UIView! {
        #if RCT_NEW_ARCH_ENABLED
            NSLog("new arch")
        #else
            NSLog("old arch")
        #endif
        return RNSSwiftView()
    }
}


