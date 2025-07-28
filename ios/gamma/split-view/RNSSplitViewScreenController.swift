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
  private var transitioningToSize: CGSize?
  private var animationFrame: CGRect?
  let viewWidthEpsilon: CGFloat = 0.5

  @objc
  public var isTransitioning: Bool = false

  @objc public required init(splitViewScreenComponentView: RNSSplitViewScreenComponentView) {
    self.splitViewScreenComponentView = splitViewScreenComponentView
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

    transitioningToSize = size
    isTransitioning = true

    if displayLink == nil {
      displayLink = CADisplayLink(target: self, selector: #selector(checkTransitionProgress))
      displayLink?.add(to: .main, forMode: .common)
    }
  }

  ///
  /// @brief This method is responsible for tracking animation frames and requests layout
  /// which will synchronize ShadowNode size with the animation frame size.
  ///
  @objc
  private func checkTransitionProgress() {
    guard let targetSize = transitioningToSize else { return }

    if let currentFrame = view.layer.presentation()?.frame {
      let currentSize = currentFrame.size

      if abs(currentSize.width - targetSize.width) < viewWidthEpsilon
        && abs(currentSize.height - targetSize.height) < viewWidthEpsilon
      {
        displayLink?.invalidate()
        displayLink = nil
        transitioningToSize = nil
      }
      animationFrame = currentFrame
      view.setNeedsLayout()
      view.layoutIfNeeded()
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
  private func updateShadowTreeState() {
    // For modals, which are presented outside the SplitViewHost subtree (and RN hierarchy),
    // we're attaching our touch handler adn we don't need to apply any offset corrections,
    // because it's positioned relatively to our RNSSplitViewScreenComponentView
    if isInSplitViewHostSubtree() {
      let ancestorView = findSplitViewHostController()?.view

      assert(
        ancestorView != nil,
        "[RNScreens] Expected to find RNSSplitViewHost component for RNSSplitViewScreen component"
      )

      if let currentAnimationFrame = animationFrame {
        let localOrigin = splitViewScreenComponentView.convert(
          splitViewScreenComponentView.frame.origin, to: ancestorView)
        let convertedFrame = CGRect(origin: localOrigin, size: currentAnimationFrame.size)

        shadowStateProxy.updateShadowState(withFrame: convertedFrame)
        animationFrame = nil
      } else if transitioningToSize == nil {
        shadowStateProxy.updateShadowState(
          ofComponent: splitViewScreenComponentView,
          inContextOfAncestorView: ancestorView!
        )
      }
    } else {
      shadowStateProxy.updateShadowState(
        ofComponent: splitViewScreenComponentView
      )
    }
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
