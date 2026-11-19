#pragma once

#import <UIKit/UIKit.h>

NS_ASSUME_NONNULL_BEGIN

@class RNSStackAnimationEasing;
@class RNSStackAnimationLength;

/**
 * When a track of a custom motion runs: `delayMs` after the transition starts, for `durationMs`, on `easing`; nil is
 * the default curve, see `RNSStackAnimationCustomMotion`. Until the delay elapses the property sits at the track's
 * `from` value, not at rest. The mapper has checked the values: a duration is at least 1 ms, a delay is not negative.
 */
@interface RNSStackAnimationTrackTimingConfig : NSObject

@property (nonatomic, readonly) NSInteger durationMs;
@property (nonatomic, readonly) NSInteger delayMs;
@property (nonatomic, readonly, nullable) RNSStackAnimationEasing *easing;

- (instancetype)initWithDurationMs:(NSInteger)durationMs
                           delayMs:(NSInteger)delayMs
                            easing:(nullable RNSStackAnimationEasing *)easing;

@end

/**
 * One animated property of a custom motion as a `from` / `to` span. An omitted endpoint is the property's rest value,
 * filled in when the motion is resolved; with both omitted the track holds it, which only lengthens the transition.
 */
@interface RNSStackAnimationTrackConfig : NSObject

@property (nonatomic, readonly) RNSStackAnimationTrackTimingConfig *timing;

- (instancetype)initWithTiming:(RNSStackAnimationTrackTimingConfig *)timing;

@end

/**
 * The mapper has checked the range: opacity and dim in [0, 1].
 */
@interface RNSStackAnimationScalarTrackConfig : RNSStackAnimationTrackConfig

@property (nonatomic, readonly, nullable) NSNumber *from;
@property (nonatomic, readonly, nullable) NSNumber *to;

- (instancetype)initWithFrom:(nullable NSNumber *)from
                          to:(nullable NSNumber *)to
                      timing:(RNSStackAnimationTrackTimingConfig *)timing;

@end

/**
 * Lengths the engine resolves against the container. An omitted endpoint is zero.
 */
@interface RNSStackAnimationTranslateTrackConfig : RNSStackAnimationTrackConfig

@property (nonatomic, readonly, nullable) RNSStackAnimationLength *from;
@property (nonatomic, readonly, nullable) RNSStackAnimationLength *to;

- (instancetype)initWithFrom:(nullable RNSStackAnimationLength *)from
                          to:(nullable RNSStackAnimationLength *)to
                      timing:(RNSStackAnimationTrackTimingConfig *)timing;

@end

/**
 * A scrim whose alpha spans `from` to `to`; an omitted endpoint is an absent scrim. A nil `color` is the default one.
 */
@interface RNSStackAnimationDimTrackConfig : RNSStackAnimationScalarTrackConfig

@property (nonatomic, readonly, nullable) UIColor *color;

- (instancetype)initWithColor:(nullable UIColor *)color
                         from:(nullable NSNumber *)from
                           to:(nullable NSNumber *)to
                       timing:(RNSStackAnimationTrackTimingConfig *)timing;

@end

NS_ASSUME_NONNULL_END
