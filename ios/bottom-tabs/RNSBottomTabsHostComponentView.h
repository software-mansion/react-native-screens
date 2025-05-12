#import <React/RCTViewComponentView.h>
#import "RNSBottomTabsHostComponentViewManager.h"
#import "RNSScreenContainer.h"

NS_ASSUME_NONNULL_BEGIN

/**
 * Component view. Lifecycle is managed by React Native.
 *
 * This component serves as:
 * 1. host for UITabBarController
 * 2. provider of React state & props for the tab bar controller
 * 3. two way communication channel with React (commands & events)
 */
@interface RNSBottomTabsHostComponentView : RCTViewComponentView <RNSScreenContainerDelegate>

#pragma mark - Props
// TODO: Extract all props to single struct / use codegened struct

@property (nonatomic, strong, readonly, nullable) UIColor *tabBarBackgroundColor;

@end

NS_ASSUME_NONNULL_END
