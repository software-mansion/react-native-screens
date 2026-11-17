#pragma once

#import <Foundation/Foundation.h>
#import "RNSStackAnimationConfig.h"

NS_ASSUME_NONNULL_BEGIN

@class RNSStackAnimationDimTrackConfig;
@class RNSStackAnimationScalarTrackConfig;
@class RNSStackAnimationTranslateTrackConfig;

/**
 * The motion written as tracks, one per animated property. A property without a track stays at rest and a motion
 * without tracks is a static screen, like `none`. `scaleX` and `scaleY` take their axis over `scale`.
 */
@interface RNSStackAnimationCustomMotionConfig : NSObject <RNSStackAnimationMotionConfig>

@property (nonatomic, readonly, nullable) RNSStackAnimationTranslateTrackConfig *translateX;
@property (nonatomic, readonly, nullable) RNSStackAnimationTranslateTrackConfig *translateY;
@property (nonatomic, readonly, nullable) RNSStackAnimationScalarTrackConfig *opacity;
@property (nonatomic, readonly, nullable) RNSStackAnimationScalarTrackConfig *scale;
@property (nonatomic, readonly, nullable) RNSStackAnimationScalarTrackConfig *scaleX;
@property (nonatomic, readonly, nullable) RNSStackAnimationScalarTrackConfig *scaleY;
@property (nonatomic, readonly, nullable) RNSStackAnimationScalarTrackConfig *rotate;
@property (nonatomic, readonly, nullable) RNSStackAnimationDimTrackConfig *dim;

- (instancetype)initWithTranslateX:(nullable RNSStackAnimationTranslateTrackConfig *)translateX
                        translateY:(nullable RNSStackAnimationTranslateTrackConfig *)translateY
                           opacity:(nullable RNSStackAnimationScalarTrackConfig *)opacity
                             scale:(nullable RNSStackAnimationScalarTrackConfig *)scale
                            scaleX:(nullable RNSStackAnimationScalarTrackConfig *)scaleX
                            scaleY:(nullable RNSStackAnimationScalarTrackConfig *)scaleY
                            rotate:(nullable RNSStackAnimationScalarTrackConfig *)rotate
                               dim:(nullable RNSStackAnimationDimTrackConfig *)dim;

@end

NS_ASSUME_NONNULL_END
