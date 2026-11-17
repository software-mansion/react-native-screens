#import "RNSStackTransitionAnimatorSubclass.h"

@implementation RNSStackTransitionAnimator {
  UIViewPropertyAnimator *_Nullable _animator;
}

- (NSTimeInterval)transitionDuration:(nullable id<UIViewControllerContextTransitioning>)transitionContext
{
  [self doesNotRecognizeSelector:_cmd];
  return 0;
}

- (UIViewPropertyAnimator *)propertyAnimatorForTransition:(id<UIViewControllerContextTransitioning>)transitionContext
{
  [self doesNotRecognizeSelector:_cmd];
  return [UIViewPropertyAnimator new];
}

- (UIViewPropertyAnimator *)linearAnimatorForTransition:(id<UIViewControllerContextTransitioning>)transitionContext
                                             animations:(nullable void (^)(void))animations
                                             completion:(nullable void (^)(void))completion
{
  // UIKit adds no Core Animation animation for a property set to the value it already has, and a property animator
  // without animations completes at once, ending the transition early. Animating a hidden view keeps the transition
  // open for its whole duration without changing anything on screen.
  UIView *hiddenView = [UIView new];
  hiddenView.hidden = YES;
  [transitionContext.containerView addSubview:hiddenView];
  UIViewPropertyAnimator *animator =
      [[UIViewPropertyAnimator alloc] initWithDuration:[self transitionDuration:transitionContext]
                                                 curve:UIViewAnimationCurveLinear
                                            animations:^{
                                              hiddenView.alpha = 0;
                                              if (animations != nil) {
                                                animations();
                                              }
                                            }];
  [animator addCompletion:^(UIViewAnimatingPosition finalPosition) {
    [hiddenView removeFromSuperview];
    if (completion != nil) {
      completion();
    }
    [transitionContext completeTransition:!transitionContext.transitionWasCancelled];
  }];
  return animator;
}

- (void)animateTransition:(id<UIViewControllerContextTransitioning>)transitionContext
{
  [[self interruptibleAnimatorForTransition:transitionContext] startAnimation];
}

// UIKit asks for the animator more than once per transition and expects the same object every time, see the
// `interruptibleAnimatorForTransition:` documentation.
- (id<UIViewImplicitlyAnimating>)interruptibleAnimatorForTransition:
    (id<UIViewControllerContextTransitioning>)transitionContext
{
  if (_animator == nil) {
    _animator = [self propertyAnimatorForTransition:transitionContext];
  }
  return _animator;
}

- (void)animationEnded:(BOOL)transitionCompleted
{
  // The animator's completion holds the transition context, which holds this object.
  _animator = nil;
}

@end
