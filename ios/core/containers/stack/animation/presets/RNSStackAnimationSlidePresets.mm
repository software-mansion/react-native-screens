#import "RNSStackAnimationSlidePresets.h"
#import "RNSStackAnimationEasing.h"
#import "RNSStackAnimationLength.h"
#import "RNSStackAnimationPresetTracks.h"
#import "RNSStackAnimationTrack.h"

// Taken from the legacy Android implementation's `res/base/anim/rns_slide_{in_from,out_to}_{right,left,bottom}.xml`:
// `@android:integer/config_mediumAnimTime` (400 ms), no interpolator (`accelerate_decelerate`, the default of a view
// `Animation`), `android:fromXDelta="100%"` / `android:fromYDelta="100%"` (the full width or height of the container).
static const NSInteger kRNSSlideDurationMs = 400;
static const CGFloat kRNSSlideDistanceFraction = 1;

@implementation RNSStackAnimationSlidePresets

+ (NSArray<RNSStackAnimationTrack *> *)tracksFromEdge:(RNSStackAnimationEdge)edge appearing:(BOOL)isAppearing
{
  return @[ [RNSStackAnimationPresetTracks
      translationTrackFromEdge:edge
                      distance:[RNSStackAnimationLength fraction:kRNSSlideDistanceFraction]
                     appearing:isAppearing
                    durationMs:kRNSSlideDurationMs
                        easing:[RNSStackAnimationEasing named:RNSStackAnimationEasingNameAccelerateDecelerate]] ];
}

@end
