#import "UIViewController+RNScreens.h"
#import "RNSScreenContainer.h"
#import "RNSScreenStack.h"
#import "RNSScreen.h"

#import <objc/runtime.h>

static dispatch_once_t checkViewControllerStatusBarOnce;

bool viewControllerStatusBarDisabled;

@implementation UIViewController (RNScreens)

- (UIViewController *)reactNativeScreensChildViewControllerForStatusBarStyle
{
  UIViewController* lastViewController = [[self childViewControllers] lastObject];
  if ([lastViewController isKindOfClass:[RNScreensNavigationController class]] || [lastViewController isKindOfClass:[RNScreensViewController class]] || [lastViewController isKindOfClass:[RNSScreen class]]) {
    return lastViewController;
  }
  return [self reactNativeScreensChildViewControllerForStatusBarStyle];
}

- (UIViewController *)reactNativeScreensChildViewControllerForStatusBarHidden
{
  UIViewController* lastViewController = [[self childViewControllers] lastObject];
  if ([lastViewController isKindOfClass:[RNScreensNavigationController class]] || [lastViewController isKindOfClass:[RNScreensViewController class]] || [lastViewController isKindOfClass:[RNSScreen class]]) {
    return lastViewController;
  }
  return [self reactNativeScreensChildViewControllerForStatusBarHidden];
}

- (UIStatusBarAnimation)reactNativeScreensPreferredStatusBarUpdateAnimation
{
  UIViewController* lastViewController = [[self childViewControllers] lastObject];
  if ([lastViewController isKindOfClass:[RNScreensNavigationController class]] || [lastViewController isKindOfClass:[RNScreensViewController class]] || [lastViewController isKindOfClass:[RNSScreen class]]) {
    return lastViewController.preferredStatusBarUpdateAnimation;
  }
  return [self reactNativeScreensPreferredStatusBarUpdateAnimation];
}

+ (void)load
{
  Class uiVCClass = [UIViewController class];

  dispatch_once(&checkViewControllerStatusBarOnce, ^{
    viewControllerStatusBarDisabled = ![[[NSBundle mainBundle] objectForInfoDictionaryKey:@"UIViewControllerBasedStatusBarAppearance"] boolValue];
  });

  method_exchangeImplementations(class_getInstanceMethod(uiVCClass, @selector(childViewControllerForStatusBarStyle)),
                                 class_getInstanceMethod(uiVCClass, @selector(reactNativeScreensChildViewControllerForStatusBarStyle)));

  method_exchangeImplementations(class_getInstanceMethod(uiVCClass, @selector(childViewControllerForStatusBarHidden)),
                                 class_getInstanceMethod(uiVCClass, @selector(reactNativeScreensChildViewControllerForStatusBarHidden)));
  
  method_exchangeImplementations(class_getInstanceMethod(uiVCClass, @selector(preferredStatusBarUpdateAnimation)),
                                 class_getInstanceMethod(uiVCClass, @selector(reactNativeScreensPreferredStatusBarUpdateAnimation)));
}

@end
