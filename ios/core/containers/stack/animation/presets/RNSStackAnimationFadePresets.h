#pragma once

#import <Foundation/Foundation.h>
#import "RNSStackAnimationEdge.h"

NS_ASSUME_NONNULL_BEGIN

@class RNSStackAnimationTrack;

@interface RNSStackAnimationFadePresets : NSObject

/**
 * One screen fading in when appearing, out when disappearing.
 */
+ (NSArray<RNSStackAnimationTrack *> *)tracksAppearing:(BOOL)isAppearing;

/**
 * One screen fading while travelling a short distance along `edge`'s vector: a rise when appearing, a shorter fall
 * when disappearing.
 */
+ (NSArray<RNSStackAnimationTrack *> *)fadeFromTracksFromEdge:(RNSStackAnimationEdge)edge appearing:(BOOL)isAppearing;

@end

NS_ASSUME_NONNULL_END
