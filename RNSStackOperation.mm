#import "RNSStackOperation.h"


@implementation RNSPushOperation

- (instancetype)initWithScreen:(nonnull RNSStackScreenComponentView *)stackScreen
{
  if (self = [super init]) {
    _stackScreen = stackScreen;
  }
  return self;
}

@end

@implementation RNSPopOperation

- (instancetype)initWithScreen:(nonnull RNSStackScreenComponentView *)stackScreen
{
  if (self = [super init]) {
    _stackScreen = stackScreen;
  }
  return self;
}

@end
