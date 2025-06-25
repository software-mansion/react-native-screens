import Foundation
import UIKit

@objc
public class RNSStackScreenController : UIViewController {
  let screenStackComponentView: RNSStackScreenComponentView
  
  @objc public required init(componentView: RNSStackScreenComponentView) {
    self.screenStackComponentView = componentView
    super.init(nibName: nil, bundle: nil)
  }

  required init?(coder aDecoder: NSCoder) {
    return nil
  }
  
  func findStackController() -> RNSStackController? {
    return self.navigationController as! RNSStackController?
  }
  
  // MARK: Signals
  
  @objc
  public func setNeedsLifecycleStateUpdate(){
    findStackController()?.setNeedsUpdateOfChildViewControllers()
  }
  
  // MARK: Events
  
  public override func viewWillAppear(_ animated: Bool) {
    screenStackComponentView.reactEventEmitter().emitOnWillAppear()
  }
  
  public override func viewDidAppear(_ animated: Bool) {
    screenStackComponentView.reactEventEmitter().emitOnDidAppear()
  }
  
  public override func viewWillDisappear(_ animated: Bool) {
    screenStackComponentView.reactEventEmitter().emitOnWillDisappear()
  }
  
  public override func viewDidDisappear(_ animated: Bool) {
    screenStackComponentView.reactEventEmitter().emitOnDidDisappear()
  }
}
