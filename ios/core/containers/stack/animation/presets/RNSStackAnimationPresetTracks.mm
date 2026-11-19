#import "RNSStackAnimationPresetTracks.h"
#import "RNSStackAnimationLength.h"
#import "RNSStackAnimationTiming.h"
#import "RNSStackAnimationTrack.h"

@implementation RNSStackAnimationPresetTracks

+ (UIColor *)defaultDimColor
{
  return UIColor.blackColor;
}

+ (RNSStackAnimationTranslateTrack *)translationTrackFromEdge:(RNSStackAnimationEdge)edge
                                                     distance:(RNSStackAnimationLength *)distance
                                                    appearing:(BOOL)isAppearing
                                                   durationMs:(NSInteger)durationMs
                                                       easing:(RNSStackAnimationEasing *)easing
{
  RNSStackAnimationAxis axis = RNSStackAnimationAxisX;
  BOOL isTowardPositive = NO;
  switch (edge) {
    case RNSStackAnimationEdgeLeft:
      break;
    case RNSStackAnimationEdgeRight:
      isTowardPositive = YES;
      break;
    case RNSStackAnimationEdgeTop:
      axis = RNSStackAnimationAxisY;
      break;
    case RNSStackAnimationEdgeBottom:
      axis = RNSStackAnimationAxisY;
      isTowardPositive = YES;
      break;
    case RNSStackAnimationEdgeLeading:
      axis = RNSStackAnimationAxisLogicalX;
      break;
    case RNSStackAnimationEdgeTrailing:
      axis = RNSStackAnimationAxisLogicalX;
      isTowardPositive = YES;
      break;
  }
  RNSStackAnimationLength *towardEdge = isTowardPositive ? distance : [distance negated];
  RNSStackAnimationLength *rest = RNSStackAnimationLength.zero;
  return [[RNSStackAnimationTranslateTrack alloc]
      initWithAxis:axis
              from:isAppearing ? towardEdge : rest
                to:isAppearing ? rest : [towardEdge negated]
            timing:[[RNSStackAnimationTiming alloc] initWithStartMs:0 durationMs:durationMs easing:easing]];
}

+ (RNSStackAnimationPropertyTrack *)opacityTrackFrom:(CGFloat)from
                                                  to:(CGFloat)to
                                             startMs:(NSInteger)startMs
                                          durationMs:(NSInteger)durationMs
                                              easing:(RNSStackAnimationEasing *)easing
{
  return [[RNSStackAnimationPropertyTrack alloc]
      initWithViewProperty:RNSStackAnimationViewPropertyOpacity
                      from:from
                        to:to
                    timing:[[RNSStackAnimationTiming alloc] initWithStartMs:startMs
                                                                 durationMs:durationMs
                                                                     easing:easing]];
}

+ (RNSStackAnimationDimTrack *)dimTrackFrom:(CGFloat)from
                                         to:(CGFloat)to
                                 durationMs:(NSInteger)durationMs
                                     easing:(RNSStackAnimationEasing *)easing
{
  return [[RNSStackAnimationDimTrack alloc] initWithColor:self.defaultDimColor
                                                     from:from
                                                       to:to
                                                   timing:[[RNSStackAnimationTiming alloc] initWithStartMs:0
                                                                                                durationMs:durationMs
                                                                                                    easing:easing]];
}

@end
