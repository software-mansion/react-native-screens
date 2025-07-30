import Foundation
import UIKit

/// @brief A protocol that observes origin changes in a RNSSplitViewNavigationController’s view frame.
///
/// The subscriber will be notified when the view's origin changes.
protocol RNSSplitViewNavigationControllerViewFrameObserver: AnyObject {
  func splitViewNavCtrlViewDidChangeFrameOrigin(
    _ splitViewNavCtrl: RNSSplitViewNavigationController)
}

/// @class RNSSplitViewNavigationController
/// @brief A subclass of UINavigationController, creates a view that wraps view associated with RNSSplitViewScreenController.
///
/// This subclass is responsible for tracking when the underlying view's frame origin changes,
/// allowing for syncing the ShadowTree layout.
///
/// It observes origin changes via key-value observer and notifies a delegate.
@objc
public class RNSSplitViewNavigationController: UINavigationController {
  private var viewFrameObservation: NSKeyValueObservation?
  weak var viewFrameOriginChangeObserver: RNSSplitViewNavigationControllerViewFrameObserver?

  ///
  /// @brief Called after the view controller’s view has been loaded.
  ///
  /// Sets up a frame-origin Key-Value Observer to monitor view position changes and propagate them via delegate to RNSSplitViewHostController.
  ///
  override public func viewDidLoad() {
    super.viewDidLoad()

    viewFrameObservation?.invalidate()
    viewFrameObservation = self.view.observe(\.frame, options: [.old, .new]) {
      [weak self] (view, change) in
      guard let oldFrame = change.oldValue, let newFrame = change.newValue else { return }

      if oldFrame.origin != newFrame.origin {
        self?.onViewOriginChange()
      }
    }
  }

  private func onViewOriginChange() {
    viewFrameOriginChangeObserver?.splitViewNavCtrlViewDidChangeFrameOrigin(self)
  }
}
