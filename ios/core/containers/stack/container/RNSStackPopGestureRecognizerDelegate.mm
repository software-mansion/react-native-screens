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
  // Refuses the root, as UIKit's own delegate does. Read from UIKit, not from the container's stack
  // model: a push UIKit queues behind its running transition makes the model longer than the stack
  // the recognizer would pop.
  // Unlike UIKit's own delegate, allows a swipe while the navigation bar is hidden, which it is on
  // every screen without a header.
  return _navigationController.viewControllers.count > 1;
}

- (BOOL)gestureRecognizer:(UIGestureRecognizer *)gestureRecognizer
    shouldBeRequiredToFailByGestureRecognizer:(UIGestureRecognizer *)otherGestureRecognizer
{
  // UIKit's own delegate gives the edge swipe priority over pans in the content; the priority is
  // private and lost with any other delegate (undocumented, matched on 18.6, 26.5 and 27.2).
  // The content pop recognizer needs no rule: it already loses to horizontal scroll views.
  UINavigationController *navigationController = _navigationController;
  return gestureRecognizer == navigationController.interactivePopGestureRecognizer &&
      RNSPanWaitsForEdgeSwipe(otherGestureRecognizer, navigationController.view);
}

@end

static BOOL RNSPanWaitsForEdgeSwipe(UIGestureRecognizer *otherGestureRecognizer, UIView *containerView)
{
  // Screen-edge recognizers keep their own arbitration. A nested stack's pop recognizers, content
  // recognizer included, subclass `UIScreenEdgePanGestureRecognizer` (undocumented, 18.6 and 27.2).
  if (![otherGestureRecognizer isKindOfClass:UIPanGestureRecognizer.class] ||
      [otherGestureRecognizer isKindOfClass:UIScreenEdgePanGestureRecognizer.class]) {
    return NO;
  }
  return otherGestureRecognizer.view != containerView && [otherGestureRecognizer.view isDescendantOfView:containerView];
}

#endif // !TARGET_OS_TV
