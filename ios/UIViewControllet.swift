
import PanModal

class PanModalViewController: UIViewController, PanModalPresentable {
  var viewController: UIViewController?
  var panScrollableCache: UIScrollView?
  convenience init(_ viewControllerToPresent: UIViewController) {
    self.init(nibName: nil, bundle: nil)

      viewControllerToPresent.setValue(self, forKey: "_parentVC")
      viewController = viewControllerToPresent
  }

  func findChildScrollViewDFS(view: UIView)-> UIScrollView? {
    if panScrollableCache != nil {
      return panScrollableCache
    }
    var viewsToTraverse = [view]
    while !viewsToTraverse.isEmpty {
      let last = viewsToTraverse.last!
      viewsToTraverse.removeLast()
      if last is UIScrollView {
        panScrollableCache = last as? UIScrollView
        return last as? UIScrollView
      }
      last.subviews.forEach { subview in
        viewsToTraverse.append(subview)
      }
    }
    return nil
  }

  override var view: UIView! {
    get {
      return viewController!.view
    }
    set {

    }
  }

  var showDragIndicator: Bool {
    return false
  }

  var topOffset: CGFloat {
    return 0
  }

  func shouldPrioritize(panModalGestureRecognizer: UIPanGestureRecognizer) -> Bool {
    let location = panModalGestureRecognizer.location(in: view)
    return location.y < 50
  }

  var panScrollable: UIScrollView? {
    return findChildScrollViewDFS(view: self.view!)
  }

  var longFormHeight: PanModalHeight {
    return .contentHeight(UIScreen.main.bounds.height)
  }



  override var transitioningDelegate: UIViewControllerTransitioningDelegate? {
    get {
      return viewController?.transitioningDelegate
    }
    set {

    }
  }

  override func viewDidLayoutSubviews() {
    super.viewDidLayoutSubviews()
    for i in 1...10 {
      DispatchQueue.main.asyncAfter(deadline: .now() + 0.3 * Double(i)) {
        self.panModalSetNeedsLayoutUpdate()
      }
    }
  }

  override var modalPresentationStyle: UIModalPresentationStyle {
    get {
      return viewController?.modalPresentationStyle ?? .custom
    }
    set {

    }
  }
}


extension UIViewController {
  @objc public func obtainDelegate() -> UIViewControllerTransitioningDelegate? {
     let delegate = PanModalPresentationDelegate.default
    return delegate
  }

  @objc public func presentModally(_ viewControllerToPresent: UIViewController,
    animated flag: Bool,
    completion: (() -> Void)? = nil) -> Void {
    let controller = PanModalViewController(viewControllerToPresent)
    self.present(controller, animated: flag, completion: completion)
  }


}
