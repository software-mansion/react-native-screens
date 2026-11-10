#pragma once

#import <Foundation/Foundation.h>

NS_ASSUME_NONNULL_BEGIN

@class RNSStackAnimationTrack;

/**
 * One screen's motion in a transition: its tracks and how long its timeline runs.
 */
@interface RNSStackAnimationMotionTimeline : NSObject

@property (nonatomic, readonly) NSArray<RNSStackAnimationTrack *> *tracks;
@property (nonatomic, readonly) NSInteger durationMs;

/**
 * A motion lasting the whole transition of `durationMs`, which no track may outlast. A screen without tracks stays
 * static until the transition ends.
 */
+ (instancetype)timelineSpanning:(NSInteger)durationMs tracks:(NSArray<RNSStackAnimationTrack *> *)tracks;

@end

NS_ASSUME_NONNULL_END
