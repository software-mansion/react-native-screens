#import "RNSStackAnimationEasing.h"
#import "RNSAssert.h"

// How close x at the solved parameter comes to the progress: a millionth of the track's duration.
static const CGFloat kRNSBezierTolerance = 1e-6;
static const int kRNSBezierMaxIterations = 32;

@interface RNSStackAnimationNamedEasing ()
- (instancetype)initWithName:(RNSStackAnimationEasingName)name;
@end

@interface RNSStackAnimationBezierEasing ()
- (instancetype)initWithX1:(CGFloat)x1 y1:(CGFloat)y1 x2:(CGFloat)x2 y2:(CGFloat)y2;
@end

@implementation RNSStackAnimationEasing

+ (RNSStackAnimationEasing *)named:(RNSStackAnimationEasingName)name
{
  return [[RNSStackAnimationNamedEasing alloc] initWithName:name];
}

+ (RNSStackAnimationEasing *)bezierWithX1:(CGFloat)x1 y1:(CGFloat)y1 x2:(CGFloat)x2 y2:(CGFloat)y2
{
  return [[RNSStackAnimationBezierEasing alloc] initWithX1:x1 y1:y1 x2:x2 y2:y2];
}

- (CGFloat)valueAt:(CGFloat)progress
{
  [self doesNotRecognizeSelector:_cmd];
  return progress;
}

@end

@implementation RNSStackAnimationNamedEasing

- (instancetype)initWithName:(RNSStackAnimationEasingName)name
{
  if (self = [super init]) {
    _name = name;
  }
  return self;
}

- (CGFloat)valueAt:(CGFloat)progress
{
  switch (_name) {
    case RNSStackAnimationEasingNameLinear:
      return progress;
    case RNSStackAnimationEasingNameAccelerateDecelerate:
      // AOSP `AccelerateDecelerateInterpolator.getInterpolation`, the curve of
      // `@android:interpolator/accelerate_decelerate`:
      // https://android.googlesource.com/platform/frameworks/base/+/refs/heads/main/core/java/android/view/animation/AccelerateDecelerateInterpolator.java
      return cos((progress + 1) * M_PI) / 2 + 0.5;
    case RNSStackAnimationEasingNameAccelerateQuint:
      // `@android:interpolator/accelerate_quint`: AOSP `AccelerateInterpolator` with factor 2.5, `t ^ (2 * factor)`:
      // https://android.googlesource.com/platform/frameworks/base/+/refs/heads/main/core/java/android/view/animation/AccelerateInterpolator.java
      return pow(progress, 5);
    case RNSStackAnimationEasingNameDecelerateQuint:
      // `@android:interpolator/decelerate_quint`: AOSP `DecelerateInterpolator` with factor 2.5,
      // `1 - (1 - t) ^ (2 * factor)`:
      // https://android.googlesource.com/platform/frameworks/base/+/refs/heads/main/core/java/android/view/animation/DecelerateInterpolator.java
      return 1 - pow(1 - progress, 5);
  }
}

@end

@implementation RNSStackAnimationBezierEasing

- (instancetype)initWithX1:(CGFloat)x1 y1:(CGFloat)y1 x2:(CGFloat)x2 y2:(CGFloat)y2
{
  RNSAssert(x1 >= 0 && x1 <= 1 && x2 >= 0 && x2 <= 1, @"[RNScreens] A bezier easing needs x1 and x2 in [0, 1].");
  if (self = [super init]) {
    _x1 = x1;
    _y1 = y1;
    _x2 = x2;
    _y2 = y2;
  }
  return self;
}

// The output is y at the parameter where x equals the progress, found by Newton's method with a bisection fallback.
// Core Animation and UIKit expose a cubic timing curve's control points only, not its value at a time.
// https://www.w3.org/TR/css-easing-1/#cubic-bezier-easing-functions
- (CGFloat)valueAt:(CGFloat)progress
{
  CGFloat low = 0;
  CGFloat high = 1;
  CGFloat s = progress;
  for (int i = 0; i < kRNSBezierMaxIterations; i++) {
    CGFloat error = [RNSStackAnimationBezierEasing coordinateAt:s c1:_x1 c2:_x2] - progress;
    if (fabs(error) < kRNSBezierTolerance) {
      break;
    }
    if (error < 0) {
      low = s;
    } else {
      high = s;
    }
    CGFloat next = s - error / [RNSStackAnimationBezierEasing slopeAt:s c1:_x1 c2:_x2];
    s = next > low && next < high ? next : (low + high) / 2;
  }
  return [RNSStackAnimationBezierEasing coordinateAt:s c1:_y1 c2:_y2];
}

// One coordinate of the curve at parameter `s`, with the end points 0 and 1 and the control points' `c1` and `c2`:
// `3 (1 - s)^2 s c1 + 3 (1 - s) s^2 c2 + s^3`, in Horner form.
+ (CGFloat)coordinateAt:(CGFloat)s c1:(CGFloat)c1 c2:(CGFloat)c2
{
  return ((1 + 3 * c1 - 3 * c2) * s + 3 * c2 - 6 * c1) * s * s + 3 * c1 * s;
}

+ (CGFloat)slopeAt:(CGFloat)s c1:(CGFloat)c1 c2:(CGFloat)c2
{
  return (3 * (1 + 3 * c1 - 3 * c2) * s + 2 * (3 * c2 - 6 * c1)) * s + 3 * c1;
}

@end
