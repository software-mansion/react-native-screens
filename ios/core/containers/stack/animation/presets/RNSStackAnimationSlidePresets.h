#pragma once

#import <Foundation/Foundation.h>
#import "RNSStackAnimationEdge.h"

NS_ASSUME_NONNULL_BEGIN

@class RNSStackAnimationTrack;

@interface RNSStackAnimationSlidePresets : NSObject

/**
 * One screen sliding along `edge`'s vector over the full width or height.
 */
+ (NSArray<RNSStackAnimationTrack *> *)tracksFromEdge:(RNSStackAnimationEdge)edge appearing:(BOOL)isAppearing;

@end

NS_ASSUME_NONNULL_END
