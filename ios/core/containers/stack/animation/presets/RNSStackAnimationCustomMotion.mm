#import "RNSStackAnimationCustomMotion.h"
#import "RNSStackAnimationCustomMotionConfig.h"
#import "RNSStackAnimationEasing.h"
#import "RNSStackAnimationLength.h"
#import "RNSStackAnimationPresetTracks.h"
#import "RNSStackAnimationTiming.h"
#import "RNSStackAnimationTrack.h"
#import "RNSStackAnimationTrackConfig.h"

@implementation RNSStackAnimationCustomMotion

+ (NSArray<RNSStackAnimationTrack *> *)tracksForConfig:(RNSStackAnimationCustomMotionConfig *)config
{
  NSMutableArray<RNSStackAnimationTrack *> *tracks = [NSMutableArray new];
  if (config.translateX != nil) {
    [tracks addObject:[self translateTrack:config.translateX axis:RNSStackAnimationAxisX]];
  }
  if (config.translateY != nil) {
    [tracks addObject:[self translateTrack:config.translateY axis:RNSStackAnimationAxisY]];
  }
  if (config.opacity != nil) {
    [tracks addObject:[self propertyTrack:config.opacity property:RNSStackAnimationViewPropertyOpacity]];
  }
  [tracks addObjectsFromArray:[self scaleTracksForScale:config.scale scaleX:config.scaleX scaleY:config.scaleY]];
  if (config.rotate != nil) {
    [tracks addObject:[self propertyTrack:config.rotate property:RNSStackAnimationViewPropertyRotate]];
  }
  if (config.dim != nil) {
    [tracks addObject:[self dimTrack:config.dim]];
  }
  return tracks;
}

// `scaleX` / `scaleY` replace the matching axis of `scale`; an axis they leave out keeps it.
+ (NSArray<RNSStackAnimationTrack *> *)scaleTracksForScale:(nullable RNSStackAnimationScalarTrackConfig *)scale
                                                    scaleX:(nullable RNSStackAnimationScalarTrackConfig *)scaleX
                                                    scaleY:(nullable RNSStackAnimationScalarTrackConfig *)scaleY
{
  if (scale == nil) {
    NSMutableArray<RNSStackAnimationTrack *> *tracks = [NSMutableArray new];
    if (scaleX != nil) {
      [tracks addObject:[self propertyTrack:scaleX property:RNSStackAnimationViewPropertyScaleX]];
    }
    if (scaleY != nil) {
      [tracks addObject:[self propertyTrack:scaleY property:RNSStackAnimationViewPropertyScaleY]];
    }
    return tracks;
  }
  if (scaleX == nil && scaleY == nil) {
    return @[ [self propertyTrack:scale property:RNSStackAnimationViewPropertyScale] ];
  }
  return @[
    [self propertyTrack:scaleX ?: scale property:RNSStackAnimationViewPropertyScaleX],
    [self propertyTrack:scaleY ?: scale property:RNSStackAnimationViewPropertyScaleY],
  ];
}

+ (RNSStackAnimationTranslateTrack *)translateTrack:(RNSStackAnimationTranslateTrackConfig *)config
                                               axis:(RNSStackAnimationAxis)axis
{
  return [[RNSStackAnimationTranslateTrack alloc] initWithAxis:axis
                                                          from:config.from ?: RNSStackAnimationLength.zero
                                                            to:config.to ?: RNSStackAnimationLength.zero
                                                        timing:[self timingForConfig:config.timing]];
}

+ (RNSStackAnimationPropertyTrack *)propertyTrack:(RNSStackAnimationScalarTrackConfig *)config
                                         property:(RNSStackAnimationViewProperty)property
{
  CGFloat rest = [RNSStackAnimationPropertyTrack restValueOfViewProperty:property];
  return
      [[RNSStackAnimationPropertyTrack alloc] initWithViewProperty:property
                                                              from:config.from != nil ? config.from.doubleValue : rest
                                                                to:config.to != nil ? config.to.doubleValue : rest
                                                            timing:[self timingForConfig:config.timing]];
}

// A scrim at rest is absent.
+ (RNSStackAnimationDimTrack *)dimTrack:(RNSStackAnimationDimTrackConfig *)config
{
  return [[RNSStackAnimationDimTrack alloc] initWithColor:config.color ?: RNSStackAnimationPresetTracks.defaultDimColor
                                                     from:config.from != nil ? config.from.doubleValue : 0
                                                       to:config.to != nil ? config.to.doubleValue : 0
                                                   timing:[self timingForConfig:config.timing]];
}

// A track without an `easing` plays linearly: the one curve that means the same on every platform.
+ (RNSStackAnimationTiming *)timingForConfig:(RNSStackAnimationTrackTimingConfig *)config
{
  return [[RNSStackAnimationTiming alloc]
      initWithStartMs:config.delayMs
           durationMs:config.durationMs
               easing:config.easing ?: [RNSStackAnimationEasing named:RNSStackAnimationEasingNameLinear]];
}

@end
