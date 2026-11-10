#import "RNSStackTransitionResolver.h"
#import "RNSStackPresetConfig.h"
#import "RNSStackPresets.h"
#import "RNSStackScreenController.h"

@implementation RNSStackTransitionResolver

+ (nullable RNSStackTransitionTimeline *)timelineForKind:(RNSStackTransitionKind)kind
                                                outgoing:(nullable RNSStackScreenController *)outgoing
                                                incoming:(nullable RNSStackScreenController *)incoming
{
  RNSStackScreenController *governing = kind == RNSStackTransitionKindPush ? incoming : outgoing;
  // A screen whose view is gone has no config and plays `default`.
  id<RNSStackAnimationConfig> config = governing.configProvider.animation ?: RNSStackPresetConfig.defaultConfig;
  return [RNSStackPresets transitionTimelineForConfig:config kind:kind];
}

@end
