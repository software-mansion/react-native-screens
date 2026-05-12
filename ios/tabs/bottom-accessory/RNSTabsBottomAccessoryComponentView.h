#pragma once

#import "RNSReactBaseView.h"
#import "RNSTabsBottomAccessoryEventEmitter.h"
#import "RNSTabsHostComponentView.h"

#if defined(__cplusplus)
#import <rnscreens/RNSTabsBottomAccessoryComponentDescriptor.h>
#endif // defined(__cplusplus)

NS_ASSUME_NONNULL_BEGIN

#if RNS_TABS_BOTTOM_ACCESSORY_AVAILABLE

@class RNSTabsBottomAccessoryHelper;
@class RNSTabsBottomAccessoryShadowStateProxy;

#endif // RNS_TABS_BOTTOM_ACCESSORY_AVAILABLE

@interface RNSTabsBottomAccessoryComponentView : RNSReactBaseView

#if RNS_TABS_BOTTOM_ACCESSORY_AVAILABLE

/**
 * If not null, the bottom accesory's helper that handles accessory size and environment changes.
 * It also manages *content view switching workaround* for RN >= 0.82.
 */
@property (nonatomic, strong, readonly, nullable) RNSTabsBottomAccessoryHelper *helper;

/**
 * If not null, the bottom accesory's shadow state proxy that handles communication with ShadowTree.
 */
@property (nonatomic, strong, readonly, nullable) RNSTabsBottomAccessoryShadowStateProxy *shadowStateProxy;

#endif // RNS_TABS_BOTTOM_ACCESSORY_AVAILABLE

/**
 * If not null, the tabs host view that this accessory component view belongs to.
 */
@property (nonatomic, weak, nullable) RNSTabsHostComponentView *tabsHostView;

@end

#pragma mark - React Events

#if RNS_TABS_BOTTOM_ACCESSORY_AVAILABLE

@interface RNSTabsBottomAccessoryComponentView ()

/**
 * Use returned object to emit appropriate React Events to Element Tree.
 */
- (nonnull RNSTabsBottomAccessoryEventEmitter *)reactEventEmitter;

@end

#endif // RNS_TABS_BOTTOM_ACCESSORY_AVAILABLE

#pragma mark - Hidden from Swift

#if defined(__cplusplus)

@interface RNSTabsBottomAccessoryComponentView ()

- (facebook::react::RNSTabsBottomAccessoryShadowNode::ConcreteState::Shared)state;

@end

#endif // defined(__cplusplus)

NS_ASSUME_NONNULL_END
