import Foundation
import UIKit

@objc
public class RNSStackController: RNSBaseNavigatorController, ReactMountingTransactionObserving {

  /// Typed convenience accessor for the stack host component view.
  @objc public var stackHostComponentView: RNSStackHostComponentView? {
    navigatorComponentView as? RNSStackHostComponentView
  }

  @objc public convenience init(stackHostComponentView: RNSStackHostComponentView) {
    self.init(navigatorComponentView: stackHostComponentView)
  }

  // updateChildViewControllers() is inherited from RNSBaseNavigatorController.
  // It reads reactSubviews(), filters by isAttached, maps to screenViewController.

  // MARK: ReactMountingTransactionObserving

  @objc
  public func reactMountingTransactionWillMount() {
    // noop
  }

  // reactMountingTransactionDidMount() is inherited from RNSBaseNavigatorController
}
