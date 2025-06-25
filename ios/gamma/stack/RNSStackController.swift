import Foundation
import UIKit

@objc
public class RNSStackController : UINavigationController, ReactMountingTransactionObserving {
  private var needsChildViewControllersUpdate = false
  private let screenStackHostComponentView: RNSScreenStackHostComponentView
  
  @objc public required init(stackHostComponentView: RNSScreenStackHostComponentView) {
    self.screenStackHostComponentView = stackHostComponentView;
    super.init(nibName: nil, bundle: nil)
  }
  
  required init?(coder aDecoder: NSCoder) {
    return nil
  }
  
  // MARK: Signals

  @objc
  public func setNeedsUpdateOfChildViewControllers() {
    needsChildViewControllersUpdate = true;
  }
  
  // MARK: Updating
  
  @objc
  public func updateChildViewControllersIfNeeded() {
    if needsChildViewControllersUpdate {
      updateChildViewControllers()
    }
  }
  
  @objc
  public func updateChildViewControllers() {
    precondition(needsChildViewControllersUpdate, "[RNScreens] Child view controller must be invalidated when update is forced!")
    
    let currentSubviews = screenStackHostComponentView.reactSubviews() as! [RNSStackScreenComponentView]
    
    let visibleViews = currentSubviews.filter {
      $0.lifecycleState != RNSScreenStackLifecycleState.popped
    }
    
    let visibleViewControllers = visibleViews.map { $0.controller }
    setViewControllers(visibleViewControllers, animated: true)
    
    needsChildViewControllersUpdate = false;
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
