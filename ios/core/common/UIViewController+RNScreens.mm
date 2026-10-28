#import "RNSEnums.h"
#import "RNSLog.h"
#import "RNSOrientationProviding.h"
#import "UIViewController+RNScreens.h"

#import <objc/runtime.h>

#if !TARGET_OS_TV
static UIInterfaceOrientationMask RNSInterfaceOrientationMaskFromOrientation(RNSOrientation orientation)
{
  switch (orientation) {
    case RNSOrientationAll:
      return UIInterfaceOrientationMaskAll;
    case RNSOrientationAllButUpsideDown:
      return UIInterfaceOrientationMaskAllButUpsideDown;
    case RNSOrientationPortrait:
      return UIInterfaceOrientationMaskPortrait | UIInterfaceOrientationMaskPortraitUpsideDown;
    case RNSOrientationPortraitUp:
      return UIInterfaceOrientationMaskPortrait;
    case RNSOrientationPortraitDown:
      return UIInterfaceOrientationMaskPortraitUpsideDown;
    case RNSOrientationLandscape:
      return UIInterfaceOrientationMaskLandscape;
    case RNSOrientationLandscapeLeft:
      return UIInterfaceOrientationMaskLandscapeLeft;
    case RNSOrientationLandscapeRight:
      return UIInterfaceOrientationMaskLandscapeRight;
    case RNSOrientationInherit:
      RNSLogE(@"[RNScreens] RNSOrientationInherit does not map directly to any UIInterfaceOrientationMask");
      return 0;
    default:
      RNSLogE(@"[RNScreens] Unsupported orientation");
      return 0;
  }
}
#endif // !TARGET_OS_TV

@implementation UIViewController (RNScreens)

#if !TARGET_OS_TV
- (UIInterfaceOrientationMask)reactNativeScreensSupportedInterfaceOrientations
{
  id<RNSOrientationProviding> childOrientationProvidingVC = [self findChildRNSOrientationProvidingViewController];

  if (childOrientationProvidingVC != nil) {
    RNSOrientation orientation = [childOrientationProvidingVC evaluateOrientation];
    if (orientation == RNSOrientationInherit) {
      return [[UIApplication sharedApplication] supportedInterfaceOrientationsForWindow:self.view.window];
    }

    return RNSInterfaceOrientationMaskFromOrientation(orientation);
  }

  return [self reactNativeScreensSupportedInterfaceOrientations];
}

- (id<RNSOrientationProviding>)findChildRNSOrientationProvidingViewController
{
  UIViewController *lastViewController = [[self childViewControllers] lastObject];
  if ([lastViewController respondsToSelector:@selector(evaluateOrientation)]) {
    return static_cast<id<RNSOrientationProviding>>(lastViewController);
  }
  return nil;
}

+ (void)load
{
  static dispatch_once_t once_token;
  dispatch_once(&once_token, ^{
    Class uiVCClass = [UIViewController class];

    method_exchangeImplementations(
        class_getInstanceMethod(uiVCClass, @selector(supportedInterfaceOrientations)),
        class_getInstanceMethod(uiVCClass, @selector(reactNativeScreensSupportedInterfaceOrientations)));
  });
}
#endif

@end
