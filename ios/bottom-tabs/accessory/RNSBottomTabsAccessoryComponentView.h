#import "RNSBottomTabsAccessoryEventEmitter.h"
#import "RNSBottomTabsHostComponentView.h"
#import "RNSReactBaseView.h"

#if RCT_NEW_ARCH_ENABLED
#import "RNSViewControllerInvalidating.h"
#else
#import <React/RCTBridge.h>
#import <React/RCTInvalidating.h>
#endif

NS_ASSUME_NONNULL_BEGIN

#if RNS_IPHONE_OS_VERSION_AVAILABLE(26_0) && !TARGET_OS_TV && !TARGET_OS_VISION

@class RNSBottomAccessoryHelper;

#endif // RNS_IPHONE_OS_VERSION_AVAILABLE(26_0) && !TARGET_OS_TV && !TARGET_OS_VISION

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

#if RNS_IPHONE_OS_VERSION_AVAILABLE(26_0) && !TARGET_OS_TV && !TARGET_OS_VISION

/**
 * If not null, the bottom accesory's helper that handles synchronization with ShadowNode.
 */
@property (nonatomic, strong, readonly, nullable) RNSBottomAccessoryHelper *helper;

#endif // RNS_IPHONE_OS_VERSION_AVAILABLE(26_0) && !TARGET_OS_TV && !TARGET_OS_VISION

/**
 * If not null, the bottom tabs host view that this accessory component view belongs to.
 */
@property (nonatomic, weak, nullable) RNSBottomTabsHostComponentView *bottomTabsHostView;

@end

#pragma mark - React Events

#if RNS_IPHONE_OS_VERSION_AVAILABLE(26_0) && !TARGET_OS_TV && !TARGET_OS_VISION

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

#endif // RNS_IPHONE_OS_VERSION_AVAILABLE(26_0) && !TARGET_OS_TV && !TARGET_OS_VISION

NS_ASSUME_NONNULL_END
