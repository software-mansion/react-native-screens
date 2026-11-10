#pragma once

#import "RNSStackTransitionAnimator.h"

NS_ASSUME_NONNULL_BEGIN

@interface RNSStackTransitionAnimator ()

/**
 * The animator that plays the transition and calls `completeTransition:` in its completion. Called once per
 * transition.
 */
- (UIViewPropertyAnimator *)propertyAnimatorForTransition:(id<UIViewControllerContextTransitioning>)transitionContext;

@end

NS_ASSUME_NONNULL_END
