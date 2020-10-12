#import "UIViewController+RNScreens.h"
#import "RNSScreen.h"

#import <objc/runtime.h>

@implementation UIViewController (RNScreens)

- (UIViewController *)reactNativeScreensChildViewControllerForStatusBarStyle
{
  RNSScreen *screenVC = [self findChildScreen];
  return screenVC ?: [self reactNativeScreensChildViewControllerForStatusBarStyle];
}

- (UIViewController *)reactNativeScreensChildViewControllerForStatusBarHidden
{
  RNSScreen *screenVC = [self findChildScreen];
  return screenVC ?: [self reactNativeScreensChildViewControllerForStatusBarHidden];
}

- (UIStatusBarAnimation)reactNativeScreensPreferredStatusBarUpdateAnimation
{
  RNSScreen *screenVC = [self findChildScreen];
  return screenVC ? screenVC.preferredStatusBarUpdateAnimation : [self reactNativeScreensPreferredStatusBarUpdateAnimation];
}

- (RNSScreen *)findChildScreen
{
  UIViewController *lastViewController = [[self childViewControllers] lastObject];
  while (lastViewController != nil) {
    if ([lastViewController isKindOfClass:[RNSScreen class]]) {
      return (RNSScreen *)lastViewController;
    }
    lastViewController = [[lastViewController childViewControllers] lastObject];
  }
  return nil;
}

+ (void)load
{
  static dispatch_once_t once_token;
  dispatch_once(&once_token,  ^{
   Class uiVCClass = [UIViewController class];
   
   method_exchangeImplementations(class_getInstanceMethod(uiVCClass, @selector(childViewControllerForStatusBarStyle)),
                                  class_getInstanceMethod(uiVCClass, @selector(reactNativeScreensChildViewControllerForStatusBarStyle)));

   method_exchangeImplementations(class_getInstanceMethod(uiVCClass, @selector(childViewControllerForStatusBarHidden)),
                                  class_getInstanceMethod(uiVCClass, @selector(reactNativeScreensChildViewControllerForStatusBarHidden)));
   
   method_exchangeImplementations(class_getInstanceMethod(uiVCClass, @selector(preferredStatusBarUpdateAnimation)),
                                  class_getInstanceMethod(uiVCClass, @selector(reactNativeScreensPreferredStatusBarUpdateAnimation)));
  });
}

@end
