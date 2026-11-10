#import "RNSStackAnimationPresets.h"
#import "RNSStackAnimationFadePresets.h"
#import "RNSStackAnimationPresetConfig.h"
#import "RNSStackAnimationSlidePresets.h"
#import "RNSStackAnimationTransitionTimeline.h"

static NSArray<RNSStackAnimationTrack *> *RNSMotionTracks(RNSStackAnimationPresetName name, BOOL isAppearing)
{
  switch (name) {
    case RNSStackAnimationPresetNameFade:
      return [RNSStackAnimationFadePresets tracksAppearing:isAppearing];
    case RNSStackAnimationPresetNameSlideFromRight:
      return [RNSStackAnimationSlidePresets tracksFromEdge:RNSStackAnimationEdgeRight appearing:isAppearing];
    case RNSStackAnimationPresetNameSlideFromLeft:
      return [RNSStackAnimationSlidePresets tracksFromEdge:RNSStackAnimationEdgeLeft appearing:isAppearing];
    case RNSStackAnimationPresetNameSlideFromBottom:
      return [RNSStackAnimationSlidePresets tracksFromEdge:RNSStackAnimationEdgeBottom appearing:isAppearing];
    case RNSStackAnimationPresetNameSlideFromTop:
      return [RNSStackAnimationSlidePresets tracksFromEdge:RNSStackAnimationEdgeTop appearing:isAppearing];
    default:
      return @[];
  }
}

// The name whose vector points the other way; a preset's pop transition is its opposite's. Names without a vector are
// their own opposite.
static RNSStackAnimationPresetName RNSOppositeName(RNSStackAnimationPresetName name)
{
  switch (name) {
    case RNSStackAnimationPresetNameSlideFromRight:
      return RNSStackAnimationPresetNameSlideFromLeft;
    case RNSStackAnimationPresetNameSlideFromLeft:
      return RNSStackAnimationPresetNameSlideFromRight;
    case RNSStackAnimationPresetNameSlideFromBottom:
      return RNSStackAnimationPresetNameSlideFromTop;
    case RNSStackAnimationPresetNameSlideFromTop:
      return RNSStackAnimationPresetNameSlideFromBottom;
    default:
      return name;
  }
}

// Whether the screen that is not pushed or popped moves too: the horizontal slides move both screens as one band,
// `fade` crossfades them, as the legacy Android `rns_fade_in.xml` / `rns_fade_out.xml` pair. The vertical slides keep
// the other screen static, as the legacy `RNSScreenStackAnimator` and the legacy Android `rns_no_animation_*.xml` on
// that side.
static BOOL RNSAnimatesBothScreens(RNSStackAnimationPresetName name)
{
  switch (name) {
    case RNSStackAnimationPresetNameFade:
    case RNSStackAnimationPresetNameSlideFromRight:
    case RNSStackAnimationPresetNameSlideFromLeft:
      return YES;
    default:
      return NO;
  }
}

// The pushed or popped screen moves along the name's vector, and the other screen with it for the names that animate
// both. A pop plays the opposite name.
static RNSStackAnimationTransitionTimeline *RNSTransition(RNSStackAnimationPresetName name,
                                                          RNSStackAnimationTransitionKind kind)
{
  BOOL isPush = kind == RNSStackAnimationTransitionKindPush;
  RNSStackAnimationPresetName movingName = isPush ? name : RNSOppositeName(name);
  NSArray<RNSStackAnimationTrack *> *movingScreenTracks = RNSMotionTracks(movingName, isPush);
  NSArray<RNSStackAnimationTrack *> *otherScreenTracks =
      RNSAnimatesBothScreens(movingName) ? RNSMotionTracks(movingName, !isPush) : @[];
  return [RNSStackAnimationTransitionTimeline timelineForKind:kind
                                                  enterTracks:isPush ? movingScreenTracks : otherScreenTracks
                                                   exitTracks:isPush ? otherScreenTracks : movingScreenTracks];
}

@implementation RNSStackAnimationPresets

+ (nullable RNSStackAnimationTransitionTimeline *)transitionTimelineForConfig:(id<RNSStackAnimationConfig>)config
                                                                         kind:(RNSStackAnimationTransitionKind)kind
{
  if (![config isKindOfClass:RNSStackAnimationPresetConfig.class]) {
    return nil;
  }
  RNSStackAnimationPresetName name = static_cast<RNSStackAnimationPresetConfig *>(config).name;
  switch (name) {
    case RNSStackAnimationPresetNameNone:
      return RNSStackAnimationTransitionTimeline.staticTimeline;
    case RNSStackAnimationPresetNameFade:
    case RNSStackAnimationPresetNameSlideFromRight:
    case RNSStackAnimationPresetNameSlideFromLeft:
    case RNSStackAnimationPresetNameSlideFromBottom:
    case RNSStackAnimationPresetNameSlideFromTop:
      return RNSTransition(name, kind);
    default:
      return nil;
  }
}

@end
