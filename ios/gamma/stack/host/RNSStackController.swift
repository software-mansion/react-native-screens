import Foundation
import UIKit

@objc
public class RNSStackController: UINavigationController, ReactMountingTransactionObserving {
  private var needsChildViewControllersUpdate = false
  private let stackHostComponentView: RNSStackHostComponentView

  @objc public required init(stackHostComponentView: RNSStackHostComponentView) {
    self.stackHostComponentView = stackHostComponentView
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

  // MARK: Updating

  @objc
  public func updateChildViewControllersIfNeeded() {
    if needsChildViewControllersUpdate {
      updateChildViewControllers()
    }
  }

  @objc
  public func updateChildViewControllers() {
    precondition(
      needsChildViewControllersUpdate,
      "[RNScreens] Child view controller must be invalidated when update is forced!")

    let activeControllers = sourceAllViewControllers()
      .filter { screenCtrl in screenCtrl.screen.activityMode == .attached }

    setViewControllers(activeControllers, animated: true)

    needsChildViewControllersUpdate = false
  }

  private func sourceAllViewControllers() -> [RNSStackScreenController] {
    let screenStackComponents =
      stackHostComponentView.reactSubviews() as! [RNSStackScreenComponentView]
    return screenStackComponents.lazy.map(\.controller)
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
