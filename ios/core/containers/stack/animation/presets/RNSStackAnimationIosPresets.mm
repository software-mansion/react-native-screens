#import "RNSStackAnimationIosPresets.h"
#import "RNSStackAnimationEasing.h"
#import "RNSStackAnimationLength.h"
#import "RNSStackAnimationPresetTracks.h"
#import "RNSStackAnimationTrack.h"
#import "RNSStackAnimationTransitionTimeline.h"

// UIKit's push on iOS 18, measured on 18.6 (Apple documents neither value): 350 ms on the curve of
// `kCAMediaTimingFunctionDefault`, which is the `ease` easing. iOS 26 moved the push to a spring, which this table does
// not follow.
static const NSInteger kRNSIosDurationMs = 350;

// The legacy iOS `RNSScreenStackAnimator`: the covered screen recedes `containerWidth * 0.3` under a black shadow view
// of alpha `RNSShadowViewMaxAlpha` (0.1).
static const CGFloat kRNSIosParallaxFraction = 0.3;
static const CGFloat kRNSIosDimAlpha = 0.1;

@implementation RNSStackAnimationIosPresets

+ (RNSStackAnimationTransitionTimeline *)transitionFromEdge:(RNSStackAnimationEdge)edge
                                                       kind:(RNSStackAnimationTransitionKind)kind
{
  BOOL isPush = kind == RNSStackAnimationTransitionKindPush;
  NSArray<RNSStackAnimationTrack *> *movingScreenTracks = @[ [self travelFromEdge:edge fraction:1 appearing:isPush] ];
  NSArray<RNSStackAnimationTrack *> *backgroundTracks = @[
    [self travelFromEdge:edge fraction:kRNSIosParallaxFraction appearing:!isPush],
    [RNSStackAnimationPresetTracks dimTrackFrom:isPush ? 0 : kRNSIosDimAlpha
                                             to:isPush ? kRNSIosDimAlpha : 0
                                     durationMs:kRNSIosDurationMs
                                         easing:[self easing]],
  ];
  return [RNSStackAnimationTransitionTimeline timelineForKind:kind
                                                  enterTracks:isPush ? movingScreenTracks : backgroundTracks
                                                   exitTracks:isPush ? backgroundTracks : movingScreenTracks];
}

+ (RNSStackAnimationEasing *)easing
{
  return [RNSStackAnimationEasing named:RNSStackAnimationEasingNameEase];
}

+ (RNSStackAnimationTrack *)travelFromEdge:(RNSStackAnimationEdge)edge
                                  fraction:(CGFloat)fraction
                                 appearing:(BOOL)isAppearing
{
  return [RNSStackAnimationPresetTracks translationTrackFromEdge:edge
                                                        distance:[RNSStackAnimationLength fraction:fraction]
                                                       appearing:isAppearing
                                                      durationMs:kRNSIosDurationMs
                                                          easing:[self easing]];
}

@end
