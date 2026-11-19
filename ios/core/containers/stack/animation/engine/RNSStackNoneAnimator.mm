#import "RNSStackNoneAnimator.h"

@implementation RNSStackNoneAnimator {
  UIViewPropertyAnimator *_Nullable _animator;
}

- (NSTimeInterval)transitionDuration:(nullable id<UIViewControllerContextTransitioning>)transitionContext
{
  // On iOS 18 UIKit crossfades the navigation bar items for this long while the transition is open (undocumented,
  // measured on 18.6). 1 ms is shorter than any frame.
  return 0.001;
}

- (void)animateTransition:(id<UIViewControllerContextTransitioning>)transitionContext
{
  [[self interruptibleAnimatorForTransition:transitionContext] startAnimation];
}

- (id<UIViewImplicitlyAnimating>)interruptibleAnimatorForTransition:
    (id<UIViewControllerContextTransitioning>)transitionContext
{
  if (_animator != nil) {
    return _animator;
  }

  UIViewController *toController = [transitionContext viewControllerForKey:UITransitionContextToViewControllerKey];
  UIView *toView = [transitionContext viewForKey:UITransitionContextToViewKey];
  toView.frame = [transitionContext finalFrameForViewController:toController];
  [transitionContext.containerView addSubview:toView];

  // On iOS 18 UIKit animates the navigation bar items right after `animateTransition:`, with its own 0.35 s slide when
  // the transition has already completed (undocumented, measured on 18.6). Animating a hidden view keeps the
  // transition open without changing anything on screen.
  UIView *hiddenView = [UIView new];
  hiddenView.hidden = YES;
  [transitionContext.containerView addSubview:hiddenView];
  _animator = [[UIViewPropertyAnimator alloc] initWithDuration:[self transitionDuration:transitionContext]
                                                         curve:UIViewAnimationCurveLinear
                                                    animations:^{
                                                      hiddenView.alpha = 0;
                                                    }];
  [_animator addCompletion:^(UIViewAnimatingPosition finalPosition) {
    [hiddenView removeFromSuperview];
    [transitionContext completeTransition:!transitionContext.transitionWasCancelled];
  }];
  return _animator;
}

- (void)animationEnded:(BOOL)transitionCompleted
{
  _animator = nil;
}

@end
