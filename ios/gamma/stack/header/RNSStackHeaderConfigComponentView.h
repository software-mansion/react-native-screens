#pragma once

#import "RNSReactBaseView.h"
#import "RNSViewFrameChangeDelegate.h"

NS_ASSUME_NONNULL_BEGIN

@interface RNSStackHeaderConfigComponentView : RNSReactBaseView <RNSViewFrameChangeDelegate>

- (void)resetProps;

@end

NS_ASSUME_NONNULL_END

#pragma mark - Hidden from Swift

#if defined(__cplusplus)

#import <rnscreens/RNSStackHeaderConfigComponentDescriptor.h>

@interface RNSStackHeaderConfigComponentView ()

- (facebook::react::RNSStackHeaderConfigShadowNode::ConcreteState::Shared)state;

@end

#endif // defined(__cplusplus)
