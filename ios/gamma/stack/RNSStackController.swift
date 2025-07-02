import Foundation
import UIKit

@objc
public class RNSStackController: UINavigationController, ReactMountingTransactionObserving {
  private var needsChildViewControllersUpdate = false
  private var needsNavigationBarAppearanceUpdate = false
  private let screenStackHostComponentView: RNSScreenStackHostComponentView
  private let navigationAppearanceCoordinator: RNSStackNavigationAppearanceCoordinator
  
  @objc public required init(stackHostComponentView: RNSScreenStackHostComponentView) {
    self.screenStackHostComponentView = stackHostComponentView;
    self.navigationAppearanceCoordinator = RNSStackNavigationAppearanceCoordinator()
    super.init(nibName: nil, bundle: nil)
  }

  required init?(coder aDecoder: NSCoder) {
    return nil
  }

  // MARK: Signals

  @objc
  public func setNeedsUpdateOfChildViewControllers() {
    needsChildViewControllersUpdate = true
  }
  
  @objc
  public func setNeedsNavigationBarAppearanceUpdate() {
    needsNavigationBarAppearanceUpdate = true
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
    precondition(needsChildViewControllersUpdate, "[RNScreens] Child view controllers must be invalidated when update is forced!")
    
    let currentSubviews = screenStackHostComponentView.reactSubviews() as! [RNSStackScreenComponentView]
    
    let visibleViews = currentSubviews.filter {
      $0.lifecycleState != RNSScreenStackLifecycleState.popped
    }
    
    let visibleViewControllers = visibleViews.map { $0.controller }
    setViewControllers(visibleViewControllers, animated: true)
    
    
    needsChildViewControllersUpdate = false;
  }
  
  @objc
  public func updateNavigationBarAppearanceIfNeeded() {
    if needsNavigationBarAppearanceUpdate {
      updateNavigationBarAppearance()
    }
  }
  
  @objc
  public func updateNavigationBarAppearance() {
    precondition(needsNavigationBarAppearanceUpdate, "[RNScreens] Header appearance must be invalidated when update is forced!")
    
    let currentSubviews = screenStackHostComponentView.reactSubviews() as! [RNSStackScreenComponentView]
    let viewControllers = currentSubviews.map { $0.controller }
    
    navigationAppearanceCoordinator.updateNavigationBarAppearance(navigationBar: self.navigationBar, viewControllers: viewControllers);
    needsNavigationBarAppearanceUpdate = false
  }
  
  // MARK: ReactMountingTransactionObserving

  @objc
  public func reactMountingTransactionWillMount() {
    // noop
  }

  @objc
  public func reactMountingTransactionDidMount() {
    updateChildViewControllersIfNeeded()
    updateNavigationBarAppearanceIfNeeded()
  }
}
