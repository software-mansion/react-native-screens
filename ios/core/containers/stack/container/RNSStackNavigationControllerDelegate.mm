#import "RNSStackNavigationControllerDelegate.h"
#import "RNSStackAnimationResolver.h"
#import "RNSStackAnimationTransitionTimeline.h"
#import "RNSStackNoneAnimator.h"
#import "RNSStackScreenController.h"
#import "RNSStackTimelineAnimator.h"

static RNSStackScreenController *_Nullable RNSStackScreenControllerOrNil(UIViewController *controller)
{
  return [controller isKindOfClass:RNSStackScreenController.class] ? static_cast<RNSStackScreenController *>(controller)
                                                                   : nil;
}

@implementation RNSStackNavigationControllerDelegate

- (nullable id<UIViewControllerAnimatedTransitioning>)navigationController:
                                                          (UINavigationController *)navigationController
                                           animationControllerForOperation:(UINavigationControllerOperation)operation
                                                        fromViewController:(UIViewController *)fromVC
                                                          toViewController:(UIViewController *)toVC
{
  RNSStackAnimationTransitionKind kind = operation == UINavigationControllerOperationPop
      ? RNSStackAnimationTransitionKindPop
      : RNSStackAnimationTransitionKindPush;
  RNSStackAnimationTransitionTimeline *timeline =
      [RNSStackAnimationResolver transitionTimelineForKind:kind
                                                  outgoing:RNSStackScreenControllerOrNil(fromVC)
                                                  incoming:RNSStackScreenControllerOrNil(toVC)];
  if (timeline == nil) {
    return nil;
  }
  // A static timeline gets here with pops UIKit starts itself (back button, back menu, tvOS Menu). The container
  // applies its own static changes without animation, see `applyStackModel:`.
  if (timeline.isStatic) {
    return [RNSStackNoneAnimator new];
  }
  RNSStackTimelineAnimator *animator = [[RNSStackTimelineAnimator alloc] initWithTimeline:timeline];
  if (operation == UINavigationControllerOperationPush) {
    animator.pushInteraction = [RNSStackScreenControllerOrNil(toVC).configProvider interactionForPush];
  }
  return animator;
}

- (nullable id<UIViewControllerInteractiveTransitioning>)
                           navigationController:(UINavigationController *)navigationController
    interactionControllerForAnimationController:(id<UIViewControllerAnimatedTransitioning>)animator
{
  if ([animator isKindOfClass:RNSStackTimelineAnimator.class]) {
    return ((RNSStackTimelineAnimator *)animator).pushInteraction;
  }
  return nil;
}

@end
