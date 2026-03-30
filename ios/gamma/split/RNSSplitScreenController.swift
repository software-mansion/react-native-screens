import Foundation
import UIKit

/// @class RNSSplitScreenController
/// @brief A UIViewController subclass that manages a screen in a RNSSplitNavigatorController stack.
///
/// Associated with a RNSSplitScreenComponentView, it handles layout synchronization with the
/// Shadow Tree, emits React lifecycle events, and interacts with the SplitHost hierarchy.
@objc
public class RNSSplitScreenController: RNSBaseScreenController {
  let splitScreenComponentView: RNSSplitScreenComponentView

  /// Per-screen header background color, set by the component view when the prop changes.
  /// If nil, no header appearance override is applied by the navigator.
  @objc public var headerBackgroundColor: UIColor?

  @objc public required init(splitScreenComponentView: RNSSplitScreenComponentView) {
    self.splitScreenComponentView = splitScreenComponentView
    super.init(nibName: nil, bundle: nil)
  }

  required init?(coder aDecoder: NSCoder) {
    return nil
  }

  // MARK: RNSBaseScreenController overrides

  public override var screenEventEmitter: RNSScreenEventEmitting? {
    splitScreenComponentView.reactEventEmitter()
  }

  public override var isAttached: Bool {
    splitScreenComponentView.activityMode == .attached
  }

  public override var preventNativeDismiss: Bool {
    splitScreenComponentView.preventNativeDismiss
  }

  // MARK: Host traversal

  ///
  /// @brief Searches for the nearest RNSSplitHostController in the view controller hierarchy.
  ///
  /// Checks both the native parent chain (via splitViewController) and the component view's
  /// back-reference to the SplitNavigator → SplitHost.
  ///
  /// @return The RNSSplitHostController if found, otherwise nil.
  ///
  func findSplitHostController() -> RNSSplitHostController? {
    if let splitHostController = self.splitViewController as? RNSSplitHostController {
      return splitHostController
    }

    if let splitNavigator = self.splitScreenComponentView.splitNavigator {
      return splitNavigator.splitHost?.splitHostController
    }

    return nil
  }

  ///
  /// @brief Determines if this controller is nested inside a SplitHost hierarchy.
  ///
  /// Used to differentiate between screens embedded in the native host and modal presentations.
  ///
  /// @return true if inside RNSSplitHostController, false otherwise.
  ///
  @objc
  public func isInSplitHostSubtree() -> Bool {
    return self.splitViewController is RNSSplitHostController
  }

  // MARK: Signals

  @objc
  public func setNeedsLifecycleStateUpdate() {
    splitScreenComponentView.splitNavigator?.controller.setNeedsUpdateOfChildViewControllers()
  }
}
