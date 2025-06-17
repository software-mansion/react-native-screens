import Foundation
import UIKit

@objc
public class RNSStackController : UINavigationController, ReactMountingTransactionObserving {
  private var pendingChildViewControllers: [RNSStackScreenController]?
  
  @objc
  public func setNeedsUpdateOfChildViewControllers(_ viewControllers: [RNSStackScreenController]) {
    pendingChildViewControllers = viewControllers
  }
  
  @objc
  public func updateChildViewControllersIfNeeded() {
    if pendingChildViewControllers != nil {
      updateChildViewControllers()
    }
  }
  
  @objc
  public func updateChildViewControllers() {
    guard let pendingChildViewControllers = pendingChildViewControllers else {
      fatalError("[RNScreens] Pending update must not be nil while it is forced!")
    }
    
    setViewControllers(pendingChildViewControllers, animated: true)
    self.pendingChildViewControllers = nil
  }
  
  // MARK: ReactMountingTransactionObserving
  
  @objc
  public func reactMountingTransactionWillMount() {
    // noop
  }
  
  @objc
  public func reactMountingTransactionDidMount() {
    updateChildViewControllersIfNeeded()
  }
}
