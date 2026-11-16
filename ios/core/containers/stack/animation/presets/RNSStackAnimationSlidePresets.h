#pragma once

#import <Foundation/Foundation.h>
#import "RNSStackAnimationEdge.h"

NS_ASSUME_NONNULL_BEGIN

@class RNSStackAnimationLength;
@class RNSStackAnimationTrack;

@interface RNSStackAnimationSlidePresets : NSObject

/**
 * One screen sliding along `edge`'s vector over `distance`, the full width or height when nil.
 */
+ (NSArray<RNSStackAnimationTrack *> *)tracksFromEdge:(RNSStackAnimationEdge)edge
                                             distance:(nullable RNSStackAnimationLength *)distance
                                            appearing:(BOOL)isAppearing;

@end

NS_ASSUME_NONNULL_END
