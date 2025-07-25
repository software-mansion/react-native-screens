#import "RNSSplitViewAppearanceCoordinator.h"
#import "RNSConversions.h"

#import "Swift-Bridging.h"

@implementation RNSSplitViewAppearanceCoordinator

- (void)updateAppearanceIfNeededOfSplitView:(RNSSplitViewHostComponentView *_Nonnull)splitView
                             withController:(RNSSplitViewHostController *_Nonnull)splitViewController
{
  RCTAssert(splitView != nil, @"[RNScreens] Attempt to update appearance of uninitialized splitView host component");
  RCTAssert(
      splitViewController != nil, @"[RNScreens] Attempt to update appearance of uninitialized splitView controller");

  [splitViewController updateSplitViewAppearance:^{
    [self updateSplitViewConfigurationFor:splitView withController:splitViewController];
  }];

  [splitViewController updateSplitViewNavBar];

  [splitViewController updateSplitViewDisplayMode:^{
    [self updateSplitViewDisplayModeFor:splitView withController:splitViewController];
  }];
}

- (void)updateSplitViewConfigurationFor:(RNSSplitViewHostComponentView *_Nonnull)splitView
                         withController:(RNSSplitViewHostController *_Nonnull)splitViewController
{
  // Step 1 - general settings
  splitViewController.displayModeButtonVisibility = splitView.displayModeButtonVisibility;
  splitViewController.preferredSplitBehavior = splitView.preferredSplitBehavior;
  splitViewController.presentsWithGesture = splitView.presentsWithGesture;
  splitViewController.primaryEdge = splitView.primaryEdge;
  splitViewController.showsSecondaryOnlyButton = splitView.showSecondaryToggleButton;

  // Step 2 - manipulating columns
  // Step 2.1 - validating column constraints
  [self validateColumnConstraintsWithMinWidth:splitView.minimumPrimaryColumnWidth
                                     maxWidth:splitView.maximumPrimaryColumnWidth];
  [self validateColumnConstraintsWithMinWidth:splitView.minimumSupplementaryColumnWidth
                                     maxWidth:splitView.maximumSupplementaryColumnWidth];

#if defined(__IPHONE_OS_VERSION_MAX_ALLOWED) && defined(__IPHONE_26_0) && \
    __IPHONE_OS_VERSION_MAX_ALLOWED >= __IPHONE_26_0
  if (@available(iOS 26.0, *)) {
    [self validateColumnConstraintsWithMinWidth:splitView.minimumInspectorColumnWidth
                                       maxWidth:splitView.maximumInspectorColumnWidth];
  }
#endif

  // Step 2.2 - applying updates to columns
  if (splitView.minimumPrimaryColumnWidth >= 0) {
    splitViewController.minimumPrimaryColumnWidth = splitView.minimumPrimaryColumnWidth;
  }

  if (splitView.maximumPrimaryColumnWidth >= 0) {
    splitViewController.maximumPrimaryColumnWidth = splitView.maximumPrimaryColumnWidth;
  }

  if (splitView.preferredPrimaryColumnWidthOrFraction >= 0 && splitView.preferredPrimaryColumnWidthOrFraction < 1) {
    splitViewController.preferredPrimaryColumnWidthFraction = splitView.preferredPrimaryColumnWidthOrFraction;
  } else if (splitView.preferredSupplementaryColumnWidthOrFraction >= 1) {
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

#if defined(__IPHONE_OS_VERSION_MAX_ALLOWED) && defined(__IPHONE_26_0) && \
    __IPHONE_OS_VERSION_MAX_ALLOWED >= __IPHONE_26_0
  if (@available(iOS 26.0, *)) {
    if (splitView.minimumSecondaryColumnWidth >= 0) {
      splitViewController.minimumSecondaryColumnWidth = splitView.minimumSecondaryColumnWidth;
    }

    if (splitView.preferredSecondaryColumnWidthOrFraction >= 0 &&
        splitView.preferredSecondaryColumnWidthOrFraction < 1) {
      splitViewController.preferredSecondaryColumnWidthFraction = splitView.preferredSecondaryColumnWidthOrFraction;
    } else if (splitView.preferredInspectorColumnWidthOrFraction >= 1) {
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

  // Step 2.3 - manipulating with inspector column
  [splitViewController toggleSplitViewInspector:splitView.showInspector];
}

- (void)updateSplitViewDisplayModeFor:(RNSSplitViewHostComponentView *_Nonnull)splitView
                       withController:(RNSSplitViewHostController *_Nonnull)splitViewController
{
  splitViewController.preferredDisplayMode = splitView.preferredDisplayMode;
}

- (void)validateColumnConstraintsWithMinWidth:(CGFloat)minWidth maxWidth:(CGFloat)maxWidth
{
  RCTAssert(
      minWidth <= maxWidth,
      @"[RNScreens] SplitView column constraints are invalid: minWidth %f cannot be greater that maxWidth %f",
      minWidth,
      maxWidth);
}

@end
