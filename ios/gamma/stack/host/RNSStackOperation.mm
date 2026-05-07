#import "RNSStackOperation.h"
#import <React/RCTAssert.h>

@implementation RNSStackOperation

- (instancetype)initWithScreen:(nonnull RNSStackScreenComponentView *)stackScreen
{
  RCTAssert(stackScreen != nil, @"[RNScreens] Expected nonnull stackScreen!");
  if (self = [super init]) {
    _stackScreen = stackScreen;
  }
  return self;
}

@end

@implementation RNSPushOperation
@end

@implementation RNSPopOperation
@end
