#pragma once

#import "RNSTabsHostComponentView.h"

#if defined(__cplusplus) && RCT_NEW_ARCH_ENABLED
#import "RNSTabsHostShadowNode.h"
#endif // defined(__cplusplus) && RCT_NEW_ARCH_ENABLED

NS_ASSUME_NONNULL_BEGIN

#if defined(__cplusplus) && RCT_NEW_ARCH_ENABLED

@class RCTImageLoader;

@interface RNSTabsHostComponentView (RNSImageLoader)

- (nullable RCTImageLoader *)retrieveImageLoaderFromState:
    (facebook::react::RNSTabsHostShadowNode::ConcreteState::Shared)state;

@end

#endif // defined(__cplusplus) && RCT_NEW_ARCH_ENABLED

NS_ASSUME_NONNULL_END
