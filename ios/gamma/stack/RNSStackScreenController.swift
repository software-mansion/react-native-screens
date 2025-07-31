@objc
public class RNSStackScreenController: UIViewController {
  let screenStackComponentView: RNSStackScreenComponentView
  public var navigationAppearance: RNSStackNavigationAppearance?
  public var needsNavigationBarAppearanceUpdate: Bool = false
  
  private var reactEventEmitter: RNSStackScreenComponentEventEmitter {
    return screenStackComponentView.reactEventEmitter()
  }
  
  @objc public required init(componentView: RNSStackScreenComponentView) {
    self.screenStackComponentView = componentView
    super.init(nibName: nil, bundle: nil)
  }

  required init?(coder aDecoder: NSCoder) {
    return nil
  }

  func findStackController() -> RNSStackController? {
    if let navCtrl = self.navigationController {
       return navCtrl as? RNSStackController
     }

     if let stackHost = self.screenStackComponentView.stackHost {
       return stackHost.stackController
     }

     return nil
  }
  
  
  @objc func requestNavigationBarAppearanceUpdate() {
    let stackController = findStackController()
    
    if (stackController != nil && needsNavigationBarAppearanceUpdate) {
      // We're not clearing the flag, as it will be cleared after appearance update by host
      stackController?.setNeedsNavigationBarAppearanceUpdate()
    }
  }

  // MARK: Signals
  @objc
  public func didMoveToWindow() {
    requestNavigationBarAppearanceUpdate()
  }
  
  @objc
  public func setNeedsLifecycleStateUpdate() {
    findStackController()?.setNeedsUpdateOfChildViewControllers()
  }
  
  @objc
  public func setNeedsNavigationBarAppearanceUpdate(_ navigationAppearance: RNSStackNavigationAppearance) {
    self.navigationAppearance = navigationAppearance
    needsNavigationBarAppearanceUpdate = true
    requestNavigationBarAppearanceUpdate()
  }
  
  @objc
  public func navigationBarAppearanceDidUpdate() {
    needsNavigationBarAppearanceUpdate = false
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
