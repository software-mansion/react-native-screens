import Foundation
import UIKit

@objc
public class RNSSplitViewScreenController: UIViewController {
  let splitViewScreenComponentView: RNSSplitViewScreenComponentView

  private var shadowStateProxy: RNSSplitViewScreenShadowStateProxy {
    return splitViewScreenComponentView.shadowStateProxy()
  }

  @objc public required init(splitViewScreenComponentView: RNSSplitViewScreenComponentView) {
    self.splitViewScreenComponentView = splitViewScreenComponentView
    super.init(nibName: nil, bundle: nil)
  }

  required init?(coder aDecoder: NSCoder) {
    return nil
  }

  func findSplitViewHostController() -> RNSSplitViewHostController? {
    if let splitViewHostController = self.splitViewController as? RNSSplitViewHostController {
      return splitViewHostController
    }

    if let splitViewHost = self.splitViewScreenComponentView.splitViewHost {
      return splitViewHost.splitViewHostController
    }

    return nil
  }

  /// Checks whether `self` is attached under a parent split view controller
  /// that is presented by SplitViewHost. This might not be the case, for example,
  /// when `self` is presented as a modal.
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

  @objc
  public override func viewDidLayoutSubviews() {
    super.viewDidLayoutSubviews()
    if #available(iOS 26.0, *) {
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
    }

    //      TODO: to be removed - only for testing purposes for inspector column
    //    if #available(iOS 26.0, *) {
    //      findSplitViewHostController()?.show(.inspector)
    //    }
  }

  func columnPositioningDidChangeIn(splitViewController: UISplitViewController) {
    shadowStateProxy.updateShadowState(
      ofComponent: splitViewScreenComponentView, inContextOfAncestorView: splitViewController.view)
  }
}
