#import "UIViewController+RNScreens.h"
#import "RNSScreenContainer.h"
#import "RNSScreenStack.h"
#import "RNSScreen.h"

#import <objc/runtime.h>

@implementation UIViewController (RNScreens)

- (UIViewController *)RNSChildViewControllerForStatusBarStyle
{
  UIViewController* lastViewController = [[self childViewControllers] lastObject];
  if ([lastViewController isKindOfClass:[RNScreensNavigationController class]] || [lastViewController isKindOfClass:[RNScreensViewController class]] || [lastViewController isKindOfClass:[RNSScreen class]]) {
    return lastViewController;
  }
  return [self RNSChildViewControllerForStatusBarStyle];
}

- (UIViewController *)RNSChildViewControllerForStatusBarHidden
{
  UIViewController* lastViewController = [[self childViewControllers] lastObject];
  if ([lastViewController isKindOfClass:[RNScreensNavigationController class]] || [lastViewController isKindOfClass:[RNScreensViewController class]] || [lastViewController isKindOfClass:[RNSScreen class]]) {
    return lastViewController;
  }
  return [self RNSChildViewControllerForStatusBarHidden];
}

- (UIStatusBarAnimation)RNSPreferredStatusBarUpdateAnimation
{
  UIViewController* lastViewController = [[self childViewControllers] lastObject];
  if ([lastViewController isKindOfClass:[RNScreensNavigationController class]] || [lastViewController isKindOfClass:[RNScreensViewController class]] || [lastViewController isKindOfClass:[RNSScreen class]]) {
    return lastViewController.preferredStatusBarUpdateAnimation;
  }
  return [self RNSPreferredStatusBarUpdateAnimation];
}

- (UIInterfaceOrientationMask)RNSSupportedInterfaceOrientations
{
  UIViewController* lastViewController = [[self childViewControllers] lastObject];
  if ([lastViewController isKindOfClass:[RNScreensNavigationController class]] || [lastViewController isKindOfClass:[RNScreensViewController class]] || [lastViewController isKindOfClass:[RNSScreen class]]) {
    return lastViewController.supportedInterfaceOrientations;
  }
  return [self RNSSupportedInterfaceOrientations];
}

+ (void)load
{
  Class uiVCClass = [UIViewController class];

  method_exchangeImplementations(class_getInstanceMethod(uiVCClass, @selector(childViewControllerForStatusBarStyle)),
                                 class_getInstanceMethod(uiVCClass, @selector(RNSChildViewControllerForStatusBarStyle)));

  method_exchangeImplementations(class_getInstanceMethod(uiVCClass, @selector(childViewControllerForStatusBarHidden)),
                                 class_getInstanceMethod(uiVCClass, @selector(RNSChildViewControllerForStatusBarHidden)));
  
  method_exchangeImplementations(class_getInstanceMethod(uiVCClass, @selector(preferredStatusBarUpdateAnimation)),
                                 class_getInstanceMethod(uiVCClass, @selector(RNSPreferredStatusBarUpdateAnimation)));
  method_exchangeImplementations(class_getInstanceMethod(uiVCClass, @selector(supportedInterfaceOrientations)),
                                 class_getInstanceMethod(uiVCClass, @selector(RNSSupportedInterfaceOrientations)));
}

@end
