#import "RNSStackAnimationMotionTimeline.h"
#import "RNSAssert.h"
#import "RNSStackAnimationTiming.h"
#import "RNSStackAnimationTrack.h"

@implementation RNSStackAnimationMotionTimeline

- (instancetype)initWithTracks:(NSArray<RNSStackAnimationTrack *> *)tracks durationMs:(NSInteger)durationMs
{
  if (self = [super init]) {
    _tracks = [tracks copy];
    _durationMs = durationMs;
  }
  return self;
}

+ (instancetype)timelineSpanning:(NSInteger)durationMs tracks:(NSArray<RNSStackAnimationTrack *> *)tracks
{
  for (RNSStackAnimationTrack *track in tracks) {
    RNSAssert(track.timing.endMs <= durationMs, @"[RNScreens] A track cannot end after its motion timeline.");
  }
  return [[self alloc] initWithTracks:tracks durationMs:durationMs];
}

@end
