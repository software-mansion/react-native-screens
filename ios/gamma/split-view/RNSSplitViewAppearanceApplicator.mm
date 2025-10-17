#import "RNSSplitViewAppearanceApplicator.h"
#import "RNSScreenWindowTraits.h"
#import "RNSSplitViewAppearanceCoordinator.h"
#import "RNSSplitViewAppearanceUpdateFlags.h"
#import "RNSSplitViewHostComponentView.h"
#import "RNSSplitViewHostController.h"

@implementation RNSSplitViewAppearanceApplicator

- (void)updateAppearanceIfNeededWithSplitView:(RNSSplitViewHostComponentView *)splitView
                          splitViewController:(RNSSplitViewHostController *)splitViewController
                        appearanceCoordinator:(RNSSplitViewAppearanceCoordinator *)appearanceCoordinator
{
  __weak RNSSplitViewAppearanceApplicator *weakSelf = self;

  [appearanceCoordinator updateIfNeeded:RNSSplitViewAppearanceUpdateFlagGeneralUpdate
                               callback:^{
                                 [weakSelf updateSplitViewConfigurationFor:splitView
                                                            withController:splitViewController];
                               }];

  [appearanceCoordinator updateIfNeeded:RNSSplitViewAppearanceUpdateFlagSecondaryNavBarUpdate
                               callback:^{
                                 [splitViewController refreshSecondaryNavBar];
                               }];

  [appearanceCoordinator updateIfNeeded:RNSSplitViewAppearanceUpdateFlagDisplayModeUpdate
                               callback:^{
                                 [weakSelf updateSplitViewDisplayModeFor:splitView withController:splitViewController];
                               }];

  [appearanceCoordinator updateIfNeeded:RNSSplitViewAppearanceUpdateFlagOrientationUpdate
                               callback:^{
                                 [RNSScreenWindowTraits enforceDesiredDeviceOrientation];
                               }];
}

- (void)updateSplitViewConfigurationFor:(RNSSplitViewHostComponentView *)splitView
                         withController:(RNSSplitViewHostController *)splitViewController
{
  // Step 1 - basic config
  splitViewController.displayModeButtonVisibility = splitView.displayModeButtonVisibility;
  splitViewController.preferredSplitBehavior = splitView.preferredSplitBehavior;
  splitViewController.presentsWithGesture = splitView.presentsWithGesture;
  splitViewController.primaryEdge = splitView.primaryEdge;
  splitViewController.showsSecondaryOnlyButton = splitView.showSecondaryToggleButton;

  // Step 2.1 - validate constraints
  [self validateColumnConstraintsWithMin:splitView.minimumPrimaryColumnWidth max:splitView.maximumPrimaryColumnWidth];
  [self validateColumnConstraintsWithMin:splitView.minimumSupplementaryColumnWidth
                                     max:splitView.maximumSupplementaryColumnWidth];

#if __IPHONE_OS_VERSION_MAX_ALLOWED >= 260000
  if (@available(iOS 26.0, *)) {
    [self validateColumnConstraintsWithMin:splitView.minimumInspectorColumnWidth
                                       max:splitView.maximumInspectorColumnWidth];
  }
#endif

  // Step 2.2 - apply column settings
  if (splitView.minimumPrimaryColumnWidth >= 0) {
    splitViewController.minimumPrimaryColumnWidth = splitView.minimumPrimaryColumnWidth;
  }

  if (splitView.maximumPrimaryColumnWidth >= 0) {
    splitViewController.maximumPrimaryColumnWidth = splitView.maximumPrimaryColumnWidth;
  }

  if (splitView.preferredPrimaryColumnWidthOrFraction >= 0 && splitView.preferredPrimaryColumnWidthOrFraction < 1) {
    splitViewController.preferredPrimaryColumnWidthFraction = splitView.preferredPrimaryColumnWidthOrFraction;
  } else if (splitView.preferredPrimaryColumnWidthOrFraction >= 1) {
    splitViewController.preferredPrimaryColumnWidth = splitView.preferredPrimaryColumnWidthOrFraction;
  }

  if (splitView.minimumSupplementaryColumnWidth >= 0) {
    splitViewController.minimumSupplementaryColumnWidth = splitView.minimumSupplementaryColumnWidth;
  }

  if (splitView.maximumSupplementaryColumnWidth >= 0) {
    splitViewController.maximumSupplementaryColumnWidth = splitView.maximumSupplementaryColumnWidth;
  }

  if (splitView.preferredSupplementaryColumnWidthOrFraction >= 0 &&
      splitView.preferredSupplementaryColumnWidthOrFraction < 1) {
    splitViewController.preferredSupplementaryColumnWidthFraction =
        splitView.preferredSupplementaryColumnWidthOrFraction;
  } else if (splitView.preferredSupplementaryColumnWidthOrFraction >= 1) {
    splitViewController.preferredSupplementaryColumnWidth = splitView.preferredSupplementaryColumnWidthOrFraction;
  }

#if __IPHONE_OS_VERSION_MAX_ALLOWED >= 260000
  if (@available(iOS 26.0, *)) {
    if (splitView.minimumSecondaryColumnWidth >= 0) {
      splitViewController.minimumSecondaryColumnWidth = splitView.minimumSecondaryColumnWidth;
    }

    if (splitView.preferredSecondaryColumnWidthOrFraction >= 0 &&
        splitView.preferredSecondaryColumnWidthOrFraction < 1) {
      splitViewController.preferredSecondaryColumnWidthFraction = splitView.preferredSecondaryColumnWidthOrFraction;
    } else if (splitView.preferredSecondaryColumnWidthOrFraction >= 1) {
      splitViewController.preferredSecondaryColumnWidth = splitView.preferredSecondaryColumnWidthOrFraction;
    }

    if (splitView.minimumInspectorColumnWidth >= 0) {
      splitViewController.minimumInspectorColumnWidth = splitView.minimumInspectorColumnWidth;
    }

    if (splitView.maximumInspectorColumnWidth >= 0) {
      splitViewController.maximumInspectorColumnWidth = splitView.maximumInspectorColumnWidth;
    }

    if (splitView.preferredInspectorColumnWidthOrFraction >= 0 &&
        splitView.preferredInspectorColumnWidthOrFraction < 1) {
      splitViewController.preferredInspectorColumnWidthFraction = splitView.preferredInspectorColumnWidthOrFraction;
    } else if (splitView.preferredInspectorColumnWidthOrFraction >= 1) {
      splitViewController.preferredInspectorColumnWidth = splitView.preferredInspectorColumnWidthOrFraction;
    }
  }
#endif

  // Step 2.3 - toggle inspector
  [splitViewController toggleSplitViewInspector:splitView.showInspector];
}

- (void)updateSplitViewDisplayModeFor:(RNSSplitViewHostComponentView *)splitView
                       withController:(RNSSplitViewHostController *)splitViewController
{
  splitViewController.preferredDisplayMode = splitView.preferredDisplayMode;
}

- (void)validateColumnConstraintsWithMin:(CGFloat)minWidth max:(CGFloat)maxWidth
{
  NSAssert(
      minWidth <= maxWidth,
      ([NSString
          stringWithFormat:
              @"[RNScreens] SplitView column constraints are invalid: minWidth %.2f cannot be greater than maxWidth %.2f",
              minWidth,
              maxWidth]));
}

@end
