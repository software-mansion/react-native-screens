#pragma once

#import "RNSTabsHostComponentView.h"

#import "RNSTabsHostShadowNode.h"

NS_ASSUME_NONNULL_BEGIN

@class RCTImageLoader;

@interface RNSTabsHostComponentView (RNSImageLoader)

- (nullable RCTImageLoader *)retrieveImageLoaderFromState:
    (facebook::react::RNSTabsHostShadowNode::ConcreteState::Shared)state;

@end

NS_ASSUME_NONNULL_END
