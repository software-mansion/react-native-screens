#pragma once

#import <Foundation/Foundation.h>
#import "RNSStackAnimationConfig.h"

NS_ASSUME_NONNULL_BEGIN

@class RNSStackAnimationEasing;
@class RNSStackAnimationLength;

@interface RNSStackAnimationMapper : NSObject

/**
 * Converts the `animation` prop. A value that cannot be parsed logs a warning and converts to the default animation.
 */
+ (id<RNSStackAnimationConfig>)animationConfigFromProp:(nullable id)value;

/**
 * The value parsers shared with `RNSStackAnimationTrackConfigMapper`; each one warns and returns nil for a value it
 * rejects, except `lengthFromValue:`, which returns nil without a warning so that the caller words it.
 */
+ (nullable NSNumber *)durationFromValue:(id)value;
+ (nullable RNSStackAnimationEasing *)easingFromValue:(id)value;
+ (nullable RNSStackAnimationLength *)lengthFromValue:(id)value;
+ (BOOL)dictionary:(NSDictionary *)map hasOnlyKeys:(NSArray<NSString *> *)allowed;
+ (nullable id)rejectWithReason:(NSString *)reason;

@end

NS_ASSUME_NONNULL_END
