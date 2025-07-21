import Foundation
import UIKit

protocol RNSSplitViewNavigationControllerViewFrameObserver: AnyObject {
  func splitViewNavCtrlViewDidChangeFrameOrigin(
    _ splitViewNavCtrl: RNSSplitViewNavigationController)
}

@objc
public class RNSSplitViewNavigationController: UINavigationController {
  private var viewFrameObservation: NSKeyValueObservation?
  weak var viewFrameOriginChangeObserver: RNSSplitViewNavigationControllerViewFrameObserver?

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
