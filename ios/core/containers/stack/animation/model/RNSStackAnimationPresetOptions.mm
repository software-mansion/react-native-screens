#import "RNSStackAnimationPresetOptions.h"

@implementation RNSStackAnimationPresetOptions

- (instancetype)initWithDurationMs:(nullable NSNumber *)durationMs
                            easing:(nullable RNSStackAnimationEasing *)easing
                          distance:(nullable RNSStackAnimationLength *)distance
{
  if (self = [super init]) {
    _durationMs = durationMs;
    _easing = easing;
    _distance = distance;
  }
  return self;
}

+ (RNSStackAnimationPresetOptions *)none
{
  static RNSStackAnimationPresetOptions *none;
  static dispatch_once_t onceToken;
  dispatch_once(&onceToken, ^{
    none = [[RNSStackAnimationPresetOptions alloc] initWithDurationMs:nil easing:nil distance:nil];
  });
  return none;
}

@end
