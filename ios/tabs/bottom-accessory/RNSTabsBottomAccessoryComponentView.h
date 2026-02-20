#pragma once

#import "RNSReactBaseView.h"
#import "RNSTabsBottomAccessoryEventEmitter.h"
#import "RNSTabsHostComponentView.h"

#if RCT_NEW_ARCH_ENABLED
#import "RNSViewControllerInvalidating.h"
#else
#import <React/RCTBridge.h>
#import <React/RCTInvalidating.h>
#endif

#if RCT_NEW_ARCH_ENABLED && defined(__cplusplus)
#import <rnscreens/RNSTabsBottomAccessoryComponentDescriptor.h>
#endif // RCT_NEW_ARCH_ENABLED && defined(__cplusplus)

NS_ASSUME_NONNULL_BEGIN

#if RNS_TABS_BOTTOM_ACCESSORY_AVAILABLE

@class RNSTabsBottomAccessoryHelper;
@class RNSTabsBottomAccessoryShadowStateProxy;

#endif // RNS_TABS_BOTTOM_ACCESSORY_AVAILABLE

@interface RNSTabsBottomAccessoryComponentView : RNSReactBaseView <
#if RCT_NEW_ARCH_ENABLED
                                                     RNSViewControllerInvalidating
#else // RCT_NEW_ARCH_ENABLED
                                                     RCTInvalidating
#endif // RCT_NEW_ARCH_ENABLED
                                                     >

#if !RCT_NEW_ARCH_ENABLED
- (instancetype)initWithFrame:(CGRect)frame bridge:(RCTBridge *)bridge;

@property (nonatomic, weak, readonly, nullable) RCTBridge *bridge;
#endif // !RCT_NEW_ARCH_ENABLED

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

#if !RCT_NEW_ARCH_ENABLED
#pragma mark - LEGACY Event blocks

@property (nonatomic, copy) RCTDirectEventBlock onEnvironmentChange;

#endif // !RCT_NEW_ARCH_ENABLED

@end

#endif // RNS_TABS_BOTTOM_ACCESSORY_AVAILABLE

#pragma mark - Hidden from Swift

#if RCT_NEW_ARCH_ENABLED && defined(__cplusplus)

@interface RNSTabsBottomAccessoryComponentView ()

- (facebook::react::RNSTabsBottomAccessoryShadowNode::ConcreteState::Shared)state;

@end

#endif // RCT_NEW_ARCH_ENABLED && defined(__cplusplus)

NS_ASSUME_NONNULL_END
