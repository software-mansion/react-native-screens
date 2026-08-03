#import "RNSSplitAppearanceApplicator.h"

#import <React/RCTAssert.h>
#import "RNSDefines.h"
#import "RNSScreenWindowTraits.h"
#import "RNSSplitHostComponentView.h"
#import "RNSSplitHostController.h"

@implementation RNSSplitAppearanceApplicator

- (void)updateAppearanceIfNeeded:(RNSSplitHostComponentView *)splitHost
             splitHostController:(RNSSplitHostController *)splitHostController
           appearanceCoordinator:(RNSSplitAppearanceCoordinator *)appearanceCoordinator
{
  __weak auto weakSelf = self;

  [appearanceCoordinator updateIfNeeded:RNSSplitAppearanceUpdateFlagsGeneralUpdate
                         updateCallback:^{
                           auto strongSelf = weakSelf;
                           if (strongSelf == nil) {
                             return;
                           }

                           [strongSelf updateSplitViewConfigurationFor:splitHost withController:splitHostController];
                         }];

  [appearanceCoordinator updateIfNeeded:RNSSplitAppearanceUpdateFlagsSecondaryScreenNavBarUpdate
                         updateCallback:^{
                           auto strongSelf = weakSelf;
                           if (strongSelf == nil) {
                             return;
                           }

                           [splitHostController refreshSecondaryNavBar];
                         }];

  [appearanceCoordinator updateIfNeeded:RNSSplitAppearanceUpdateFlagsDisplayModeUpdate
                         updateCallback:^{
                           auto strongSelf = weakSelf;
                           if (strongSelf == nil) {
                             return;
                           }

                           [strongSelf updateSplitViewDisplayModeFor:splitHost withController:splitHostController];
                         }];

  [appearanceCoordinator updateIfNeeded:RNSSplitAppearanceUpdateFlagsOrientationUpdate
                         updateCallback:^{
                           [RNSScreenWindowTraits enforceDesiredDeviceOrientation];
                         }];
}

/**
 * @brief Function that applies all basic updates.
 *
 * It calls all setters on RNSSplitHostController that doesn't require any custom logic and conditions to be met.
 *
 * @param splitHost The view representing JS component which is sending updates.
 * @param splitHostController The controller associated with the SplitView component which receives updates and
 * manages the native layer.
 */
- (void)updateSplitViewConfigurationFor:(RNSSplitHostComponentView *)splitHost
                         withController:(RNSSplitHostController *)splitHostController
{
  // Step 1 - general settings
  splitHostController.displayModeButtonVisibility = splitHost.displayModeButtonVisibility;
  splitHostController.preferredSplitBehavior = splitHost.preferredSplitBehavior;
  splitHostController.overrideUserInterfaceStyle = splitHost.colorScheme;
#if !TARGET_OS_TV
  splitHostController.primaryBackgroundStyle = splitHost.primaryBackgroundStyle;
#endif
  splitHostController.presentsWithGesture = splitHost.presentsWithGesture;
  splitHostController.primaryEdge = splitHost.primaryEdge;
  splitHostController.showsSecondaryOnlyButton = splitHost.showSecondaryToggleButton;

  // Step 2.1 - validating column constraints
  [self validateColumnConstraintsWithMinWidth:splitHost.minimumPrimaryColumnWidth
                                     maxWidth:splitHost.maximumPrimaryColumnWidth];

  [self validateColumnConstraintsWithMinWidth:splitHost.minimumSupplementaryColumnWidth
                                     maxWidth:splitHost.maximumSupplementaryColumnWidth];

#if RNS_IPHONE_OS_VERSION_AVAILABLE(26_0) && !TARGET_OS_TV
  if (@available(iOS 26.0, *)) {
    [self validateColumnConstraintsWithMinWidth:splitHost.minimumInspectorColumnWidth
                                       maxWidth:splitHost.maximumInspectorColumnWidth];
  }
#endif

  // Step 2.2 - applying updates to columns
  if (splitHost.minimumPrimaryColumnWidth >= 0) {
    splitHostController.minimumPrimaryColumnWidth = splitHost.minimumPrimaryColumnWidth;
  }

  if (splitHost.maximumPrimaryColumnWidth >= 0) {
    splitHostController.maximumPrimaryColumnWidth = splitHost.maximumPrimaryColumnWidth;
  }

  if (splitHost.preferredPrimaryColumnWidthOrFraction >= 0 && splitHost.preferredPrimaryColumnWidthOrFraction < 1) {
    splitHostController.preferredPrimaryColumnWidthFraction = splitHost.preferredPrimaryColumnWidthOrFraction;
  } else if (splitHost.preferredPrimaryColumnWidthOrFraction >= 1) {
    splitHostController.preferredPrimaryColumnWidth = splitHost.preferredPrimaryColumnWidthOrFraction;
  }

  if (splitHost.minimumSupplementaryColumnWidth >= 0) {
    splitHostController.minimumSupplementaryColumnWidth = splitHost.minimumSupplementaryColumnWidth;
  }

  if (splitHost.maximumSupplementaryColumnWidth >= 0) {
    splitHostController.maximumSupplementaryColumnWidth = splitHost.maximumSupplementaryColumnWidth;
  }

  if (splitHost.preferredSupplementaryColumnWidthOrFraction >= 0 &&
      splitHost.preferredSupplementaryColumnWidthOrFraction < 1) {
    splitHostController.preferredSupplementaryColumnWidthFraction =
        splitHost.preferredSupplementaryColumnWidthOrFraction;
  } else if (splitHost.preferredSupplementaryColumnWidthOrFraction >= 1) {
    splitHostController.preferredSupplementaryColumnWidth = splitHost.preferredSupplementaryColumnWidthOrFraction;
  }

#if RNS_IPHONE_OS_VERSION_AVAILABLE(26_0) && !TARGET_OS_TV
  if (@available(iOS 26.0, *)) {
    if (splitHost.minimumSecondaryColumnWidth >= 0) {
      splitHostController.minimumSecondaryColumnWidth = splitHost.minimumSecondaryColumnWidth;
    }

    if (splitHost.preferredSecondaryColumnWidthOrFraction >= 0 &&
        splitHost.preferredSecondaryColumnWidthOrFraction < 1) {
      splitHostController.preferredSecondaryColumnWidthFraction = splitHost.preferredSecondaryColumnWidthOrFraction;
    } else if (splitHost.preferredSecondaryColumnWidthOrFraction >= 1) {
      splitHostController.preferredSecondaryColumnWidth = splitHost.preferredSecondaryColumnWidthOrFraction;
    }

    if (splitHost.minimumInspectorColumnWidth >= 0) {
      splitHostController.minimumInspectorColumnWidth = splitHost.minimumInspectorColumnWidth;
    }

    if (splitHost.maximumInspectorColumnWidth >= 0) {
      splitHostController.maximumInspectorColumnWidth = splitHost.maximumInspectorColumnWidth;
    }

    if (splitHost.preferredInspectorColumnWidthOrFraction >= 0 &&
        splitHost.preferredInspectorColumnWidthOrFraction < 1) {
      splitHostController.preferredInspectorColumnWidthFraction = splitHost.preferredInspectorColumnWidthOrFraction;
    } else if (splitHost.preferredInspectorColumnWidthOrFraction >= 1) {
      splitHostController.preferredInspectorColumnWidth = splitHost.preferredInspectorColumnWidthOrFraction;
    }
  }
#endif

  // Step 2.3 - manipulating with inspector column
  [splitHostController toggleSplitViewInspector:splitHost.showInspector];
}

/**
 * @brief Function that updates `preferredDisplayMode` property on SplitView.
 *
 * `preferredDisplayMode` needs to have a dedicated flag to prevent updates from the JS, when other props updates the
 * appearance. It is crucial in the case, when `preferredDisplayMode` has changed due to some transition that was
 * executed natively, e. g. after showing/hiding a column by a swipe. In that case, any prop update incoming, would
 * reset `preferredDisplayMode` to the state from JS, what doesn't look good.
 *
 * @param splitHost The view representing JS component which is sending updates.
 * @param splitHostController The controller associated with the SplitView component which receives updates and
 * manages the native layer.
 */
- (void)updateSplitViewDisplayModeFor:(RNSSplitHostComponentView *)splitHost
                       withController:(RNSSplitHostController *)splitHostController
{
  splitHostController.preferredDisplayMode = splitHost.preferredDisplayMode;
}

- (void)validateColumnConstraintsWithMinWidth:(CGFloat)minWidth maxWidth:(CGFloat)maxWidth
{
  // Compare values only if both are non-negative.
  // The default value, which is -1, indicates that the constraint was not provided.
  if (minWidth >= 0 && maxWidth >= 0) {
    RCTAssert(minWidth <= maxWidth,
              @"[RNScreens] Split column constraints are invalid: minWidth %f cannot be greater than maxWidth %f",
              minWidth,
              maxWidth);
  }
}

@end
