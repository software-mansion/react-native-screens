#pragma once

#import <Foundation/Foundation.h>
#import "RNSStackAnimationConfig.h"

NS_ASSUME_NONNULL_BEGIN

@interface RNSStackAnimationMapper : NSObject

/**
 * Converts the `animation` prop. A value that cannot be parsed logs a warning and converts to the default animation.
 */
+ (id<RNSStackAnimationConfig>)animationConfigFromProp:(nullable id)value;

@end

NS_ASSUME_NONNULL_END
