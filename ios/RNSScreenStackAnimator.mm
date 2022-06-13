#import "RNSScreenStackAnimator.h"
#import "RNSEnums.h"
#import "RNSScreenStack.h"
#import "RNSSharedElementTransitionOptions.h"

#import "RNSScreen.h"

// proportions to default transition duration
static const float RNSSlideOpenTransitionDurationProportion = 1;
static const float RNSFadeOpenTransitionDurationProportion = 0.2 / 0.35;
static const float RNSSlideCloseTransitionDurationProportion = 0.25 / 0.35;
static const float RNSFadeCloseTransitionDurationProportion = 0.15 / 0.35;
static const float RNSFadeCloseDelayTransitionDurationProportion = 0.1 / 0.35;

@implementation RNSScreenStackAnimator {
  UINavigationControllerOperation _operation;
  NSTimeInterval _transitionDuration;
}

- (instancetype)initWithOperation:(UINavigationControllerOperation)operation
{
  if (self = [super init]) {
    _operation = operation;
    _transitionDuration = 0.35; // default duration in seconds
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
    screen = (RNSScreenView *)toViewController.view;
  } else if (_operation == UINavigationControllerOperationPop) {
    screen = (RNSScreenView *)fromViewController.view;
  }
  if (screen != nil) {
    if (screen.sharedElementTransitions != nil) {
      [self animateSharedElements:screen.sharedElementTransitions
                transitionContext:transitionContext
                             toVC:toViewController
                           fromVC:fromViewController];
    }
    if (screen.fullScreenSwipeEnabled && transitionContext.isInteractive) {
      // we are swiping with full width gesture
      if (screen.customAnimationOnSwipe) {
        [self animateTransitionWithStackAnimation:screen.stackAnimation
                                transitionContext:transitionContext
                                             toVC:toViewController
                                           fromVC:fromViewController];
      } else {
        // we have to provide an animation when swiping, otherwise the screen will be popped immediately,
        // so in case of no custom animation on swipe set, we provide the one closest to the default
        [self animateSimplePushWithTransitionContext:transitionContext toVC:toViewController fromVC:fromViewController];
      }
    } else {
      // we are going forward or provided custom animation on swipe or clicked native header back button
      [self animateTransitionWithStackAnimation:screen.stackAnimation
                              transitionContext:transitionContext
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

    void (^animationBlock)(void) = ^{
      toViewController.view.transform = CGAffineTransformIdentity;
      fromViewController.view.transform = topBottomTransform;
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

- (void)animateFadeFromBottomWithTransitionContext:(id<UIViewControllerContextTransitioning>)transitionContext
                                              toVC:(UIViewController *)toViewController
                                            fromVC:(UIViewController *)fromViewController
{
  CGAffineTransform topBottomTransform =
      CGAffineTransformMakeTranslation(0, 0.08 * transitionContext.containerView.bounds.size.height);

  const float transitionDuration = [self transitionDuration:transitionContext];

  if (_operation == UINavigationControllerOperationPush) {
    toViewController.view.transform = topBottomTransform;
    toViewController.view.alpha = 0.0;
    [[transitionContext containerView] addSubview:toViewController.view];

    // Android Nougat open animation
    // http://aosp.opersys.com/xref/android-7.1.2_r37/xref/frameworks/base/core/res/res/anim/activity_open_enter.xml
    [UIView animateWithDuration:transitionDuration * RNSSlideOpenTransitionDurationProportion // defaults to 0.35 s
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
    [UIView animateWithDuration:transitionDuration * RNSFadeOpenTransitionDurationProportion // defaults to 0.2 s
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
    [UIView animateWithDuration:transitionDuration * RNSSlideCloseTransitionDurationProportion // defaults to 0.25 s
        delay:0
        options:UIViewAnimationOptionCurveEaseIn
        animations:^{
          toViewController.view.transform = CGAffineTransformIdentity;
          fromViewController.view.transform = topBottomTransform;
        }
        completion:^(BOOL finished) {
          [transitionContext completeTransition:![transitionContext transitionWasCancelled]];
        }];
    [UIView animateWithDuration:transitionDuration * RNSFadeCloseTransitionDurationProportion // defaults to 0.15 s
                          delay:transitionDuration * RNSFadeCloseDelayTransitionDurationProportion // defaults to 0.1 s
                        options:UIViewAnimationOptionCurveLinear
                     animations:^{
                       fromViewController.view.alpha = 0.0;
                     }
                     completion:nil];
  }
}

- (void)animateSharedElements:(NSArray<RNSSharedElementTransitionOptions *> *)sharedElementTransitions
            transitionContext:(id<UIViewControllerContextTransitioning>)transitionContext
                         toVC:(UIViewController *)toViewController
                       fromVC:(UIViewController *)fromViewController

{
  RNSScreenView *toScreen = (RNSScreenView *)toViewController.view;
  RNSScreenView *fromScreen = (RNSScreenView *)fromViewController.view;
  if (toScreen == nil || fromScreen == nil) {
    return;
  }
  for (RNSSharedElementTransitionOptions *sharedElementTransition in sharedElementTransitions) {
    if (sharedElementTransition != nil) {
      NSString *fromID = sharedElementTransition.from;
      NSString *toID = sharedElementTransition.to;
      if (_operation == UINavigationControllerOperationPop) {
        NSString *temp = fromID;
        fromID = toID;
        toID = temp;
      }
      UIView *fromView = [fromScreen findElementForID:fromID];
      UIView *toView = [toScreen findElementForID:toID];

      if (fromView == nil || toView == nil) {
        continue;
      }
      [self animateSharedElement:sharedElementTransition
               transitionContext:transitionContext
                          toView:toView
                        fromView:fromView];
    }
  }
}

- (void)animateSharedElement:(RNSSharedElementTransitionOptions *)sharedElementTransition
           transitionContext:(id<UIViewControllerContextTransitioning>)transitionContext
                      toView:(UIView *)toView
                    fromView:(UIView *)fromView
{
  UIViewAnimationOptions animationOptions;
  switch (sharedElementTransition.easing) {
    case RNSSharedElementTransitionEasingLinear:
      animationOptions = UIViewAnimationCurveEaseIn;
      break;
    case RNSSharedElementTransitionEasingEaseOut:
      animationOptions = UIViewAnimationCurveEaseOut;
      break;
    case RNSSharedElementTransitionEasingEaseInOut:
      animationOptions = UIViewAnimationCurveEaseInOut;
      break;

    default:
      animationOptions = UIViewAnimationCurveLinear;
      break;
  }

  UIView *container = transitionContext.containerView;

  CGRect initialFrame = [fromView.superview convertRect:fromView.frame toView:container];
  CGRect targetFrame = [toView.superview convertRect:toView.frame toView:container];

  CGFloat centerX;
  CGFloat centerY;
  switch (sharedElementTransition.align) {
    case RNSSharedElementTransitionAlignLeftCenter:
      centerX = targetFrame.origin.x + initialFrame.size.width / 2;
      centerY = targetFrame.origin.y + targetFrame.size.height / 2;
      break;
    case RNSSharedElementTransitionAlignLeftBottom:
      centerX = targetFrame.origin.x + initialFrame.size.width / 2;
      centerY = targetFrame.origin.y + targetFrame.size.height - initialFrame.size.height / 2;
      break;
    case RNSSharedElementTransitionAlignCenterTop:
      centerX = targetFrame.origin.x + targetFrame.size.width / 2;
      centerY = targetFrame.origin.y + initialFrame.size.height / 2;
      break;
    case RNSSharedElementTransitionAlignCenterCenter:
      centerX = targetFrame.origin.x + targetFrame.size.width / 2;
      centerY = targetFrame.origin.y + targetFrame.size.height / 2;
      break;
    case RNSSharedElementTransitionAlignCenterBottom:
      centerX = targetFrame.origin.x + targetFrame.size.width / 2;
      centerY = targetFrame.origin.y + targetFrame.size.height - initialFrame.size.height / 2;
      break;
    case RNSSharedElementTransitionAlignRightTop:
      centerX = targetFrame.origin.x + targetFrame.size.width - initialFrame.size.width / 2;
      centerY = targetFrame.origin.y + initialFrame.size.height / 2;
      break;
    case RNSSharedElementTransitionAlignRightCenter:
      centerX = targetFrame.origin.x + targetFrame.size.width - initialFrame.size.width / 2;
      centerY = targetFrame.origin.y + targetFrame.size.height / 2;
      break;
    case RNSSharedElementTransitionAlignRightBottom:
      centerX = targetFrame.origin.x + targetFrame.size.width - initialFrame.size.width / 2;
      centerY = targetFrame.origin.y + targetFrame.size.height - initialFrame.size.height / 2;
      break;
    default:
      centerX = targetFrame.origin.x + initialFrame.size.width / 2;
      centerY = targetFrame.origin.y + initialFrame.size.height / 2;
      break;
  }

  CGPoint targetCenter = CGPointMake(centerX, centerY);
  UIView *snapshot;
  if (sharedElementTransition.resizeMode == RNSSharedElementTransitionResizeModeResize &&
      ([NSStringFromClass(fromView.class) isEqualToString:@"RCTImageView"] ||
       [NSStringFromClass(fromView.class) isEqualToString:@"RCTImageComponentView"])) {
    UIImageView *imageView = fromView.subviews.firstObject;
    if (imageView != nil && imageView.image != nil) {
      UIImage *image = imageView.image;

      CGFloat largerWidth =
          fromView.bounds.size.width > toView.bounds.size.width ? fromView.bounds.size.width : toView.bounds.size.width;

      CGFloat largerHeight = fromView.bounds.size.height > toView.bounds.size.height ? fromView.bounds.size.height
                                                                                     : toView.bounds.size.height;

      CGFloat imageAspectRatio = image.size.width / image.size.height;
      CGSize drawSize = largerHeight > largerWidth ? CGSizeMake(largerHeight * imageAspectRatio, largerHeight)
                                                   : CGSizeMake(largerWidth, largerWidth / imageAspectRatio);

      UIGraphicsImageRenderer *renderer = [[UIGraphicsImageRenderer alloc] initWithSize:drawSize];
      UIImage *resizedImage = [renderer imageWithActions:^(UIGraphicsImageRendererContext *_Nonnull context) {
        [image drawInRect:CGRectMake(0, 0, drawSize.width, drawSize.height)];
      }];

      if (resizedImage != nil) {
        UIImageView *imageSnapshot = [[UIImageView alloc] initWithImage:resizedImage];
        imageSnapshot.autoresizingMask = (UIViewAutoresizingFlexibleWidth | UIViewAutoresizingFlexibleHeight);
        imageSnapshot.contentMode = imageView.contentMode;
        imageSnapshot.clipsToBounds = YES;
        snapshot = imageSnapshot;
      }
    }
  }

  if (snapshot == nil) {
    snapshot = [fromView snapshotViewAfterScreenUpdates:NO];
  }

  snapshot.alpha = 1.0;
  snapshot.layer.zPosition = 1;
  snapshot.frame = initialFrame;
  [container addSubview:snapshot];

  CGFloat initialFromViewAlpha = fromView.alpha;
  if (!sharedElementTransition.showFromElementDuringAnimation) {
    fromView.alpha = 0.0;
  }
  CGFloat initialToViewAlpha = toView.alpha;
  if (!sharedElementTransition.showToElementDuringAnimation) {
    toView.alpha = 0.0;
  }

  NSTimeInterval duration = sharedElementTransition.duration != 0 ? sharedElementTransition.duration
                                                                  : [self transitionDuration:transitionContext];

  [UIView animateWithDuration:duration
      delay:sharedElementTransition.delay
      usingSpringWithDamping:sharedElementTransition.damping
      initialSpringVelocity:sharedElementTransition.initialVelocity
      options:animationOptions
      animations:^{
        if (sharedElementTransition.resizeMode == RNSSharedElementTransitionResizeModeNone) {
          snapshot.center = targetCenter;
        } else {
          snapshot.frame = targetFrame;
        }
      }
      completion:^(BOOL finished) {
        [snapshot removeFromSuperview];
        if (!sharedElementTransition.showFromElementDuringAnimation) {
          fromView.alpha = initialFromViewAlpha;
        }
        if (!sharedElementTransition.showToElementDuringAnimation) {
          toView.alpha = initialToViewAlpha;
        }
      }];
}

+ (BOOL)isCustomAnimation:(RNSScreenStackAnimation)animation
{
  return (animation != RNSScreenStackAnimationFlip && animation != RNSScreenStackAnimationDefault);
}

- (void)animateTransitionWithStackAnimation:(RNSScreenStackAnimation)animation
                          transitionContext:(id<UIViewControllerContextTransitioning>)transitionContext
                                       toVC:(UIViewController *)toVC
                                     fromVC:(UIViewController *)fromVC
{
  if (animation == RNSScreenStackAnimationSimplePush) {
    [self animateSimplePushWithTransitionContext:transitionContext toVC:toVC fromVC:fromVC];
    return;
  } else if (animation == RNSScreenStackAnimationFade || animation == RNSScreenStackAnimationNone) {
    [self animateFadeWithTransitionContext:transitionContext toVC:toVC fromVC:fromVC];
    return;
  } else if (animation == RNSScreenStackAnimationSlideFromBottom) {
    [self animateSlideFromBottomWithTransitionContext:transitionContext toVC:toVC fromVC:fromVC];
    return;
  } else if (animation == RNSScreenStackAnimationFadeFromBottom) {
    [self animateFadeFromBottomWithTransitionContext:transitionContext toVC:toVC fromVC:fromVC];
    return;
  }
  // simple_push is the default custom animation
  [self animateSimplePushWithTransitionContext:transitionContext toVC:toVC fromVC:fromVC];
}

@end
