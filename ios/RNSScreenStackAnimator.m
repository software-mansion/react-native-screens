#import "RNSScreenStackAnimator.h"
#import "RNSScreenStack.h"
#import "RNSScreen.h"

@implementation RNSScreenStackAnimator {
  UINavigationControllerOperation _operation;
  NSTimeInterval _transitionDuration;
  NSTimeInterval _animationStartTime;
  UIViewController *_toViewController;
  UIViewController *_fromViewController;
  BOOL _isInteractive;
}

- (instancetype)initWithOperation:(UINavigationControllerOperation)operation
{
  if (self = [super init]) {
    _operation = operation;
    _transitionDuration = 0.35;
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
  return _transitionDuration; // default duration
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
  _toViewController = toViewController;
  UIViewController* fromViewController = [transitionContext viewControllerForKey:UITransitionContextFromViewControllerKey];
  _fromViewController = fromViewController;

  CGAffineTransform rightTransform = CGAffineTransformMakeTranslation(transitionContext.containerView.bounds.size.width, 0);
  CGAffineTransform leftTransform = CGAffineTransformMakeTranslation(-transitionContext.containerView.bounds.size.width, 0);
  
  CADisplayLink *animationTimer = [CADisplayLink displayLinkWithTarget:self selector:@selector(handleAnimation)];
  _animationStartTime = CACurrentMediaTime();
  _isInteractive = [transitionContext isInteractive];
  if (!_isInteractive) {
    [animationTimer addToRunLoop:[NSRunLoop currentRunLoop] forMode:NSDefaultRunLoopMode];
  }

  if (_operation == UINavigationControllerOperationPush) {
    toViewController.view.transform = rightTransform;
    [[transitionContext containerView] addSubview:toViewController.view];
    [UIView animateWithDuration:[self transitionDuration:transitionContext] animations:^{
      fromViewController.view.transform = leftTransform;
      toViewController.view.transform = CGAffineTransformIdentity;
    } completion:^(BOOL finished) {
      NSLog(@"%d, %d", finished, [transitionContext transitionWasCancelled]);
      fromViewController.view.transform = CGAffineTransformIdentity;
      [animationTimer setPaused:YES];
      [animationTimer invalidate];
      self->_toViewController = nil;
      self->_fromViewController = nil;
      [transitionContext completeTransition:![transitionContext transitionWasCancelled]];
    }];
  } else if (_operation == UINavigationControllerOperationPop) {
    toViewController.view.transform = leftTransform;
    [[transitionContext containerView] insertSubview:toViewController.view belowSubview: fromViewController.view];
    
    [UIView animateWithDuration:[self transitionDuration:transitionContext] animations:^{
      toViewController.view.transform = CGAffineTransformIdentity;
      fromViewController.view.transform = rightTransform;
    } completion:^(BOOL finished) {
      [animationTimer setPaused:YES];
      [animationTimer invalidate];
      self->_toViewController = nil;
      self->_fromViewController = nil;
      if (transitionContext.transitionWasCancelled) {
        toViewController.view.transform = CGAffineTransformIdentity;
      }
      if (self->_isInteractive) {
        UINavigationController *navctr = toViewController.navigationController;
        if ([navctr.delegate isKindOfClass:[RNSScreenStackView class]]) {
          ((RNSScreenStackView *) navctr.delegate).topScreenView = nil;
          ((RNSScreenStackView *) navctr.delegate).belowScreenView = nil;
          [((RNSScreenStackView *) navctr.delegate).animationTimer setPaused:YES];
          [((RNSScreenStackView *) navctr.delegate).animationTimer invalidate];
        }
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

- (void)handleAnimation
{
  double progress = (fmin(1.0, (CACurrentMediaTime() - _animationStartTime)/ _transitionDuration));
  [((RNSScreenView *)_toViewController.view) notifyTransitionProgress:progress];
  [((RNSScreenView *)_fromViewController.view) notifyTransitionProgress:progress];
}

@end
