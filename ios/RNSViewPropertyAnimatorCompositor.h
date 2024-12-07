#import <React/RCTAssert.h>
#import <UIKit/UIKit.h>

NS_ASSUME_NONNULL_BEGIN

/// Retains collection of animators and itself implements `UIViewImplicitlyAnimating`. Object of this class
/// fans out all call to methods of `UIViewAnimating` and `continueAnimationWithTimingParameters:durationFactor` to all
/// the animators. The remaining methods of `UIViewImplicitlyAnimating`, are forwareded to the
/// `animatorForImplicitAnimations`.
///
/// This allows to pass instance of this class as the interruptible animator and have the `animators` be interruptible
/// with timing curve of the implicit animator. This is useful for navigation item animation.
/// We also get possibility to drive all the animators simultaneously with gesture (interactive animation).
@interface RNSViewPropertyAnimatorCompositor : NSObject <UIViewImplicitlyAnimating>

@property (nonnull, strong, nonatomic, readonly) NSArray<id<UIViewImplicitlyAnimating>> *animators;
@property (nullable, strong, nonatomic) id<UIViewImplicitlyAnimating> implicitAnimator;

/// @param animators - nonnull, nonempty animator list
/// @param implicitAnimator - designated aniamator to return from `- animatorForImplicitAnimations`
/// @return nonnull instance only in case above invariants are not violated
- (nullable instancetype)initWithAnimators:(nonnull NSArray<id<UIViewImplicitlyAnimating>> *)animators
                          implicitAnimator:(nullable id<UIViewImplicitlyAnimating>)implicitAnimator
    NS_DESIGNATED_INITIALIZER;

- (nonnull id<UIViewImplicitlyAnimating>)animatorForImplicitAnimations;

@end

NS_ASSUME_NONNULL_END
