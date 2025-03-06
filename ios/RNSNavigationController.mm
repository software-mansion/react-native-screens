#ifdef RCT_NEW_ARCH_ENABLED
#import <React/RCTFabricComponentsPlugins.h>
#import <React/RCTFabricSurface.h>
#import <React/RCTMountingTransactionObserving.h>
#import <React/RCTSurfaceTouchHandler.h>
#import <React/RCTSurfaceView.h>
#import <React/UIView+React.h>
#import <react/renderer/components/rnscreens/ComponentDescriptors.h>
#import <react/renderer/components/rnscreens/EventEmitters.h>
#import <react/renderer/components/rnscreens/Props.h>
#import <react/renderer/components/rnscreens/RCTComponentViewHelpers.h>
#import "RCTSurfaceTouchHandler+RNSUtility.h"
#else
#import <React/RCTBridge.h>
#import <React/RCTRootContentView.h>
#import <React/RCTShadowView.h>
#import <React/RCTTouchHandler.h>
#import <React/RCTUIManager.h>
#import <React/RCTUIManagerUtils.h>
#import "RCTTouchHandler+RNSUtility.h"
#endif // RCT_NEW_ARCH_ENABLED

#import "RNSDefines.h"
#import "RNSNavigationController.h"
#import "RNSPercentDrivenInteractiveTransition.h"
#import "RNSScreen.h"
#import "RNSScreenStackAnimator.h"
#import "RNSScreenStackHeaderConfig.h"
#import "RNSScreenStackView.h"
#import "RNSScreenWindowTraits.h"
#import "utils/UINavigationBar+RNSUtility.h"

#import "UIView+RNSUtility.h"

#ifdef RCT_NEW_ARCH_ENABLED
namespace react = facebook::react;
#endif // RCT_NEW_ARCH_ENABLED

@implementation RNSNavigationController

#if !TARGET_OS_TV
- (UIViewController *)childViewControllerForStatusBarStyle
{
  return [self topViewController];
}

- (UIStatusBarAnimation)preferredStatusBarUpdateAnimation
{
  return [self topViewController].preferredStatusBarUpdateAnimation;
}

- (UIViewController *)childViewControllerForStatusBarHidden
{
  return [self topViewController];
}

- (void)viewDidLayoutSubviews
{
  [super viewDidLayoutSubviews];
  if ([self.topViewController isKindOfClass:[RNSScreen class]]) {
    RNSScreen *screenController = (RNSScreen *)self.topViewController;
    BOOL isNotDismissingModal = screenController.presentedViewController == nil ||
        (screenController.presentedViewController != nil &&
         ![screenController.presentedViewController isBeingDismissed]);

    // Calculate header height during simple transition from one screen to another.
    // If RNSScreen includes a navigation controller of type RNSNavigationController, it should not calculate
    // header height, as it could have nested stack.
    if (![screenController hasNestedStack] && isNotDismissingModal) {
      [screenController calculateAndNotifyHeaderHeightChangeIsModal:NO];
    }

    [self maybeUpdateHeaderLayoutInfoInShadowTree:screenController];
  }
}

- (UIInterfaceOrientationMask)supportedInterfaceOrientations
{
  return [self topViewController].supportedInterfaceOrientations;
}

- (UIViewController *)childViewControllerForHomeIndicatorAutoHidden
{
  return [self topViewController];
}

- (void)maybeUpdateHeaderLayoutInfoInShadowTree:(RNSScreen *)screenController
{
  // This might happen e.g. if there is only native title present in navigation bar.
  if (self.navigationBar.subviews.count < 2) {
    return;
  }

  auto headerConfig = screenController.screenView.findHeaderConfig;
  if (headerConfig == nil || !headerConfig.shouldHeaderBeVisible) {
    return;
  }

#ifdef RCT_NEW_ARCH_ENABLED
  [headerConfig updateHeaderStateInShadowTreeInContextOfNavigationBar:self.navigationBar];
#else
  NSDirectionalEdgeInsets navBarMargins = [self.navigationBar directionalLayoutMargins];
  NSDirectionalEdgeInsets navBarContentMargins =
      [self.navigationBar.rnscreens_findContentView directionalLayoutMargins];

  BOOL isDisplayingBackButton = [headerConfig shouldBackButtonBeVisibleInNavigationBar:self.navigationBar];

  // 44.0 is just "closed eyes default". It is so on device I've tested with, nothing more.
  UIView *barButtonView = isDisplayingBackButton ? self.navigationBar.rnscreens_findBackButtonWrapperView : nil;
  CGFloat platformBackButtonWidth = barButtonView != nil ? barButtonView.frame.size.width : 44.0f;

  [headerConfig updateHeaderConfigState:NSDirectionalEdgeInsets{
                                            .leading = navBarMargins.leading + navBarContentMargins.leading +
                                                (isDisplayingBackButton ? platformBackButtonWidth : 0),
                                            .trailing = navBarMargins.trailing + navBarContentMargins.trailing,
                                        }];
#endif // RCT_NEW_ARCH_ENABLED
}
#endif

@end
