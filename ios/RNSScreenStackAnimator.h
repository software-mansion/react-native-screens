#import "RNSScreen.h"

@interface RNSScreenStackAnimator : NSObject <UIViewControllerAnimatedTransitioning>

/// This property is filled only when there is an property aniamator associated with an ongoing interactive transition.
/// In our case this is when we're handling full screen swipe or edge back gesture.
@property (nonatomic, strong, nullable, readonly) UIViewPropertyAnimator *inFlightAnimator;

- (nonnull instancetype)initWithOperation:(UINavigationControllerOperation)operation;

/// In case of interactive / interruptible transition (e.g. swipe back gesture) this method should return
/// timing parameters expected by animator to be used for animation completion (e.g. when user's
/// gesture had ended).
///
/// @return timing curve provider expected to be used for animation completion or nil,
/// when there is no interactive transition running.
- (nullable id<UITimingCurveProvider>)timingParamsForAnimationCompletion;

+ (BOOL)isCustomAnimation:(RNSScreenStackAnimation)animation;

@end
