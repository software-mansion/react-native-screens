#pragma once

#import "RNSStackTransitionAnimator.h"

NS_ASSUME_NONNULL_BEGIN

@interface RNSStackTransitionAnimator ()

/**
 * The animator that plays the transition and calls `completeTransition:` in its completion. Called once per
 * transition.
 */
- (UIViewPropertyAnimator *)propertyAnimatorForTransition:(id<UIViewControllerContextTransitioning>)transitionContext;

/**
 * A linear animator of `transitionDuration:` that runs `animations` and lasts its whole duration even when they change
 * nothing. Its completion runs `completion`, then calls `completeTransition:`.
 */
- (UIViewPropertyAnimator *)linearAnimatorForTransition:(id<UIViewControllerContextTransitioning>)transitionContext
                                             animations:(nullable void (^)(void))animations
                                             completion:(nullable void (^)(void))completion;

@end

NS_ASSUME_NONNULL_END
