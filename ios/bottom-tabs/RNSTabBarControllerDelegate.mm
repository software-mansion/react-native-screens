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

  [tabBarCtrl.tabsHostComponentView
      emitOnNativeFocusChangeRequestSelectedTabScreen:tabScreenCtrl.tabScreenComponentView];

  return ![self shouldPreventNativeTabChangeWithinTabBarController:tabBarCtrl];
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
