#import "UIViewController+RNScreens.h"
#import "RNSScreenContainer.h"
#import "RNSScreenStack.h"
#import "RNSScreen.h"

#import <objc/runtime.h>

@implementation UIViewController (RNScreens)

- (UIViewController *)RNSChildViewControllerForStatusBarStyle
{
  if ([self isKindOfClass:[RNSScreen class]]) {
    return nil;
  }
  UIViewController* lastViewController = [[self childViewControllers] lastObject];
  if ([lastViewController isKindOfClass:[RNScreensNavigationController class]] || [lastViewController isKindOfClass:[RNScreensViewController class]] || [lastViewController isKindOfClass:[RNSScreen class]]) {
    return [lastViewController childViewControllerForStatusBarStyle] ?: lastViewController;
  }
  return [self RNSChildViewControllerForStatusBarStyle];
}

- (UIViewController *)RNSChildViewControllerForStatusBarHidden
{
  if ([self isKindOfClass:[RNSScreen class]]) {
    return nil;
  }
  UIViewController* lastViewController = [[self childViewControllers] lastObject];
  if ([lastViewController isKindOfClass:[RNScreensNavigationController class]] || [lastViewController isKindOfClass:[RNScreensViewController class]] || [lastViewController isKindOfClass:[RNSScreen class]]) {
    return [lastViewController childViewControllerForStatusBarHidden] ?: lastViewController;
  }
  return [self RNSChildViewControllerForStatusBarHidden];
}

- (UIStatusBarAnimation)RNSPreferredStatusBarUpdateAnimation
{
  UIViewController *childVC =  [[self childViewControllers] lastObject];
  return childVC ? childVC.preferredStatusBarUpdateAnimation : UIStatusBarAnimationFade;
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
}

@end
