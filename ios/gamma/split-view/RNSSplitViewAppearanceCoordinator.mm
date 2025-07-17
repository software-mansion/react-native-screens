#import "RNSSplitViewAppearanceCoordinator.h"
#import "RNSConversions.h"

#import "Swift-Bridging.h"

@implementation RNSSplitViewAppearanceCoordinator

#define ASSIGN_PROP_IF_NONNEGATIVE(target, source, property) \
  if ((source).property >= 0) {                              \
    (target).property = (source).property;                   \
  }

- (void)updateAppearanceOfSplitView:(RNSSplitViewHostComponentView *_Nonnull)splitView
                     withController:(RNSSplitViewHostController *_Nonnull)controller
{
  RCTAssert(splitView != nil, @"[RNScreens] Attempt to update appearance of uninitialized splitView host component");
  RCTAssert(controller != nil, @"[RNScreens] Attempt to update appearance of uninitialized splitView controller");

  // Step 1 - general settings
  controller.displayModeButtonVisibility = splitView.displayModeButtonVisibility;
  controller.preferredSplitBehavior = splitView.splitBehavior;
  controller.preferredDisplayMode = splitView.displayMode;
  controller.presentsWithGesture = splitView.presentsWithGesture;
  controller.primaryEdge = splitView.primaryEdge;
  controller.showsSecondaryOnlyButton = splitView.showSecondaryToggleButton;

  // Step 2 - manipulating columns
  [controller toggleSplitViewInspector:splitView.showInspector];

  ASSIGN_PROP_IF_NONNEGATIVE(controller, splitView, minimumPrimaryColumnWidth);
  ASSIGN_PROP_IF_NONNEGATIVE(controller, splitView, maximumPrimaryColumnWidth);
  ASSIGN_PROP_IF_NONNEGATIVE(controller, splitView, preferredPrimaryColumnWidth);

  ASSIGN_PROP_IF_NONNEGATIVE(controller, splitView, minimumSupplementaryColumnWidth);
  ASSIGN_PROP_IF_NONNEGATIVE(controller, splitView, maximumSupplementaryColumnWidth);
  ASSIGN_PROP_IF_NONNEGATIVE(controller, splitView, preferredSupplementaryColumnWidth);
}

@end
