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

  // TODO: handle enforcing orientation with natively-driven tabs

  // Detect repeated selection and inform tabScreenController
  BOOL repeatedSelection = [tabBarCtrl selectedViewController] == tabScreenCtrl;
  BOOL repeatedSelectionHandledBySpecialEffect =
      repeatedSelection ? [tabScreenCtrl tabScreenSelectedRepeatedly] : false;

  [tabBarCtrl.tabsHostComponentView
      emitOnNativeFocusChangeRequestSelectedTabScreen:tabScreenCtrl.tabScreenComponentView
              repeatedSelectionHandledBySpecialEffect:repeatedSelectionHandledBySpecialEffect];

  // On repeated selection we return false to prevent native *pop to root* effect that works only starting from iOS 26
  // and interferes with our implementation (which is necessary for controlled tabs).
  return repeatedSelection ? false : ![self shouldPreventNativeTabChangeWithinTabBarController:tabBarCtrl];
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
