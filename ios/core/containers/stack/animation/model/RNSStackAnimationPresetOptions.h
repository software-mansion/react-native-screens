#pragma once

#import <Foundation/Foundation.h>

NS_ASSUME_NONNULL_BEGIN

@class RNSStackAnimationEasing;
@class RNSStackAnimationLength;

typedef NS_ENUM(NSInteger, RNSStackAnimationPresetOption) {
  RNSStackAnimationPresetOptionDuration,
  RNSStackAnimationPresetOptionEasing,
  RNSStackAnimationPresetOptionDistance,
};

/**
 * Options applied while a preset's tables are built: `durationMs` replaces the reference duration, `easing` the curve
 * of every track, `distance` the travel of the moving screen. The mapper has checked the values: a duration is at least
 * 1 ms, a distance is positive.
 */
@interface RNSStackAnimationPresetOptions : NSObject

@property (nonatomic, readonly, nullable) NSNumber *durationMs;
@property (nonatomic, readonly, nullable) RNSStackAnimationEasing *easing;
@property (nonatomic, readonly, nullable) RNSStackAnimationLength *distance;

@property (class, nonatomic, readonly) RNSStackAnimationPresetOptions *none;

- (instancetype)initWithDurationMs:(nullable NSNumber *)durationMs
                            easing:(nullable RNSStackAnimationEasing *)easing
                          distance:(nullable RNSStackAnimationLength *)distance;

@end

NS_ASSUME_NONNULL_END
