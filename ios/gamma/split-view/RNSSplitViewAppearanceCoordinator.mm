#import "RNSSplitViewAppearanceCoordinator.h"
#import "RNSConversions.h"

#import "Swift-Bridging.h"

@implementation RNSSplitViewAppearanceCoordinator

- (void)updateAppearanceOfSplitView:(RNSSplitViewHostComponentView *_Nonnull)splitView
                     withController:(RNSSplitViewHostController *_Nonnull)controller
{
  RCTAssert(splitView != nil, @"[RNScreens] Attempt to update appearance of uninitialized splitView host component");
  RCTAssert(controller != nil, @"[RNScreens] Attempt to update appearance of uninitialized splitView controller");

  // Step 1 - general settings
  controller.displayModeButtonVisibility = splitView.displayModeButtonVisibility;
  controller.preferredSplitBehavior = splitView.preferredSplitBehavior;
  controller.presentsWithGesture = splitView.presentsWithGesture;
  controller.primaryEdge = splitView.primaryEdge;
  controller.showsSecondaryOnlyButton = splitView.showSecondaryToggleButton;

  // Step 2 - props with dedicated flags for updates
  [controller updatePreferredDisplayModeIfNeeded];

  // Step 3 - manipulating columns
  // Step 3.1 - validating column constraints
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

  // Step 3.2 - applying updates to columns
  if (splitView.minimumPrimaryColumnWidth >= 0) {
    controller.minimumPrimaryColumnWidth = splitView.minimumPrimaryColumnWidth;
  }

  if (splitView.maximumPrimaryColumnWidth >= 0) {
    controller.maximumPrimaryColumnWidth = splitView.maximumPrimaryColumnWidth;
  }

  if (splitView.preferredPrimaryColumnWidthOrFraction >= 0 && splitView.preferredPrimaryColumnWidthOrFraction < 1) {
    controller.preferredPrimaryColumnWidthFraction = splitView.preferredPrimaryColumnWidthOrFraction;
  } else if (splitView.preferredSupplementaryColumnWidthOrFraction >= 1) {
    controller.preferredPrimaryColumnWidth = splitView.preferredPrimaryColumnWidthOrFraction;
  }

  if (splitView.minimumSupplementaryColumnWidth >= 0) {
    controller.minimumSupplementaryColumnWidth = splitView.minimumSupplementaryColumnWidth;
  }

  if (splitView.maximumSupplementaryColumnWidth >= 0) {
    controller.maximumSupplementaryColumnWidth = splitView.maximumSupplementaryColumnWidth;
  }

  if (splitView.preferredSupplementaryColumnWidthOrFraction >= 0 &&
      splitView.preferredSupplementaryColumnWidthOrFraction < 1) {
    controller.preferredSupplementaryColumnWidthFraction = splitView.preferredSupplementaryColumnWidthOrFraction;
  } else if (splitView.preferredSupplementaryColumnWidthOrFraction >= 1) {
    controller.preferredSupplementaryColumnWidth = splitView.preferredSupplementaryColumnWidthOrFraction;
  }

#if defined(__IPHONE_OS_VERSION_MAX_ALLOWED) && defined(__IPHONE_26_0) && \
    __IPHONE_OS_VERSION_MAX_ALLOWED >= __IPHONE_26_0
  if (@available(iOS 26.0, *)) {
    if (splitView.minimumSecondaryColumnWidth >= 0) {
      controller.minimumSecondaryColumnWidth = splitView.minimumSecondaryColumnWidth;
    }

    if (splitView.preferredSecondaryColumnWidthOrFraction >= 0 &&
        splitView.preferredSecondaryColumnWidthOrFraction < 1) {
      controller.preferredSecondaryColumnWidthFraction = splitView.preferredSecondaryColumnWidthOrFraction;
    } else if (splitView.preferredInspectorColumnWidthOrFraction >= 1) {
      controller.preferredSecondaryColumnWidth = splitView.preferredSecondaryColumnWidthOrFraction;
    }

    if (splitView.minimumInspectorColumnWidth >= 0) {
      controller.minimumInspectorColumnWidth = splitView.minimumInspectorColumnWidth;
    }

    if (splitView.maximumInspectorColumnWidth >= 0) {
      controller.maximumInspectorColumnWidth = splitView.maximumInspectorColumnWidth;
    }

    if (splitView.preferredInspectorColumnWidthOrFraction >= 0 &&
        splitView.preferredInspectorColumnWidthOrFraction < 1) {
      controller.preferredInspectorColumnWidthFraction = splitView.preferredInspectorColumnWidthOrFraction;
    } else if (splitView.preferredInspectorColumnWidthOrFraction >= 1) {
      controller.preferredInspectorColumnWidth = splitView.preferredInspectorColumnWidthOrFraction;
    }
  }
#endif

  // Step 3.3 - manipulating with inspector column
  [controller toggleSplitViewInspector:splitView.showInspector];
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
