#import "RNSBottomTabsHostComponentView.h"

#if defined(__cplusplus) && RCT_NEW_ARCH_ENABLED
#import "RNSBottomTabsShadowNode.h"
#endif // defined(__cplusplus) && RCT_NEW_ARCH_ENABLED

NS_ASSUME_NONNULL_BEGIN

#if defined(__cplusplus) && RCT_NEW_ARCH_ENABLED

@class RCTImageLoader;

@interface RNSBottomTabsHostComponentView (RNSImageLoader)

- (nullable RCTImageLoader *)retrieveImageLoaderFromState:
    (facebook::react::RNSBottomTabsShadowNode::ConcreteState::Shared)state;

@end

#endif // defined(__cplusplus) && RCT_NEW_ARCH_ENABLED

NS_ASSUME_NONNULL_END
