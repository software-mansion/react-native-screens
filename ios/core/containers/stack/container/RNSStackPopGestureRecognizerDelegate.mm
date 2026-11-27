#import "RNSStackPopGestureRecognizerDelegate.h"
#import "RNSDefines.h"
#import "RNSStackNavigationController.h"
#import "RNSStackScreenController.h"

#if !TARGET_OS_TV

static BOOL RNSPanWaitsForEdgeSwipe(UIGestureRecognizer *otherGestureRecognizer, UIView *containerView);

@implementation RNSStackPopGestureRecognizerDelegate {
  __weak RNSStackNavigationController *_navigationController;
}

- (instancetype)initWithNavigationController:(RNSStackNavigationController *)navigationController
{
  if (self = [super init]) {
    _navigationController = navigationController;
  }
  return self;
}

- (BOOL)gestureRecognizerShouldBegin:(UIGestureRecognizer *)gestureRecognizer
{
  RNSStackNavigationController *navigationController = _navigationController;
  // Refuses the root, as UIKit's own delegate does. Read from UIKit, not from the container's stack
  // model: a push UIKit queues behind its running transition makes the model longer than the stack
  // the recognizer would pop.
  // Unlike UIKit's own delegate, allows a swipe while the navigation bar is hidden, which it is on
  // every screen without a header.
  if (navigationController.viewControllers.count <= 1) {
    return NO;
  }
  // Read on every touch, so a prop change applies to the next swipe and the recognizers need no resync.
  // The top screen comes from UIKit for the reason above.
  id<RNSStackContainerItemConfigProviding> topConfig = [self topScreenConfigProvider];
  if (topConfig != nil) {
    if (!topConfig.backGestureEnabled) {
      return NO;
    }
    if (!topConfig.fullScreenBackGestureEnabled && [self isContentPopGestureRecognizer:gestureRecognizer]) {
      return NO;
    }
  }
  // Below 26, UIKit decides when the recognizer begins whether the swipe's pop follows the finger, so the
  // finish in `popViewControllerAnimated:` comes too late (undocumented, 18.6). From 26 it decides inside that
  // call (27.2, 26.5 in bare UIKit), and a finish here could end our transition for a swipe that never pops.
  if (@available(iOS 26.0, *)) {
  } else {
    [navigationController finishRunningCustomTransition];
  }
  return YES;
}

// Nil when the top is not a stack screen or its view is gone; the gate then allows the swipe.
- (nullable id<RNSStackContainerItemConfigProviding>)topScreenConfigProvider
{
  UIViewController *top = _navigationController.topViewController;
  return [top isKindOfClass:RNSStackScreenController.class]
      ? static_cast<RNSStackScreenController *>(top).configProvider
      : nil;
}

- (BOOL)isContentPopGestureRecognizer:(UIGestureRecognizer *)gestureRecognizer
{
#if RNS_IPHONE_OS_VERSION_AVAILABLE(26_0)
  if (@available(iOS 26.0, *)) {
    return gestureRecognizer == _navigationController.interactiveContentPopGestureRecognizer;
  }
#endif // RNS_IPHONE_OS_VERSION_AVAILABLE(26_0)
  return NO;
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
