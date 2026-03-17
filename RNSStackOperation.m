#import "RNSStackOperation.h"


@implementation RNSPushOperation

- (instancetype)initWithScreen:(RNSStackScreenComponentView *)screen
{
  if (self = [super init]) {
    _screen = screen;
  }
  return self;
}

@end

@implementation RNSPopOperation

- (instancetype)initWithScreen:(RNSStackScreenComponentView *)screen
{
  if (self = [super init]) {
    _screen = screen;
  }
  return self;
}

@end
