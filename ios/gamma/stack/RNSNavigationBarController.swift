import Foundation
import UIKit

@objc
public class RNSNavigationBarController: NSObject, ReactMountingTransactionObserving {
  @objc
  public var navigationItem: UINavigationItem?
  private let navigationBarComponentView: RNSScreenStackNavigationBarComponentView
  // Signals
  private var needsNavigationItemUpdate = false;
  
  @objc
  public required init(navigationBarComponentView: RNSScreenStackNavigationBarComponentView) {
    self.navigationBarComponentView = navigationBarComponentView
  }
  
  
  // MARK: Signals
  
  @objc
  public func setNeedsNavigationItemUpdate() {
    needsNavigationItemUpdate = true;
  }
  
  
  // MARK: Updating
  
  private func updateNavigationIfNeeded() {
    if (needsNavigationItemUpdate) {
      updateNavigationItem()
    }
  }
 
  private func updateNavigationItem() {
    precondition(needsNavigationItemUpdate, "[RNScreens] Navigation item needs to be invalidated when update is forced!")
    
    guard let navigationItem = navigationItem else {
      fatalError("[RNScreens] Navigation item should be provided at this moment already");
    }
    
    navigationItem.title = navigationBarComponentView.title;
    
    needsNavigationItemUpdate = false;
  }
  // MARK: ReactMountingTransactionObserving
  
  @objc
  public func reactMountingTransactionWillMount() {
    // noop
  }
  
  @objc
  public func reactMountingTransactionDidMount() {
    updateNavigationIfNeeded()
  }
}
