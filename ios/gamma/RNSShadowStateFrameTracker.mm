#import "RNSShadowStateFrameTracker.h"

@implementation RNSShadowStateFrameTracker {
  CGRect _lastReportedFrame;
}

- (instancetype)init
{
  if (self = [super init]) {
    _lastReportedFrame = CGRectNull;
  }
  return self;
}

- (BOOL)updateFrameIfNeeded:(CGRect)newFrame
{
  if (CGRectEqualToRect(newFrame, _lastReportedFrame)) {
    return NO;
  }
  _lastReportedFrame = newFrame;
  return YES;
}

- (void)reset
{
  _lastReportedFrame = CGRectNull;
}

@end
