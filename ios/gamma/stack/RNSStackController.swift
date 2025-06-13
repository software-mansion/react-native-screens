import Foundation
import UIKit

@objc
class RNSStackController : UINavigationController, ReactMountingTransactionObserving {
  private var pendingChildViewControllers: [RNSStackScreenController]?
  
  @objc
  func setNeedsUpdateOfChildViewControllers(_ viewControllers: [RNSStackScreenController]) {
    pendingChildViewControllers = viewControllers
  }
  
  @objc
  func updateChildViewControllersIfNeeded() {
    if pendingChildViewControllers != nil {
      updateChildViewControllers()
    }
  }
  
  @objc
  func updateChildViewControllers() {
    guard let pendingChildViewControllers = pendingChildViewControllers else {
      fatalError("[RNScreens] Pending update must not be nil while it is forced!")
    }
    
    setViewControllers(pendingChildViewControllers, animated: true)
    self.pendingChildViewControllers = nil
  }
  
  // MARK: ReactMountingTransactionObserving
  
  @objc
  func reactMountingTransactionWillMount() {
    // noop
  }
  
  @objc
  func reactMountingTransactionDidMount() {
    updateChildViewControllersIfNeeded()
  }
}
