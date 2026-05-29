#pragma once

#import "RNSTabsHostComponentView.h"

#if defined(__cplusplus)
#import "RNSTabsHostShadowNode.h"
#endif // defined(__cplusplus)

NS_ASSUME_NONNULL_BEGIN

#if defined(__cplusplus)

@class RCTImageLoader;

@interface RNSTabsHostComponentView (RNSImageLoader)

- (nullable RCTImageLoader *)retrieveImageLoaderFromState:
    (facebook::react::RNSTabsHostShadowNode::ConcreteState::Shared)state;

@end

#endif // defined(__cplusplus)

NS_ASSUME_NONNULL_END
