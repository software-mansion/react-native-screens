#pragma once

#import <CoreGraphics/CoreGraphics.h>
#import <Foundation/Foundation.h>

NS_ASSUME_NONNULL_BEGIN

@class RNSStackAnimationEasing;

/**
 * When a track runs on its screen's timeline, in absolute milliseconds, and with which curve.
 */
@interface RNSStackAnimationTiming : NSObject

@property (nonatomic, readonly) NSInteger startMs;
@property (nonatomic, readonly) NSInteger durationMs;
@property (nonatomic, readonly) NSInteger endMs;
@property (nonatomic, readonly) RNSStackAnimationEasing *easing;

- (instancetype)initWithStartMs:(NSInteger)startMs
                     durationMs:(NSInteger)durationMs
                         easing:(RNSStackAnimationEasing *)easing;

/**
 * Eased 0..1 progress at `timeMs` on the screen's timeline, clamped; a 0 ms span is a step.
 */
- (CGFloat)progressAtMs:(double)timeMs;

@end

NS_ASSUME_NONNULL_END
