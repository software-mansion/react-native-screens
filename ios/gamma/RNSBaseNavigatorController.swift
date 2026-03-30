import Foundation
import UIKit

/// @class RNSBaseNavigatorController
/// @brief Base UINavigationController for gamma stack and split navigator controllers.
///
/// Owns the back-reference to the component view that created it and provides:
/// - Deferred child-VC update pattern (setNeedsUpdateOfChildViewControllers / reactMountingTransactionDidMount)
/// - updateChildViewControllers() — reads attached screens from the component view and calls setViewControllers
///
/// Subclasses do NOT need to override updateChildViewControllers() unless they require
/// custom filtering or ordering beyond the default isAttached / screenViewController protocol.
@objc
public class RNSBaseNavigatorController: UINavigationController {

  /// Weak back-reference to the Fabric component view that owns this controller.
  /// Used by updateChildViewControllers() to read the current child screen list.
  @objc public private(set) weak var navigatorComponentView: RNSBaseNavigatorComponentView?

  private var _needsUpdateOfChildViewControllers = false

  // MARK: Init

  @objc public init(navigatorComponentView: RNSBaseNavigatorComponentView) {
    self.navigatorComponentView = navigatorComponentView
    super.init(nibName: nil, bundle: nil)
  }

  required init?(coder: NSCoder) {
    return nil
  }

  // MARK: Signals

  /// Mark that child view controllers should be updated on the next transaction flush.
  @objc
  public func setNeedsUpdateOfChildViewControllers() {
    _needsUpdateOfChildViewControllers = true
  }

  // MARK: Transaction observer

  /// Called by the parent Fabric component view after a mounting transaction completes.
  /// Triggers updateChildViewControllers() if an update was scheduled.
  @objc
  public func reactMountingTransactionDidMount() {
    if _needsUpdateOfChildViewControllers {
      _needsUpdateOfChildViewControllers = false
      updateChildViewControllers()
    }
  }

  // MARK: Updating

  /// Reads all child screens from navigatorComponentView, filters by isAttached,
  /// and calls setViewControllers(_:animated:).
  ///
  /// Subclasses may override for custom behaviour, but in most cases the default is sufficient.
  @objc
  public func updateChildViewControllers() {
    guard let componentView = navigatorComponentView else { return }
    let screens = componentView.reactSubviews() as! [RNSBaseScreenComponentView]
    let attached = screens
      .filter { $0.isAttached }
      .map { $0.screenViewController }
    setViewControllers(attached, animated: !viewControllers.isEmpty)
  }
}
