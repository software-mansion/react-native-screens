#import "RNSStackOperation.h"
#import <React/RCTAssert.h>

@implementation RNSStackOperation

- (instancetype)initWithScreenController:(nonnull RNSStackScreenController *)screenController
{
  RCTAssert(screenController != nil, @"[RNScreens] Expected nonnull screenController!");
  if (self = [super init]) {
    _screenController = screenController;
  }
  return self;
}

@end

@implementation RNSPushOperation
@end

@implementation RNSPopOperation
@end
