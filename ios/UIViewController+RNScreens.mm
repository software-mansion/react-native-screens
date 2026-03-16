#import "RNSConversions.h"
#import "RNSEnums.h"
#import "RNSOrientationProviding.h"
#import "RNSScreenContainer.h"
#import "UIViewController+RNScreens.h"

#import <objc/runtime.h>

@implementation UIViewController (RNScreens)

#if !TARGET_OS_TV
- (UIViewController *)reactNativeScreensChildViewControllerForStatusBarStyle
{
  UIViewController *childVC = [self findChildRNSScreensViewController];
  return childVC ?: [self reactNativeScreensChildViewControllerForStatusBarStyle];
}

- (UIViewController *)reactNativeScreensChildViewControllerForStatusBarHidden
{
  UIViewController *childVC = [self findChildRNSScreensViewController];
  return childVC ?: [self reactNativeScreensChildViewControllerForStatusBarHidden];
}

- (UIStatusBarAnimation)reactNativeScreensPreferredStatusBarUpdateAnimation
{
  UIViewController *childVC = [self findChildRNSScreensViewController];
  return childVC ? childVC.preferredStatusBarUpdateAnimation
                 : [self reactNativeScreensPreferredStatusBarUpdateAnimation];
}

- (UIInterfaceOrientationMask)reactNativeScreensSupportedInterfaceOrientations
{
  id<RNSOrientationProviding> childOrientationProvidingVC = [self findChildRNSOrientationProvidingViewController];

  if (childOrientationProvidingVC != nil) {
    RNSOrientation orientation = [childOrientationProvidingVC evaluateOrientation];
    if (orientation == RNSOrientationInherit) {
      return [[UIApplication sharedApplication] supportedInterfaceOrientationsForWindow:self.view.window];
    }

    return rnscreens::conversion::UIInterfaceOrientationMaskFromRNSOrientation(orientation);
  }

  return [self reactNativeScreensSupportedInterfaceOrientations];
}

- (UIViewController *)reactNativeScreensChildViewControllerForHomeIndicatorAutoHidden
{
  UIViewController *childVC = [self findChildRNSScreensViewController];
  return childVC ?: [self reactNativeScreensChildViewControllerForHomeIndicatorAutoHidden];
}

- (id<RNSOrientationProviding>)findChildRNSOrientationProvidingViewController
{
  UIViewController *lastViewController = [[self childViewControllers] lastObject];
  if ([lastViewController respondsToSelector:@selector(evaluateOrientation)]) {
    return static_cast<id<RNSOrientationProviding>>(lastViewController);
  }
  return nil;
}

- (UIViewController *)findChildRNSScreensViewController
{
  UIViewController *lastViewController = [[self childViewControllers] lastObject];
  if ([lastViewController conformsToProtocol:@protocol(RNSViewControllerDelegate)]) {
    return lastViewController;
  }
  return nil;
}

+ (void)load
{
  static dispatch_once_t once_token;
  dispatch_once(&once_token, ^{
    Class uiVCClass = [UIViewController class];

    method_exchangeImplementations(
        class_getInstanceMethod(uiVCClass, @selector(childViewControllerForStatusBarStyle)),
        class_getInstanceMethod(uiVCClass, @selector(reactNativeScreensChildViewControllerForStatusBarStyle)));

    method_exchangeImplementations(
        class_getInstanceMethod(uiVCClass, @selector(childViewControllerForStatusBarHidden)),
        class_getInstanceMethod(uiVCClass, @selector(reactNativeScreensChildViewControllerForStatusBarHidden)));

    method_exchangeImplementations(
        class_getInstanceMethod(uiVCClass, @selector(preferredStatusBarUpdateAnimation)),
        class_getInstanceMethod(uiVCClass, @selector(reactNativeScreensPreferredStatusBarUpdateAnimation)));

    method_exchangeImplementations(
        class_getInstanceMethod(uiVCClass, @selector(supportedInterfaceOrientations)),
        class_getInstanceMethod(uiVCClass, @selector(reactNativeScreensSupportedInterfaceOrientations)));

    method_exchangeImplementations(
        class_getInstanceMethod(uiVCClass, @selector(childViewControllerForHomeIndicatorAutoHidden)),
        class_getInstanceMethod(uiVCClass, @selector(reactNativeScreensChildViewControllerForHomeIndicatorAutoHidden)));
  });
}
#endif

@end
