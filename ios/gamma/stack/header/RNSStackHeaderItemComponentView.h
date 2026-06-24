#pragma once

#import "RNSReactBaseView.h"
#import "RNSStackHeaderItemDataProviding.h"
#import "RNSStackHeaderItemInvalidationDelegate.h"
#import "RNSViewFrameChangeDelegate.h"

NS_ASSUME_NONNULL_BEGIN

@interface RNSStackHeaderItemComponentView : RNSReactBaseView <RNSStackHeaderItemDataProviding>

@property (nonatomic, readonly) RNSHeaderItemPlacement placement;
@property (nonatomic, readonly, nullable) NSString *title;
@property (nonatomic, readonly, nullable) RNSStackHeaderMenuData *menu;
@property (nonatomic, readonly, nullable) RNSStackHeaderMenuToggleStateTracker *menuToggleStateTracker;
@property (nonatomic, readonly, nullable) UIView *customView;

@property (nonatomic, weak, nullable) id<RNSStackHeaderItemInvalidationDelegate> invalidationDelegate;

@end

NS_ASSUME_NONNULL_END

#pragma mark - Hidden from Swift

#if defined(__cplusplus)

#import <rnscreens/RNSStackHeaderItemComponentDescriptor.h>

@interface RNSStackHeaderItemComponentView ()

- (facebook::react::RNSStackHeaderItemShadowNode::ConcreteState::Shared)state;

@end

#endif // defined(__cplusplus)
