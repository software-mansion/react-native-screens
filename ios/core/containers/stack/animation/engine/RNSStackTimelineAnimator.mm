#import "RNSStackTimelineAnimator.h"
#import "RNSStackAnimationMotionBinding.h"
#import "RNSStackAnimationTransitionTimeline.h"
#import "RNSStackTransitionAnimatorSubclass.h"

@implementation RNSStackTimelineAnimator {
  RNSStackAnimationTransitionTimeline *_timeline;
}

- (instancetype)initWithTimeline:(RNSStackAnimationTransitionTimeline *)timeline
{
  if (self = [super init]) {
    _timeline = timeline;
  }
  return self;
}

- (NSTimeInterval)transitionDuration:(nullable id<UIViewControllerContextTransitioning>)transitionContext
{
  return _timeline.durationMs / 1000.0;
}

- (UIViewPropertyAnimator *)propertyAnimatorForTransition:(id<UIViewControllerContextTransitioning>)transitionContext
{
  UIView *containerView = transitionContext.containerView;
  UIViewController *toController = [transitionContext viewControllerForKey:UITransitionContextToViewControllerKey];
  UIView *toView = [transitionContext viewForKey:UITransitionContextToViewKey];
  UIView *fromView = [transitionContext viewForKey:UITransitionContextFromViewKey];
  toView.frame = [transitionContext finalFrameForViewController:toController];
  if (_timeline.exitZOrder == RNSStackAnimationZOrderOver) {
    [containerView insertSubview:toView belowSubview:fromView];
  } else {
    [containerView addSubview:toView];
  }

  CGSize containerSize = containerView.bounds.size;
  RNSStackAnimationMotionBinding *enterBinding = [[RNSStackAnimationMotionBinding alloc] initWithMotion:_timeline.enter
                                                                                                   view:toView
                                                                                          containerSize:containerSize];
  RNSStackAnimationMotionBinding *exitBinding = [[RNSStackAnimationMotionBinding alloc] initWithMotion:_timeline.exit
                                                                                                  view:fromView
                                                                                         containerSize:containerSize];

  // Keyframes inside a property animator take its duration and its timing curve, so the linear animator leaves every
  // track's curve to the keyframes.
  NSInteger durationMs = _timeline.durationMs;
  NSTimeInterval duration = [self transitionDuration:transitionContext];
  UIViewPropertyAnimator *animator = [[UIViewPropertyAnimator alloc]
      initWithDuration:duration
                 curve:UIViewAnimationCurveLinear
            animations:^{
              [UIView animateKeyframesWithDuration:duration
                                             delay:0
                                           options:UIViewKeyframeAnimationOptionCalculationModeLinear
                                        animations:^{
                                          [enterBinding addKeyframesForDurationMs:durationMs];
                                          [exitBinding addKeyframesForDurationMs:durationMs];
                                        }
                                        completion:nil];
            }];
  [animator addCompletion:^(UIViewAnimatingPosition finalPosition) {
    [enterBinding restore];
    [exitBinding restore];
    [transitionContext completeTransition:!transitionContext.transitionWasCancelled];
  }];
  return animator;
}

@end
