#import "RNSBottomTabsHostComponentView.h"

#if defined(__cplusplus)
#import "RNSBottomTabsShadowNode.h"
#endif

NS_ASSUME_NONNULL_BEGIN

#if defined(__cplusplus)

@class RCTImageLoader;

@interface RNSBottomTabsHostComponentView (RNSImageLoader)

- (RCTImageLoader *)retrieveImageLoaderFromState:(facebook::react::RNSBottomTabsShadowNode::ConcreteState::Shared)state;

@end

#endif

NS_ASSUME_NONNULL_END
