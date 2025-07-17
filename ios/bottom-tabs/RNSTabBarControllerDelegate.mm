#import "RNSTabBarControllerDelegate.h"
#import <React/RCTAssert.h>
#import "RNSTabBarController.h"
#import "RNSTabsScreenViewController.h"

@implementation RNSTabBarControllerDelegate

- (BOOL)tabBarController:(UITabBarController *)tabBarController
    shouldSelectViewController:(UIViewController *)viewController
{
  // TODO: This will crash with "More" view controller.
  RCTAssert(
      [tabBarController isKindOfClass:RNSTabBarController.class],
      @"[RNScreens] Unexpected type of controller: %@",
      tabBarController.class);
  RCTAssert(
      [viewController isKindOfClass:RNSTabsScreenViewController.class],
      @"[RNScreens] Unexpected type of controller: %@",
      viewController.class);

  RNSTabBarController *tabBarCtrl = static_cast<RNSTabBarController *>(tabBarController);
  RNSTabsScreenViewController *tabScreenCtrl = static_cast<RNSTabsScreenViewController *>(viewController);

  bool repeatedSelectionHandledNatively = false;

  // Detect repeated selection and inform tabScreenController
  if ([tabBarCtrl selectedViewController] == tabScreenCtrl) {
    repeatedSelectionHandledNatively = [tabScreenCtrl tabScreenSelectedRepeatedly];
  }

  // TODO: send an event with information about event being handled natively
  if (!repeatedSelectionHandledNatively) {
    [tabBarCtrl.tabsHostComponentView
        emitOnNativeFocusChangeRequestSelectedTabScreen:tabScreenCtrl.tabScreenComponentView];
      
    // TODO: handle overrideScrollViewBehaviorInFirstDescendantChainIfNeeded for natively-driven tabs
    return ![self shouldPreventNativeTabChangeWithinTabBarController:tabBarCtrl];
  }

  // As we're selecting the same controller, returning both true and false works here.
  return true;
}

- (void)tabBarController:(UITabBarController *)tabBarController
    didSelectViewController:(UIViewController *)viewController
{
  RCTAssert(
      [tabBarController isKindOfClass:RNSTabBarController.class],
      @"[RNScreens] Unexpected type of controller: %@",
      tabBarController.class);
  RCTAssert(
      [viewController isKindOfClass:RNSTabsScreenViewController.class],
      @"[RNScreens] Unexpected type of controller: %@",
      viewController.class);
}

- (bool)shouldPreventNativeTabChangeWithinTabBarController:(nonnull RNSTabBarController *)tabBarCtrl
{
  // This handles the tabsHostComponentView nullability
  return [tabBarCtrl.tabsHostComponentView experimental_controlNavigationStateInJS] ?: NO;
}

@end
