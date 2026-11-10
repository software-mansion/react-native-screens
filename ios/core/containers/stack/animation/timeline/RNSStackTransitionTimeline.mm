#import "RNSStackTransitionTimeline.h"

@implementation RNSStackTransitionTimeline

- (instancetype)initWithStatic:(BOOL)isStatic
{
  if (self = [super init]) {
    _isStatic = isStatic;
  }
  return self;
}

+ (RNSStackTransitionTimeline *)staticTimeline
{
  static RNSStackTransitionTimeline *staticTimeline;
  static dispatch_once_t onceToken;
  dispatch_once(&onceToken, ^{
    staticTimeline = [[RNSStackTransitionTimeline alloc] initWithStatic:YES];
  });
  return staticTimeline;
}

@end
