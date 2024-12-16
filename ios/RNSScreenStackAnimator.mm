#import "RNSScreenStackAnimator.h"
#import "RNSScreenStack.h"

#import "RNSScreen.h"

#pragma mark - Constants

// Default duration for transitions in seconds. Note, that this enforces the default
// only on Paper. On Fabric the transition duration coming from JS layer
// is never null, thus it defaults to the value set in component codegen spec.
static constexpr NSTimeInterval RNSDefaultTransitionDuration = 0.5;

// Proportions for diffrent phases of more complex animations.
// The reference duration differs from default transition duration,
// because we've changed the default duration & we want to keep proportions
// in tact. Unit = seconds.
static constexpr NSTimeInterval RNSTransitionDurationForProportion = 0.35;

static constexpr float RNSSlideOpenTransitionDurationProportion = 1;
static constexpr float RNSFadeOpenTransitionDurationProportion = 0.2 / RNSTransitionDurationForProportion;
static constexpr float RNSSlideCloseTransitionDurationProportion = 0.25 / RNSTransitionDurationForProportion;
static constexpr float RNSFadeCloseTransitionDurationProportion = 0.15 / RNSTransitionDurationForProportion;
static constexpr float RNSFadeCloseDelayTransitionDurationProportion = 0.1 / RNSTransitionDurationForProportion;

// Value used for dimming view attached for tranistion time.
// Same value is used in other projects using similar approach for transistions
// and it looks the most similar to the value used by Apple
static constexpr float RNSShadowViewMaxAlpha = 0.1;

@implementation RNSScreenStackAnimator {
  UINavigationControllerOperation _operation;
  NSTimeInterval _transitionDuration;
  UIViewPropertyAnimator *_Nullable _inFlightAnimator;
}

- (instancetype)initWithOperation:(UINavigationControllerOperation)operation
{
  if (self = [super init]) {
    _operation = operation;
    _transitionDuration = RNSDefaultTransitionDuration; // default duration in seconds
    _inFlightAnimator = nil;
  }
  return self;
}

#pragma mark - UIViewControllerAnimatedTransitioning

- (NSTimeInterval)transitionDuration:(id<UIViewControllerContextTransitioning>)transitionContext
{
  RNSScreenView *screen;
  if (_operation == UINavigationControllerOperationPush) {
    UIViewController *toViewController =
        [transitionContext viewControllerForKey:UITransitionContextToViewControllerKey];
    screen = ((RNSScreen *)toViewController).screenView;
  } else if (_operation == UINavigationControllerOperationPop) {
    UIViewController *fromViewController =
        [transitionContext viewControllerForKey:UITransitionContextFromViewControllerKey];
    screen = ((RNSScreen *)fromViewController).screenView;
  }

  if (screen != nil && screen.stackAnimation == RNSScreenStackAnimationNone) {
    return 0.0;
  }

  if (screen != nil && screen.transitionDuration != nil && [screen.transitionDuration floatValue] >= 0) {
    float durationInSeconds = [screen.transitionDuration floatValue] / 1000.0;
    return durationInSeconds;
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
    screen = ((RNSScreen *)toViewController).screenView;
  } else if (_operation == UINavigationControllerOperationPop) {
    screen = ((RNSScreen *)fromViewController).screenView;
  }

  if (screen != nil) {
    if ([screen.reactSuperview isKindOfClass:[RNSScreenStackView class]] &&
        ((RNSScreenStackView *)(screen.reactSuperview)).customAnimation) {
      [self animateWithNoAnimation:transitionContext toVC:toViewController fromVC:fromViewController];
    } else if (screen.fullScreenSwipeEnabled && transitionContext.isInteractive) {
      // we are swiping with full width gesture
      if (screen.customAnimationOnSwipe) {
        [self animateTransitionWithStackAnimation:screen.stackAnimation
                                    shadowEnabled:screen.fullScreenSwipeShadowEnabled
                                transitionContext:transitionContext
                                             toVC:toViewController
                                           fromVC:fromViewController];
      } else {
        // we have to provide an animation when swiping, otherwise the screen will be popped immediately,
        // so in case of no custom animation on swipe set, we provide the one closest to the default
        [self animateSimplePushWithShadowEnabled:screen.fullScreenSwipeShadowEnabled
                               transitionContext:transitionContext
                                            toVC:toViewController
                                          fromVC:fromViewController];
      }
    } else {
      // we are going forward or provided custom animation on swipe or clicked native header back button
      [self animateTransitionWithStackAnimation:screen.stackAnimation
                                  shadowEnabled:screen.fullScreenSwipeShadowEnabled
                              transitionContext:transitionContext
                                           toVC:toViewController
                                         fromVC:fromViewController];
    }
  }
}

- (void)animationEnded:(BOOL)transitionCompleted
{
  _inFlightAnimator = nil;
}

#pragma mark - Animation implementations

- (void)animateSimplePushWithShadowEnabled:(BOOL)shadowEnabled
                         transitionContext:(id<UIViewControllerContextTransitioning>)transitionContext
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

  UIView *shadowView;
  if (shadowEnabled) {
    shadowView = [[UIView alloc] initWithFrame:fromViewController.view.frame];
    shadowView.backgroundColor = [UIColor blackColor];
  }

  if (_operation == UINavigationControllerOperationPush) {
    toViewController.view.transform = rightTransform;
    [[transitionContext containerView] addSubview:toViewController.view];
    if (shadowView) {
      [[transitionContext containerView] insertSubview:shadowView belowSubview:toViewController.view];
      shadowView.alpha = 0.0;
    }

    UIViewPropertyAnimator *animator =
        [[UIViewPropertyAnimator alloc] initWithDuration:[self transitionDuration:transitionContext]
                                        timingParameters:[RNSScreenStackAnimator defaultSpringTimingParametersApprox]];

    [animator addAnimations:^{
      fromViewController.view.transform = leftTransform;
      toViewController.view.transform = CGAffineTransformIdentity;
      if (shadowView) {
        shadowView.alpha = RNSShadowViewMaxAlpha;
      }
    }];

    [animator addCompletion:^(UIViewAnimatingPosition finalPosition) {
      if (shadowView) {
        [shadowView removeFromSuperview];
      }
      fromViewController.view.transform = CGAffineTransformIdentity;
      toViewController.view.transform = CGAffineTransformIdentity;
      [transitionContext completeTransition:![transitionContext transitionWasCancelled]];
    }];
    _inFlightAnimator = animator;
    [animator startAnimation];
  } else if (_operation == UINavigationControllerOperationPop) {
    toViewController.view.transform = leftTransform;
    [[transitionContext containerView] insertSubview:toViewController.view belowSubview:fromViewController.view];
    if (shadowView) {
      [[transitionContext containerView] insertSubview:shadowView belowSubview:fromViewController.view];
      shadowView.alpha = RNSShadowViewMaxAlpha;
    }

    void (^animationBlock)(void) = ^{
      toViewController.view.transform = CGAffineTransformIdentity;
      fromViewController.view.transform = rightTransform;
      if (shadowView) {
        shadowView.alpha = 0.0;
      }
    };

    void (^completionBlock)(UIViewAnimatingPosition) = ^(UIViewAnimatingPosition finalPosition) {
      if (shadowView) {
        [shadowView removeFromSuperview];
      }
      fromViewController.view.transform = CGAffineTransformIdentity;
      toViewController.view.transform = CGAffineTransformIdentity;
      [transitionContext completeTransition:![transitionContext transitionWasCancelled]];
    };

    if (!transitionContext.isInteractive) {
      UIViewPropertyAnimator *animator = [[UIViewPropertyAnimator alloc]
          initWithDuration:[self transitionDuration:transitionContext]
          timingParameters:[RNSScreenStackAnimator defaultSpringTimingParametersApprox]];

      [animator addAnimations:animationBlock];
      [animator addCompletion:completionBlock];
      _inFlightAnimator = animator;
      [animator startAnimation];
    } else {
      // we don't want the EaseInOut option when swiping to dismiss the view, it is the same in default animation option
      UIViewPropertyAnimator *animator =
          [[UIViewPropertyAnimator alloc] initWithDuration:[self transitionDuration:transitionContext]
                                                     curve:UIViewAnimationCurveLinear
                                                animations:animationBlock];

      [animator addCompletion:completionBlock];
      [animator setUserInteractionEnabled:YES];
      _inFlightAnimator = animator;
    }
  }
}

- (void)animateSlideFromLeftWithTransitionContext:(id<UIViewControllerContextTransitioning>)transitionContext
                                             toVC:(UIViewController *)toViewController
                                           fromVC:(UIViewController *)fromViewController
{
  float containerWidth = transitionContext.containerView.bounds.size.width;
  float belowViewWidth = containerWidth * 0.3;

  CGAffineTransform rightTransform = CGAffineTransformMakeTranslation(-containerWidth, 0);
  CGAffineTransform leftTransform = CGAffineTransformMakeTranslation(belowViewWidth, 0);

  if (toViewController.navigationController.view.semanticContentAttribute ==
      UISemanticContentAttributeForceRightToLeft) {
    rightTransform = CGAffineTransformMakeTranslation(containerWidth, 0);
    leftTransform = CGAffineTransformMakeTranslation(-belowViewWidth, 0);
  }

  if (_operation == UINavigationControllerOperationPush) {
    toViewController.view.transform = rightTransform;
    [[transitionContext containerView] addSubview:toViewController.view];

    UIViewPropertyAnimator *animator =
        [[UIViewPropertyAnimator alloc] initWithDuration:[self transitionDuration:transitionContext]
                                        timingParameters:[RNSScreenStackAnimator defaultSpringTimingParametersApprox]];

    [animator addAnimations:^{
      fromViewController.view.transform = leftTransform;
      toViewController.view.transform = CGAffineTransformIdentity;
    }];
    [animator addCompletion:^(UIViewAnimatingPosition finalPosition) {
      fromViewController.view.transform = CGAffineTransformIdentity;
      toViewController.view.transform = CGAffineTransformIdentity;
      [transitionContext completeTransition:![transitionContext transitionWasCancelled]];
    }];
    _inFlightAnimator = animator;
    [animator startAnimation];
  } else if (_operation == UINavigationControllerOperationPop) {
    toViewController.view.transform = leftTransform;
    [[transitionContext containerView] insertSubview:toViewController.view belowSubview:fromViewController.view];

    void (^animationBlock)(void) = ^{
      toViewController.view.transform = CGAffineTransformIdentity;
      fromViewController.view.transform = rightTransform;
    };
    void (^completionBlock)(UIViewAnimatingPosition) = ^(UIViewAnimatingPosition finalPosition) {
      fromViewController.view.transform = CGAffineTransformIdentity;
      toViewController.view.transform = CGAffineTransformIdentity;
      [transitionContext completeTransition:![transitionContext transitionWasCancelled]];
    };

    if (!transitionContext.isInteractive) {
      UIViewPropertyAnimator *animator = [[UIViewPropertyAnimator alloc]
          initWithDuration:[self transitionDuration:transitionContext]
          timingParameters:[RNSScreenStackAnimator defaultSpringTimingParametersApprox]];

      [animator addAnimations:animationBlock];
      [animator addCompletion:completionBlock];
      _inFlightAnimator = animator;
      [animator startAnimation];
    } else {
      // we don't want the EaseInOut option when swiping to dismiss the view, it is the same in default animation option
      UIViewPropertyAnimator *animator =
          [[UIViewPropertyAnimator alloc] initWithDuration:[self transitionDuration:transitionContext]
                                                     curve:UIViewAnimationCurveLinear
                                                animations:animationBlock];
      [animator addCompletion:completionBlock];
      [animator setUserInteractionEnabled:YES];
      _inFlightAnimator = animator;
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
    auto animator = [[UIViewPropertyAnimator alloc] initWithDuration:[self transitionDuration:transitionContext]
                                                               curve:UIViewAnimationCurveEaseInOut
                                                          animations:^{
                                                            toViewController.view.alpha = 1.0;
                                                          }];
    [animator addCompletion:^(UIViewAnimatingPosition finalPosition) {
      toViewController.view.alpha = 1.0;
      [transitionContext completeTransition:![transitionContext transitionWasCancelled]];
    }];
    _inFlightAnimator = animator;
    [animator startAnimation];
  } else if (_operation == UINavigationControllerOperationPop) {
    [[transitionContext containerView] insertSubview:toViewController.view belowSubview:fromViewController.view];
    auto animator = [[UIViewPropertyAnimator alloc] initWithDuration:[self transitionDuration:transitionContext]
                                                               curve:UIViewAnimationCurveEaseInOut
                                                          animations:^{
                                                            fromViewController.view.alpha = 0.0;
                                                          }];
    [animator addCompletion:^(UIViewAnimatingPosition finalPosition) {
      fromViewController.view.alpha = 1.0;
      [transitionContext completeTransition:![transitionContext transitionWasCancelled]];
    }];
    _inFlightAnimator = animator;
    [animator startAnimation];
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

    auto animator = [[UIViewPropertyAnimator alloc] initWithDuration:[self transitionDuration:transitionContext]
                                                               curve:UIViewAnimationCurveEaseInOut
                                                          animations:^{
                                                            fromViewController.view.transform =
                                                                CGAffineTransformIdentity;
                                                            toViewController.view.transform = CGAffineTransformIdentity;
                                                          }];
    [animator addCompletion:^(UIViewAnimatingPosition finalPosition) {
      fromViewController.view.transform = CGAffineTransformIdentity;
      toViewController.view.transform = CGAffineTransformIdentity;
      [transitionContext completeTransition:![transitionContext transitionWasCancelled]];
    }];
    _inFlightAnimator = animator;
    [animator startAnimation];
  } else if (_operation == UINavigationControllerOperationPop) {
    toViewController.view.transform = CGAffineTransformIdentity;
    [[transitionContext containerView] insertSubview:toViewController.view belowSubview:fromViewController.view];

    void (^animationBlock)(void) = ^{
      toViewController.view.transform = CGAffineTransformIdentity;
      fromViewController.view.transform = topBottomTransform;
    };
    void (^completionBlock)(UIViewAnimatingPosition) = ^(UIViewAnimatingPosition finalPosition) {
      fromViewController.view.transform = CGAffineTransformIdentity;
      toViewController.view.transform = CGAffineTransformIdentity;
      [transitionContext completeTransition:![transitionContext transitionWasCancelled]];
    };

    if (!transitionContext.isInteractive) {
      auto animator = [[UIViewPropertyAnimator alloc] initWithDuration:[self transitionDuration:transitionContext]
                                                                 curve:UIViewAnimationCurveEaseInOut
                                                            animations:animationBlock];
      [animator addCompletion:completionBlock];
      _inFlightAnimator = animator;
      [animator startAnimation];
    } else {
      // we don't want the EaseInOut option when swiping to dismiss the view, it is the same in default animation option
      auto animator = [[UIViewPropertyAnimator alloc] initWithDuration:[self transitionDuration:transitionContext]
                                                                 curve:UIViewAnimationCurveLinear
                                                            animations:animationBlock];
      [animator addCompletion:completionBlock];
      _inFlightAnimator = animator;
    }
  }
}

- (void)animateFadeFromBottomWithTransitionContext:(id<UIViewControllerContextTransitioning>)transitionContext
                                              toVC:(UIViewController *)toViewController
                                            fromVC:(UIViewController *)fromViewController
{
  CGAffineTransform topBottomTransform =
      CGAffineTransformMakeTranslation(0, 0.08 * transitionContext.containerView.bounds.size.height);

  const float baseTransitionDuration = [self transitionDuration:transitionContext];

  if (_operation == UINavigationControllerOperationPush) {
    toViewController.view.transform = topBottomTransform;
    toViewController.view.alpha = 0.0;
    [[transitionContext containerView] addSubview:toViewController.view];

    // Android Nougat open animation
    // http://aosp.opersys.com/xref/android-7.1.2_r37/xref/frameworks/base/core/res/res/anim/activity_open_enter.xml
    auto slideAnimator = [[UIViewPropertyAnimator alloc]
        initWithDuration:baseTransitionDuration * RNSSlideOpenTransitionDurationProportion
                   curve:UIViewAnimationCurveEaseOut
              animations:^{
                fromViewController.view.transform = CGAffineTransformIdentity;
                toViewController.view.transform = CGAffineTransformIdentity;
              }];
    [slideAnimator addCompletion:^(UIViewAnimatingPosition finalPosition) {
      fromViewController.view.transform = CGAffineTransformIdentity;
      [transitionContext completeTransition:![transitionContext transitionWasCancelled]];
    }];

    auto fadeAnimator = [[UIViewPropertyAnimator alloc]
        initWithDuration:baseTransitionDuration * RNSFadeOpenTransitionDurationProportion
                   curve:UIViewAnimationCurveEaseOut
              animations:^{
                toViewController.view.alpha = 1.0;
              }];

    _inFlightAnimator = slideAnimator;
    [slideAnimator startAnimation];
    [fadeAnimator startAnimation];
  } else if (_operation == UINavigationControllerOperationPop) {
    toViewController.view.transform = CGAffineTransformIdentity;
    [[transitionContext containerView] insertSubview:toViewController.view belowSubview:fromViewController.view];

    // Android Nougat exit animation
    // http://aosp.opersys.com/xref/android-7.1.2_r37/xref/frameworks/base/core/res/res/anim/activity_close_exit.xml
    auto slideAnimator = [[UIViewPropertyAnimator alloc]
        initWithDuration:baseTransitionDuration * RNSSlideCloseTransitionDurationProportion
                   curve:UIViewAnimationCurveEaseIn
              animations:^{
                toViewController.view.transform = CGAffineTransformIdentity;
                fromViewController.view.transform = topBottomTransform;
              }];
    [slideAnimator addCompletion:^(UIViewAnimatingPosition finalPosition) {
      fromViewController.view.transform = CGAffineTransformIdentity;
      toViewController.view.transform = CGAffineTransformIdentity;
      fromViewController.view.alpha = 1.0;
      toViewController.view.alpha = 1.0;
      [transitionContext completeTransition:![transitionContext transitionWasCancelled]];
    }];

    auto fadeAnimator = [[UIViewPropertyAnimator alloc]
        initWithDuration:baseTransitionDuration * RNSFadeCloseTransitionDurationProportion
                   curve:UIViewAnimationCurveLinear
              animations:^{
                fromViewController.view.alpha = 0.0;
              }];

    _inFlightAnimator = slideAnimator;
    [slideAnimator startAnimation];
    [fadeAnimator startAnimationAfterDelay:baseTransitionDuration * RNSFadeCloseDelayTransitionDurationProportion];
  }
}

- (void)animateWithNoAnimation:(id<UIViewControllerContextTransitioning>)transitionContext
                          toVC:(UIViewController *)toViewController
                        fromVC:(UIViewController *)fromViewController
{
  if (_operation == UINavigationControllerOperationPush) {
    [[transitionContext containerView] addSubview:toViewController.view];
    [UIView animateWithDuration:[self transitionDuration:transitionContext]
        animations:^{
        }
        completion:^(BOOL finished) {
          [transitionContext completeTransition:![transitionContext transitionWasCancelled]];
        }];
  } else if (_operation == UINavigationControllerOperationPop) {
    [[transitionContext containerView] insertSubview:toViewController.view belowSubview:fromViewController.view];

    [UIView animateWithDuration:[self transitionDuration:transitionContext]
        animations:^{
        }
        completion:^(BOOL finished) {
          [transitionContext completeTransition:![transitionContext transitionWasCancelled]];
        }];
  }
}

- (void)animateNoneWithTransitionContext:(id<UIViewControllerContextTransitioning>)transitionContext
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
          toViewController.view.alpha = 1.0;
          [transitionContext completeTransition:![transitionContext transitionWasCancelled]];
        }];
  } else if (_operation == UINavigationControllerOperationPop) {
    [[transitionContext containerView] insertSubview:toViewController.view belowSubview:fromViewController.view];

    [UIView animateWithDuration:[self transitionDuration:transitionContext]
        animations:^{
          fromViewController.view.alpha = 0.0;
        }
        completion:^(BOOL finished) {
          fromViewController.view.alpha = 1.0;

          [transitionContext completeTransition:![transitionContext transitionWasCancelled]];
        }];
  }
}

#pragma mark - Public API

- (nullable id<UITimingCurveProvider>)timingParamsForAnimationCompletion
{
  return [RNSScreenStackAnimator defaultSpringTimingParametersApprox];
}

+ (BOOL)isCustomAnimation:(RNSScreenStackAnimation)animation
{
  return (animation != RNSScreenStackAnimationFlip && animation != RNSScreenStackAnimationDefault);
}

#pragma mark - Helpers

- (void)animateTransitionWithStackAnimation:(RNSScreenStackAnimation)animation
                              shadowEnabled:(BOOL)shadowEnabled
                          transitionContext:(id<UIViewControllerContextTransitioning>)transitionContext
                                       toVC:(UIViewController *)toVC
                                     fromVC:(UIViewController *)fromVC
{
  switch (animation) {
    case RNSScreenStackAnimationSimplePush:
      [self animateSimplePushWithShadowEnabled:shadowEnabled
                             transitionContext:transitionContext
                                          toVC:toVC
                                        fromVC:fromVC];
      return;
    case RNSScreenStackAnimationSlideFromLeft:
      [self animateSlideFromLeftWithTransitionContext:transitionContext toVC:toVC fromVC:fromVC];
      return;
    case RNSScreenStackAnimationFade:
      [self animateFadeWithTransitionContext:transitionContext toVC:toVC fromVC:fromVC];
      return;
    case RNSScreenStackAnimationSlideFromBottom:
      [self animateSlideFromBottomWithTransitionContext:transitionContext toVC:toVC fromVC:fromVC];
      return;
    case RNSScreenStackAnimationFadeFromBottom:
      [self animateFadeFromBottomWithTransitionContext:transitionContext toVC:toVC fromVC:fromVC];
      return;
    case RNSScreenStackAnimationNone:
      [self animateNoneWithTransitionContext:transitionContext toVC:toVC fromVC:fromVC];
      return;
    default:
      // simple_push is the default custom animation
      [self animateSimplePushWithShadowEnabled:shadowEnabled
                             transitionContext:transitionContext
                                          toVC:toVC
                                        fromVC:fromVC];
  }
}

+ (UISpringTimingParameters *)defaultSpringTimingParametersApprox
{
  // Default curve provider is as defined below, however spring timing defined this way
  // ignores the requested duration of the animation, effectively impairing our `animationDuration` prop.
  // We want to keep `animationDuration` functional.
  // id<UITimingCurveProvider> timingCurveProvider = [[UISpringTimingParameters alloc] init];

  // According to "Programming iOS 14" by Matt Neuburg, the params for the default spring are as follows:
  // mass = 3, stiffness = 1000, damping = 500. Damping ratio is computed using formula
  // ratio = damping / (2 * sqrt(stiffness * mass)) ==> default damping ratio should be ~= 4,56.
  // I've found afterwards that this is even indicated here:
  // https://developer.apple.com/documentation/uikit/uispringtimingparameters/1649802-init?language=objc

  return [[UISpringTimingParameters alloc] initWithDampingRatio:4.56];
}

@end
