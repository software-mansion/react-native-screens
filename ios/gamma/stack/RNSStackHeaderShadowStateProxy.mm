#import "RNSStackHeaderShadowStateProxy.h"

@implementation RNSStackHeaderShadowStateProxy {
  CGRect _previousFrame;
}

- (instancetype)init
{
  if (self = [super init]) {
    [self initState];
  }
  return self;
}

- (void)initState
{
  _previousFrame = CGRectNull;
}

- (BOOL)updateShadowStateWithFrame:(CGRect)frame
{
  if (CGRectEqualToRect(frame, _previousFrame)) {
    return NO;
  }
  _previousFrame = frame;
  return YES;
}

- (void)invalidate
{
  [self initState];
}

@end
