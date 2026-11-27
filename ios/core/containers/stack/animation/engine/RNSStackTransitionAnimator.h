#pragma once

#import <UIKit/UIKit.h>

NS_ASSUME_NONNULL_BEGIN

@class RNSStackTransitionAnimator;

@protocol RNSStackTransitionAnimatorDelegate <NSObject>

/**
 * UIKit ended the transition, completed or not. The animator holds nothing of the transition afterwards.
 */
- (void)transitionAnimatorDidEnd:(RNSStackTransitionAnimator *)animator;

@end

/**
 * Plays a transition with one `UIViewPropertyAnimator`, built by a subclass on the first request, started by
 * `animateTransition:` and released when UIKit ends the transition. Subclasses implement `transitionDuration:` and
 * `propertyAnimatorForTransition:` (`RNSStackTransitionAnimatorSubclass.h`).
 */
@interface RNSStackTransitionAnimator : NSObject <UIViewControllerAnimatedTransitioning>

@property (nonatomic, weak, nullable) id<RNSStackTransitionAnimatorDelegate> delegate;

/**
 * Whether `animateTransition:` has started the animator and UIKit has not ended the transition yet.
 */
@property (nonatomic, readonly) BOOL isRunning;

/**
 * Jumps a running transition to its end: the completion restores the screens and calls `completeTransition:` before
 * this returns. Does nothing unless `isRunning`.
 */
- (void)finish;

@end

NS_ASSUME_NONNULL_END
