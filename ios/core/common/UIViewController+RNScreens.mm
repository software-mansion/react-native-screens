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

/// The topmost orientation provider below `parent` that is on screen: depth-first, last child
/// first. A child whose view is not in a window (an unselected tab, a detached screen) is skipped
/// together with everything below it.
static id<RNSOrientationProviding> RNSFindOrientationProvider(UIViewController *parent)
{
  for (UIViewController *child in [[parent childViewControllers] reverseObjectEnumerator]) {
    if (child.viewIfLoaded.window == nil) {
      continue;
    }
    if ([child respondsToSelector:@selector(evaluateOrientation)]) {
      return static_cast<id<RNSOrientationProviding>>(child);
    }
    id<RNSOrientationProviding> nested = RNSFindOrientationProvider(child);
    if (nested != nil) {
      return nested;
    }
  }
  return nil;
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

  // The window's root view controller can have children that are not ours and have no opinion on
  // orientation, so the screens container is not always its last child: a SwiftUI
  // `UIHostingController` that a SwiftUI-backed view adds when it resolves its parent to the root,
  // or a development launcher that is the root's only child and holds the container one level down.
  // Reading only `lastObject` then finds nothing, and no screen's `orientation` is enforced. So when
  // the last child has no opinion, the root searches below itself for the topmost provider that is
  // on screen. Other view controllers keep the `lastObject` answer.
  //
  // `viewIfLoaded` rather than `view`: the lookup must not load a view as a side effect.
  UIWindow *window = self.viewIfLoaded.window;
  if (window == nil || window.rootViewController != self) {
    return nil;
  }
  return RNSFindOrientationProvider(self);
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
