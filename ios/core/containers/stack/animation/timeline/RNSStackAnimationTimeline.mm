#import "RNSStackAnimationTimeline.h"
#import "RNSStackAnimationTransitionTimeline.h"

@implementation RNSStackAnimationTimeline

- (instancetype)initWithPush:(RNSStackAnimationTransitionTimeline *)push pop:(RNSStackAnimationTransitionTimeline *)pop
{
  if (self = [super init]) {
    _push = push;
    _pop = pop;
  }
  return self;
}

- (RNSStackAnimationTransitionTimeline *)transitionForKind:(RNSStackAnimationTransitionKind)kind
{
  return kind == RNSStackAnimationTransitionKindPush ? _push : _pop;
}

- (instancetype)retimedTo:(NSInteger)durationMs
{
  double factor = static_cast<double>(durationMs) / MAX(_push.durationMs, _pop.durationMs);
  return [[[self class] alloc] initWithPush:[_push scaledBy:factor] pop:[_pop scaledBy:factor]];
}

- (instancetype)withEasing:(RNSStackAnimationEasing *)easing
{
  return [[[self class] alloc] initWithPush:[_push withEasing:easing] pop:[_pop withEasing:easing]];
}

@end
