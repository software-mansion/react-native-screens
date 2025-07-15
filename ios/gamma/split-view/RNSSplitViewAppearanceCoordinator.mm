#import "RNSSplitViewAppearanceCoordinator.h"
#import "Swift-Bridging.h"

@implementation RNSSplitViewAppearanceCoordinator

- (void)updateAppearanceOfSplitView:(RNSSplitViewHostComponentView *)splitView
                     withController:(UISplitViewController *)controller
{
  if (splitView == nil) {
    return;
  }

  // Step 1 - general settings
  controller.preferredSplitBehavior =
      convertRNSSplitBehaviorToUISplitViewControllerSplitBehavior(splitView.splitBehavior);
  controller.preferredDisplayMode = convertRNSDisplayModeToUISplitViewControllerDisplayMode(splitView.displayMode);
  controller.presentsWithGesture = splitView.enableSwipe;
  controller.showsSecondaryOnlyButton = splitView.showSecondaryToggleButton;

  // Step 2 - manipulating columns
  if ([controller isKindOfClass:[RNSSplitViewHostController class]]) {
    RNSSplitViewHostController *hostController = (RNSSplitViewHostController *)controller;

    [hostController toggleSplitViewInspector:splitView.showInspector];
  }
}

#pragma mark Conversions

UISplitViewControllerSplitBehavior convertRNSSplitBehaviorToUISplitViewControllerSplitBehavior(
    RNSSplitViewSplitBehavior behavior)
{
  switch (behavior) {
    case RNSSplitViewSplitBehaviorDisplace:
      return UISplitViewControllerSplitBehaviorDisplace;
    case RNSSplitViewSplitBehaviorOverlay:
      return UISplitViewControllerSplitBehaviorOverlay;
    case RNSSplitViewSplitBehaviorTile:
      return UISplitViewControllerSplitBehaviorTile;
    case RNSSplitViewSplitBehaviorAutomatic:
    default:
      return UISplitViewControllerSplitBehaviorAutomatic;
  }
}

UISplitViewControllerDisplayMode convertRNSDisplayModeToUISplitViewControllerDisplayMode(
    RNSSplitViewDisplayMode displayMode)
{
  switch (displayMode) {
    case RNSSplitViewDisplayModeSecondaryOnly:
      return UISplitViewControllerDisplayModeSecondaryOnly;
    case RNSSplitViewDisplayModeOneBesideSecondary:
      return UISplitViewControllerDisplayModeOneBesideSecondary;
    case RNSSplitViewDisplayModeOneOverSecondary:
      return UISplitViewControllerDisplayModeOneOverSecondary;
    case RNSSplitViewDisplayModeTwoBesideSecondary:
      return UISplitViewControllerDisplayModeTwoBesideSecondary;
    case RNSSplitViewDisplayModeTwoOverSecondary:
      return UISplitViewControllerDisplayModeTwoOverSecondary;
    case RNSSplitViewDisplayModeTwoDisplaceSecondary:
      return UISplitViewControllerDisplayModeTwoDisplaceSecondary;
    case RNSSplitViewDisplayModeAutomatic:
    default:
      return UISplitViewControllerDisplayModeAutomatic;
  }
}

@end
