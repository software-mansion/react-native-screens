#import "RNSTabsHostComponentView+RNSImageLoaderRetrieval.h"

#import <React/RCTImageLoader.h>
#import <react/utils/ManagedObjectWrapper.h>

#import "RNSLog.h"

@implementation RNSTabsHostComponentView (RNSImageLoaderRetrieval)

- (nullable RCTImageLoader *)retrieveImageLoaderFromState:
    (facebook::react::RNSTabsHostShadowNode::ConcreteState::Shared)receivedState
{
  if (auto imgLoaderPtr = receivedState.get()->getData().getImageLoader().lock()) {
    return react::unwrapManagedObject(imgLoaderPtr);
  }

  RNSLogW(@"[RNScreens] unable to retrieve RCTImageLoader");
  return nil;
}

@end
