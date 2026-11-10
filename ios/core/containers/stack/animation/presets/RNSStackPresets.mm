#import "RNSStackPresets.h"
#import "RNSStackPresetConfig.h"
#import "RNSStackTransitionTimeline.h"

@implementation RNSStackPresets

+ (nullable RNSStackTransitionTimeline *)transitionTimelineForConfig:(id<RNSStackAnimationConfig>)config
                                                                kind:(RNSStackTransitionKind)kind
{
  if (![config isKindOfClass:RNSStackPresetConfig.class]) {
    return nil;
  }
  switch (static_cast<RNSStackPresetConfig *>(config).name) {
    case RNSStackPresetNameNone:
      return RNSStackTransitionTimeline.staticTimeline;
    default:
      return nil;
  }
}

@end
