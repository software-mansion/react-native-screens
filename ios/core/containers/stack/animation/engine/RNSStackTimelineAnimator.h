#pragma once

#import "RNSStackTransitionAnimator.h"

NS_ASSUME_NONNULL_BEGIN

@class RNSStackAnimationTransitionTimeline;

/**
 * Plays a transition timeline: both screens' tracks as keyframes of one linear `UIViewPropertyAnimator`, so that
 * every track keeps its own timing and curve.
 */
@interface RNSStackTimelineAnimator : RNSStackTransitionAnimator

- (instancetype)initWithTimeline:(RNSStackAnimationTransitionTimeline *)timeline;

@end

NS_ASSUME_NONNULL_END
