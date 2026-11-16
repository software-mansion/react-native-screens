#import "RNSStackAnimationCustomTransitionConfig.h"

@implementation RNSStackAnimationCustomTransitionConfig

- (instancetype)initWithEnter:(id<RNSStackAnimationMotionConfig>)enter exit:(id<RNSStackAnimationMotionConfig>)exit
{
  if (self = [super init]) {
    _enter = enter;
    _exit = exit;
  }
  return self;
}

@end
