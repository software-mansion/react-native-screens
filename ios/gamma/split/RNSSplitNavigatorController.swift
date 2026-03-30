import Foundation
import UIKit

/// @class RNSSplitNavigatorController
/// @brief A UINavigationController subclass managing the screen stack for one column of a UISplitViewController.
///
/// Associated with a RNSSplitNavigatorComponentView, it:
/// - Inherits updateChildViewControllers() from RNSBaseNavigatorController (filters by isAttached / screenViewController).
/// - Applies per-screen navigation bar appearance in willShowViewController.
/// - Tracks frame-origin changes to synchronise Shadow Tree layout.
/// - Observes Fabric mounting transactions to defer stack updates until after a transaction completes.
@objc
public class RNSSplitNavigatorController: RNSBaseNavigatorController {

  /// Typed accessor for the split navigator component view.
  private var splitNavigatorComponentView: RNSSplitNavigatorComponentView? {
    navigatorComponentView as? RNSSplitNavigatorComponentView
  }

  private var viewFrameObservation: NSKeyValueObservation?

  // setNeedsUpdateOfChildViewControllers(), reactMountingTransactionDidMount(),
  // and updateChildViewControllers() are all inherited from RNSBaseNavigatorController.

  // MARK: Lifecycle

  override public func viewDidLoad() {
    super.viewDidLoad()

    delegate = self

    viewFrameObservation?.invalidate()
    viewFrameObservation = self.view.observe(\.frame, options: [.old, .new]) {
      [weak self] (_, change) in
      guard let self = self,
            let oldFrame = change.oldValue,
            let newFrame = change.newValue else { return }
      if oldFrame.origin != newFrame.origin {
        self.updateShadowTreeState()
      }
    }
  }

  // MARK: Layout

  override public func viewDidLayoutSubviews() {
    super.viewDidLayoutSubviews()
    updateShadowTreeState()
  }

  private func updateShadowTreeState() {
    guard let componentView = splitNavigatorComponentView else { return }

    // The navigator component view's frame is not reliable here — the actual column layout
    // is owned by UISplitViewController which positions self.view. Compute the frame from
    // the controller's view directly, converting to the split host's coordinate space.
    var frame = self.view.frame
    if let ancestor = findSplitHostController()?.view {
      frame = self.view.convert(self.view.bounds, to: ancestor)
    }
    componentView.shadowStateProxy().updateShadowState(withFrame: frame)
  }

  @objc
  public func findSplitHostController() -> RNSSplitHostController? {
    return self.splitViewController as? RNSSplitHostController
  }

}

// MARK: - UINavigationControllerDelegate

extension RNSSplitNavigatorController: UINavigationControllerDelegate {
  public func navigationController(
    _ navigationController: UINavigationController,
    willShow viewController: UIViewController,
    animated: Bool
  ) {
    // Apply per-screen header background color.
    guard let screen = viewController as? RNSSplitScreenController,
          let bg = screen.headerBackgroundColor else { return }

    let appearance = UINavigationBarAppearance()
    appearance.configureWithOpaqueBackground()
    appearance.backgroundColor = bg
    navigationBar.standardAppearance = appearance
    navigationBar.scrollEdgeAppearance = appearance
  }
}
