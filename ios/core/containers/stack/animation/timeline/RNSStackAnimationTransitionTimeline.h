#pragma once

#import <Foundation/Foundation.h>
#import "RNSStackAnimationTransitionKind.h"
#import "RNSStackAnimationZOrder.h"

NS_ASSUME_NONNULL_BEGIN

@class RNSStackAnimationEasing;
@class RNSStackAnimationMotionTimeline;
@class RNSStackAnimationTrack;

/**
 * What both screens of one transition do: `enter` is the motion of the screen whose view appears, `exit` of the
 * screen whose view disappears, drawn in `exitZOrder` relative to the other.
 */
@interface RNSStackAnimationTransitionTimeline : NSObject

@property (nonatomic, readonly) RNSStackAnimationMotionTimeline *enter;
@property (nonatomic, readonly) RNSStackAnimationMotionTimeline *exit;
@property (nonatomic, readonly) RNSStackAnimationZOrder exitZOrder;

/**
 * How long the longest track lasts; 0 for the static timeline.
 */
@property (nonatomic, readonly) NSInteger durationMs;

/**
 * Whether the transition lasts 0 ms, with or without tracks: it swaps the screens at once.
 */
@property (nonatomic, readonly) BOOL isStatic;

@property (class, nonatomic, readonly) RNSStackAnimationTransitionTimeline *staticTimeline;

/**
 * The transition of `kind` playing `enterTracks` on the appearing screen and `exitTracks` on the disappearing one. On
 * a push the covered screen is drawn under the entering one; on a pop the popped screen stays on top of the revealed
 * one.
 */
+ (instancetype)timelineForKind:(RNSStackAnimationTransitionKind)kind
                    enterTracks:(NSArray<RNSStackAnimationTrack *> *)enterTracks
                     exitTracks:(NSArray<RNSStackAnimationTrack *> *)exitTracks;

/**
 * Both motions rebuilt from their scaled tracks, so the duration follows the rounded tracks; the static timeline
 * stays static.
 */
- (instancetype)scaledBy:(double)factor;

/**
 * Both motions scaled so the transition lasts `durationMs`; the static timeline stays static.
 */
- (instancetype)retimedTo:(NSInteger)durationMs;

- (instancetype)withEasing:(RNSStackAnimationEasing *)easing;

@end

NS_ASSUME_NONNULL_END
