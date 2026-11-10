#pragma once

#import <Foundation/Foundation.h>
#import "RNSStackAnimationConfig.h"

NS_ASSUME_NONNULL_BEGIN

@interface RNSStackAnimationMapper : NSObject

/**
 * Converts the `animation` prop. A value that cannot be parsed logs a warning and converts to the default animation.
 * A preset iOS has no transition for logs a warning and converts as written; UIKit's default transition plays for it,
 * see `+[RNSStackPresets transitionTimelineForConfig:kind:]`.
 */
+ (id<RNSStackAnimationConfig>)animationConfigFromProp:(nullable id)value;

@end

NS_ASSUME_NONNULL_END
