#pragma once

#import "RNSBottomTabsAccessoryEventEmitter.h"
#import "RNSBottomTabsHostComponentView.h"
#import "RNSReactBaseView.h"

#if RCT_NEW_ARCH_ENABLED
#import "RNSViewControllerInvalidating.h"
#else
#import <React/RCTBridge.h>
#import <React/RCTInvalidating.h>
#endif

#if RCT_NEW_ARCH_ENABLED && defined(__cplusplus)
#import <rnscreens/RNSBottomTabsAccessoryComponentDescriptor.h>
#endif // RCT_NEW_ARCH_ENABLED && defined(__cplusplus)

NS_ASSUME_NONNULL_BEGIN

#if RNS_BOTTOM_ACCESSORY_AVAILABLE

@class RNSBottomAccessoryHelper;
@class RNSBottomTabsAccessoryShadowStateProxy;

#endif // RNS_BOTTOM_ACCESSORY_AVAILABLE

@interface RNSBottomTabsAccessoryComponentView : RNSReactBaseView <
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

#if RNS_BOTTOM_ACCESSORY_AVAILABLE

/**
 * If not null, the bottom accesory's helper that handles accessory size and environment changes.
 * It also manages *content view switching workaround* for RN >= 0.82.
 */
@property (nonatomic, strong, readonly, nullable) RNSBottomAccessoryHelper *helper;

/**
 * If not null, the bottom accesory's shadow state proxy that handles communication with ShadowTree.
 */
@property (nonatomic, strong, readonly, nullable) RNSBottomTabsAccessoryShadowStateProxy *shadowStateProxy;

#endif // RNS_BOTTOM_ACCESSORY_AVAILABLE

/**
 * If not null, the bottom tabs host view that this accessory component view belongs to.
 */
@property (nonatomic, weak, nullable) RNSBottomTabsHostComponentView *bottomTabsHostView;

@end

#pragma mark - React Events

#if RNS_BOTTOM_ACCESSORY_AVAILABLE

@interface RNSBottomTabsAccessoryComponentView ()

/**
 * Use returned object to emit appropriate React Events to Element Tree.
 */
- (nonnull RNSBottomTabsAccessoryEventEmitter *)reactEventEmitter;

#if !RCT_NEW_ARCH_ENABLED
#pragma mark - LEGACY Event blocks

@property (nonatomic, copy) RCTDirectEventBlock onEnvironmentChange;

#endif // !RCT_NEW_ARCH_ENABLED

@end

#endif // RNS_BOTTOM_ACCESSORY_AVAILABLE

#pragma mark - Hidden from Swift

#if RCT_NEW_ARCH_ENABLED && defined(__cplusplus)

@interface RNSBottomTabsAccessoryComponentView ()

- (facebook::react::RNSBottomTabsAccessoryShadowNode::ConcreteState::Shared)state;

@end

#endif // RCT_NEW_ARCH_ENABLED && defined(__cplusplus)

NS_ASSUME_NONNULL_END
