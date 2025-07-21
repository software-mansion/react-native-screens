import Foundation
import UIKit

/// @class RNSSplitViewScreenController
/// @brief A UIViewController subclass that manages a SplitView column in a UISplitViewController.
///
/// Associated with a RNSSplitViewScreenComponentView, it handles layout synchronization with the
/// Shadow Tree, emits React lifecycle events, and interacts with the SplitViewHost hierarchy.
@objc
public class RNSSplitViewScreenController: UIViewController {

  ///
  /// @brief The associated React Native component view managed by this controller.
  ///
  let splitViewScreenComponentView: RNSSplitViewScreenComponentView

  ///
  /// @brief Proxy that updates the layout state of the corresponding ShadowNode.
  ///
  private var shadowStateProxy: RNSSplitViewScreenShadowStateProxy {
    return splitViewScreenComponentView.shadowStateProxy()
  }

  ///
  /// @brief The event emitter for sending lifecycle events to the React tree.
  ///
  private var reactEventEmitter: RNSSplitViewScreenComponentEventEmitter {
    return splitViewScreenComponentView.reactEventEmitter()
  }

  ///
  /// @brief Initializes the controller with the associated view.
  ///
  /// @param splitViewScreenComponentView The RNSSplitViewScreenComponentView linked to this controller.
  ///
  @objc public required init(splitViewScreenComponentView: RNSSplitViewScreenComponentView) {
    self.splitViewScreenComponentView = splitViewScreenComponentView
    super.init(nibName: nil, bundle: nil)
  }

  ///
  /// @brief Unavailable, only for satisfying the compiler.
  ///
  required init?(coder aDecoder: NSCoder) {
    return nil
  }

  ///
  /// @brief Searching for the SplitViewHost controller
  ///
  /// @return If found - a RNSSplitViewHostController instance, otherwise nil.
  ///
  func findSplitViewHostController() -> RNSSplitViewHostController? {
    if let splitViewHostController = self.splitViewController as? RNSSplitViewHostController {
      return splitViewHostController
    }

    if let splitViewHost = self.splitViewScreenComponentView.splitViewHost {
      return splitViewHost.splitViewHostController
    }

    return nil
  }

  ///
  /// @brief Determines if this controller is nested inside a SplitViewHost hierarchy.
  ///
  /// Used to differentiate between screens embedded in the native host and modal presentations.
  ///
  /// @return true if inside RNSSplitViewHostController, false otherwise.
  ///
  @objc
  public func isInSplitViewHostSubtree() -> Bool {
    return self.splitViewController is RNSSplitViewHostController
  }

  // MARK: Signals

  ///
  /// @brief Requests the host split view controller to mark its child view controllers for update.
  ///
  @objc
  public func setNeedsLifecycleStateUpdate() {
    findSplitViewHostController()?.setNeedsUpdateOfChildViewControllers()
  }

  // MARK: Layout

  ///
  /// @brief Handles frame layout changes and updates Shadow Tree accordingly.
  ///
  /// Requests for the ShadowNode updates through the shadow state proxy.
  ///
  @objc
  public override func viewDidLayoutSubviews() {
    super.viewDidLayoutSubviews()
    // For modals, which are presented outside the SplitViewHost subtree (and RN hierarchy),
    // we're attaching our touch handler adn we don't need to apply any offset corrections,
    // because it's positioned relatively to our RNSSplitViewScreenComponentView
    if isInSplitViewHostSubtree() {
      let ancestorView = findSplitViewHostController()?.view

      assert(
        ancestorView != nil,
        "[RNScreens] Expected to find RNSSplitViewHost component for RNSSplitViewScreen component"
      )

      shadowStateProxy.updateShadowState(
        ofComponent: splitViewScreenComponentView,
        inContextOfAncestorView: ancestorView!
      )
    } else {
      shadowStateProxy.updateShadowState(
        ofComponent: splitViewScreenComponentView
      )
    }

    //      TODO: to be removed - only for testing purposes for inspector column
    //    if #available(iOS 26.0, ///) {
    //      findSplitViewHostController()?.show(.inspector)
    //    }
  }

  ///
  /// @brief Request ShadowNode state update when the SplitView screen frame origin has changed.
  ///
  /// @param splitViewController The UISplitViewController whose layout positioning changed, represented by RNSSplitViewHostController.
  ///
  func columnPositioningDidChangeIn(splitViewController: UISplitViewController) {
    shadowStateProxy.updateShadowState(
      ofComponent: splitViewScreenComponentView, inContextOfAncestorView: splitViewController.view)
  }

  // MARK: Events

  ///
  /// @brief Emits React event before the view becomes visible.
  ///
  public override func viewWillAppear(_ animated: Bool) {
    reactEventEmitter.emitOnWillAppear()
  }

  ///
  /// @brief Emits React event after the view has became visible.
  ///
  public override func viewDidAppear(_ animated: Bool) {
    reactEventEmitter.emitOnDidAppear()
  }

  ///
  /// @brief Emits React event before the view is removed.
  ///
  public override func viewWillDisappear(_ animated: Bool) {
    reactEventEmitter.emitOnWillDisappear()
  }

  ///
  /// @brief Emits React event after the view has been removed.
  ///
  public override func viewDidDisappear(_ animated: Bool) {
    reactEventEmitter.emitOnDidDisappear()
  }
}
