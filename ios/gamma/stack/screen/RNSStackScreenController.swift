import Foundation
import UIKit

@objc
public class RNSStackScreenController: UIViewController {
  let screen: RNSStackScreenComponentView
  private var reactEventEmitter: RNSStackScreenComponentEventEmitter {
    return screen.reactEventEmitter()
  }

  @objc public required init(componentView: RNSStackScreenComponentView) {
    self.screen = componentView
    super.init(nibName: nil, bundle: nil)
  }

  required init?(coder aDecoder: NSCoder) {
    return nil
  }

  func findStackController() -> RNSStackController? {
    if let navCtrl = self.navigationController {
      return navCtrl as? RNSStackController
    }

    if let stackHost = self.screen.stackHost {
      return stackHost.stackController
    }

    return nil
  }

  // MARK: Signals

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

  public override func didMove(toParent parent: UIViewController?) {
    print("ScreenCtrl [\(self.screen.tag)] didMoveToParent \(String(describing: parent))")
    super.didMove(toParent: parent)

    if parent == nil {
      if self.screen.activityMode == .detached {
        reactEventEmitter.emitOnDismiss()
      } else {
        reactEventEmitter.emitOnNativeDismiss()
      }
    }
  }
}
