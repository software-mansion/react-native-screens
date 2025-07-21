import Foundation
import UIKit

/// @class RNSSplitViewHostController
/// @brief A controller associated with the RN native component representing SplitView host.
///
/// Manages a collection of RNSSplitViewScreenComponentView instances,
/// synchronizes appearance settings with props, observes component lifecycle, and emits events.
@objc
public class RNSSplitViewHostController: UISplitViewController, ReactMountingTransactionObserving {
  private var needsChildViewControllersUpdate = false
  private var needsAppearanceUpdate = false
  private var needsSecondaryScreenNavBarAppearanceUpdate = false

  private var reactEventEmitter: RNSSplitViewHostComponentEventEmitter {
    return splitViewHostComponentView.reactEventEmitter()
  }

  private let splitViewHostComponentView: RNSSplitViewHostComponentView
  private let splitViewAppearanceCoordinator: RNSSplitViewAppearanceCoordinator

  /// This variable is keeping the value of how many columns were set in the initial render. It's used for validation, because SplitView doesn't support changing number of columns dynamically.
  private let fixedColumnsCount: Int

  private let minNumberOfColumns: Int = 2
  private let maxNumberOfColumns: Int = 3
  private let maxNumberOfInspectors: Int = 1

  /**
   * @brief Initializes the SplitView host controller.
   *
   * @param splitViewHostComponentView The view managed by this controller.
   * @param numberOfColumns Expected number of visible columns.
   */
  @objc public init(
    splitViewHostComponentView: RNSSplitViewHostComponentView,
    numberOfColumns: Int
  ) {
    self.splitViewHostComponentView = splitViewHostComponentView
    self.splitViewAppearanceCoordinator = RNSSplitViewAppearanceCoordinator()
    self.fixedColumnsCount = numberOfColumns

    super.init(style: RNSSplitViewHostController.styleByNumberOfColumns(numberOfColumns))

    delegate = self
  }

  /**
   * @brief Unavailable, only for satisfying the compiler.
   */
  required init?(coder aDecoder: NSCoder) {
    return nil
  }

  // MARK: Signals

  /**
   * @brief Marks child view controllers for an update.
   */
  @objc
  public func setNeedsUpdateOfChildViewControllers() {
    needsChildViewControllersUpdate = true
  }

  /**
   * @brief Marks the component view as needing update.
   */
  @objc
  public func setNeedsAppearanceUpdate() {
    needsAppearanceUpdate = true
  }

  /**
   * @brief Marks the secondary component's UINavigationBar as needing update.
   */
  @objc
  public func setNeedsSecondaryScreenNavBarUpdate() {
    /// We noticed a bug on the pure-native component, which is blocking dynamic updates for showsSecondaryOnlyButton.
    /// Toggling this flag doesn't refresh the component and is updated after triggerig some other interaction, like changing layout.
    /// We noticed that we can forcefully refresh navigation bar from UINavigationController level by toggling setNavigationBarHidden.
    /// After some testing, it looks well and I haven't noticed any flicker - missing button is appearing naturally.
    /// Please note that this is a hack rather than a solution so feel free to remove this code in case of any problems and treat the bug with toggling button as a platform's issue.
    needsSecondaryScreenNavBarAppearanceUpdate = true
  }

  // MARK: Updating

  /**
   * @brief Updates child view controllers if marked for update
   */
  @objc
  public func updateChildViewControllersIfNeeded() {
    if needsChildViewControllersUpdate {
      updateChildViewControllers()
    }
  }

  /**
   * @brief Creates and attaches the SplitView child controllers based on the current React subviews.
   *
   * It validates constraints for SplitView hierarchy, then attaches SplitViewScreen representatives to SplitViewHost component.
   */
  @objc
  public func updateChildViewControllers() {
    precondition(
      needsChildViewControllersUpdate,
      "[RNScreens] Child view controller must be invalidated when update is forced!")

    let currentColumns = filterSubviews(
      ofType: RNSSplitViewScreenColumnType.column, in: splitViewReactSubviews)
    let currentInspectors = filterSubviews(
      ofType: RNSSplitViewScreenColumnType.inspector, in: splitViewReactSubviews)

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

  /**
   * @brief Triggers appearance update if it was requested.
   */
  func updateSplitViewAppearanceIfNeeded() {
    if needsAppearanceUpdate {
      updateSplitViewAppearance()
    }
  }

  /**
   * @brief Triggers update on UINavigationController for the secondary column if it was requested.
   */
  func updateSplitViewSecondaryScreenNavBarAppearanceIfNeeded() {
    if needsSecondaryScreenNavBarAppearanceUpdate {
      updateSplitViewSecondaryScreenNavBarAppearance()
    }
  }

  /**
   * @brief Requests RNSSplitViewAppearanceCoordinator to apply appearance updates.
   */
  func updateSplitViewAppearance() {
    needsAppearanceUpdate = false

    splitViewAppearanceCoordinator.updateAppearance(
      ofSplitView: self.splitViewHostComponentView, with: self)
  }

  /**
   * @brief Consumes and refreshes secondary NavBar appearance
   */
  func updateSplitViewSecondaryScreenNavBarAppearance() {
    needsSecondaryScreenNavBarAppearanceUpdate = false

    refreshSecondaryNavBar()
  }

  /**
   * @brief Triggering appearance updates on secondary column's UINavigationBar component
   */
  private func refreshSecondaryNavBar() {
    let secondaryViewController = viewController(for: .secondary)
    assert(
      secondaryViewController != nil,
      "[RNScreens] Failed to refresh secondary nav bar. Secondary view controller is nil.")
    assert(
      secondaryViewController is UINavigationController,
      "[RNScreens] Expected UINavigationController but got \(type(of: secondaryViewController))")
    let navigationController = secondaryViewController as! UINavigationController

    /// The assumption is that it should come in a single batch and it won't cause any delays in rendering the content.
    navigationController.setNavigationBarHidden(true, animated: false)
    navigationController.setNavigationBarHidden(false, animated: false)
  }

  // MARK: Helpers
  /**
   * @brief Gets the appropriate style for a specified number of columns.
   *
   * This utility maps a given number of columns to the corresponding UISplitViewController.Style.
   *
   * @param numberOfColumns The number of columns for the SplitView.
   * @return A UISplitViewController.Style corresponding to the provided column count.
   */
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

  /**
   * @brief Filters the given subviews array by a specific column type.
   *
   * Iterates over the provided subview array and returns only the elements that match
   * the specified RNSSplitViewScreenColumnType (e.g., .column, .inspector).
   *
   * @param type The target RNSSplitViewScreenColumnType to filter for.
   * @param subviews The array of RNSSplitViewScreenComponentView elements to filter.
   * @return A filtered array of RNSSplitViewScreenComponentView objects with the specified column type.
   */
  func filterSubviews(
    ofType type: RNSSplitViewScreenColumnType, in subviews: [RNSSplitViewScreenComponentView]
  ) -> [RNSSplitViewScreenComponentView] {
    return subviews.filter { $0.columnType == type }
  }

  // MARK: Public setters

  /**
   * @brief Shows or hides the inspector screen.
   * @remarks Available only on iOS26 or higher.
   *
   * @param showInspector Determines whether the inspector column should be visible.
   */
  @objc
  public func toggleSplitViewInspector(_ showInspector: Bool) {
    #if compiler(>=6.2)
      if showInspector {
        maybeShowInspector()
      } else {
        maybeHideInspector()
      }
    #endif
  }

  // MARK: ReactMountingTransactionObserving

  /**
   * @brief Called before mounting transaction.
   */
  @objc
  public func reactMountingTransactionWillMount() {
    // noop
  }

  /**
   * @brief Called after mounting transaction.
   *
   * Updates children and props, checks if the hierarchy is valid.
   */
  @objc
  public func reactMountingTransactionDidMount() {
    updateChildViewControllersIfNeeded()
    updateSplitViewAppearanceIfNeeded()
    updateSplitViewSecondaryScreenNavBarAppearanceIfNeeded()
    validateSplitViewHierarchy()
  }

  // MARK: Validators

  /**
   * @brief Validates that child structure meets required constraints.
   */
  func validateSplitViewHierarchy() {
    let columns = filterSubviews(
      ofType: RNSSplitViewScreenColumnType.column, in: splitViewReactSubviews)
    let inspectors = filterSubviews(
      ofType: RNSSplitViewScreenColumnType.inspector, in: splitViewReactSubviews)

    validateColumns(columns)
    validateInspectors(inspectors)
  }

  /**
   * @brief Ensures that number of columns is valid and hasn't changed dynamically.
   */
  func validateColumns(_ columns: [RNSSplitViewScreenComponentView]) {
    assert(
      columns.count >= minNumberOfColumns
        && columns.count <= maxNumberOfColumns,
      "[RNScreens] SplitView can only have from \(minNumberOfColumns) to \(maxNumberOfColumns) columns"
    )

    assert(
      columns.count == fixedColumnsCount,
      "[RNScreens] SplitView number of columns shouldn't change dynamically")
  }

  /**
   * @brief Ensures that at most one inspector is present.
   */
  func validateInspectors(_ inspectors: [RNSSplitViewScreenComponentView]) {
    assert(
      inspectors.count <= maxNumberOfInspectors,
      "[RNScreens] SplitView can only have \(maxNumberOfInspectors) inspector")
  }
}

extension RNSSplitViewHostController {
  /**
   * @brief Gets the children RNSSplitViewScreenController instances.
   *
   * Accesses SplitView controllers associated with columns. It asserts that each view controller is a navigation controller and its topViewController is of type RNSSplitViewScreenController.
   *
   * @return An array of RNSSplitViewScreenController corresponding to current split view columns.
   */
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

  /**
   * @brief Gets all React subviews of type RNSSplitViewScreenComponentView.
   *
   * Accesses all the subviews from the reactSubviews collection. It asserts that each one is a RNSSplitViewScreenComponentView.
   *
   * @return An array of RNSSplitViewScreenComponentView subviews which are children of the host component view.
   */
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
  /**
   * @brief Notifies that an origin of parent RNSSplitViewNavigationController frame has changed.
   *
   * It notifies children controllers for the layout update.
   *
   * @param splitViewNavCtrl The navigation controller whose frame origin changed.
   */
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
    /**
     * @brief Sets up the inspector column if available.
     * @remarks Available only on iOS26 or higher.
     *
     * Attaches a view controller for the inspector column.
     *
     * @param inspectors An array of inspector-type RNSSplitViewScreenComponentView subviews.
     */
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

    /**
     * @brief Shows the inspector column when available.
     * @remarks Available only on iOS26 or higher.
     *
     * Uses the UISplitViewController's new API introduced in iOS 26 to show the inspector column.
     */
    func maybeShowInspector() {
      if #available(iOS 26.0, *) {
        show(.inspector)
      }
    }

    /**
     * @brief Hides the inspector column when available.
     * @remarks Available only on iOS26 or higher.
     *
     * Uses the UISplitViewController's new API introduced in iOS 26 to hide the inspector column.
     */
    func maybeHideInspector() {
      if #available(iOS 26.0, *) {
        hide(.inspector)
      }
    }
  }
#endif

extension RNSSplitViewHostController: UISplitViewControllerDelegate {
  /**
   * @brief Called when SplitView has collapsed onto a single column.
   *
   * @param svc The split view controller that collapsed its interface.
   */
  public func splitViewControllerDidCollapse(_ svc: UISplitViewController) {
    reactEventEmitter.emitOnCollapse()
  }

  /**
   * @brief Called when split view interface has expanded from a single column into multiple columns.
   *
   * @param svc The split view controller that expanded its interface.
   */
  public func splitViewControllerDidExpand(_ svc: UISplitViewController) {
    reactEventEmitter.emitOnExpand()
  }

  #if compiler(>=6.2)
    /**
     * @brief Called after a column in the split view controller has been hidden from the interface.
     *
     * Currently emits onHideInspector event for the inspector if applicable.
     *
     * @param svc The split view controller that just hid the column.
     * @param column The column that was hidden.
     */
    public func splitViewController(
      _ svc: UISplitViewController, didHide column: UISplitViewController.Column
    ) {
      if #available(iOS 26.0, *) {
        // TODO: we may consider removing this logic, because it could be handled by onViewDidDisappear on the column level
        // On the other hand, maybe dedicated event related to the inspector would be a better approach.
        // For now I am leaving it, but feel free to drop this method if there's any reason that `onDidDisappear` works better.
        if column != .inspector {
          return
        }

        // `didHide` for modal is called on finger down for dismiss, what is problematic, because we can cancel dismissing modal.
        // In this scenario, the modal inspector might receive an invalid state and will deviate from the JS value.
        // Therefore, for event emissions, we need to ensure that the view was detached from the view hierarchy, by checking its window.
        if let inspectorViewController = viewController(for: .inspector) {
          if inspectorViewController.view.window == nil {
            reactEventEmitter.emitOnHideInspector()
          }
        }
      }
    }
  #endif
}
