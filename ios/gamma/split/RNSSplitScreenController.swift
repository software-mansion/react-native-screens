import Foundation
import UIKit

/// @class RNSSplitScreenController
/// @brief A UIViewController subclass that manages a Split column in a UISplitViewController.
///
/// Associated with a RNSSplitScreenComponentView, it handles layout synchronization with the
/// Shadow Tree, emits React lifecycle events, and interacts with the SplitHost hierarchy.
@objc
public class RNSSplitScreenController: UIViewController {
  let splitScreenComponentView: RNSSplitScreenComponentView

  private var shadowStateProxy: RNSSplitScreenShadowStateProxy {
    return splitScreenComponentView.shadowStateProxy()
  }

  private var reactEventEmitter: RNSSplitScreenComponentEventEmitter {
    return splitScreenComponentView.reactEventEmitter()
  }

  @objc public required init(splitScreenComponentView: RNSSplitScreenComponentView) {
    self.splitScreenComponentView = splitScreenComponentView
    super.init(nibName: nil, bundle: nil)
  }

  required init?(coder aDecoder: NSCoder) {
    return nil
  }

  ///
  /// @brief Searching for the SplitHost controller
  ///
  /// It checks whether the parent controller is our host controller.
  /// If we're outside the structure, e. g. for inspector represented as a modal,
  /// we're searching for that controller using a reference that Screen keeps for Host component view.
  ///
  /// @return If found - a RNSSplitHostController instance, otherwise nil.
  ///
  func findSplitHostController() -> RNSSplitHostController? {
    if let splitHostController = self.splitViewController as? RNSSplitHostController {
      return splitHostController
    }

    if let splitHost = self.splitScreenComponentView.splitHost {
      return splitHost.splitHostController
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
    findSplitHostController()?.setNeedsUpdateOfChildViewControllers()
  }

  // MARK: Layout

  @objc
  public override func viewDidLayoutSubviews() {
    super.viewDidLayoutSubviews()

    updateShadowTreeState()
  }

  ///
  /// @brief Handles frame layout changes and updates Shadow Tree accordingly.
  ///
  /// Requests for the ShadowNode updates through the shadow state proxy.
  /// Differentiates cases when we're in the Host hierarchy to calculate frame relatively
  /// to the Host view from the modal case where we're passing absolute layout metrics to the ShadowNode.
  ///
  private func updateShadowTreeState() {
    // For modals, which are presented outside the SplitHost subtree (and RN hierarchy),
    // we're attaching our touch handler and we don't need to apply any offset corrections,
    // because it's positioned relatively to our RNSSplitScreenComponentView
    if !isInSplitHostSubtree() {
      shadowStateProxy.updateShadowState(ofComponent: splitScreenComponentView)
      return
    }

    guard let splitHostController = findSplitHostController(),
      let ancestorView = splitHostController.view
    else {
      assert(
        false,
        "[RNScreens] Expected to find RNSSplitHost component for RNSSplitScreen component"
      )
      return
    }

    var targetFrame = splitScreenComponentView.frame

    ///
    /// When a UISplitViewController collapses into a single column, it hides columns and pushes
    /// them onto a UINavigationController stack. To optimize resources, UIKit
    /// does NOT update the frames of these off-screen views - they retain their old widths.
    ///
    /// When navigating back to a hidden column, UIKit performs the transition animation, but skips calling
    /// `setFrame:` on our actual component view, relying on AutoLayout to resize the content.
    ///
    /// However, Yoga is expecting absolute values. If we rely strictly on the component's current frame
    /// during this transition, Yoga will receive the stale width calculate the layout and break the UI.
    ///
    /// To fix this, if the SplitView is collapsed, we know the column must span the entire screen.
    /// We preemptively extract the host's bounds and send them as the target frame to the ShadowTree,
    /// ensuring the column renders at full width.
    ///
    if splitHostController.isCollapsed {
      targetFrame = ancestorView.bounds
    }

    shadowStateProxy.updateShadowState(
      ofComponent: splitScreenComponentView,
      withFrame: targetFrame,
      inContextOfAncestorView: ancestorView
    )
  }

  ///
  /// @brief Request ShadowNode state update when the Split screen frame origin has changed.
  ///
  /// @param splitViewController The UISplitViewController whose layout positioning changed, represented by RNSSplitHostController.
  ///
  func columnPositioningDidChangeIn(splitViewController: UISplitViewController) {
    shadowStateProxy.updateShadowState(
      ofComponent: splitScreenComponentView, inContextOfAncestorView: splitViewController.view
    )
  }

  // MARK: Events

  public override func viewWillAppear(_ animated: Bool) {
    reactEventEmitter.emitOnWillAppear()
  }

  public override func viewDidAppear(_ animated: Bool) {
    reactEventEmitter.emitOnDidAppear()
  }

  public override func viewWillDisappear(_ animated: Bool) {
    reactEventEmitter.emitOnWillDisappear()
  }

  public override func viewDidDisappear(_ animated: Bool) {
    reactEventEmitter.emitOnDidDisappear()
  }
}
