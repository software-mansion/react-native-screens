#import "RNSStackAnimationTiming.h"
#import "RNSAssert.h"
#import "RNSStackAnimationEasing.h"

@implementation RNSStackAnimationTiming

- (instancetype)initWithStartMs:(NSInteger)startMs
                     durationMs:(NSInteger)durationMs
                         easing:(RNSStackAnimationEasing *)easing
{
  RNSAssert(startMs >= 0 && durationMs >= 0, @"[RNScreens] A track cannot start or last a negative time.");
  if (self = [super init]) {
    _startMs = startMs;
    _durationMs = durationMs;
    _easing = easing;
  }
  return self;
}

- (NSInteger)endMs
{
  return _startMs + _durationMs;
}

- (CGFloat)progressAtMs:(double)timeMs
{
  CGFloat linearProgress;
  if (_durationMs == 0) {
    linearProgress = timeMs < _startMs ? 0 : 1;
  } else {
    linearProgress = MIN(MAX((timeMs - _startMs) / _durationMs, 0.0), 1.0);
  }
  return [_easing valueAt:linearProgress];
}

@end
