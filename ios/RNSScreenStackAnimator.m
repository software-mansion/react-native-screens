#import "RNSScreenStackAnimator.h"
#import "RNSScreen.h"
#import "RNSScreenStack.h"

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

- (NSTimeInterval)transitionDuration:(id<UIViewControllerContextTransitioning>)transitionContext
{
  RNSScreenView *screen;
  if (_operation == UINavigationControllerOperationPush) {
    UIViewController *toViewController =
        [transitionContext viewControllerForKey:UITransitionContextToViewControllerKey];
    screen = (RNSScreenView *)toViewController.view;
  } else if (_operation == UINavigationControllerOperationPop) {
    UIViewController *fromViewController =
        [transitionContext viewControllerForKey:UITransitionContextFromViewControllerKey];
    screen = (RNSScreenView *)fromViewController.view;
  }

  if (screen != nil && screen.stackAnimation == RNSScreenStackAnimationNone) {
    return 0;
  }
  return _transitionDuration;
}

- (void)animateTransition:(id<UIViewControllerContextTransitioning>)transitionContext
{
  UIViewController *toViewController = [transitionContext viewControllerForKey:UITransitionContextToViewControllerKey];
  UIViewController *fromViewController =
      [transitionContext viewControllerForKey:UITransitionContextFromViewControllerKey];
  toViewController.view.frame = [transitionContext finalFrameForViewController:toViewController];

  RNSScreenView *screen;
  if (_operation == UINavigationControllerOperationPush) {
    screen = (RNSScreenView *)toViewController.view;
  } else if (_operation == UINavigationControllerOperationPop) {
    screen = (RNSScreenView *)fromViewController.view;
  }

  if (screen != nil) {
    if (screen.stackAnimation == RNSScreenStackAnimationSimplePush) {
      [self animateSimplePushWithTransitionContext:transitionContext toVC:toViewController fromVC:fromViewController];
    } else if (
        screen.stackAnimation == RNSScreenStackAnimationFade || screen.stackAnimation == RNSScreenStackAnimationNone) {
      [self animateFadeWithTransitionContext:transitionContext toVC:toViewController fromVC:fromViewController];
    } else if (screen.stackAnimation == RNSScreenStackAnimationSlideFromBottom) {
      [self animateSlideFromBottomWithTransitionContext:transitionContext
                                                   toVC:toViewController
                                                 fromVC:fromViewController];
    } else if (screen.stackAnimation == RNSScreenStackAnimationFadeFromBottom) {
      [self animateFadeFromBottomWithTransitionContext:transitionContext
                                                  toVC:toViewController
                                                fromVC:fromViewController];
    } else if (screen.stackAnimation == RNSScreenStackAnimationCustom) {
      [self animateCustomTransitionWithTransitionContext:transitionContext
                                                    toVC:toViewController
                                                  fromVC:fromViewController];
    }
  }
}

- (void)animateSimplePushWithTransitionContext:(id<UIViewControllerContextTransitioning>)transitionContext
                                          toVC:(UIViewController *)toViewController
                                        fromVC:(UIViewController *)fromViewController
{
  float containerWidth = transitionContext.containerView.bounds.size.width;
  float belowViewWidth = containerWidth * 0.3;

  CGAffineTransform rightTransform = CGAffineTransformMakeTranslation(containerWidth, 0);
  CGAffineTransform leftTransform = CGAffineTransformMakeTranslation(-belowViewWidth, 0);

  if (toViewController.navigationController.view.semanticContentAttribute ==
      UISemanticContentAttributeForceRightToLeft) {
    rightTransform = CGAffineTransformMakeTranslation(-containerWidth, 0);
    leftTransform = CGAffineTransformMakeTranslation(belowViewWidth, 0);
  }

  if (_operation == UINavigationControllerOperationPush) {
    toViewController.view.transform = rightTransform;
    [[transitionContext containerView] addSubview:toViewController.view];
    [UIView animateWithDuration:[self transitionDuration:transitionContext]
        animations:^{
          fromViewController.view.transform = leftTransform;
          toViewController.view.transform = CGAffineTransformIdentity;
        }
        completion:^(BOOL finished) {
          fromViewController.view.transform = CGAffineTransformIdentity;
          [transitionContext completeTransition:![transitionContext transitionWasCancelled]];
        }];
  } else if (_operation == UINavigationControllerOperationPop) {
    toViewController.view.transform = leftTransform;
    [[transitionContext containerView] insertSubview:toViewController.view belowSubview:fromViewController.view];

    void (^animationBlock)(void) = ^{
      toViewController.view.transform = CGAffineTransformIdentity;
      fromViewController.view.transform = rightTransform;
    };
    void (^completionBlock)(BOOL) = ^(BOOL finished) {
      if (transitionContext.transitionWasCancelled) {
        toViewController.view.transform = CGAffineTransformIdentity;
      }
      [transitionContext completeTransition:![transitionContext transitionWasCancelled]];
    };

    if (!transitionContext.isInteractive) {
      [UIView animateWithDuration:[self transitionDuration:transitionContext]
                       animations:animationBlock
                       completion:completionBlock];
    } else {
      // we don't want the EaseInOut option when swiping to dismiss the view, it is the same in default animation option
      [UIView animateWithDuration:[self transitionDuration:transitionContext]
                            delay:0.0
                          options:UIViewAnimationOptionCurveLinear
                       animations:animationBlock
                       completion:completionBlock];
    }
  }
}

- (void)animateFadeWithTransitionContext:(id<UIViewControllerContextTransitioning>)transitionContext
                                    toVC:(UIViewController *)toViewController
                                  fromVC:(UIViewController *)fromViewController
{
  toViewController.view.frame = [transitionContext finalFrameForViewController:toViewController];

  if (_operation == UINavigationControllerOperationPush) {
    [[transitionContext containerView] addSubview:toViewController.view];
    toViewController.view.alpha = 0.0;
    [UIView animateWithDuration:[self transitionDuration:transitionContext]
        animations:^{
          toViewController.view.alpha = 1.0;
        }
        completion:^(BOOL finished) {
          [transitionContext completeTransition:![transitionContext transitionWasCancelled]];
        }];
  } else if (_operation == UINavigationControllerOperationPop) {
    [[transitionContext containerView] insertSubview:toViewController.view belowSubview:fromViewController.view];

    [UIView animateWithDuration:[self transitionDuration:transitionContext]
        animations:^{
          fromViewController.view.alpha = 0.0;
        }
        completion:^(BOOL finished) {
          if (transitionContext.transitionWasCancelled) {
            toViewController.view.transform = CGAffineTransformIdentity;
          }
          [transitionContext completeTransition:![transitionContext transitionWasCancelled]];
        }];
  }
}

- (void)animateSlideFromBottomWithTransitionContext:(id<UIViewControllerContextTransitioning>)transitionContext
                                               toVC:(UIViewController *)toViewController
                                             fromVC:(UIViewController *)fromViewController
{
  CGAffineTransform topBottomTransform =
      CGAffineTransformMakeTranslation(0, transitionContext.containerView.bounds.size.height);

  if (_operation == UINavigationControllerOperationPush) {
    toViewController.view.transform = topBottomTransform;
    [[transitionContext containerView] addSubview:toViewController.view];
    [UIView animateWithDuration:[self transitionDuration:transitionContext]
        animations:^{
          fromViewController.view.transform = CGAffineTransformIdentity;
          toViewController.view.transform = CGAffineTransformIdentity;
        }
        completion:^(BOOL finished) {
          fromViewController.view.transform = CGAffineTransformIdentity;
          [transitionContext completeTransition:![transitionContext transitionWasCancelled]];
        }];
  } else if (_operation == UINavigationControllerOperationPop) {
    toViewController.view.transform = CGAffineTransformIdentity;
    [[transitionContext containerView] insertSubview:toViewController.view belowSubview:fromViewController.view];
    [UIView animateWithDuration:[self transitionDuration:transitionContext]
        animations:^{
          toViewController.view.transform = CGAffineTransformIdentity;
          fromViewController.view.transform = topBottomTransform;
        }
        completion:^(BOOL finished) {
          [transitionContext completeTransition:![transitionContext transitionWasCancelled]];
        }];
  }
}

- (void)animateFadeFromBottomWithTransitionContext:(id<UIViewControllerContextTransitioning>)transitionContext
                                              toVC:(UIViewController *)toViewController
                                            fromVC:(UIViewController *)fromViewController
{
  CGAffineTransform topBottomTransform =
      CGAffineTransformMakeTranslation(0, 0.08 * transitionContext.containerView.bounds.size.height);

  if (_operation == UINavigationControllerOperationPush) {
    toViewController.view.transform = topBottomTransform;
    toViewController.view.alpha = 0.0;
    [[transitionContext containerView] addSubview:toViewController.view];

    // Android Nougat open animation
    // http://aosp.opersys.com/xref/android-7.1.2_r37/xref/frameworks/base/core/res/res/anim/activity_open_enter.xml
    [UIView animateWithDuration:0.35
        delay:0
        options:UIViewAnimationOptionCurveEaseOut
        animations:^{
          fromViewController.view.transform = CGAffineTransformIdentity;
          toViewController.view.transform = CGAffineTransformIdentity;
        }
        completion:^(BOOL finished) {
          fromViewController.view.transform = CGAffineTransformIdentity;
          [transitionContext completeTransition:![transitionContext transitionWasCancelled]];
        }];
    [UIView animateWithDuration:0.2
                          delay:0
                        options:UIViewAnimationOptionCurveEaseOut
                     animations:^{
                       toViewController.view.alpha = 1.0;
                     }
                     completion:nil];

  } else if (_operation == UINavigationControllerOperationPop) {
    toViewController.view.transform = CGAffineTransformIdentity;
    [[transitionContext containerView] insertSubview:toViewController.view belowSubview:fromViewController.view];

    // Android Nougat exit animation
    // http://aosp.opersys.com/xref/android-7.1.2_r37/xref/frameworks/base/core/res/res/anim/activity_close_exit.xml
    [UIView animateWithDuration:0.25
        delay:0
        options:UIViewAnimationOptionCurveEaseIn
        animations:^{
          toViewController.view.transform = CGAffineTransformIdentity;
          fromViewController.view.transform = topBottomTransform;
        }
        completion:^(BOOL finished) {
          [transitionContext completeTransition:![transitionContext transitionWasCancelled]];
        }];
    [UIView animateWithDuration:0.15
                          delay:0.1
                        options:UIViewAnimationOptionCurveLinear
                     animations:^{
                       fromViewController.view.alpha = 0.0;
                     }
                     completion:nil];
  }
}

- (void)animateCustomTransitionWithTransitionContext:(id<UIViewControllerContextTransitioning>)transitionContext
                                                toVC:(UIViewController *)toViewController
                                              fromVC:(UIViewController *)fromViewController
{
  RNSScreenView *toView = ((RNSScreenView *)toViewController.view);
  RNSScreenView *fromView = ((RNSScreenView *)fromViewController.view);

  NSDictionary *toViewAnimationSpec = toView.animationSpecification[@"entering"];
  NSDictionary *fromViewAnimationSpec = fromView.animationSpecification[@"exiting"];

  CGPoint toViewAnchorPoint = toView.layer.anchorPoint;
  CGPoint fromViewAnchorPoint = fromView.layer.anchorPoint;

  [self setAnimationsForView:toView withSpecification:toViewAnimationSpec];

  float duration = 0;
  if (_operation == UINavigationControllerOperationPush) {
    duration = [toViewAnimationSpec[@"duration"] intValue] / 1000.0f;
  } else if (_operation == UINavigationControllerOperationPop) {
    duration = [fromViewAnimationSpec[@"duration"] intValue] / 1000.0f;
  }
  if (duration <= 0) {
    duration = _transitionDuration;
  }

  UIViewAnimationOptions curve = UIViewAnimationOptionCurveEaseInOut;
  NSString *interpolator = toViewAnimationSpec[@"interpolator"];
  if ([interpolator isEqualToString:@"easeIn"]) {
    curve = UIViewAnimationOptionCurveEaseIn;
  } else if ([interpolator isEqualToString:@"easeOut"]) {
    curve = UIViewAnimationOptionCurveEaseOut;
  } else if ([interpolator isEqualToString:@"easeInOut"]) {
    curve = UIViewAnimationOptionCurveEaseInOut;
  } else if ([interpolator isEqualToString:@"linear"]) {
    curve = UIViewAnimationOptionCurveLinear;
  }

  if (_operation == UINavigationControllerOperationPush) {
    [[transitionContext containerView] addSubview:toView];
  } else if (_operation == UINavigationControllerOperationPop) {
    [[transitionContext containerView] insertSubview:toView belowSubview:fromView];
  }
  [UIView animateWithDuration:duration
      delay:0.0
      options:curve
      animations:^{
        toView.transform = CGAffineTransformIdentity;
        toView.alpha = 1.0;
        [self setAnimationsForView:fromView withSpecification:fromViewAnimationSpec];
      }
      completion:^(BOOL finished) {
        // we might have changed the anchor points of these views
        [self setAnchorPoint:toViewAnchorPoint inView:toView];
        [self setAnchorPoint:fromViewAnchorPoint inView:fromView];
        [transitionContext completeTransition:![transitionContext transitionWasCancelled]];
      }];
}

- (void)setAnimationsForView:(UIView *)view withSpecification:(NSDictionary *)specification
{
  if (specification == nil) {
    return;
  }

  CGAffineTransform trasform = CGAffineTransformIdentity;

  if (specification[@"alpha"] != nil) {
    view.alpha = [specification[@"alpha"] floatValue];
  }

  float pivotX = 0;
  float pivotY = 0;
  NSDictionary *pivot = specification[@"pivot"];
  if (pivot != nil) {
    // on iOS the pivot is in range [0,1] so we scale it
    pivotX = [pivot[@"x"] floatValue] / view.frame.size.width;
    pivotY = [pivot[@"y"] floatValue] / view.frame.size.height;
  }

  NSDictionary *rotate = specification[@"rotate"];
  if (rotate != nil) {
    float degrees = [rotate[@"degrees"] floatValue] * M_PI / 180;
    trasform = CGAffineTransformRotate(trasform, degrees);
  }

  NSDictionary *scale = specification[@"scale"];
  if (scale != nil) {
    float x = [scale[@"x"] floatValue];
    float y = [scale[@"y"] floatValue];
    trasform = CGAffineTransformScale(trasform, x, y);
  }

  NSDictionary *translate = specification[@"translate"];
  if (translate != nil) {
    float x = [translate[@"x"] floatValue];
    float y = [translate[@"y"] floatValue];
    trasform = CGAffineTransformTranslate(trasform, x, y);
  }

  [self setAnchorPoint:CGPointMake(pivotX, pivotY) inView:view];
  view.transform = trasform;
}

// method taken from
// https://www.hackingwithswift.com/example-code/calayer/how-to-change-a-views-anchor-point-without-moving-it
- (void)setAnchorPoint:(CGPoint)point inView:(UIView *)view
{
  CGPoint newPoint = CGPointMake(view.bounds.size.width * point.x, view.bounds.size.height * point.y);
  CGPoint oldPoint = CGPointMake(
      view.bounds.size.width * view.layer.anchorPoint.x, view.bounds.size.height * view.layer.anchorPoint.y);

  newPoint = CGPointApplyAffineTransform(newPoint, view.transform);
  oldPoint = CGPointApplyAffineTransform(oldPoint, view.transform);
  CGPoint position = view.layer.position;

  position.x -= oldPoint.x;
  position.x += newPoint.x;

  position.y -= oldPoint.y;
  position.y += newPoint.y;

  view.layer.position = position;
  view.layer.anchorPoint = point;
}

@end
