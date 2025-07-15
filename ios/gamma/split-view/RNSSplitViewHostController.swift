import Foundation
import UIKit

@objc
public class RNSSplitViewHostController: UISplitViewController, ReactMountingTransactionObserving {
  private var needsChildViewControllersUpdate = false
  private var needsUpdateOfSplitViewAppearance = false
  private let splitViewHostComponentView: RNSSplitViewHostComponentView
  private let splitViewAppearanceCoordinator: RNSSplitViewAppearanceCoordinator

  /// This variable is keeping the value of how many columns were set in the initial render. It's used for validation, because SplitView doesn't support changing number of columns dynamically.
  private let DEFINED_NUMBER_OF_COLUMNS: Int?

  private let MIN_NUMBER_OF_COLUMNS: Int = 2
  private let MAX_NUMBER_OF_COLUMNS: Int = 3
  private let MAX_NUMBER_OF_INSPECTORS: Int = 1

  @objc public init(
    splitViewHostComponentView: RNSSplitViewHostComponentView,
  ) {
    self.splitViewHostComponentView = splitViewHostComponentView
    self.splitViewAppearanceCoordinator = RNSSplitViewAppearanceCoordinator()
    let currentSubviews =
      splitViewHostComponentView.reactSubviews() as! [RNSSplitViewScreenComponentView]
    DEFINED_NUMBER_OF_COLUMNS =
      RNSSplitViewHostController.filterSubviews(
        ofType: .column, in: currentSubviews
      ).count
    var style: UISplitViewController.Style = .unspecified
    switch DEFINED_NUMBER_OF_COLUMNS {
    case 2:
      style = .doubleColumn
      break
    case 3:
      style = .tripleColumn
      break
    default:
      style = .unspecified
    }
    super.init(style: style)
  }

  required init?(coder aDecoder: NSCoder) {
    return nil
  }

  // MARK: Signals

  @objc
  public func setNeedsUpdateOfChildViewControllers() {
    needsChildViewControllersUpdate = true
  }

  // MARK: Updating

  @objc
  public func updateChildViewControllersIfNeeded() {
    if needsChildViewControllersUpdate {
      updateChildViewControllers()
    }
  }

  func updateSplitViewAppearanceIfNeeded() {
    if needsUpdateOfSplitViewAppearance {
      updateSplitViewAppearance()
    }
  }

  func updateSplitViewAppearance() {
    needsUpdateOfSplitViewAppearance = false

    splitViewAppearanceCoordinator.updateAppearance(
      ofSplitView: self.splitViewHostComponentView, with: self)
  }

  @objc public func setNeedsUpdateOfSplitViewAppearance(_ needsUpdateOfSplitViewAppearance_: Bool) {
    needsUpdateOfSplitViewAppearance = needsUpdateOfSplitViewAppearance_
  }

  @objc
  public func updateChildViewControllers() {
    precondition(
      needsChildViewControllersUpdate,
      "[RNScreens] Child view controller must be invalidated when update is forced!")

    let currentSubviews =
      splitViewHostComponentView.reactSubviews() as! [RNSSplitViewScreenComponentView]
    let currentColumns = RNSSplitViewHostController.filterSubviews(
      ofType: .column, in: currentSubviews)
    let currentInspectors = RNSSplitViewHostController.filterSubviews(
      ofType: .inspector, in: currentSubviews)

    assert(
      currentColumns.count >= MIN_NUMBER_OF_COLUMNS
        && currentColumns.count <= MAX_NUMBER_OF_COLUMNS,
      "[RNScreens] SplitView can only have from \(MIN_NUMBER_OF_COLUMNS) to \(MAX_NUMBER_OF_COLUMNS) columns"
    )
    assert(
      currentInspectors.count <= MAX_NUMBER_OF_INSPECTORS,
      "[RNScreens] SplitView can only have 1 inspector")
    assert(
      currentColumns.count == DEFINED_NUMBER_OF_COLUMNS,
      "[RNScreens] SplitView number of columns shouldn't change dynamically")

    let currentViewControllers = currentColumns.map {
      RNSSplitViewNavigationController(rootViewController: $0.controller)
    }

    viewControllers = currentViewControllers

    if #available(iOS 26.0, *) {
      let inspector = currentInspectors.first
      if inspector != nil {
        let inspectorViewController = RNSSplitViewNavigationController(
          rootViewController: inspector!.controller)
        setViewController(inspectorViewController, for: .inspector)
      }
    }

    for controller in currentViewControllers {
      controller.viewFrameOriginChangeObserver = self
    }

    validateSplitViewHierarchy()

    needsChildViewControllersUpdate = false
  }

  @objc
  public func toggleSplitViewInspector(_ showInspector: Bool) {
    if #available(iOS 26.0, *) {
      if showInspector {
        show(.inspector)
      } else {
        hide(.inspector)
      }
    }
  }

  static func filterSubviews(
    ofType type: RNSSplitViewScreenColumnType, in subviews: [RNSSplitViewScreenComponentView]
  ) -> [RNSSplitViewScreenComponentView] {
    return subviews.filter { $0.columnType == type }
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

  @objc public func validateSplitViewHierarchy() {
    assert(
      splitViewScreenColumns.count >= MIN_NUMBER_OF_COLUMNS
        && splitViewScreenColumns.count <= MAX_NUMBER_OF_COLUMNS,
      "[RNScreens] SplitView can only have from \(MIN_NUMBER_OF_COLUMNS) to \(MAX_NUMBER_OF_COLUMNS) columns"
    )
    assert(
      splitViewScreenColumns.count == DEFINED_NUMBER_OF_COLUMNS,
      "[RNScreens] SplitView number of columns shouldn't change dynamically")
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

  var splitViewScreenColumns: [RNSSplitViewScreenComponentView] {
    return self.splitViewHostComponentView.reactSubviews().lazy.map { subview in
      assert(
        subview is RNSSplitViewScreenComponentView,
        "[RNScreens] Expected RNSSplitViewScreenComponentView but got \(type(of: subview))")

      return subview as! RNSSplitViewScreenComponentView
    }.filter { $0.columnType == RNSSplitViewScreenColumnType.column }
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
