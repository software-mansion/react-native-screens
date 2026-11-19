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
