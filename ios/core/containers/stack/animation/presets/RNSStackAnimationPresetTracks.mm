#import "RNSStackAnimationPresetTracks.h"
#import "RNSStackAnimationLength.h"
#import "RNSStackAnimationTiming.h"
#import "RNSStackAnimationTrack.h"

@implementation RNSStackAnimationPresetTracks

+ (RNSStackAnimationTranslateTrack *)translationTrackFromEdge:(RNSStackAnimationEdge)edge
                                                     distance:(RNSStackAnimationLength *)distance
                                                    appearing:(BOOL)isAppearing
                                                   durationMs:(NSInteger)durationMs
                                                       easing:(RNSStackAnimationEasing *)easing
{
  BOOL isHorizontal = edge == RNSStackAnimationEdgeLeft || edge == RNSStackAnimationEdgeRight;
  BOOL isTowardPositive = edge == RNSStackAnimationEdgeRight || edge == RNSStackAnimationEdgeBottom;
  RNSStackAnimationLength *towardEdge = isTowardPositive ? distance : [distance negated];
  RNSStackAnimationLength *rest = RNSStackAnimationLength.zero;
  return [[RNSStackAnimationTranslateTrack alloc]
      initWithAxis:isHorizontal ? RNSStackAnimationAxisX : RNSStackAnimationAxisY
              from:isAppearing ? towardEdge : rest
                to:isAppearing ? rest : [towardEdge negated]
            timing:[[RNSStackAnimationTiming alloc] initWithStartMs:0 durationMs:durationMs easing:easing]];
}

+ (RNSStackAnimationPropertyTrack *)opacityTrackFrom:(CGFloat)from
                                                  to:(CGFloat)to
                                          durationMs:(NSInteger)durationMs
                                              easing:(RNSStackAnimationEasing *)easing
{
  return [[RNSStackAnimationPropertyTrack alloc]
      initWithViewProperty:RNSStackAnimationViewPropertyOpacity
                      from:from
                        to:to
                    timing:[[RNSStackAnimationTiming alloc] initWithStartMs:0 durationMs:durationMs easing:easing]];
}

@end
