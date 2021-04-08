#import "RNSScreenStackAnimator.h"
#import "RNSScreenStack.h"
#import "RNSScreen.h"

@implementation RNSScreenStackAnimator {
  UINavigationControllerOperation _operation;
  NSTimeInterval _transitionDuration;
}

- (instancetype)initWithOperation:(UINavigationControllerOperation)operation
{
  if (self = [super init]) {
    _operation = operation;
    _transitionDuration = 0.35; // default duration
  }
  return self;
}

- (NSTimeInterval)transitionDuration:(id <UIViewControllerContextTransitioning>)transitionContext
{
  RNSScreenView *screen;
  if (_operation == UINavigationControllerOperationPush) {
    UIViewController* toViewController = [transitionContext viewControllerForKey:UITransitionContextToViewControllerKey];
    screen = (RNSScreenView *)toViewController.view;
  } else if (_operation == UINavigationControllerOperationPop) {
    UIViewController* fromViewController = [transitionContext viewControllerForKey:UITransitionContextFromViewControllerKey];
    screen = (RNSScreenView *)fromViewController.view;
  }

  if (screen != nil && screen.stackAnimation == RNSScreenStackAnimationNone) {
    return 0;
  }
  return _transitionDuration;
}

- (void)animateTransition:(id<UIViewControllerContextTransitioning>)transitionContext
{
  UIViewController* toViewController = [transitionContext viewControllerForKey:UITransitionContextToViewControllerKey];
  UIViewController* fromViewController = [transitionContext viewControllerForKey:UITransitionContextFromViewControllerKey];
  toViewController.view.frame = [transitionContext finalFrameForViewController:toViewController];

  RNSScreenView *screen;
  if (_operation == UINavigationControllerOperationPush) {
    screen = (RNSScreenView *)toViewController.view;
  } else if (_operation == UINavigationControllerOperationPop) {
    screen = (RNSScreenView *)fromViewController.view;
  }
  
  if (screen != nil) {
    if (screen.stackAnimation == RNSScreenStackAnimationSimplePush) {
      [self animateSimplePushWithTransitionContext:transitionContext];
    } else if (screen.stackAnimation == RNSScreenStackAnimationFade || screen.stackAnimation == RNSScreenStackAnimationNone) {
      [self animateFadeWithTransitionContext:transitionContext];
    }
  }
}

- (void)animateSimplePushWithTransitionContext:(id<UIViewControllerContextTransitioning>)transitionContext
{
  UIViewController* toViewController = [transitionContext viewControllerForKey:UITransitionContextToViewControllerKey];
  UIViewController* fromViewController = [transitionContext viewControllerForKey:UITransitionContextFromViewControllerKey];

  CGAffineTransform rightTransform = CGAffineTransformMakeTranslation(transitionContext.containerView.bounds.size.width, 0);
  CGAffineTransform leftTransform = CGAffineTransformMakeTranslation(-transitionContext.containerView.bounds.size.width, 0);
  
  if (toViewController.navigationController.view.semanticContentAttribute == UISemanticContentAttributeForceRightToLeft) {
    rightTransform = CGAffineTransformMakeTranslation(-transitionContext.containerView.bounds.size.width, 0);
    leftTransform = CGAffineTransformMakeTranslation(transitionContext.containerView.bounds.size.width, 0);
  }
  
  if (_operation == UINavigationControllerOperationPush) {
    toViewController.view.transform = rightTransform;
    [[transitionContext containerView] addSubview:toViewController.view];
    [UIView animateWithDuration:[self transitionDuration:transitionContext] animations:^{
      fromViewController.view.transform = leftTransform;
      toViewController.view.transform = CGAffineTransformIdentity;
    } completion:^(BOOL finished) {
      fromViewController.view.transform = CGAffineTransformIdentity;
      [transitionContext completeTransition:![transitionContext transitionWasCancelled]];
    }];
  } else if (_operation == UINavigationControllerOperationPop) {
    toViewController.view.transform = leftTransform;
    [[transitionContext containerView] insertSubview:toViewController.view belowSubview: fromViewController.view];
    
    [UIView animateWithDuration:[self transitionDuration:transitionContext] animations:^{
      toViewController.view.transform = CGAffineTransformIdentity;
      fromViewController.view.transform = rightTransform;
    } completion:^(BOOL finished) {
      if (transitionContext.transitionWasCancelled) {
        toViewController.view.transform = CGAffineTransformIdentity;
      }
      [transitionContext completeTransition:![transitionContext transitionWasCancelled]];
    }];
  }
}

- (void)animateFadeWithTransitionContext:(id<UIViewControllerContextTransitioning>)transitionContext
{
  UIViewController* toViewController = [transitionContext viewControllerForKey:UITransitionContextToViewControllerKey];
  UIViewController* fromViewController = [transitionContext viewControllerForKey:UITransitionContextFromViewControllerKey];
  
  if (_operation == UINavigationControllerOperationPush) {
    [[transitionContext containerView] addSubview:toViewController.view];
    toViewController.view.alpha = 0.0;
    [UIView animateWithDuration:[self transitionDuration:transitionContext] animations:^{
      toViewController.view.alpha = 1.0;
    } completion:^(BOOL finished) {
      [transitionContext completeTransition:![transitionContext transitionWasCancelled]];
    }];
  } else if (_operation == UINavigationControllerOperationPop) {
    [[transitionContext containerView] insertSubview:toViewController.view belowSubview:fromViewController.view];

    [UIView animateWithDuration:[self transitionDuration:transitionContext] animations:^{
      fromViewController.view.alpha = 0.0;
    } completion:^(BOOL finished) {
      if (transitionContext.transitionWasCancelled) {
        toViewController.view.transform = CGAffineTransformIdentity;
      }
      [transitionContext completeTransition:![transitionContext transitionWasCancelled]];
    }];
  }
}

@end
