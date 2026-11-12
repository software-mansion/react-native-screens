#pragma once

#import <Foundation/Foundation.h>

NS_ASSUME_NONNULL_BEGIN

@class RNSStackAnimationTrack;

@interface RNSStackAnimationFadePresets : NSObject

/**
 * One screen fading in when appearing, out when disappearing.
 */
+ (NSArray<RNSStackAnimationTrack *> *)tracksAppearing:(BOOL)isAppearing;

@end

NS_ASSUME_NONNULL_END
