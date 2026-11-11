#import "RNSStackAnimationEasing.h"

@implementation RNSStackAnimationEasing

- (instancetype)initWithName:(RNSStackAnimationEasingName)name
{
  if (self = [super init]) {
    _name = name;
  }
  return self;
}

+ (instancetype)named:(RNSStackAnimationEasingName)name
{
  return [[self alloc] initWithName:name];
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
  }
}

@end
