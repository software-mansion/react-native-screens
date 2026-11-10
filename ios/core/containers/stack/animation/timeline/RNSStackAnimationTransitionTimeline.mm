#import "RNSStackAnimationTransitionTimeline.h"

@implementation RNSStackAnimationTransitionTimeline

- (instancetype)initWithStatic:(BOOL)isStatic
{
  if (self = [super init]) {
    _isStatic = isStatic;
  }
  return self;
}

+ (RNSStackAnimationTransitionTimeline *)staticTimeline
{
  static RNSStackAnimationTransitionTimeline *staticTimeline;
  static dispatch_once_t onceToken;
  dispatch_once(&onceToken, ^{
    staticTimeline = [[RNSStackAnimationTransitionTimeline alloc] initWithStatic:YES];
  });
  return staticTimeline;
}

@end
