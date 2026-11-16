#import "RNSStackAnimationTransitionTimeline.h"
#import "RNSStackAnimationMotionTimeline.h"
#import "RNSStackAnimationTiming.h"
#import "RNSStackAnimationTrack.h"

// Scaling rounds each track on its own, so a short transition can round every track to 0 ms; a 0 ms animator would
// end the transition before UIKit updates the navigation bar (the reason `RNSStackNoneAnimator` lasts 1 ms).
static const NSInteger kRNSMinDurationMs = 1;

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
  return [self timelineWithEnterTracks:enterTracks
                            exitTracks:exitTracks
                            exitZOrder:kind == RNSStackAnimationTransitionKindPush ? RNSStackAnimationZOrderUnder
                                                                                   : RNSStackAnimationZOrderOver];
}

- (instancetype)scaledBy:(double)factor
{
  if (self.isStatic) {
    return self;
  }
  return [[self class] timelineWithEnterTracks:[RNSStackAnimationTrack tracks:_enter.tracks scaledBy:factor]
                                    exitTracks:[RNSStackAnimationTrack tracks:_exit.tracks scaledBy:factor]
                                    exitZOrder:_exitZOrder];
}

- (instancetype)retimedTo:(NSInteger)durationMs
{
  return [self scaledBy:durationMs / static_cast<double>(self.durationMs)];
}

- (instancetype)withEasing:(RNSStackAnimationEasing *)easing
{
  if (self.isStatic) {
    return self;
  }
  return [[self class] timelineWithEnterTracks:[RNSStackAnimationTrack tracks:_enter.tracks withEasing:easing]
                                    exitTracks:[RNSStackAnimationTrack tracks:_exit.tracks withEasing:easing]
                                    exitZOrder:_exitZOrder];
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

+ (instancetype)timelineWithEnterTracks:(NSArray<RNSStackAnimationTrack *> *)enterTracks
                             exitTracks:(NSArray<RNSStackAnimationTrack *> *)exitTracks
                             exitZOrder:(RNSStackAnimationZOrder)exitZOrder
{
  NSArray<RNSStackAnimationTrack *> *tracks = [enterTracks arrayByAddingObjectsFromArray:exitTracks];
  NSInteger durationMs = 0;
  for (RNSStackAnimationTrack *track in tracks) {
    durationMs = MAX(durationMs, track.timing.endMs);
  }
  if (tracks.count > 0) {
    durationMs = MAX(durationMs, kRNSMinDurationMs);
  }
  return [[self alloc] initWithEnter:[RNSStackAnimationMotionTimeline timelineSpanning:durationMs tracks:enterTracks]
                                exit:[RNSStackAnimationMotionTimeline timelineSpanning:durationMs tracks:exitTracks]
                          exitZOrder:exitZOrder];
}

@end
