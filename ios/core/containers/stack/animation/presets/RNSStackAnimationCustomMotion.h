#pragma once

#import <Foundation/Foundation.h>

NS_ASSUME_NONNULL_BEGIN

@class RNSStackAnimationCustomMotionConfig;
@class RNSStackAnimationTrack;

@interface RNSStackAnimationCustomMotion : NSObject

/**
 * The tracks of a motion written as tracks, endpoints completed with the rest values; a track with both omitted holds
 * the rest value. The horizontal axis is physical: a raw `translateX` never mirrors in a right-to-left container.
 */
+ (NSArray<RNSStackAnimationTrack *> *)tracksForConfig:(RNSStackAnimationCustomMotionConfig *)config;

@end

NS_ASSUME_NONNULL_END
