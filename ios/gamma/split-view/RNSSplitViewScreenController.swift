import Foundation
import UIKit

@objc
public class RNSSplitViewScreenController: UIViewController {
  let splitViewScreenComponentView: RNSSplitViewScreenComponentView

  @objc public required init(splitViewScreenComponentView: RNSSplitViewScreenComponentView) {
    self.splitViewScreenComponentView = splitViewScreenComponentView
    super.init(nibName: nil, bundle: nil)
  }

  required init?(coder aDecoder: NSCoder) {
    return nil
  }

  func findSplitViewHostController() -> RNSSplitViewHostController? {
    return self.navigationController as! RNSSplitViewHostController?
  }

  // MARK: Signals

  @objc
  public func setNeedsLifecycleStateUpdate() {
    findSplitViewHostController()?.setNeedsUpdateOfChildViewControllers()
  }
}
