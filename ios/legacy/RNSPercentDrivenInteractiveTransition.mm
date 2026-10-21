#import "RNSPercentDrivenInteractiveTransition.h"

@implementation RNSPercentDrivenInteractiveTransition {
  RNSScreenStackAnimator *_animationController;
}

#pragma mark - UIViewControllerInteractiveTransitioning

- (void)startInteractiveTransition:(id<UIViewControllerContextTransitioning>)transitionContext
{
  [super startInteractiveTransition:transitionContext];
}

#pragma mark - UIPercentDrivenInteractiveTransition

// `updateInteractiveTransition`, `finishInteractiveTransition`,
// `cancelInteractiveTransition` are forwared by superclass to
// corresponding methods in transition context. In case
// of "classical CA driven animations", such as UIView animation blocks
// or direct utilization of CoreAnimation API, context drives the animation,
// however in case of UIViewPropertyAnimator it does not. We need
// to drive animation manually and this is exactly what happens below.

- (void)updateInteractiveTransition:(CGFloat)percentComplete
{
  if (_animationController != nil) {
    [_animationController.inFlightAnimator setFractionComplete:percentComplete];
  }
  [super updateInteractiveTransition:percentComplete];
}

- (void)finishInteractiveTransition
{
  [self finalizeInteractiveTransitionWithAnimationWasCancelled:NO];
  [super finishInteractiveTransition];
}

- (void)cancelInteractiveTransition
{
  [self finalizeInteractiveTransitionWithAnimationWasCancelled:YES];
  [super cancelInteractiveTransition];
}

#pragma mark - Helpers

/// Completes the in-flight transition, forward or reversed (`cancelled`), with a critically damped
/// spring that starts at `releaseVelocity` and settles over the transition's full duration.
- (void)finalizeInteractiveTransitionWithAnimationWasCancelled:(BOOL)cancelled
{
  if (_animationController == nil) {
    return;
  }

  UIViewPropertyAnimator *_Nullable animator = _animationController.inFlightAnimator;
  if (animator == nil) {
    return;
  }

  BOOL shouldReverseAnimation = cancelled;

  [animator pauseAnimation];
  [animator setReversed:shouldReverseAnimation];

  // Continue at the finger's speed, over the transition's full duration. The spring's initial
  // velocity is relative to the distance left to travel, and it points toward the target, so a
  // cancel flips the sign. `1 - fractionComplete` is not the distance left once the animator is
  // reversed, and as a duration factor it replayed a short cancel in a frame or two.
  CGFloat remaining =
      (shouldReverseAnimation ? animator.fractionComplete : 1 - animator.fractionComplete) * _transitionDistance;
  CGFloat velocityTowardTarget = shouldReverseAnimation ? -_releaseVelocity : _releaseVelocity;
  CGFloat relativeVelocity = remaining > 1 ? velocityTowardTarget / remaining : 0;
  UISpringTimingParameters *timingParams =
      [[UISpringTimingParameters alloc] initWithDampingRatio:1
                                             initialVelocity:CGVectorMake(relativeVelocity, relativeVelocity)];
  [animator continueAnimationWithTimingParameters:timingParams durationFactor:1];

  // System retains it & we don't need it anymore.
  _animationController = nil;
}

@end
