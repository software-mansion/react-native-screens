import Foundation
import UIKit

@objc
public class RNSSplitViewHostController: UISplitViewController, ReactMountingTransactionObserving {
  private var needsChildViewControllersUpdate = false
  private var needsAppearanceUpdate = false

  private let splitViewHostComponentView: RNSSplitViewHostComponentView
  private let splitViewAppearanceCoordinator: RNSSplitViewAppearanceCoordinator

  /// This variable is keeping the value of how many columns were set in the initial render. It's used for validation, because SplitView doesn't support changing number of columns dynamically.
  private let FIXED_COLUMNS_COUNT: Int

  private let MIN_NUMBER_OF_COLUMNS: Int = 2
  private let MAX_NUMBER_OF_COLUMNS: Int = 3
  private let MAX_NUMBER_OF_INSPECTORS: Int = 1

  @objc public init(
    splitViewHostComponentView: RNSSplitViewHostComponentView,
    numberOfColumns: Int
  ) {
    self.splitViewHostComponentView = splitViewHostComponentView
    self.splitViewAppearanceCoordinator = RNSSplitViewAppearanceCoordinator()
    self.FIXED_COLUMNS_COUNT = numberOfColumns

    super.init(style: RNSSplitViewHostController.styleByNumberOfColumns(numberOfColumns))

    delegate = self
  }

  required init?(coder aDecoder: NSCoder) {
    return nil
  }

  // MARK: Signals

  @objc
  public func setNeedsUpdateOfChildViewControllers() {
    needsChildViewControllersUpdate = true
  }

  @objc
  public func setNeedsAppearanceUpdate() {
    needsAppearanceUpdate = true
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
    precondition(
      needsChildViewControllersUpdate,
      "[RNScreens] Child view controller must be invalidated when update is forced!")

    let currentColumns = filterSubviews(
      ofType: .column, in: splitViewReactSubviews)
    let currentInspectors = filterSubviews(
      ofType: .inspector, in: splitViewReactSubviews)

    validateColumns(currentColumns)
    validateInspectors(currentInspectors)

    let currentViewControllers = currentColumns.map {
      RNSSplitViewNavigationController(rootViewController: $0.controller)
    }

    viewControllers = currentViewControllers

    #if compiler(>=6.2)
      maybeSetupInspector(currentInspectors)
    #endif

    for controller in currentViewControllers {
      controller.viewFrameOriginChangeObserver = self
    }

    needsChildViewControllersUpdate = false
  }

  func updateSplitViewAppearanceIfNeeded() {
    if needsAppearanceUpdate {
      updateSplitViewAppearance()
    }
  }

  func updateSplitViewAppearance() {
    needsAppearanceUpdate = false

    splitViewAppearanceCoordinator.updateAppearance(
      ofSplitView: self.splitViewHostComponentView, with: self)
  }

  // MARK: Helpers
  static func styleByNumberOfColumns(_ numberOfColumns: Int) -> UISplitViewController.Style {
    switch numberOfColumns {
    case 2:
      return .doubleColumn
    case 3:
      return .tripleColumn
    default:
      return .unspecified
    }
  }

  func filterSubviews(
    ofType type: RNSSplitViewScreenColumnType, in subviews: [RNSSplitViewScreenComponentView]
  ) -> [RNSSplitViewScreenComponentView] {
    return subviews.filter { $0.columnType == type }
  }

  // MARK: Public setters

  @objc
  public func toggleSplitViewInspector(_ showInspector: Bool) {
    if showInspector {
      #if compiler(>=6.2)
        maybeShowInspector()
      #endif

    } else {
      #if compiler(>=6.2)
        maybeHideInspector()
      #endif
    }
  }

  // MARK: ReactMountingTransactionObserving

  @objc
  public func reactMountingTransactionWillMount() {
    // noop
  }

  @objc
  public func reactMountingTransactionDidMount() {
    updateChildViewControllersIfNeeded()
    updateSplitViewAppearanceIfNeeded()
    validateSplitViewHierarchy()
  }

  // MARK: Validators

  func validateSplitViewHierarchy() {
    let columns = filterSubviews(
      ofType: .column, in: splitViewReactSubviews)
    let inspectors = filterSubviews(
      ofType: .inspector, in: splitViewReactSubviews)

    validateColumns(columns)
    validateInspectors(inspectors)
  }

  func validateColumns(_ columns: [RNSSplitViewScreenComponentView]) {
    assert(
      columns.count >= MIN_NUMBER_OF_COLUMNS
        && columns.count <= MAX_NUMBER_OF_COLUMNS,
      "[RNScreens] SplitView can only have from \(MIN_NUMBER_OF_COLUMNS) to \(MAX_NUMBER_OF_COLUMNS) columns"
    )

    assert(
      columns.count == FIXED_COLUMNS_COUNT,
      "[RNScreens] SplitView number of columns shouldn't change dynamically")
  }

  func validateInspectors(_ inspectors: [RNSSplitViewScreenComponentView]) {
    assert(
      inspectors.count <= MAX_NUMBER_OF_INSPECTORS,
      "[RNScreens] SplitView can only have 1 inspector")
  }
}

extension RNSSplitViewHostController {
  var splitViewScreenControllers: [RNSSplitViewScreenController] {
    return viewControllers.lazy.map { viewController in
      assert(
        viewController is RNSSplitViewNavigationController,
        "[RNScreens] Expected RNSSplitViewNavigationController but got \(type(of: viewController))")

      let splitViewNavigationController = viewController as! RNSSplitViewNavigationController
      let splitViewNavigationControllerTopViewController = splitViewNavigationController
        .topViewController
      assert(
        splitViewNavigationControllerTopViewController is RNSSplitViewScreenController,
        "[RNScreens] Expected RNSSplitViewScreenController but got \(type(of: splitViewNavigationControllerTopViewController))"
      )

      return splitViewNavigationControllerTopViewController as! RNSSplitViewScreenController
    }
  }

  var splitViewReactSubviews: [RNSSplitViewScreenComponentView] {
    return self.splitViewHostComponentView.reactSubviews().lazy.map { subview in
      assert(
        subview is RNSSplitViewScreenComponentView,
        "[RNScreens] Expected RNSSplitViewScreenComponentView but got \(type(of: subview))")

      return subview as! RNSSplitViewScreenComponentView
    }
  }
}

extension RNSSplitViewHostController: RNSSplitViewNavigationControllerViewFrameObserver {
  func splitViewNavCtrlViewDidChangeFrameOrigin(
    _ splitViewNavCtrl: RNSSplitViewNavigationController
  ) {
    for controller in self.splitViewScreenControllers {
      controller.columnPositioningDidChangeIn(splitViewController: self)
    }
  }
}

/// This extension is a workaround for missing UISplitViewController symbols introduced in iOS 26,
/// allowing the project to compile and run on iOS 18 or earlier versions.

#if compiler(>=6.2)
  extension RNSSplitViewHostController {
    func maybeSetupInspector(_ inspectors: [RNSSplitViewScreenComponentView]) {

      if #available(iOS 26.0, *) {
        let inspector = inspectors.first
        if inspector != nil {
          let inspectorViewController = RNSSplitViewNavigationController(
            rootViewController: inspector!.controller)
          setViewController(inspectorViewController, for: .inspector)
        }
      }
    }

    func maybeShowInspector() {
      if #available(iOS 26.0, *) {
        show(.inspector)
      }
    }

    func maybeHideInspector() {
      if #available(iOS 26.0, *) {
        hide(.inspector)
      }
    }
  }
#endif

extension RNSSplitViewHostController: UISplitViewControllerDelegate {
  #if compiler(>=6.2)
    public func splitViewController(
      _ svc: UISplitViewController, didHide column: UISplitViewController.Column
    ) {
      if #available(iOS 26.0, *) {
        if column != .inspector {
          return
        }

        if let inspectorViewController = viewController(for: .inspector) {
          if inspectorViewController.view.window == nil {
            splitViewHostComponentView.notifyInspectorDidHide()
          }
        }
      }
    }
  #endif
}
