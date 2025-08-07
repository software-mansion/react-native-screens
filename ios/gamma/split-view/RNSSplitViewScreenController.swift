import Foundation
import UIKit

/// @class RNSSplitViewScreenController
/// @brief A UIViewController subclass that manages a SplitView column in a UISplitViewController.
///
/// Associated with a RNSSplitViewScreenComponentView, it handles layout synchronization with the
/// Shadow Tree, emits React lifecycle events, and interacts with the SplitViewHost hierarchy.
@objc
public class RNSSplitViewScreenController: UIViewController {
  let splitViewScreenComponentView: RNSSplitViewScreenComponentView

  private var shadowStateProxy: RNSSplitViewScreenShadowStateProxy {
    return splitViewScreenComponentView.shadowStateProxy()
  }

  private var reactEventEmitter: RNSSplitViewScreenComponentEventEmitter {
    return splitViewScreenComponentView.reactEventEmitter()
  }

  private var displayLink: CADisplayLink?
  private var lastAnimationFrame: CGRect?
  private var transitionInProgress: Bool

  @objc public required init(splitViewScreenComponentView: RNSSplitViewScreenComponentView) {
    self.splitViewScreenComponentView = splitViewScreenComponentView
    self.transitionInProgress = false

    super.init(nibName: nil, bundle: nil)
  }

  required init?(coder aDecoder: NSCoder) {
    return nil
  }

  ///
  /// @brief Searching for the SplitViewHost controller
  ///
  /// It checks whether the parent controller is our host controller.
  /// If we're outside the structure, e. g. for inspector represented as a modal,
  /// we're searching for that controller using a reference that Screen keeps for Host component view.
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

  ///
  /// @brief Determines whether an SplitView animated transition is currently running
  ///
  /// Used to differentiate favor frames from the presentation layer over view's frame .
  ///
  /// @return true if the transition is running, false otherwise.
  ///
  @objc
  public func isTransitionInProgress() -> Bool {
    return transitionInProgress
  }

  // MARK: Signals

  @objc
  public func setNeedsLifecycleStateUpdate() {
    findSplitViewHostController()?.setNeedsUpdateOfChildViewControllers()
  }

  // MARK: Layout

  ///
  /// @brief This method is overridden to extract the value to which we're transitioning
  /// and attach the DisplayLink to track frame updates on the presentation layer.
  ///
  public override func viewWillTransition(
    to size: CGSize,
    with coordinator: any UIViewControllerTransitionCoordinator
  ) {
    super.viewWillTransition(to: size, with: coordinator)

    transitionInProgress = true

    coordinator.animate(
      alongsideTransition: { [weak self] context in
        guard let self = self else { return }
        if self.displayLink == nil {
          self.displayLink = CADisplayLink(
            target: self, selector: #selector(trackTransitionProgress))
          self.displayLink?.add(to: .main, forMode: .common)
        }
      },
      completion: { [weak self] context in
        guard let self = self else { return }
        self.stopAnimation()
        // After the animation completion, ensure that ShadowTree state
        // is calculated relatively to the ancestor's frame by requesting
        // the state update.
        self.updateShadowTreeState()
      })
  }

  private func stopAnimation() {
    lastAnimationFrame = nil
    transitionInProgress = false

    displayLink?.invalidate()
    displayLink = nil
  }

  ///
  /// @brief This method is responsible for tracking animation frames and requests layout
  /// which will synchronize ShadowNode size with the animation frame size.
  ///
  @objc
  private func trackTransitionProgress() {
    if let currentFrame = view.layer.presentation()?.frame {
      lastAnimationFrame = currentFrame
      updateShadowTreeState()
    }
  }

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
  /// Prefers to apply dynamic updates from the presentation layer if the transition is in progress.
  ///
  private func updateShadowTreeState() {
    // For modals, which are presented outside the SplitViewHost subtree (and RN hierarchy),
    // we're attaching our touch handler and we don't need to apply any offset corrections,
    // because it's positioned relatively to our RNSSplitViewScreenComponentView
    if !isInSplitViewHostSubtree() {
      shadowStateProxy.updateShadowState(ofComponent: splitViewScreenComponentView)
      return
    }

    let ancestorView = findSplitViewHostController()?.view
    assert(
      ancestorView != nil,
      "[RNScreens] Expected to find RNSSplitViewHost component for RNSSplitViewScreen component"
    )

    // If the resize animation is currently running, we prefer to apply dynamic updates,
    // based on the results from the presentation layer
    // which is read from `trackTransitionProgress` method.
    if let currentSize = lastAnimationFrame?.size {
      applyTransitioningShadowState(
        size: currentSize,
        ancestorView: ancestorView!
      )
      return
    }

    // There might be the case, when transition is about to start and in the meantime,
    // sth else is triggering frame update relatively to the parent. As we know
    // that dynamic updates from the presentation layer are coming, we're blocking this
    // to prevent interrupting with the frames that are less important for us.
    // This works fine, because after the animation completion, we're sending the last update
    // which is compatible with the frame which would be calculated relatively to the ancestor here.
    if !isTransitionInProgress() {
      applyStaticShadowStateRelativeToAncestor(ancestorView!)
    }
  }

  private func applyTransitioningShadowState(size: CGSize, ancestorView: UIView) {
    let localOrigin = splitViewScreenComponentView.convert(
      splitViewScreenComponentView.frame.origin,
      to: ancestorView
    )
    let convertedFrame = CGRect(origin: localOrigin, size: size)
    shadowStateProxy.updateShadowState(withFrame: convertedFrame)
  }

  private func applyStaticShadowStateRelativeToAncestor(_ ancestorView: UIView) {
    shadowStateProxy.updateShadowState(
      ofComponent: splitViewScreenComponentView,
      inContextOfAncestorView: ancestorView
    )
  }

  ///
  /// @brief Request ShadowNode state update when the SplitView screen frame origin has changed.
  ///
  /// If there's a transition in progress, this function is ignored as we prefer to apply updates
  /// that are dynamically coming from the presentation layer, rather than reading the frame, because
  /// view's frame is set to the target value at the begining of the transition.
  ///
  /// @param splitViewController The UISplitViewController whose layout positioning changed, represented by RNSSplitViewHostController.
  ///
  func columnPositioningDidChangeIn(splitViewController: UISplitViewController) {
    // During the transition, we're listening for the animation
    // frame updates on the presentation layer and we're
    // treating these updates as the source of truth
    if !isTransitionInProgress() {
      shadowStateProxy.updateShadowState(
        ofComponent: splitViewScreenComponentView, inContextOfAncestorView: splitViewController.view
      )
    }
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
