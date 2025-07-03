import Foundation
import UIKit

@objc
public class RNSSplitViewHostController : UISplitViewController, ReactMountingTransactionObserving {
    private var needsChildViewControllersUpdate = false
    private let splitViewHostComponentView: RNSSplitViewHostComponentView
    
    @objc public init(splitViewHostComponentView: RNSSplitViewHostComponentView, style: UISplitViewController.Style) {
        self.splitViewHostComponentView = splitViewHostComponentView
        super.init(style: style)
    }
    
    required init?(coder aDecoder: NSCoder) {
        return nil
    }
    
    // MARK: Signals
    
    @objc
    public func setNeedsUpdateOfChildViewControllers() {
        needsChildViewControllersUpdate = true;
    }
    
    // MARK: Updating
    
    @objc
    public func updateChildViewControllersIfNeeded() {
        if needsChildViewControllersUpdate {
            updateChildViewControllers()
        }
    }
    
    @objc
    public func updateChildViewControllers() {
        precondition(needsChildViewControllersUpdate, "[RNScreens] Child view controller must be invalidated when update is forced!")

        let currentSubviews = splitViewHostComponentView.reactSubviews() as! [RNSSplitViewScreenComponentView]
        let currentViewControllers = currentSubviews.map { $0.controller }

        viewControllers = currentViewControllers
        
        needsChildViewControllersUpdate = false;
    }
    
    // MARK: ReactMountingTransactionObserving
    
    @objc
    public func reactMountingTransactionWillMount() {
        // noop
    }
    
    @objc
    public func reactMountingTransactionDidMount() {
        updateChildViewControllersIfNeeded()
    }
}
