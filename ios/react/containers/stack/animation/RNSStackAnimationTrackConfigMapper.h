#pragma once

#import <Foundation/Foundation.h>

NS_ASSUME_NONNULL_BEGIN

@class RNSStackAnimationCustomMotionConfig;

@interface RNSStackAnimationTrackConfigMapper : NSObject

/**
 * Converts a `{ type: 'custom', ...tracks }` motion. Each track is an object under its property's key; an omitted key
 * leaves the property at rest. nil after a warning.
 */
+ (nullable RNSStackAnimationCustomMotionConfig *)customMotionConfigFromDictionary:(NSDictionary *)map;

@end

NS_ASSUME_NONNULL_END
