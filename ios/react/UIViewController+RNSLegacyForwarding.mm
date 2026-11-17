#import <UIKit/UIKit.h>
#import "RNSScreenContainer.h" // legacy-compat: forwards status-bar and home-indicator queries to legacy screens (D3)

#import <objc/runtime.h>

/**
 * Forwards status-bar and home-indicator queries to the last child view controller when it is a legacy screen
 * (conforms to `RNSViewControllerDelegate`).
 *
 * The orientation query is handled by `UIViewController+RNScreens`; the two categories swizzle disjoint selectors.
 */
@interface UIViewController (RNSLegacyForwarding)

@end

@implementation UIViewController (RNSLegacyForwarding)

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

- (UIViewController *)reactNativeScreensChildViewControllerForHomeIndicatorAutoHidden
{
  UIViewController *childVC = [self findChildRNSScreensViewController];
  return childVC ?: [self reactNativeScreensChildViewControllerForHomeIndicatorAutoHidden];
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
        class_getInstanceMethod(uiVCClass, @selector(childViewControllerForHomeIndicatorAutoHidden)),
        class_getInstanceMethod(uiVCClass, @selector(reactNativeScreensChildViewControllerForHomeIndicatorAutoHidden)));
  });
}
#endif

@end
