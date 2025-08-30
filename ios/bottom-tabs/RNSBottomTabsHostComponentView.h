#import "RNSBottomTabsHostComponentViewManager.h"
#import "RNSBottomTabsHostEventEmitter.h"
#import "RNSDefines.h"
#import "RNSEnums.h"
#import "RNSReactBaseView.h"
#import "RNSScreenContainer.h"

#ifdef RCT_NEW_ARCH_ENABLED
#import "RNSViewControllerInvalidating.h"
#else
#import <React/RCTInvalidating.h>
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
@interface RNSBottomTabsHostComponentView : RNSReactBaseView <
                                                RNSScreenContainerDelegate,
#ifdef RCT_NEW_ARCH_ENABLED
                                                RNSViewControllerInvalidating
#else
                                                RCTInvalidating
#endif
                                                >

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
