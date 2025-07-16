#import "RNSSplitViewAppearanceCoordinator.h"
#import "RNSConversions.h"

#import "Swift-Bridging.h"

@implementation RNSSplitViewAppearanceCoordinator

- (void)updateAppearanceOfSplitView:(RNSSplitViewHostComponentView *)splitView
                     withController:(UISplitViewController *)controller
{
  if (splitView == nil) {
    return;
  }

  // Step 1 - general settings
  controller.preferredSplitBehavior = splitView.splitBehavior;
  controller.preferredDisplayMode = splitView.displayMode;
  controller.presentsWithGesture = splitView.enableSwipe;
  controller.primaryEdge = splitView.primaryEdge;
  controller.showsSecondaryOnlyButton = splitView.showSecondaryToggleButton;

  // Step 2 - manipulating columns
  if ([controller isKindOfClass:[RNSSplitViewHostController class]]) {
    RNSSplitViewHostController *hostController = (RNSSplitViewHostController *)controller;

    [hostController toggleSplitViewInspector:splitView.showInspector];
  }
}

@end
