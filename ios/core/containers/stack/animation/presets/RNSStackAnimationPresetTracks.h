#pragma once

#import <UIKit/UIKit.h>
#import "RNSStackAnimationEdge.h"

NS_ASSUME_NONNULL_BEGIN

@class RNSStackAnimationDimTrack;
@class RNSStackAnimationEasing;
@class RNSStackAnimationLength;
@class RNSStackAnimationPropertyTrack;
@class RNSStackAnimationTranslateTrack;

@interface RNSStackAnimationPresetTracks : NSObject

/**
 * The scrim color of a dim without one: black, as the shadow view of the legacy iOS `RNSScreenStackAnimator`.
 */
@property (class, nonatomic, readonly) UIColor *defaultDimColor;

/**
 * A `*From<Edge>` motion is a vector pointing away from the edge: an appearing view arrives at rest along it, a
 * disappearing view departs from rest along it (exiting through the opposite edge). Logical edges are written for
 * left-to-right and mirrored by the engine.
 */
+ (RNSStackAnimationTranslateTrack *)translationTrackFromEdge:(RNSStackAnimationEdge)edge
                                                     distance:(RNSStackAnimationLength *)distance
                                                    appearing:(BOOL)isAppearing
                                                   durationMs:(NSInteger)durationMs
                                                       easing:(RNSStackAnimationEasing *)easing;

+ (RNSStackAnimationPropertyTrack *)opacityTrackFrom:(CGFloat)from
                                                  to:(CGFloat)to
                                             startMs:(NSInteger)startMs
                                          durationMs:(NSInteger)durationMs
                                              easing:(RNSStackAnimationEasing *)easing;

+ (RNSStackAnimationDimTrack *)dimTrackFrom:(CGFloat)from
                                         to:(CGFloat)to
                                 durationMs:(NSInteger)durationMs
                                     easing:(RNSStackAnimationEasing *)easing;

@end

NS_ASSUME_NONNULL_END
