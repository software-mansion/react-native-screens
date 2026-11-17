#import "RNSStackAnimationTrackConfig.h"

@implementation RNSStackAnimationTrackTimingConfig

- (instancetype)initWithDurationMs:(NSInteger)durationMs
                           delayMs:(NSInteger)delayMs
                            easing:(nullable RNSStackAnimationEasing *)easing
{
  if (self = [super init]) {
    _durationMs = durationMs;
    _delayMs = delayMs;
    _easing = easing;
  }
  return self;
}

@end

@implementation RNSStackAnimationTrackConfig

- (instancetype)initWithTiming:(RNSStackAnimationTrackTimingConfig *)timing
{
  if (self = [super init]) {
    _timing = timing;
  }
  return self;
}

@end

@implementation RNSStackAnimationScalarTrackConfig

- (instancetype)initWithFrom:(nullable NSNumber *)from
                          to:(nullable NSNumber *)to
                      timing:(RNSStackAnimationTrackTimingConfig *)timing
{
  if (self = [super initWithTiming:timing]) {
    _from = from;
    _to = to;
  }
  return self;
}

@end

@implementation RNSStackAnimationTranslateTrackConfig

- (instancetype)initWithFrom:(nullable RNSStackAnimationLength *)from
                          to:(nullable RNSStackAnimationLength *)to
                      timing:(RNSStackAnimationTrackTimingConfig *)timing
{
  if (self = [super initWithTiming:timing]) {
    _from = from;
    _to = to;
  }
  return self;
}

@end

@implementation RNSStackAnimationDimTrackConfig

- (instancetype)initWithColor:(nullable UIColor *)color
                         from:(nullable NSNumber *)from
                           to:(nullable NSNumber *)to
                       timing:(RNSStackAnimationTrackTimingConfig *)timing
{
  if (self = [super initWithFrom:from to:to timing:timing]) {
    _color = color;
  }
  return self;
}

@end
