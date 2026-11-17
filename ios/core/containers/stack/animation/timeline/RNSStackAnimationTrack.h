#pragma once

#import <UIKit/UIKit.h>
#import "RNSStackAnimationAxis.h"
#import "RNSStackAnimationViewProperty.h"

NS_ASSUME_NONNULL_BEGIN

@class RNSStackAnimationEasing;
@class RNSStackAnimationLength;
@class RNSStackAnimationTiming;

/**
 * A value interpolated on the screen's timeline from a `from` to a `to` value.
 */
@interface RNSStackAnimationTrack : NSObject

@property (nonatomic, readonly) RNSStackAnimationTiming *timing;

- (instancetype)initWithTiming:(RNSStackAnimationTiming *)timing;

- (instancetype)withTiming:(RNSStackAnimationTiming *)timing;

+ (NSArray<RNSStackAnimationTrack *> *)tracks:(NSArray<RNSStackAnimationTrack *> *)tracks scaledBy:(double)factor;

/**
 * Every track scaled so the last one ends at `durationMs`; a list ending at 0 ms has nothing to scale.
 */
+ (NSArray<RNSStackAnimationTrack *> *)tracks:(NSArray<RNSStackAnimationTrack *> *)tracks
                                    retimedTo:(NSInteger)durationMs;

+ (NSArray<RNSStackAnimationTrack *> *)tracks:(NSArray<RNSStackAnimationTrack *> *)tracks
                                   withEasing:(RNSStackAnimationEasing *)easing;

@end

@interface RNSStackAnimationTranslateTrack : RNSStackAnimationTrack

@property (nonatomic, readonly) RNSStackAnimationAxis axis;
@property (nonatomic, readonly) RNSStackAnimationLength *from;
@property (nonatomic, readonly) RNSStackAnimationLength *to;

- (instancetype)initWithAxis:(RNSStackAnimationAxis)axis
                        from:(RNSStackAnimationLength *)from
                          to:(RNSStackAnimationLength *)to
                      timing:(RNSStackAnimationTiming *)timing;

@end

@interface RNSStackAnimationPropertyTrack : RNSStackAnimationTrack

@property (nonatomic, readonly) RNSStackAnimationViewProperty viewProperty;
@property (nonatomic, readonly) CGFloat from;
@property (nonatomic, readonly) CGFloat to;

- (instancetype)initWithViewProperty:(RNSStackAnimationViewProperty)viewProperty
                                from:(CGFloat)from
                                  to:(CGFloat)to
                              timing:(RNSStackAnimationTiming *)timing;

/**
 * The `UIView` default of `property`: what an omitted endpoint of a custom track stands for.
 */
+ (CGFloat)restValueOfViewProperty:(RNSStackAnimationViewProperty)property;

@end

/**
 * A scrim of `color` over the screen, its alpha interpolated from `from` to `to`.
 */
@interface RNSStackAnimationDimTrack : RNSStackAnimationTrack

@property (nonatomic, readonly) UIColor *color;
@property (nonatomic, readonly) CGFloat from;
@property (nonatomic, readonly) CGFloat to;

- (instancetype)initWithColor:(UIColor *)color
                         from:(CGFloat)from
                           to:(CGFloat)to
                       timing:(RNSStackAnimationTiming *)timing;

@end

NS_ASSUME_NONNULL_END
