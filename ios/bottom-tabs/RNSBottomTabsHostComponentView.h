#import <React/RCTViewComponentView.h>
#import <react/renderer/components/rnscreens/EventEmitters.h>
#import "RNSBottomTabsHostComponentViewManager.h"
#import "RNSEnums.h"
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
@interface RNSBottomTabsHostComponentView : RCTViewComponentView <RNSScreenContainerDelegate>

@end

#pragma mark - Props

@interface RNSBottomTabsHostComponentView ()

@property (nonatomic, strong, readonly, nullable) UIColor *tabBarBackgroundColor;
@property (nonatomic, strong, readonly, nullable) UIBlurEffect *tabBarBlurEffect;
@property (nonatomic, strong, readonly, nullable) NSNumber *tabBarItemTitleFontSize;

@property (nonatomic, readonly) bool experimental_controlNavigationStateInJS;

@end

#pragma mark - React Events

@interface RNSBottomTabsHostComponentView ()

/**
 * This pointer might be `nullptr`!  All this method does is a cast of the backing field inherited from
 * `RCTViewComponentView`. The nullability of this pointer is therefore determined by `_eventEmitter` lifecycle in the
 * super class.
 */
- (std::shared_ptr<const facebook::react::RNSBottomTabsEventEmitter>)reactEventEmitter;

- (bool)emitOnNativeFocusChangeRequestSelectedTabScreen:(nonnull RNSBottomTabsScreenComponentView *)tabScreen;

@end

NS_ASSUME_NONNULL_END
