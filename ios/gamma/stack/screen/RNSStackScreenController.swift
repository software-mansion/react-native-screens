import Foundation
import UIKit

@objc
public class RNSStackScreenController: RNSBaseScreenController {
  let screen: RNSStackScreenComponentView

  @objc public required init(componentView: RNSStackScreenComponentView) {
    self.screen = componentView
    super.init(nibName: nil, bundle: nil)
  }

  required init?(coder aDecoder: NSCoder) {
    return nil
  }

  // MARK: RNSBaseScreenController overrides

  public override var screenEventEmitter: RNSScreenEventEmitting? {
    screen.reactEventEmitter()
  }

  public override var isAttached: Bool {
    screen.activityMode == .attached
  }

  // MARK: Host traversal

  func findStackController() -> RNSStackController? {
    if let navCtrl = self.navigationController {
      return navCtrl as? RNSStackController
    }

    if let stackHost = self.screen.stackHost {
      return stackHost.stackController
    }

    return nil
  }
}
