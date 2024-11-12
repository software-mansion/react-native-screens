#import "RNSViewPropertyAnimatorCompositor.h"
#import <React/RCTAssert.h>

@implementation RNSViewPropertyAnimatorCompositor

RCT_NOT_IMPLEMENTED(-(instancetype)init)

- (instancetype)initWithAnimators:(nonnull NSArray<id<UIViewImplicitlyAnimating>> *)animators
                 implicitAnimator:(nullable id<UIViewImplicitlyAnimating>)implicitAnimator
{
  if (animators == nil || animators.count == 0) {
    assert((false) && "[RNScreens] Expected non-empty animator list");
    return nil;
  }

  if (self = [super init]) {
    _animators = animators ?: @[];
    _implicitAnimator = implicitAnimator;
  }
  return self;
}

- (id<UIViewImplicitlyAnimating>)animatorForImplicitAnimations
{
  if (_implicitAnimator != nil) {
    return _implicitAnimator;
  }
  assert(_animators.count > 0 && "[RNScreens] Animator list must not be empty");
  return _animators.firstObject;
}

#pragma mark - UIViewImplicityAnimating optional methods

- (void)addAnimations:(void (^)())animation
{
  [self.animatorForImplicitAnimations addAnimations:animation];
}

- (void)addAnimations:(void (^)())animation delayFactor:(CGFloat)delayFactor
{
  [self.animatorForImplicitAnimations addAnimations:animation delayFactor:delayFactor];
}

- (void)addCompletion:(void (^)(UIViewAnimatingPosition))completion
{
  [self.animatorForImplicitAnimations addCompletion:completion];
}

- (void)continueAnimationWithTimingParameters:(id<UITimingCurveProvider>)parameters
                               durationFactor:(CGFloat)durationFactor
{
  for (id<UIViewImplicitlyAnimating> animator in _animators) {
    [animator continueAnimationWithTimingParameters:parameters durationFactor:durationFactor];
  }
  [self.implicitAnimator continueAnimationWithTimingParameters:parameters durationFactor:durationFactor];
}

#pragma mark - UIViewAnimating

- (UIViewAnimatingState)state
{
  return self.animatorForImplicitAnimations.state;
}

- (BOOL)isRunning
{
  return self.animatorForImplicitAnimations.isRunning;
}

- (BOOL)isReversed
{
  return self.animatorForImplicitAnimations.isReversed;
}

- (void)setReversed:(BOOL)reversed
{
  for (id<UIViewImplicitlyAnimating> animator in _animators) {
    animator.reversed = reversed;
  }
  [self.implicitAnimator setReversed:reversed];
}

- (void)setFractionComplete:(CGFloat)fractionComplete
{
  for (id<UIViewImplicitlyAnimating> animator in _animators) {
    animator.fractionComplete = fractionComplete;
  }
  [self.implicitAnimator setFractionComplete:fractionComplete];
}

- (CGFloat)fractionComplete
{
  return self.animatorForImplicitAnimations.fractionComplete;
}

- (void)startAnimation
{
  for (id<UIViewImplicitlyAnimating> animator in _animators) {
    [animator startAnimation];
  }
  [self.implicitAnimator startAnimation];
}

- (void)startAnimationAfterDelay:(NSTimeInterval)delay
{
  for (id<UIViewImplicitlyAnimating> animator in _animators) {
    [animator startAnimationAfterDelay:delay];
  }
  [self.implicitAnimator startAnimationAfterDelay:delay];
}

- (void)pauseAnimation
{
  for (id<UIViewImplicitlyAnimating> animator in _animators) {
    [animator pauseAnimation];
  }
  [self.implicitAnimator pauseAnimation];
}

- (void)stopAnimation:(BOOL)withoutFinishing
{
  for (id<UIViewImplicitlyAnimating> animator in _animators) {
    [animator stopAnimation:withoutFinishing];
  }
  [self.implicitAnimator stopAnimation:withoutFinishing];
}

- (void)finishAnimationAtPosition:(UIViewAnimatingPosition)finalPosition
{
  for (id<UIViewImplicitlyAnimating> animator in _animators) {
    [animator finishAnimationAtPosition:finalPosition];
  }
  [self.implicitAnimator finishAnimationAtPosition:finalPosition];
}

@end
