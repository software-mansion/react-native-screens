#import "RNSStackAnimationResolver.h"
#import "RNSStackAnimationPresetConfig.h"
#import "RNSStackAnimationPresets.h"
#import "RNSStackScreenController.h"

@implementation RNSStackAnimationResolver

+ (nullable RNSStackAnimationTransitionTimeline *)
    transitionTimelineForKind:(RNSStackAnimationTransitionKind)kind
                     outgoing:(nullable RNSStackScreenController *)outgoing
                     incoming:(nullable RNSStackScreenController *)incoming
{
  RNSStackScreenController *governing = kind == RNSStackAnimationTransitionKindPush ? incoming : outgoing;
  // A screen whose view is gone has no config and plays `default`.
  id<RNSStackAnimationConfig> config =
      governing.configProvider.animation ?: RNSStackAnimationPresetConfig.defaultConfig;
  return [RNSStackAnimationPresets transitionTimelineForConfig:config kind:kind];
}

@end
