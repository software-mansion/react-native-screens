#import "RNSStackPopGestureRecognizerDelegate.h"

#if !TARGET_OS_TV

static BOOL RNSPanWaitsForEdgeSwipe(UIGestureRecognizer *otherGestureRecognizer, UIView *containerView);

@implementation RNSStackPopGestureRecognizerDelegate {
  __weak UINavigationController *_navigationController;
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
  // UIKit's own delegate refused the root. Read from UIKit, not the stack model: a push UIKit queues behind
  // its running transition makes the model longer than the stack the recognizer would pop.
  return _navigationController.viewControllers.count > 1;
}

- (BOOL)gestureRecognizer:(UIGestureRecognizer *)gestureRecognizer
    shouldBeRequiredToFailByGestureRecognizer:(UIGestureRecognizer *)otherGestureRecognizer
{
  // UIKit's own delegate gives the edge swipe priority over pans in the content; the priority is private
  // and lost with any other delegate.
  UINavigationController *navigationController = _navigationController;
  return gestureRecognizer == navigationController.interactivePopGestureRecognizer &&
      RNSPanWaitsForEdgeSwipe(otherGestureRecognizer, navigationController.view);
}

@end

static BOOL RNSPanWaitsForEdgeSwipe(UIGestureRecognizer *otherGestureRecognizer, UIView *containerView)
{
  // Screen-edge recognizers, including a nested stack's pop recognizers, keep their own arbitration.
  if (![otherGestureRecognizer isKindOfClass:UIPanGestureRecognizer.class] ||
      [otherGestureRecognizer isKindOfClass:UIScreenEdgePanGestureRecognizer.class]) {
    return NO;
  }
  return otherGestureRecognizer.view != containerView && [otherGestureRecognizer.view isDescendantOfView:containerView];
}

#endif // !TARGET_OS_TV
