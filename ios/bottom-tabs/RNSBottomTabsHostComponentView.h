#import "RNSBottomTabsHostComponentViewManager.h"
#import "RNSBottomTabsHostEventEmitter.h"
#import "RNSDefines.h"
#import "RNSEnums.h"
#import "RNSReactBaseView.h"
#import "RNSScreenContainer.h"

#ifdef RCT_NEW_ARCH_ENABLED
#import <cxxreact/ReactNativeVersion.h>

// Starting 0.82.0, we're switching to the new impl based on RCTComponentViewProtocol.
// Additional runtime check is needed for RCs of 0.82
#if REACT_NATIVE_VERSION_MINOR <= 82
#import "RNSViewControllerInvalidating.h"
#endif // REACT_NATIVE_VERSION_MINOR <= 82

#else
#import <React/RCTInvalidating.h>
#endif // RCT_NEW_ARCH_ENABLED

#if RCT_NEW_ARCH_ENABLED && REACT_NATIVE_VERSION_MINOR <= 82
#define RNS_BOTTOM_TABS_HOST_INVALIDATING_INTERFACE RNSViewControllerInvalidating
#elif !RCT_NEW_ARCH_ENABLED
#define RNS_BOTTOM_TABS_HOST_INVALIDATING_INTERFACE RCTInvalidating
#else
#define RNS_BOTTOM_TABS_HOST_INVALIDATING_INTERFACE NSObject
#endif

NS_ASSUME_NONNULL_BEGIN

@class RNSBottomTabsScreenComponentView;
@class RNSTabBarController;
@class RCTImageLoader;

/**
 * Component view. Lifecycle is managed by React Native.
 *
 * This component serves as:
 * 1. host for UITabBarController
 * 2. provider of React state & props for the tab bar controller
 * 3. two way communication channel with React (commands & events)
 */
@interface RNSBottomTabsHostComponentView
    : RNSReactBaseView <RNSScreenContainerDelegate, RNS_BOTTOM_TABS_HOST_INVALIDATING_INTERFACE>

#if !RCT_NEW_ARCH_ENABLED
- (instancetype)initWithFrame:(CGRect)frame reactImageLoader:(RCTImageLoader *)imageLoader;
#endif // !RCT_NEW_ARCH_ENABLED

@property (nonatomic, nonnull, strong, readonly) RNSTabBarController *controller;

@end

#pragma mark - Props

@interface RNSBottomTabsHostComponentView ()

@property (nonatomic, strong, readonly, nullable) UIColor *tabBarTintColor;

@property (nonatomic, readonly) BOOL experimental_controlNavigationStateInJS;

#if RNS_IPHONE_OS_VERSION_AVAILABLE(26_0)
@property (nonatomic, readonly) UITabBarMinimizeBehavior tabBarMinimizeBehavior API_AVAILABLE(ios(26.0));
#endif // Check for iOS >= 26

#if RNS_IPHONE_OS_VERSION_AVAILABLE(18_0)
@property (nonatomic, readonly) UITabBarControllerMode tabBarControllerMode API_AVAILABLE(ios(18.0));
#endif // Check for iOS >= 18
@end

#pragma mark - React Events

@interface RNSBottomTabsHostComponentView ()

/**
 * Use returned object to emit appropriate React Events to Element Tree.
 */
- (nonnull RNSBottomTabsHostEventEmitter *)reactEventEmitter;

- (BOOL)emitOnNativeFocusChangeRequestSelectedTabScreen:(nonnull RNSBottomTabsScreenComponentView *)tabScreen;

#if !RCT_NEW_ARCH_ENABLED
#pragma mark - LEGACY Event blocks

@property (nonatomic, copy) RCTDirectEventBlock onNativeFocusChange;

#endif

@end

#pragma mark - React Image Loader

@interface RNSBottomTabsHostComponentView ()

- (nullable RCTImageLoader *)reactImageLoader;

@end

NS_ASSUME_NONNULL_END
