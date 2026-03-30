import Foundation
import UIKit

/// @class RNSSplitHostController
/// @brief A controller associated with the RN native component representing Split host.
///
/// Manages a collection of RNSSplitNavigatorComponentView instances (one per column),
/// synchronizes appearance settings with props, observes component lifecycle, and emits events.
@objc
public class RNSSplitHostController: UISplitViewController, ReactMountingTransactionObserving,
  RNSOrientationProvidingSwift
{
  private var needsChildViewControllersUpdate = false

  private var splitAppearanceCoordinator: RNSSplitAppearanceCoordinator
  private var splitAppearanceApplicator: RNSSplitAppearanceApplicator

  private var reactEventEmitter: RNSSplitHostComponentEventEmitter {
    return splitHostComponentView.reactEventEmitter()
  }

  private let splitHostComponentView: RNSSplitHostComponentView

  /// This variable is keeping the value of how many columns were set in the initial render. It's used for validation, because Split doesn't support changing number of columns dynamically.
  private let fixedColumnsCount: Int

  private let minNumberOfColumns: Int = 2
  private let maxNumberOfColumns: Int = 3
  private let maxNumberOfInspectors: Int = 1

  /// Tracks currently visible columns of the UISplitViewController.
  ///
  /// This set is kept in sync via `UISplitViewControllerDelegate` methods (`willShow` / `willHide`)
  /// to reflect which columns are currently rendered in the UI.
  /// It ensures that only visible columns are considered (e.g. for accessing topViewController),
  /// avoiding crashes when certain columns are collapsed or hidden.
  private var visibleColumns: Set<UISplitViewController.Column> = []

  ///
  /// @brief Initializes the Split host controller with provided style.
  ///
  /// The style for the Split component can be passed only in the initialization method and cannot be changed dynamically.
  ///
  /// @param splitHostComponentView The view managed by this controller.
  /// @param numberOfColumns Expected number of visible columns.
  ///
  @objc public init(
    splitHostComponentView: RNSSplitHostComponentView,
    numberOfColumns: Int
  ) {
    self.splitHostComponentView = splitHostComponentView
    self.splitAppearanceCoordinator = RNSSplitAppearanceCoordinator()
    self.splitAppearanceApplicator = RNSSplitAppearanceApplicator()
    self.fixedColumnsCount = numberOfColumns

    super.init(style: RNSSplitHostController.styleByNumberOfColumns(numberOfColumns))

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
    splitAppearanceCoordinator.needs(.generalUpdate)
  }

  @objc
  public func setNeedsSecondaryScreenNavBarUpdate() {
    // We noticed a bug on the pure-native component, which is blocking dynamic updates for showsSecondaryOnlyButton.
    // Toggling this flag doesn't refresh the component and is updated after triggering some other interaction, like changing layout.
    // We noticed that we can forcefully refresh navigation bar from UINavigationController level by toggling setNavigationBarHidden.
    // After some testing, it looks well and I haven't noticed any flicker - missing button is appearing naturally.
    // Please note that this is a hack rather than a solution so feel free to remove this code in case of any problems and treat the bug with toggling button as a platform's issue.
    splitAppearanceCoordinator.needs(.secondaryScreenNavBarUpdate)
  }

  @objc
  public func setNeedsDisplayModeUpdate() {
    splitAppearanceCoordinator.needs(.displayModeUpdate)
  }

  @objc
  public func setNeedsOrientationUpdate() {
    splitAppearanceCoordinator.needs(.orientationUpdate)
  }

  // MARK: Updating

  @objc
  public func updateChildViewControllersIfNeeded() {
    if needsChildViewControllersUpdate {
      updateChildViewControllers()
    }
  }

  ///
  /// @brief Creates and attaches the Split child controllers based on the current React subviews.
  ///
  /// It validates constraints for Split hierarchy and will crash after recognizing an invalid state,
  /// e.g. dynamically changed number of columns or number of columns that isn't between defined bounds.
  /// If Split constraints are met, it attaches Navigator controllers to the SplitViewController columns.
  ///
  @objc
  public func updateChildViewControllers() {
    precondition(
      needsChildViewControllersUpdate,
      "[RNScreens] Child view controller must be invalidated when update is forced!")

    let currentColumns = splitReactSubviews.filter {
        $0.columnType != RNSSplitNavigatorColumnType.inspector
    }
    let currentInspectors = splitReactSubviews.filter {
        $0.columnType == RNSSplitNavigatorColumnType.inspector
    }

    validateColumns(currentColumns)
    validateInspectors(currentInspectors)

    // Assign each navigator controller to its designated column using explicit column API (iOS 14+)
    for navigatorView in currentColumns {
      if let column = uiSplitViewColumn(for: navigatorView.columnType) {
        setViewController(navigatorView.controller, for: column)
      }
    }

    #if compiler(>=6.2)
      maybeSetupInspector(currentInspectors)
    #endif

    needsChildViewControllersUpdate = false
  }

  func updateSplitAppearanceIfNeeded() {
    splitAppearanceApplicator.updateAppearanceIfNeeded(
      self.splitHostComponentView, self, self.splitAppearanceCoordinator)
  }

  ///
  /// @brief Triggering appearance updates on secondary column's UINavigationBar component
  ///
  /// It validates that the secondary VC is valid UINavigationController and it updates the navbar
  /// state by toggling its visibility, what should be performed in a single batch of updates.
  ///
  public func refreshSecondaryNavBar() {
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

  ///
  /// @brief Gets the appropriate style for a specified number of columns.
  ///
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

  ///
  /// @brief Maps a RNSSplitNavigatorColumnType to its corresponding UISplitViewController.Column.
  ///
  private func uiSplitViewColumn(
    for columnType: RNSSplitNavigatorColumnType
  ) -> UISplitViewController.Column? {
    switch columnType {
    case RNSSplitNavigatorColumnType.primary:
      return .primary
    case RNSSplitNavigatorColumnType.supplementary:
      return .supplementary
    case RNSSplitNavigatorColumnType.secondary:
      return .secondary
    case RNSSplitNavigatorColumnType.inspector:
      return nil  // handled via maybeSetupInspector
    default:
      return .secondary
    }
  }

  // MARK: Public setters

  ///
  /// @brief Shows or hides the inspector screen.
  /// @remarks Inspector column is only available for iOS 26 or higher.
  ///
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

  ///
  /// @brief Programmatically shows a specific column identified by its string name.
  ///
  @objc
  public func showColumnNamed(_ columnName: String) {
    guard let column = splitViewColumnFromString(columnName) else {
      assertionFailure("[RNScreens] Unknown column name: \(columnName)")
      return
    }

    show(column)
  }

  private func splitViewColumnFromString(_ name: String) -> UISplitViewController.Column? {
    switch name {
    case "primary":
      return .primary
    case "supplementary":
      return .supplementary
    case "secondary":
      return .secondary
    default:
      return nil
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
    updateSplitAppearanceIfNeeded()
    validateSplitViewHierarchy()
  }

  // MARK: RNSSplitHostOrientationProviding
  @objc
  public func evaluateOrientation() -> RNSOrientationSwift {
    return convertToSwiftEnum(splitHostComponentView.orientation)
  }

  func convertToSwiftEnum(_ orientation: RNSOrientation) -> RNSOrientationSwift {
    switch orientation {
    case RNSOrientation.inherit:
      return .inherit
    case RNSOrientation.all:
      return .all
    case RNSOrientation.allButUpsideDown:
      return .allButUpsideDown
    case RNSOrientation.portrait:
      return .portrait
    case RNSOrientation.portraitUp:
      return .portraitUp
    case RNSOrientation.portraitDown:
      return .portraitDown
    case RNSOrientation.landscape:
      return .landscape
    case RNSOrientation.landscapeLeft:
      return .landscapeLeft
    case RNSOrientation.landscapeRight:
      return .landscapeRight
    @unknown default:
      return .inherit
    }
  }

  // MARK: Validators

  func validateSplitViewHierarchy() {
    let columns = splitReactSubviews.filter {
        $0.columnType != RNSSplitNavigatorColumnType.inspector
    }
    let inspectors = splitReactSubviews.filter {
        $0.columnType == RNSSplitNavigatorColumnType.inspector
    }

    validateColumns(columns)
    validateInspectors(inspectors)
  }

  func validateColumns(_ navigators: [RNSSplitNavigatorComponentView]) {
    assert(
      navigators.count >= minNumberOfColumns
        && navigators.count <= maxNumberOfColumns,
      "[RNScreens] Split can only have from \(minNumberOfColumns) to \(maxNumberOfColumns) columns"
    )

    assert(
      navigators.count == fixedColumnsCount,
      "[RNScreens] Split number of columns shouldn't change dynamically")
  }

  func validateInspectors(_ navigators: [RNSSplitNavigatorComponentView]) {
    assert(
      navigators.count <= maxNumberOfInspectors,
      "[RNScreens] Split can only have \(maxNumberOfInspectors) inspector")
  }
}

extension RNSSplitHostController {

  ///
  /// @brief Gets all React subviews of type RNSSplitNavigatorComponentView.
  ///
  var splitReactSubviews: [RNSSplitNavigatorComponentView] {
    return self.splitHostComponentView.reactSubviews().lazy.map { subview in
      assert(
        subview is RNSSplitNavigatorComponentView,
        "[RNScreens] Expected RNSSplitNavigatorComponentView but got \(type(of: subview))")

      return subview as! RNSSplitNavigatorComponentView
    }
  }
}

/// This extension is a workaround for missing UISplitViewController symbols introduced in iOS 26,
/// allowing the project to compile and run on iOS 18 or earlier versions.

#if compiler(>=6.2)
  extension RNSSplitHostController {

    func maybeSetupInspector(_ inspectors: [RNSSplitNavigatorComponentView]) {
      #if !os(tvOS)
        if #available(iOS 26.0, *) {
          if let inspector = inspectors.first {
            setViewController(inspector.controller, for: .inspector)
          }
        }
      #endif
    }

    func maybeShowInspector() {
      #if !os(tvOS)
        if #available(iOS 26.0, *) {
          show(.inspector)
        }
      #endif
    }

    func maybeHideInspector() {
      #if !os(tvOS)
        if #available(iOS 26.0, *) {
          hide(.inspector)
        }
      #endif
    }
  }
#endif

extension RNSSplitHostController: UISplitViewControllerDelegate {
  public func splitViewController(
    _ svc: UISplitViewController, willShow column: UISplitViewController.Column
  ) {
    visibleColumns.insert(column)
  }

  public func splitViewController(
    _ svc: UISplitViewController, willHide column: UISplitViewController.Column
  ) {
    visibleColumns.remove(column)
  }

  public func splitViewControllerDidCollapse(_ svc: UISplitViewController) {
    reactEventEmitter.emitOnCollapse()
  }

  public func splitViewControllerDidExpand(_ svc: UISplitViewController) {
    reactEventEmitter.emitOnExpand()
  }

  #if compiler(>=6.2)
    public func splitViewController(
      _ svc: UISplitViewController, didHide column: UISplitViewController.Column
    ) {
      #if !os(tvOS)
        if #available(iOS 26.0, *) {
          if column != .inspector {
            return
          }

          if let inspectorViewController = viewController(for: .inspector) {
            if inspectorViewController.view.window == nil {
              reactEventEmitter.emitOnHideInspector()
            }
          }
        }
      #endif
    }
  #endif

  @objc
  public func splitViewController(
    _ svc: UISplitViewController, willChangeTo displayMode: UISplitViewController.DisplayMode
  ) {
    if self.displayMode != displayMode {
      reactEventEmitter.emitOnDisplayModeWillChange(from: self.displayMode, to: displayMode)
    }
  }

  public func splitViewController(
    _ svc: UISplitViewController,
    topColumnForCollapsingToProposedTopColumn proposedTopColumn: UISplitViewController.Column
  ) -> UISplitViewController.Column {
    if splitHostComponentView.hasCustomTopColumnForCollapsing {
      return splitHostComponentView.topColumnForCollapsingColumn
    }
    return proposedTopColumn
  }
}
