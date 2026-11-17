#import "RNSStackOperation.h"
#import "RNSAssert.h"

@implementation RNSStackOperation

- (instancetype)initWithScreenController:(nonnull RNSStackScreenController *)screenController
{
  RNSAssert(screenController != nil, @"[RNScreens] Expected nonnull screenController!");
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
