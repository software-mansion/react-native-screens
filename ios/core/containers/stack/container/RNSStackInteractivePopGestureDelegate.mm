#import "RNSStackInteractivePopGestureDelegate.h"

#if !TARGET_OS_TV

@implementation RNSStackInteractivePopGestureDelegate {
  __weak UINavigationController *_Nullable _navigationController;
}

- (instancetype)initWithNavigationController:(UINavigationController *)navigationController
{
  if (self = [super init]) {
    _navigationController = navigationController;
  }
  return self;
}

- (BOOL)gestureRecognizerShouldBegin:(UIGestureRecognizer *)gestureRecognizer
{
  UINavigationController *navigationController = _navigationController;
  return navigationController.viewControllers.count > 1 && navigationController.transitionCoordinator == nil;
}

@end

#endif // !TARGET_OS_TV
