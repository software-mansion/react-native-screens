///
/// @brief - Class responsible for applying all upcoming updates to SplitView.
///
/// This class is synchronizing UISplitViewController configuration props which are affecting the SplitView appearance with props passed to RNSSplitViewHostComponentView from the ElementTree.
///
class RNSSplitViewAppearanceApplicator {
  ///
  /// @brief Function responsible for applying all updates to SplitView in correct order
  ///
  /// It requests calling proper callbacks with batched SplitView updates on the AppearanceCoordinator object
  ///
  /// @param splitView The view representing JS component which is sending updates.
  /// @param splitViewController The controller associated with the SplitView component which receives updates and manages the native layer.
  /// @param appearanceCoordinator The coordinator which is checking whether the update needs to be applied and if so, it executes the callback passed by this class.
  ///
  public func updateAppearanceIfNeeded(
    _ splitView: RNSSplitViewHostComponentView,
    _ splitViewController: RNSSplitViewHostController,
    _ appearanceCoordinator: RNSSplitViewAppearanceCoordinator
  ) {
    appearanceCoordinator.updateIfNeeded(.generalUpdate) { [weak self] in
      guard let self = self
      else {
        return
      }

      self.updateSplitViewConfiguration(for: splitView, withController: splitViewController)
    }

    appearanceCoordinator.updateIfNeeded(.secondaryScreenNavBarUpdate) { [weak self] in
      guard let self = self
      else {
        return
      }

      splitViewController.refreshSecondaryNavBar()
    }

    appearanceCoordinator.updateIfNeeded(.displayModeUpdate) { [weak self] in
      guard let self = self
      else {
        return
      }

      self.updateSplitViewDisplayMode(for: splitView, withController: splitViewController)
    }

    appearanceCoordinator.updateIfNeeded(.orientationUpdate) { [] in
      RNSScreenWindowTraits.enforceDesiredDeviceOrientation()
    }
  }

  ///
  /// @brief Function that applies all basic updates.
  ///
  /// It calls all setters on RNSSplitViewHostController that doesn't require any custom logic and conditions to be met.
  ///
  /// @param splitView The view representing JS component which is sending updates.
  /// @param splitViewController The controller associated with the SplitView component which receives updates and manages the native layer.
  ///
  private func updateSplitViewConfiguration(
    for splitView: RNSSplitViewHostComponentView,
    withController splitViewController: RNSSplitViewHostController
  ) {
    // Step 1 - general settings
    splitViewController.displayModeButtonVisibility = splitView.displayModeButtonVisibility
    splitViewController.preferredSplitBehavior = splitView.preferredSplitBehavior
    splitViewController.presentsWithGesture = splitView.presentsWithGesture
    splitViewController.primaryEdge = splitView.primaryEdge
    splitViewController.showsSecondaryOnlyButton = splitView.showSecondaryToggleButton

    // Step 2.1 - validating column constraints
    validateColumnConstraints(
      minWidth: splitView.minimumPrimaryColumnWidth,
      maxWidth: splitView.maximumPrimaryColumnWidth)

    validateColumnConstraints(
      minWidth: splitView.minimumSupplementaryColumnWidth,
      maxWidth: splitView.maximumSupplementaryColumnWidth)

    #if compiler(>=6.2)
      if #available(iOS 26.0, *) {
        validateColumnConstraints(
          minWidth: splitView.minimumInspectorColumnWidth,
          maxWidth: splitView.maximumInspectorColumnWidth)
      }
    #endif

    // Step 2.2 - applying updates to columns
    if splitView.minimumPrimaryColumnWidth >= 0 {
      splitViewController.minimumPrimaryColumnWidth = splitView.minimumPrimaryColumnWidth
    }

    if splitView.maximumPrimaryColumnWidth >= 0 {
      splitViewController.maximumPrimaryColumnWidth = splitView.maximumPrimaryColumnWidth
    }

    if splitView.preferredPrimaryColumnWidthOrFraction >= 0
      && splitView.preferredPrimaryColumnWidthOrFraction < 1
    {
      splitViewController.preferredPrimaryColumnWidthFraction =
        splitView.preferredPrimaryColumnWidthOrFraction
    } else if splitView.preferredPrimaryColumnWidthOrFraction >= 1 {
      splitViewController.preferredPrimaryColumnWidth =
        splitView.preferredPrimaryColumnWidthOrFraction
    }

    if splitView.minimumSupplementaryColumnWidth >= 0 {
      splitViewController.minimumSupplementaryColumnWidth =
        splitView.minimumSupplementaryColumnWidth
    }

    if splitView.maximumSupplementaryColumnWidth >= 0 {
      splitViewController.maximumSupplementaryColumnWidth =
        splitView.maximumSupplementaryColumnWidth
    }

    if splitView.preferredSupplementaryColumnWidthOrFraction >= 0
      && splitView.preferredSupplementaryColumnWidthOrFraction < 1
    {
      splitViewController.preferredSupplementaryColumnWidthFraction =
        splitView.preferredSupplementaryColumnWidthOrFraction
    } else if splitView.preferredSupplementaryColumnWidthOrFraction >= 1 {
      splitViewController.preferredSupplementaryColumnWidth =
        splitView.preferredSupplementaryColumnWidthOrFraction
    }

    #if compiler(>=6.2)
      if #available(iOS 26.0, *) {
        if splitView.minimumSecondaryColumnWidth >= 0 {
          splitViewController.minimumSecondaryColumnWidth = splitView.minimumSecondaryColumnWidth
        }

        if splitView.preferredSecondaryColumnWidthOrFraction >= 0
          && splitView.preferredSecondaryColumnWidthOrFraction < 1
        {
          splitViewController.preferredSecondaryColumnWidthFraction =
            splitView.preferredSecondaryColumnWidthOrFraction
        } else if splitView.preferredSecondaryColumnWidthOrFraction >= 1 {
          splitViewController.preferredSecondaryColumnWidth =
            splitView.preferredSecondaryColumnWidthOrFraction
        }

        if splitView.minimumInspectorColumnWidth >= 0 {
          splitViewController.minimumInspectorColumnWidth = splitView.minimumInspectorColumnWidth
        }

        if splitView.maximumInspectorColumnWidth >= 0 {
          splitViewController.maximumInspectorColumnWidth = splitView.maximumInspectorColumnWidth
        }

        if splitView.preferredInspectorColumnWidthOrFraction >= 0
          && splitView.preferredInspectorColumnWidthOrFraction < 1
        {
          splitViewController.preferredInspectorColumnWidthFraction =
            splitView.preferredInspectorColumnWidthOrFraction
        } else if splitView.preferredInspectorColumnWidthOrFraction >= 1 {
          splitViewController.preferredInspectorColumnWidth =
            splitView.preferredInspectorColumnWidthOrFraction
        }
      }
    #endif

    // Step 2.3 - manipulating with inspector column
    splitViewController.toggleSplitViewInspector(splitView.showInspector)
  }

  ///
  /// @brief Function that updates `preferredDisplayMode` property on SplitView.
  ///
  /// `preferredDisplayMode` needs to have a dedicated flag to prevent updates from the JS, when other props updates the appearance.
  /// It is crucial in the case, when `preferredDisplayMode` has changed due to some transition that was executed natively, e. g. after showing/hiding a column by a swipe.
  /// In that case, any prop update incoming, would reset `preferredDisplayMode` to the state from JS, what doesn't look good.
  ///
  /// @param splitView The view representing JS component which is sending updates.
  /// @param splitViewController The controller associated with the SplitView component which receives updates and manages the native layer.
  ///
  func updateSplitViewDisplayMode(
    for splitView: RNSSplitViewHostComponentView,
    withController splitViewController: RNSSplitViewHostController
  ) {
    splitViewController.preferredDisplayMode = splitView.preferredDisplayMode
  }

  func validateColumnConstraints(minWidth: CGFloat, maxWidth: CGFloat) {
    assert(
      minWidth <= maxWidth,
      "[RNScreens] SplitView column constraints are invalid: minWidth \(minWidth) cannot be greater than maxWidth \(maxWidth)"
    )
  }
}
