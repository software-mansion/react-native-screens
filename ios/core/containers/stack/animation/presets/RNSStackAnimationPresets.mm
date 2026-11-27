#import "RNSStackAnimationPresets.h"
#import "RNSStackAnimationCustomConfig.h"
#import "RNSStackAnimationCustomMotion.h"
#import "RNSStackAnimationCustomMotionConfig.h"
#import "RNSStackAnimationCustomTransitionConfig.h"
#import "RNSStackAnimationFadePresets.h"
#import "RNSStackAnimationIosPresets.h"
#import "RNSStackAnimationPresetConfig.h"
#import "RNSStackAnimationSlidePresets.h"
#import "RNSStackAnimationTimeline.h"
#import "RNSStackAnimationTrack.h"
#import "RNSStackAnimationTransitionTimeline.h"

@implementation RNSStackAnimationPresets

+ (nullable RNSStackAnimationTransitionTimeline *)transitionTimelineForConfig:(id<RNSStackAnimationConfig>)config
                                                                         kind:(RNSStackAnimationTransitionKind)kind
{
  if ([config isKindOfClass:RNSStackAnimationCustomConfig.class]) {
    RNSStackAnimationCustomConfig *custom = static_cast<RNSStackAnimationCustomConfig *>(config);
    return [self
        transitionTimelineForTransitionConfig:kind == RNSStackAnimationTransitionKindPush ? custom.push : custom.pop
                                         kind:kind];
  }
  if (![config isKindOfClass:RNSStackAnimationPresetConfig.class]) {
    return nil;
  }
  RNSStackAnimationPresetConfig *preset = static_cast<RNSStackAnimationPresetConfig *>(config);
  switch (preset.name) {
    case RNSStackAnimationPresetNameDefault:
      return nil;
    case RNSStackAnimationPresetNameNone:
      return RNSStackAnimationTransitionTimeline.staticTimeline;
    default:
      break;
  }
  // Both transitions, so that `duration` scales them against the longer one. A preset's pop transition is the push
  // transition of the name whose vector points the other way.
  RNSStackAnimationPresetOptions *options = preset.options;
  RNSStackAnimationTransitionTimeline *push = [self transitionForName:preset.name
                                                             distance:options.distance
                                                                 kind:RNSStackAnimationTransitionKindPush];
  RNSStackAnimationTransitionTimeline *pop = [self transitionForName:[self oppositeNameOf:preset.name]
                                                            distance:options.distance
                                                                kind:RNSStackAnimationTransitionKindPop];
  RNSStackAnimationTimeline *animation = [[RNSStackAnimationTimeline alloc] initWithPush:push pop:pop];
  if (options.durationMs != nil) {
    animation = [animation retimedTo:options.durationMs.integerValue];
  }
  if (options.easing != nil) {
    animation = [animation withEasing:options.easing];
  }
  return [animation transitionForKind:kind];
}

// The transition written at a push or pop position: the name is played as written and the options apply to it alone.
+ (RNSStackAnimationTransitionTimeline *)transitionTimelineForTransitionConfig:
                                             (id<RNSStackAnimationTransitionConfig>)config
                                                                          kind:(RNSStackAnimationTransitionKind)kind
{
  if ([config isKindOfClass:RNSStackAnimationCustomTransitionConfig.class]) {
    RNSStackAnimationCustomTransitionConfig *custom = static_cast<RNSStackAnimationCustomTransitionConfig *>(config);
    return [RNSStackAnimationTransitionTimeline
        timelineForKind:kind
            enterTracks:[self motionTracksForMotionConfig:custom.enter appearing:YES]
             exitTracks:[self motionTracksForMotionConfig:custom.exit appearing:NO]];
  }
  RNSStackAnimationPresetConfig *preset = static_cast<RNSStackAnimationPresetConfig *>(config);
  RNSStackAnimationPresetOptions *options = preset.options;
  RNSStackAnimationTransitionTimeline *transition = [self transitionForName:preset.name
                                                                   distance:options.distance
                                                                       kind:kind];
  if (options.durationMs != nil) {
    transition = [transition retimedTo:options.durationMs.integerValue];
  }
  if (options.easing != nil) {
    transition = [transition withEasing:options.easing];
  }
  return transition;
}

// The motion written at an enter or exit position: its tracks, or a preset whose options apply to it alone.
+ (NSArray<RNSStackAnimationTrack *> *)motionTracksForMotionConfig:(id<RNSStackAnimationMotionConfig>)config
                                                         appearing:(BOOL)isAppearing
{
  if ([config isKindOfClass:RNSStackAnimationCustomMotionConfig.class]) {
    return [RNSStackAnimationCustomMotion tracksForConfig:static_cast<RNSStackAnimationCustomMotionConfig *>(config)];
  }
  RNSStackAnimationPresetConfig *preset = static_cast<RNSStackAnimationPresetConfig *>(config);
  RNSStackAnimationPresetOptions *options = preset.options;
  NSArray<RNSStackAnimationTrack *> *tracks = [self motionTracksForName:preset.name
                                                               distance:options.distance
                                                              appearing:isAppearing];
  if (options.durationMs != nil) {
    tracks = [RNSStackAnimationTrack tracks:tracks retimedTo:options.durationMs.integerValue];
  }
  if (options.easing != nil) {
    tracks = [RNSStackAnimationTrack tracks:tracks withEasing:options.easing];
  }
  return tracks;
}

+ (NSArray<RNSStackAnimationTrack *> *)motionTracksForName:(RNSStackAnimationPresetName)name
                                                  distance:(nullable RNSStackAnimationLength *)distance
                                                 appearing:(BOOL)isAppearing
{
  switch (name) {
    case RNSStackAnimationPresetNameFade:
      return [RNSStackAnimationFadePresets tracksAppearing:isAppearing];
    case RNSStackAnimationPresetNameSlideFromRight:
      return [RNSStackAnimationSlidePresets tracksFromEdge:RNSStackAnimationEdgeRight
                                                  distance:distance
                                                 appearing:isAppearing];
    case RNSStackAnimationPresetNameSlideFromLeft:
      return [RNSStackAnimationSlidePresets tracksFromEdge:RNSStackAnimationEdgeLeft
                                                  distance:distance
                                                 appearing:isAppearing];
    case RNSStackAnimationPresetNameSlideFromTrailing:
      return [RNSStackAnimationSlidePresets tracksFromEdge:RNSStackAnimationEdgeTrailing
                                                  distance:distance
                                                 appearing:isAppearing];
    case RNSStackAnimationPresetNameSlideFromLeading:
      return [RNSStackAnimationSlidePresets tracksFromEdge:RNSStackAnimationEdgeLeading
                                                  distance:distance
                                                 appearing:isAppearing];
    case RNSStackAnimationPresetNameSlideFromBottom:
      return [RNSStackAnimationSlidePresets tracksFromEdge:RNSStackAnimationEdgeBottom
                                                  distance:distance
                                                 appearing:isAppearing];
    case RNSStackAnimationPresetNameSlideFromTop:
      return [RNSStackAnimationSlidePresets tracksFromEdge:RNSStackAnimationEdgeTop
                                                  distance:distance
                                                 appearing:isAppearing];
    case RNSStackAnimationPresetNameFadeFromBottom:
      return [RNSStackAnimationFadePresets fadeFromTracksFromEdge:RNSStackAnimationEdgeBottom
                                                         distance:distance
                                                        appearing:isAppearing];
    case RNSStackAnimationPresetNameFadeFromTop:
      return [RNSStackAnimationFadePresets fadeFromTracksFromEdge:RNSStackAnimationEdgeTop
                                                         distance:distance
                                                        appearing:isAppearing];
    default:
      return @[];
  }
}

// The name whose vector points the other way. Names without a vector are their own opposite.
+ (RNSStackAnimationPresetName)oppositeNameOf:(RNSStackAnimationPresetName)name
{
  switch (name) {
    case RNSStackAnimationPresetNameSlideFromRight:
      return RNSStackAnimationPresetNameSlideFromLeft;
    case RNSStackAnimationPresetNameSlideFromLeft:
      return RNSStackAnimationPresetNameSlideFromRight;
    case RNSStackAnimationPresetNameSlideFromTrailing:
      return RNSStackAnimationPresetNameSlideFromLeading;
    case RNSStackAnimationPresetNameSlideFromLeading:
      return RNSStackAnimationPresetNameSlideFromTrailing;
    case RNSStackAnimationPresetNameSlideFromBottom:
      return RNSStackAnimationPresetNameSlideFromTop;
    case RNSStackAnimationPresetNameSlideFromTop:
      return RNSStackAnimationPresetNameSlideFromBottom;
    case RNSStackAnimationPresetNameFadeFromBottom:
      return RNSStackAnimationPresetNameFadeFromTop;
    case RNSStackAnimationPresetNameFadeFromTop:
      return RNSStackAnimationPresetNameFadeFromBottom;
    case RNSStackAnimationPresetNameIosFromRight:
      return RNSStackAnimationPresetNameIosFromLeft;
    case RNSStackAnimationPresetNameIosFromLeft:
      return RNSStackAnimationPresetNameIosFromRight;
    case RNSStackAnimationPresetNameIosFromTrailing:
      return RNSStackAnimationPresetNameIosFromLeading;
    case RNSStackAnimationPresetNameIosFromLeading:
      return RNSStackAnimationPresetNameIosFromTrailing;
    default:
      return name;
  }
}

// Whether the screen that is not pushed or popped moves too: the horizontal slides move both screens as one band,
// `fade` crossfades them, as the legacy Android `rns_fade_in.xml` / `rns_fade_out.xml` pair. The vertical slides and
// the `fadeFrom*` names keep the other screen static, as the legacy `RNSScreenStackAnimator` and the legacy Android
// `rns_no_animation_*.xml` on that side.
+ (BOOL)animatesBothScreens:(RNSStackAnimationPresetName)name
{
  switch (name) {
    case RNSStackAnimationPresetNameFade:
    case RNSStackAnimationPresetNameSlideFromRight:
    case RNSStackAnimationPresetNameSlideFromLeft:
    case RNSStackAnimationPresetNameSlideFromTrailing:
    case RNSStackAnimationPresetNameSlideFromLeading:
      return YES;
    default:
      return NO;
  }
}

// The pushed or popped screen moves along the name's vector, and the other screen with it for the names that animate
// both; the `iosFrom*` names give the two screens different motions.
+ (RNSStackAnimationTransitionTimeline *)transitionForName:(RNSStackAnimationPresetName)name
                                                  distance:(nullable RNSStackAnimationLength *)distance
                                                      kind:(RNSStackAnimationTransitionKind)kind
{
  BOOL isPush = kind == RNSStackAnimationTransitionKindPush;
  switch (name) {
    case RNSStackAnimationPresetNameIosFromRight:
      return [RNSStackAnimationIosPresets transitionFromEdge:RNSStackAnimationEdgeRight kind:kind];
    case RNSStackAnimationPresetNameIosFromLeft:
      return [RNSStackAnimationIosPresets transitionFromEdge:RNSStackAnimationEdgeLeft kind:kind];
    case RNSStackAnimationPresetNameIosFromTrailing:
      return [RNSStackAnimationIosPresets transitionFromEdge:RNSStackAnimationEdgeTrailing kind:kind];
    case RNSStackAnimationPresetNameIosFromLeading:
      return [RNSStackAnimationIosPresets transitionFromEdge:RNSStackAnimationEdgeLeading kind:kind];
    default:
      break;
  }
  NSArray<RNSStackAnimationTrack *> *movingScreenTracks = [self motionTracksForName:name
                                                                           distance:distance
                                                                          appearing:isPush];
  NSArray<RNSStackAnimationTrack *> *otherScreenTracks =
      [self animatesBothScreens:name] ? [self motionTracksForName:name distance:distance appearing:!isPush] : @[];
  return [RNSStackAnimationTransitionTimeline timelineForKind:kind
                                                  enterTracks:isPush ? movingScreenTracks : otherScreenTracks
                                                   exitTracks:isPush ? otherScreenTracks : movingScreenTracks];
}

@end
