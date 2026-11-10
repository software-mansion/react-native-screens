#pragma once

#import <CoreGraphics/CoreGraphics.h>
#import <Foundation/Foundation.h>
#import "RNSStackAnimationEdge.h"
#import "RNSStackAnimationLength.h"

NS_ASSUME_NONNULL_BEGIN

@class RNSStackAnimationEasing;
@class RNSStackAnimationPropertyTrack;
@class RNSStackAnimationTranslateTrack;

@interface RNSStackAnimationPresetTracks : NSObject

/**
 * A `*From<Edge>` motion is a vector pointing away from the edge: an appearing view arrives at rest along it, a
 * disappearing view departs from rest along it (exiting through the opposite edge).
 */
+ (RNSStackAnimationTranslateTrack *)translationTrackFromEdge:(RNSStackAnimationEdge)edge
                                                     distance:(RNSStackAnimationLength)distance
                                                    appearing:(BOOL)isAppearing
                                                   durationMs:(NSInteger)durationMs
                                                       easing:(RNSStackAnimationEasing *)easing;

+ (RNSStackAnimationPropertyTrack *)opacityTrackFrom:(CGFloat)from
                                                  to:(CGFloat)to
                                          durationMs:(NSInteger)durationMs
                                              easing:(RNSStackAnimationEasing *)easing;

@end

NS_ASSUME_NONNULL_END
