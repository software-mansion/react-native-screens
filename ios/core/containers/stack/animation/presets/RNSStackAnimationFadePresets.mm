#import "RNSStackAnimationFadePresets.h"
#import "RNSStackAnimationEasing.h"
#import "RNSStackAnimationPresetTracks.h"
#import "RNSStackAnimationTrack.h"

// Taken from the legacy Android implementation's `res/base/anim/rns_fade_in.xml` / `rns_fade_out.xml`: 150 ms
// ("duration taken from debugging source code"), no interpolator.
static const NSInteger kRNSFadeDurationMs = 150;

@implementation RNSStackAnimationFadePresets

+ (NSArray<RNSStackAnimationTrack *> *)tracksAppearing:(BOOL)isAppearing
{
  return @[ [RNSStackAnimationPresetTracks
      opacityTrackFrom:isAppearing ? 0 : 1
                    to:isAppearing ? 1 : 0
            durationMs:kRNSFadeDurationMs
                easing:[RNSStackAnimationEasing named:RNSStackAnimationEasingNameAccelerateDecelerate]] ];
}

@end
