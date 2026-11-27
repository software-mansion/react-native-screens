#import "RNSStackNoneAnimator.h"
#import "RNSStackTransitionAnimatorSubclass.h"

@implementation RNSStackNoneAnimator

- (NSTimeInterval)transitionDuration:(nullable id<UIViewControllerContextTransitioning>)transitionContext
{
  // On iOS 18 UIKit crossfades the navigation bar items for this long while the transition is open (undocumented,
  // measured on 18.6). 1 ms is shorter than any frame.
  return 0.001;
}

- (UIViewPropertyAnimator *)propertyAnimatorForTransition:(id<UIViewControllerContextTransitioning>)transitionContext
{
  UIViewController *toController = [transitionContext viewControllerForKey:UITransitionContextToViewControllerKey];
  UIView *toView = [transitionContext viewForKey:UITransitionContextToViewKey];
  toView.frame = [transitionContext finalFrameForViewController:toController];
  [transitionContext.containerView addSubview:toView];

  // On iOS 18 UIKit animates the navigation bar items right after `animateTransition:`, with its own 0.35 s slide when
  // the transition has already completed (undocumented, measured on 18.6), so the animator must stay open for its
  // duration although nothing on screen changes.
  return [self linearAnimatorForTransition:transitionContext animations:nil completion:nil];
}

@end
