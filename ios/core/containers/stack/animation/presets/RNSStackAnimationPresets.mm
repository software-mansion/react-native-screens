#import "RNSStackAnimationPresets.h"
#import "RNSStackAnimationPresetConfig.h"
#import "RNSStackAnimationTransitionTimeline.h"

@implementation RNSStackAnimationPresets

+ (nullable RNSStackAnimationTransitionTimeline *)transitionTimelineForConfig:(id<RNSStackAnimationConfig>)config
                                                                         kind:(RNSStackAnimationTransitionKind)kind
{
  if (![config isKindOfClass:RNSStackAnimationPresetConfig.class]) {
    return nil;
  }
  switch (static_cast<RNSStackAnimationPresetConfig *>(config).name) {
    case RNSStackAnimationPresetNameNone:
      return RNSStackAnimationTransitionTimeline.staticTimeline;
    default:
      return nil;
  }
}

@end
