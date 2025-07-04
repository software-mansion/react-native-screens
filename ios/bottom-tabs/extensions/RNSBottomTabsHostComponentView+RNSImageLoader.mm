#import "RNSBottomTabsHostComponentView+RNSImageLoader.h"
#import <React/RCTImageLoader.h>
#import <react/utils/ManagedObjectWrapper.h>

@implementation RNSBottomTabsHostComponentView (RNSImageLoader)

- (RCTImageLoader *)retrieveImageLoaderFromState:(facebook::react::RNSBottomTabsShadowNode::ConcreteState::Shared)receivedState
{
  if (auto imgLoaderPtr = receivedState.get()->getData().getImageLoader().lock()) {
    return react::unwrapManagedObject(imgLoaderPtr);
  }
  
  RCTLogWarn(@"[RNScreens] unable to retrieve RCTImageLoader");
  return nil;
}

@end
