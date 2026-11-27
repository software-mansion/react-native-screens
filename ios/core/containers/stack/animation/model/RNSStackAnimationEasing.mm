#import "RNSStackAnimationEasing.h"
#import "RNSAssert.h"

// How close x at the solved parameter comes to the progress: a millionth of the track's duration.
static const CGFloat kRNSBezierTolerance = 1e-6;
static const int kRNSBezierMaxIterations = 32;

typedef struct {
  CGFloat x1, y1, x2, y2;
} RNSStackAnimationControlPoints;

@interface RNSStackAnimationNamedEasing ()
- (instancetype)initWithName:(RNSStackAnimationEasingName)name;
@end

@interface RNSStackAnimationBezierEasing ()
- (instancetype)initWithX1:(CGFloat)x1 y1:(CGFloat)y1 x2:(CGFloat)x2 y2:(CGFloat)y2;
+ (CGFloat)valueAt:(CGFloat)progress controlPoints:(RNSStackAnimationControlPoints)points;
@end

// The strings of the `easing` option; keep them in sync with `StackScreenAnimationEasingName` in
// `src/components/stack/screen/animation/types.ts`.
static const struct {
  RNSStackAnimationEasingName name;
  const char *string;
} kRNSStackAnimationEasingNames[] = {
    {RNSStackAnimationEasingNameLinear, "linear"},
    {RNSStackAnimationEasingNameEase, "ease"},
    {RNSStackAnimationEasingNameEaseIn, "easeIn"},
    {RNSStackAnimationEasingNameEaseOut, "easeOut"},
    {RNSStackAnimationEasingNameEaseInOut, "easeInOut"},
    {RNSStackAnimationEasingNameStandard, "standard"},
    {RNSStackAnimationEasingNameStandardAccelerate, "standardAccelerate"},
    {RNSStackAnimationEasingNameStandardDecelerate, "standardDecelerate"},
    {RNSStackAnimationEasingNameEmphasized, "emphasized"},
    {RNSStackAnimationEasingNameEmphasizedAccelerate, "emphasizedAccelerate"},
    {RNSStackAnimationEasingNameEmphasizedDecelerate, "emphasizedDecelerate"},
    {RNSStackAnimationEasingNameAccelerateDecelerate, "accelerateDecelerate"},
    {RNSStackAnimationEasingNameAccelerateQuint, "accelerateQuint"},
    {RNSStackAnimationEasingNameDecelerateQuint, "decelerateQuint"},
};

// CSS Easing Functions Level 1, the `ease` / `ease-in` / `ease-out` / `ease-in-out` keywords:
// https://www.w3.org/TR/css-easing-1/#cubic-bezier-easing-functions
// `ease` is also `kCAMediaTimingFunctionDefault`, whose control points
// `-[CAMediaTimingFunction getControlPointAtIndex:values:]` returns as (0.25, 0.1) and (0.25, 1).
static const RNSStackAnimationControlPoints kRNSEase = {0.25, 0.1, 0.25, 1};
static const RNSStackAnimationControlPoints kRNSEaseIn = {0.42, 0, 1, 1};
static const RNSStackAnimationControlPoints kRNSEaseOut = {0, 0, 0.58, 1};
static const RNSStackAnimationControlPoints kRNSEaseInOut = {0.42, 0, 0.58, 1};
// Material 3 easing tokens: https://m3.material.io/styles/motion/easing-and-duration/tokens-specs
static const RNSStackAnimationControlPoints kRNSStandard = {0.2, 0, 0, 1};
static const RNSStackAnimationControlPoints kRNSStandardAccelerate = {0.3, 0, 1, 1};
static const RNSStackAnimationControlPoints kRNSStandardDecelerate = {0, 0, 0, 1};
// The two halves of the `emphasized` path `M 0,0 C 0.05,0 0.133333,0.06 0.166666,0.4 C 0.208333,0.82 0.25,1 1,1`,
// each normalized to the unit square; the token page lists the same values under the two names.
static const RNSStackAnimationControlPoints kRNSEmphasizedAccelerate = {0.3, 0, 0.8, 0.15};
static const RNSStackAnimationControlPoints kRNSEmphasizedDecelerate = {0.05, 0.7, 0.1, 1};
static const CGPoint kRNSEmphasizedJoin = {1.0 / 6, 0.4};

@implementation RNSStackAnimationEasing

+ (RNSStackAnimationEasing *)named:(RNSStackAnimationEasingName)name
{
  return [[RNSStackAnimationNamedEasing alloc] initWithName:name];
}

+ (RNSStackAnimationEasing *)bezierWithX1:(CGFloat)x1 y1:(CGFloat)y1 x2:(CGFloat)x2 y2:(CGFloat)y2
{
  return [[RNSStackAnimationBezierEasing alloc] initWithX1:x1 y1:y1 x2:x2 y2:y2];
}

+ (nullable RNSStackAnimationEasing *)easingNamed:(NSString *)string
{
  for (const auto &entry : kRNSStackAnimationEasingNames) {
    if (strcmp(entry.string, string.UTF8String) == 0) {
      return [self named:entry.name];
    }
  }
  return nil;
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
    case RNSStackAnimationEasingNameEase:
      return [RNSStackAnimationBezierEasing valueAt:progress controlPoints:kRNSEase];
    case RNSStackAnimationEasingNameEaseIn:
      return [RNSStackAnimationBezierEasing valueAt:progress controlPoints:kRNSEaseIn];
    case RNSStackAnimationEasingNameEaseOut:
      return [RNSStackAnimationBezierEasing valueAt:progress controlPoints:kRNSEaseOut];
    case RNSStackAnimationEasingNameEaseInOut:
      return [RNSStackAnimationBezierEasing valueAt:progress controlPoints:kRNSEaseInOut];
    case RNSStackAnimationEasingNameStandard:
      return [RNSStackAnimationBezierEasing valueAt:progress controlPoints:kRNSStandard];
    case RNSStackAnimationEasingNameStandardAccelerate:
      return [RNSStackAnimationBezierEasing valueAt:progress controlPoints:kRNSStandardAccelerate];
    case RNSStackAnimationEasingNameStandardDecelerate:
      return [RNSStackAnimationBezierEasing valueAt:progress controlPoints:kRNSStandardDecelerate];
    case RNSStackAnimationEasingNameEmphasized:
      return [RNSStackAnimationNamedEasing emphasizedValueAt:progress];
    case RNSStackAnimationEasingNameEmphasizedAccelerate:
      return [RNSStackAnimationBezierEasing valueAt:progress controlPoints:kRNSEmphasizedAccelerate];
    case RNSStackAnimationEasingNameEmphasizedDecelerate:
      return [RNSStackAnimationBezierEasing valueAt:progress controlPoints:kRNSEmphasizedDecelerate];
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

// Two cubic segments joined at `kRNSEmphasizedJoin`, each the normalized curve of the matching token.
+ (CGFloat)emphasizedValueAt:(CGFloat)progress
{
  if (progress < kRNSEmphasizedJoin.x) {
    return kRNSEmphasizedJoin.y *
        [RNSStackAnimationBezierEasing valueAt:progress / kRNSEmphasizedJoin.x controlPoints:kRNSEmphasizedAccelerate];
  }
  CGFloat segmentProgress = (progress - kRNSEmphasizedJoin.x) / (1 - kRNSEmphasizedJoin.x);
  return kRNSEmphasizedJoin.y +
      (1 - kRNSEmphasizedJoin.y) *
      [RNSStackAnimationBezierEasing valueAt:segmentProgress controlPoints:kRNSEmphasizedDecelerate];
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

- (CGFloat)valueAt:(CGFloat)progress
{
  RNSStackAnimationControlPoints points = {_x1, _y1, _x2, _y2};
  return [RNSStackAnimationBezierEasing valueAt:progress controlPoints:points];
}

// The output is y at the parameter where x equals the progress, found by Newton's method with a bisection fallback.
// Core Animation and UIKit expose a cubic timing curve's control points only, not its value at a time.
// https://www.w3.org/TR/css-easing-1/#cubic-bezier-easing-functions
+ (CGFloat)valueAt:(CGFloat)progress controlPoints:(RNSStackAnimationControlPoints)points
{
  CGFloat low = 0;
  CGFloat high = 1;
  CGFloat s = progress;
  for (int i = 0; i < kRNSBezierMaxIterations; i++) {
    CGFloat error = [self coordinateAt:s c1:points.x1 c2:points.x2] - progress;
    if (fabs(error) < kRNSBezierTolerance) {
      break;
    }
    if (error < 0) {
      low = s;
    } else {
      high = s;
    }
    CGFloat next = s - error / [self slopeAt:s c1:points.x1 c2:points.x2];
    s = next > low && next < high ? next : (low + high) / 2;
  }
  return [self coordinateAt:s c1:points.y1 c2:points.y2];
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
