#import "RNSStackAnimationFadePresets.h"
#import "RNSStackAnimationEasing.h"
#import "RNSStackAnimationLength.h"
#import "RNSStackAnimationPresetTracks.h"
#import "RNSStackAnimationTrack.h"

// Every value below is taken from the legacy Android implementation's `res/base/anim/rns_fade_*.xml` animations.

// `rns_fade_in.xml` / `rns_fade_out.xml`: 150 ms ("duration taken from debugging source code"), no interpolator.
static const NSInteger kRNSFadeDurationMs = 150;

// `rns_fade_from_bottom.xml` (AOSP Nougat `activity_open_enter.xml`), paired with `rns_no_animation_350.xml` on the
// covered side: a 350 ms `<translate>`, a 210 ms `<alpha>`, both `decelerate_quint`.
static const NSInteger kRNSRiseDurationMs = 350;
static const NSInteger kRNSRiseFadeDurationMs = 210;

// `rns_fade_to_bottom.xml` (AOSP Nougat `activity_close_exit.xml`), paired with `rns_no_animation_250.xml` on the
// revealed side: a 250 ms `accelerate_quint` `<translate>`, a linear `<alpha>` over 100-250 ms.
static const NSInteger kRNSFallDurationMs = 250;
static const NSInteger kRNSFallFadeStartMs = 100;
static const NSInteger kRNSFallFadeDurationMs = 150;

// `rns_fade_from_bottom.xml` `<translate android:fromYDelta="8%">`; the legacy iOS `RNSScreenStackAnimator` uses the
// same `0.08 * height` in its fade-from-bottom animation.
static const CGFloat kRNSRiseDistanceFraction = 0.08;

@implementation RNSStackAnimationFadePresets

+ (NSArray<RNSStackAnimationTrack *> *)tracksAppearing:(BOOL)isAppearing
{
  return @[ [RNSStackAnimationPresetTracks
      opacityTrackFrom:isAppearing ? 0 : 1
                    to:isAppearing ? 1 : 0
               startMs:0
            durationMs:kRNSFadeDurationMs
                easing:[RNSStackAnimationEasing named:RNSStackAnimationEasingNameAccelerateDecelerate]] ];
}

+ (NSArray<RNSStackAnimationTrack *> *)fadeFromTracksFromEdge:(RNSStackAnimationEdge)edge
                                                     distance:(nullable RNSStackAnimationLength *)distance
                                                    appearing:(BOOL)isAppearing
{
  RNSStackAnimationLength *travel = distance ?: [RNSStackAnimationLength fraction:kRNSRiseDistanceFraction];
  if (isAppearing) {
    RNSStackAnimationEasing *decelerate = [RNSStackAnimationEasing named:RNSStackAnimationEasingNameDecelerateQuint];
    return @[
      [RNSStackAnimationPresetTracks opacityTrackFrom:0
                                                   to:1
                                              startMs:0
                                           durationMs:kRNSRiseFadeDurationMs
                                               easing:decelerate],
      [RNSStackAnimationPresetTracks translationTrackFromEdge:edge
                                                     distance:travel
                                                    appearing:YES
                                                   durationMs:kRNSRiseDurationMs
                                                       easing:decelerate],
    ];
  }
  return @[
    [RNSStackAnimationPresetTracks opacityTrackFrom:1
                                                 to:0
                                            startMs:kRNSFallFadeStartMs
                                         durationMs:kRNSFallFadeDurationMs
                                             easing:[RNSStackAnimationEasing named:RNSStackAnimationEasingNameLinear]],
    [RNSStackAnimationPresetTracks
        translationTrackFromEdge:edge
                        distance:travel
                       appearing:NO
                      durationMs:kRNSFallDurationMs
                          easing:[RNSStackAnimationEasing named:RNSStackAnimationEasingNameAccelerateQuint]],
  ];
}

@end
