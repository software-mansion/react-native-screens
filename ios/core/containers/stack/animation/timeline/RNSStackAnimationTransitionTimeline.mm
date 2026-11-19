#import "RNSStackAnimationTransitionTimeline.h"
#import "RNSStackAnimationMotionTimeline.h"
#import "RNSStackAnimationTiming.h"
#import "RNSStackAnimationTrack.h"

@implementation RNSStackAnimationTransitionTimeline

- (instancetype)initWithEnter:(RNSStackAnimationMotionTimeline *)enter
                         exit:(RNSStackAnimationMotionTimeline *)exit
                   exitZOrder:(RNSStackAnimationZOrder)exitZOrder
{
  if (self = [super init]) {
    _enter = enter;
    _exit = exit;
    _exitZOrder = exitZOrder;
  }
  return self;
}

+ (instancetype)timelineForKind:(RNSStackAnimationTransitionKind)kind
                    enterTracks:(NSArray<RNSStackAnimationTrack *> *)enterTracks
                     exitTracks:(NSArray<RNSStackAnimationTrack *> *)exitTracks
{
  NSInteger durationMs = 0;
  for (RNSStackAnimationTrack *track in [enterTracks arrayByAddingObjectsFromArray:exitTracks]) {
    durationMs = MAX(durationMs, track.timing.endMs);
  }
  RNSStackAnimationZOrder exitZOrder =
      kind == RNSStackAnimationTransitionKindPush ? RNSStackAnimationZOrderUnder : RNSStackAnimationZOrderOver;
  return [[self alloc] initWithEnter:[RNSStackAnimationMotionTimeline timelineSpanning:durationMs tracks:enterTracks]
                                exit:[RNSStackAnimationMotionTimeline timelineSpanning:durationMs tracks:exitTracks]
                          exitZOrder:exitZOrder];
}

- (NSInteger)durationMs
{
  return MAX(_enter.durationMs, _exit.durationMs);
}

- (BOOL)isStatic
{
  return self.durationMs == 0;
}

+ (RNSStackAnimationTransitionTimeline *)staticTimeline
{
  static RNSStackAnimationTransitionTimeline *staticTimeline;
  static dispatch_once_t onceToken;
  dispatch_once(&onceToken, ^{
    staticTimeline = [RNSStackAnimationTransitionTimeline timelineForKind:RNSStackAnimationTransitionKindPush
                                                              enterTracks:@[]
                                                               exitTracks:@[]];
  });
  return staticTimeline;
}

@end
