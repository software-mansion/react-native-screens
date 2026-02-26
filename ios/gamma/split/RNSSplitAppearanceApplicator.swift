///
/// @brief - Class responsible for applying all upcoming updates to SplitView.
///
/// This class is synchronizing UISplitViewController configuration props which are affecting the SplitView appearance with props passed to RNSSplitHostComponentView from the ElementTree.
///
class RNSSplitAppearanceApplicator {
  ///
  /// @brief Function responsible for applying all updates to SplitView in correct order
  ///
  /// It requests calling proper callbacks with batched SplitView updates on the AppearanceCoordinator object
  ///
  /// @param splitHost The view representing JS component which is sending updates.
  /// @param splitHostController The controller associated with the SplitView component which receives updates and manages the native layer.
  /// @param appearanceCoordinator The coordinator which is checking whether the update needs to be applied and if so, it executes the callback passed by this class.
  ///
  public func updateAppearanceIfNeeded(
    _ splitHost: RNSSplitHostComponentView,
    _ splitHostController: RNSSplitHostController,
    _ appearanceCoordinator: RNSSplitAppearanceCoordinator
  ) {
    appearanceCoordinator.updateIfNeeded(.generalUpdate) { [weak self] in
      guard let self = self
      else {
        return
      }

      self.updateSplitViewConfiguration(for: splitHost, withController: splitHostController)
    }

    appearanceCoordinator.updateIfNeeded(.secondaryScreenNavBarUpdate) { [weak self] in
      guard let self = self
      else {
        return
      }

      splitHostController.refreshSecondaryNavBar()
    }

    appearanceCoordinator.updateIfNeeded(.displayModeUpdate) { [weak self] in
      guard let self = self
      else {
        return
      }

      self.updateSplitViewDisplayMode(for: splitHost, withController: splitHostController)
    }

    appearanceCoordinator.updateIfNeeded(.orientationUpdate) { [] in
      RNSScreenWindowTraits.enforceDesiredDeviceOrientation()
    }
  }

  ///
  /// @brief Function that applies all basic updates.
  ///
  /// It calls all setters on RNSSplitHostController that doesn't require any custom logic and conditions to be met.
  ///
  /// @param splitHost The view representing JS component which is sending updates.
  /// @param splitHostController The controller associated with the SplitView component which receives updates and manages the native layer.
  ///
  private func updateSplitViewConfiguration(
    for splitHost: RNSSplitHostComponentView,
    withController splitHostController: RNSSplitHostController
  ) {
    // Step 1 - general settings
    splitHostController.displayModeButtonVisibility = splitHost.displayModeButtonVisibility
    splitHostController.preferredSplitBehavior = splitHost.preferredSplitBehavior
    #if !os(tvOS)
      splitHostController.primaryBackgroundStyle = splitHost.primaryBackgroundStyle
    #endif
    splitHostController.presentsWithGesture = splitHost.presentsWithGesture
    splitHostController.primaryEdge = splitHost.primaryEdge
    splitHostController.showsSecondaryOnlyButton = splitHost.showSecondaryToggleButton

    // Step 2.1 - validating column constraints
    validateColumnConstraints(
      minWidth: splitHost.minimumPrimaryColumnWidth,
      maxWidth: splitHost.maximumPrimaryColumnWidth)

    validateColumnConstraints(
      minWidth: splitHost.minimumSupplementaryColumnWidth,
      maxWidth: splitHost.maximumSupplementaryColumnWidth)

    #if compiler(>=6.2) && !os(tvOS)
      if #available(iOS 26.0, *) {
        validateColumnConstraints(
          minWidth: splitHost.minimumInspectorColumnWidth,
          maxWidth: splitHost.maximumInspectorColumnWidth)
      }
    #endif

    // Step 2.2 - applying updates to columns
    if splitHost.minimumPrimaryColumnWidth >= 0 {
      splitHostController.minimumPrimaryColumnWidth = splitHost.minimumPrimaryColumnWidth
    }

    if splitHost.maximumPrimaryColumnWidth >= 0 {
      splitHostController.maximumPrimaryColumnWidth = splitHost.maximumPrimaryColumnWidth
    }

    if splitHost.preferredPrimaryColumnWidthOrFraction >= 0
      && splitHost.preferredPrimaryColumnWidthOrFraction < 1
    {
      splitHostController.preferredPrimaryColumnWidthFraction =
        splitHost.preferredPrimaryColumnWidthOrFraction
    } else if splitHost.preferredPrimaryColumnWidthOrFraction >= 1 {
      splitHostController.preferredPrimaryColumnWidth =
        splitHost.preferredPrimaryColumnWidthOrFraction
    }

    if splitHost.minimumSupplementaryColumnWidth >= 0 {
      splitHostController.minimumSupplementaryColumnWidth =
        splitHost.minimumSupplementaryColumnWidth
    }

    if splitHost.maximumSupplementaryColumnWidth >= 0 {
      splitHostController.maximumSupplementaryColumnWidth =
        splitHost.maximumSupplementaryColumnWidth
    }

    if splitHost.preferredSupplementaryColumnWidthOrFraction >= 0
      && splitHost.preferredSupplementaryColumnWidthOrFraction < 1
    {
      splitHostController.preferredSupplementaryColumnWidthFraction =
        splitHost.preferredSupplementaryColumnWidthOrFraction
    } else if splitHost.preferredSupplementaryColumnWidthOrFraction >= 1 {
      splitHostController.preferredSupplementaryColumnWidth =
        splitHost.preferredSupplementaryColumnWidthOrFraction
    }

    #if compiler(>=6.2) && !os(tvOS)
      if #available(iOS 26.0, *) {
        if splitHost.minimumSecondaryColumnWidth >= 0 {
          splitHostController.minimumSecondaryColumnWidth = splitHost.minimumSecondaryColumnWidth
        }

        if splitHost.preferredSecondaryColumnWidthOrFraction >= 0
          && splitHost.preferredSecondaryColumnWidthOrFraction < 1
        {
          splitHostController.preferredSecondaryColumnWidthFraction =
            splitHost.preferredSecondaryColumnWidthOrFraction
        } else if splitHost.preferredSecondaryColumnWidthOrFraction >= 1 {
          splitHostController.preferredSecondaryColumnWidth =
            splitHost.preferredSecondaryColumnWidthOrFraction
        }

        if splitHost.minimumInspectorColumnWidth >= 0 {
          splitHostController.minimumInspectorColumnWidth = splitHost.minimumInspectorColumnWidth
        }

        if splitHost.maximumInspectorColumnWidth >= 0 {
          splitHostController.maximumInspectorColumnWidth = splitHost.maximumInspectorColumnWidth
        }

        if splitHost.preferredInspectorColumnWidthOrFraction >= 0
          && splitHost.preferredInspectorColumnWidthOrFraction < 1
        {
          splitHostController.preferredInspectorColumnWidthFraction =
            splitHost.preferredInspectorColumnWidthOrFraction
        } else if splitHost.preferredInspectorColumnWidthOrFraction >= 1 {
          splitHostController.preferredInspectorColumnWidth =
            splitHost.preferredInspectorColumnWidthOrFraction
        }
      }
    #endif

    // Step 2.3 - manipulating with inspector column
    splitHostController.toggleSplitViewInspector(splitHost.showInspector)
  }

  ///
  /// @brief Function that updates `preferredDisplayMode` property on SplitView.
  ///
  /// `preferredDisplayMode` needs to have a dedicated flag to prevent updates from the JS, when other props updates the appearance.
  /// It is crucial in the case, when `preferredDisplayMode` has changed due to some transition that was executed natively, e. g. after showing/hiding a column by a swipe.
  /// In that case, any prop update incoming, would reset `preferredDisplayMode` to the state from JS, what doesn't look good.
  ///
  /// @param splitHost The view representing JS component which is sending updates.
  /// @param splitHostController The controller associated with the SplitView component which receives updates and manages the native layer.
  ///
  func updateSplitViewDisplayMode(
    for splitHost: RNSSplitHostComponentView,
    withController splitHostController: RNSSplitHostController
  ) {
    splitHostController.preferredDisplayMode = splitHost.preferredDisplayMode
  }

  func validateColumnConstraints(minWidth: CGFloat, maxWidth: CGFloat) {
    assert(
      minWidth <= maxWidth,
      "[RNScreens] Split column constraints are invalid: minWidth \(minWidth) cannot be greater than maxWidth \(maxWidth)"
    )
  }
}
