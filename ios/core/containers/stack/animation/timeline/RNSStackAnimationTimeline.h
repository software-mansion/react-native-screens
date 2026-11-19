#pragma once

#import <Foundation/Foundation.h>
#import "RNSStackAnimationTransitionKind.h"

NS_ASSUME_NONNULL_BEGIN

@class RNSStackAnimationEasing;
@class RNSStackAnimationTransitionTimeline;

/**
 * Both transitions of one animation. The reference duration a `duration` option rescales against is the longer one.
 */
@interface RNSStackAnimationTimeline : NSObject

@property (nonatomic, readonly) RNSStackAnimationTransitionTimeline *push;
@property (nonatomic, readonly) RNSStackAnimationTransitionTimeline *pop;

- (instancetype)initWithPush:(RNSStackAnimationTransitionTimeline *)push pop:(RNSStackAnimationTransitionTimeline *)pop;

- (RNSStackAnimationTransitionTimeline *)transitionForKind:(RNSStackAnimationTransitionKind)kind;

/**
 * Both transitions scaled by the same factor, so the animation's own asymmetry survives.
 */
- (instancetype)retimedTo:(NSInteger)durationMs;

/**
 * Every track of both transitions on one curve, the dim included.
 */
- (instancetype)withEasing:(RNSStackAnimationEasing *)easing;

@end

NS_ASSUME_NONNULL_END
