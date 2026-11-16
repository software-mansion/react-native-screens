#import "RNSStackAnimationCustomConfig.h"

@implementation RNSStackAnimationCustomConfig

- (instancetype)initWithPush:(id<RNSStackAnimationTransitionConfig>)push pop:(id<RNSStackAnimationTransitionConfig>)pop
{
  if (self = [super init]) {
    _push = push;
    _pop = pop;
  }
  return self;
}

@end
