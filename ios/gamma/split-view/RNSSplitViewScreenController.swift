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
    return self.splitViewController as? RNSSplitViewHostController
  }

  // MARK: Signals

  @objc
  public func setNeedsLifecycleStateUpdate() {
    findSplitViewHostController()?.setNeedsUpdateOfChildViewControllers()
  }

  func columnPositioningDidChangeIn(splitViewController: UISplitViewController) {
    shadowStateProxy.updateShadowState(ofComponent: splitViewScreenComponentView, inContextOfAncestorView: splitViewController.view)
  }
}
