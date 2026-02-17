#import "RNSTabsHostComponentView+RNSImageLoader.h"

#if RCT_NEW_ARCH_ENABLED

#import <React/RCTImageLoader.h>
#import <react/utils/ManagedObjectWrapper.h>

@implementation RNSTabsHostComponentView (RNSImageLoader)

- (nullable RCTImageLoader *)retrieveImageLoaderFromState:
    (facebook::react::RNSTabsHostShadowNode::ConcreteState::Shared)receivedState
{
  if (auto imgLoaderPtr = receivedState.get()->getData().getImageLoader().lock()) {
    return react::unwrapManagedObject(imgLoaderPtr);
  }

  RCTLogWarn(@"[RNScreens] unable to retrieve RCTImageLoader");
  return nil;
}

@end

#endif // RCT_NEW_ARCH_ENABLED
