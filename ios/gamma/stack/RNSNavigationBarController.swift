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
    print("setNeedsNavigationItemUpdate");
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
      fatalError("[RNScreens navigation item should be provided at this moment already]");
    }
    
    navigationItem.title = navigationBarComponentView.title;
    print(navigationItem.title);
    
    needsNavigationItemUpdate = false;
  }
  // MARK: ReactMountingTransactionObserving
  
  @objc
  public func reactMountingTransactionWillMount() {
    // noop
  }
  
  @objc
  public func reactMountingTransactionDidMount() {
    print("update if needed \(needsNavigationItemUpdate)")
    updateNavigationIfNeeded()
  }
}
