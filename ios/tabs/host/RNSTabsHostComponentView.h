#pragma once

#import "RNSDefines.h"
#import "RNSEnums.h"
#import "RNSReactBaseView.h"
#import "RNSScreenContainer.h"
#import "RNSTabsHostEventEmitter.h"
#import "RNSTabsNavigationState.h"

#import "RNSTabBarController.h"

NS_ASSUME_NONNULL_BEGIN

#if defined(__cplusplus)
@class RCTImageLoader;
#endif // defined(__cplusplus)

/**
 * Component view. Lifecycle is managed by React Native.
 *
 * This component serves as:
 * 1. host for UITabBarController
 * 2. provider of React state & props for the tab bar controller
 * 3. two way communication channel with React (commands & events)
 */
@interface RNSTabsHostComponentView : RNSReactBaseView <RNSScreenContainerDelegate, RNSTabsNavigationStateObserver>

@property (nonatomic, nonnull, strong, readonly) RNSTabBarController *controller;

@end

#pragma mark - Props

@interface RNSTabsHostComponentView ()

/**
 * Last navigation state update requested by JS. Will be nonnull after first prop update.
 */
@property (nonatomic, strong, readonly, nullable) RNSTabsNavigationStateUpdateRequest *navStateRequest;

@property (nonatomic, readonly) BOOL rejectStaleNavStateUpdates;

@property (nonatomic, strong, readonly, nullable) UIColor *tabBarTintColor;

@property (nonatomic, readonly) BOOL tabBarHidden;

@property (nonatomic, readonly) BOOL bottomAccessoryHidden;

@property (nonatomic, strong, readonly, nullable) UIColor *nativeContainerBackgroundColor;

@property (nonatomic, readonly) UIUserInterfaceStyle colorScheme;

@property (nonatomic, readonly) UITraitEnvironmentLayoutDirection layoutDirection;

#if RNS_IPHONE_OS_VERSION_AVAILABLE(26_0)
@property (nonatomic, readonly) UITabBarMinimizeBehavior tabBarMinimizeBehavior API_AVAILABLE(ios(26.0));
#endif // Check for iOS >= 26

#if RNS_IPHONE_OS_VERSION_AVAILABLE(18_0)
@property (nonatomic, readonly) UITabBarControllerMode tabBarControllerMode API_AVAILABLE(ios(18.0));
#endif // Check for iOS >= 18
@end

#pragma mark - React Events

@interface RNSTabsHostComponentView ()

/**
 * Use returned object to emit appropriate React Events to Element Tree.
 */
- (nonnull RNSTabsHostEventEmitter *)reactEventEmitter;

@end

#pragma mark - React Image Loader

@interface RNSTabsHostComponentView ()

#if defined(__cplusplus)
- (nullable RCTImageLoader *)reactImageLoader;
#endif // defined(__cplusplus)

@end

NS_ASSUME_NONNULL_END
