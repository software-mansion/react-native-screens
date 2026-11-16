#pragma once

#import <CoreGraphics/CoreGraphics.h>
#import <Foundation/Foundation.h>

NS_ASSUME_NONNULL_BEGIN

typedef NS_ENUM(NSInteger, RNSStackAnimationEasingName) {
  RNSStackAnimationEasingNameLinear,
  RNSStackAnimationEasingNameEaseIn,
  RNSStackAnimationEasingNameEaseOut,
  RNSStackAnimationEasingNameEaseInOut,
  RNSStackAnimationEasingNameStandard,
  RNSStackAnimationEasingNameStandardAccelerate,
  RNSStackAnimationEasingNameStandardDecelerate,
  RNSStackAnimationEasingNameEmphasized,
  RNSStackAnimationEasingNameEmphasizedAccelerate,
  RNSStackAnimationEasingNameEmphasizedDecelerate,
  // Curves of the preset tables only; the `easing` option has no string for them.
  RNSStackAnimationEasingNameAccelerateDecelerate,
  RNSStackAnimationEasingNameAccelerateQuint,
  RNSStackAnimationEasingNameDecelerateQuint,
};

/**
 * A curve mapping a track's linear progress to its eased progress: a named curve or a cubic bezier.
 */
@interface RNSStackAnimationEasing : NSObject

+ (RNSStackAnimationEasing *)named:(RNSStackAnimationEasingName)name;

/**
 * The curve named `string` in the `easing` option, nil for any other string.
 */
+ (nullable RNSStackAnimationEasing *)easingNamed:(NSString *)string;

/**
 * The cubic bezier from (0, 0) to (1, 1) with control points (x1, y1) and (x2, y2); x1 and x2 must be in [0, 1], so
 * that the curve is a function of time.
 */
+ (RNSStackAnimationEasing *)bezierWithX1:(CGFloat)x1 y1:(CGFloat)y1 x2:(CGFloat)x2 y2:(CGFloat)y2;

/**
 * Eased progress for a linear progress in [0, 1].
 */
- (CGFloat)valueAt:(CGFloat)progress;

@end

@interface RNSStackAnimationNamedEasing : RNSStackAnimationEasing

@property (nonatomic, readonly) RNSStackAnimationEasingName name;

@end

@interface RNSStackAnimationBezierEasing : RNSStackAnimationEasing

@property (nonatomic, readonly) CGFloat x1;
@property (nonatomic, readonly) CGFloat y1;
@property (nonatomic, readonly) CGFloat x2;
@property (nonatomic, readonly) CGFloat y2;

@end

NS_ASSUME_NONNULL_END
