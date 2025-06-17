#import "RNSBottomTabsHostComponentViewManager.h"
#import "RNSBottomTabsHostEventEmitter.h"
#import "RNSEnums.h"
#import "RNSReactBaseView.h"
#import "RNSScreenContainer.h"

NS_ASSUME_NONNULL_BEGIN

@class RNSBottomTabsScreenComponentView;

/**
 * Component view. Lifecycle is managed by React Native.
 *
 * This component serves as:
 * 1. host for UITabBarController
 * 2. provider of React state & props for the tab bar controller
 * 3. two way communication channel with React (commands & events)
 */
@interface RNSBottomTabsHostComponentView : RNSReactBaseView <RNSScreenContainerDelegate>

@end

#pragma mark - Props

@interface RNSBottomTabsHostComponentView ()

@property (nonatomic, strong, readonly, nullable) UIColor *tabBarBackgroundColor;
@property (nonatomic, strong, readonly, nullable) UIBlurEffect *tabBarBlurEffect;
@property (nonatomic, strong, readonly, nullable) NSNumber *tabBarItemTitleFontSize;

@property (nonatomic, readonly) BOOL experimental_controlNavigationStateInJS;

@end

#pragma mark - React Events

@interface RNSBottomTabsHostComponentView ()

/**
 * Use returned object to emit appropriate React Events to Element Tree.
 */
- (nonnull RNSBottomTabsHostEventEmitter *)reactEventEmitter;

- (BOOL)emitOnNativeFocusChangeRequestSelectedTabScreen:(nonnull RNSBottomTabsScreenComponentView *)tabScreen;

@end

NS_ASSUME_NONNULL_END
