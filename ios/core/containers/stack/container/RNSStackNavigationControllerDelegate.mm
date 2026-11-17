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
    _transitionAnimator = nil;
    return nil;
  }
  // A static timeline gets here with pops UIKit starts itself (back button, back menu, tvOS Menu). The container
  // applies its own static changes without animation, see `applyStackModel:`.
  _transitionAnimator =
      timeline.isStatic ? [RNSStackNoneAnimator new] : [[RNSStackTimelineAnimator alloc] initWithTimeline:timeline];
  _transitionAnimator.delegate = self;
  return _transitionAnimator;
}

- (void)transitionAnimatorDidEnd:(RNSStackTransitionAnimator *)animator
{
  if (_transitionAnimator == animator) {
    _transitionAnimator = nil;
  }
}

@end
