#pragma once

#import <Foundation/Foundation.h>
#import "RNSStackAnimationEdge.h"

NS_ASSUME_NONNULL_BEGIN

@class RNSStackAnimationLength;
@class RNSStackAnimationTrack;

@interface RNSStackAnimationFadePresets : NSObject

/**
 * One screen fading in when appearing, out when disappearing.
 */
+ (NSArray<RNSStackAnimationTrack *> *)tracksAppearing:(BOOL)isAppearing;

/**
 * One screen fading while travelling `distance` along `edge`'s vector: a rise when appearing, a shorter fall when
 * disappearing. A nil `distance` is the legacy 8 % of the container's height.
 */
+ (NSArray<RNSStackAnimationTrack *> *)fadeFromTracksFromEdge:(RNSStackAnimationEdge)edge
                                                     distance:(nullable RNSStackAnimationLength *)distance
                                                    appearing:(BOOL)isAppearing;

@end

NS_ASSUME_NONNULL_END
