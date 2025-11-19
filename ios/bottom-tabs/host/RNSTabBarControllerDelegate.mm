#import "RNSTabBarControllerDelegate.h"
#import <React/RCTAssert.h>
#import "RNSTabBarController.h"
#import "RNSTabsScreenViewController.h"

@implementation RNSTabBarControllerDelegate

- (BOOL)tabBarController:(UITabBarController *)tabBarController
    shouldSelectViewController:(UIViewController *)viewController
{
  RCTAssert(
      [tabBarController isKindOfClass:RNSTabBarController.class],
      @"[RNScreens] Unexpected type of controller: %@",
      tabBarController.class);

  // Can be UINavigationController in case of MoreNavigationController
  RCTAssert(
      [viewController isKindOfClass:RNSTabsScreenViewController.class] ||
          [viewController isKindOfClass:UINavigationController.class],
      @"[RNScreens] Unexpected type of controller: %@",
      viewController.class);

  RNSTabBarController *tabBarCtrl = static_cast<RNSTabBarController *>(tabBarController);
  RNSTabsScreenViewController *tabScreenCtrl = static_cast<RNSTabsScreenViewController *>(viewController);

#if !TARGET_OS_TV
  // When the moreNavigationController is selected, we want to show it
  // TODO: this solution only works for uncontrolled mode. Add support for controlled mode as well.
  if ([self shouldAllowMoreControllerSelection:tabBarCtrl] &&
      viewController == tabBarController.moreNavigationController) {
    return YES;
  }
#endif // !TARGET_OS_TV

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

  // TODO: handle enforcing orientation with natively-driven tabs

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

  // Can be UINavigationController in case of MoreNavigationController
  RCTAssert(
      [viewController isKindOfClass:RNSTabsScreenViewController.class] ||
          [viewController isKindOfClass:UINavigationController.class],
      @"[RNScreens] Unexpected type of controller: %@",
      viewController.class);

#if !TARGET_OS_TV
  // When the moreNavigationController is selected, we want to show it
  if ([self shouldAllowMoreControllerSelection:static_cast<RNSTabBarController *>(tabBarController)] &&
      viewController == tabBarController.moreNavigationController) {
    // Hide the navigation bar for the more controller
    [tabBarController.moreNavigationController setNavigationBarHidden:YES animated:NO];
  }
#endif // !TARGET_OS_TV
}

- (BOOL)shouldPreventNativeTabChangeWithinTabBarController:(nonnull RNSTabBarController *)tabBarCtrl
{
  // This handles the tabsHostComponentView nullability
  return [tabBarCtrl.tabsHostComponentView experimental_controlNavigationStateInJS] ?: NO;
}

- (BOOL)shouldAllowMoreControllerSelection:(nonnull RNSTabBarController *)tabBarCtrl
{
  return ![tabBarCtrl.tabsHostComponentView experimental_controlNavigationStateInJS] ?: YES;
}

@end
