#import <Foundation/Foundation.h>
#import "RNSBottomTabsHostComponentView.h"
#import "RNSTabsScreenViewController.h"

NS_ASSUME_NONNULL_BEGIN

@class RCTImageLoader;

/**
 * Responsible for creating & applying appearance to the tab bar.
 *
 * It does take into account all properties from host component view & tab screen controllers related to tab bar
 * appearance and applies them accordingly in correct order.
 */
@interface RNSTabBarAppearanceCoordinator : NSObject

/**
 * Constructs the tab bar appearance from the ground up, basing on information contained in provided params (mostly
 * react props), and then applies it to the tab bar and respective tab bar items.
 *
 * Current implementation configures all tab bar styles & state (stacked, inline, normal, focused, selected, disabled,
 * etc.) with the same appearance.
 *
 * TODO: Do not take references to component view & controllers here. Put the tab bar appearance properites in single
 * type & only take it here.
 */
- (void)updateAppearanceOfTabBar:(nullable UITabBar *)tabBar
           withHostComponentView:(nullable RNSBottomTabsHostComponentView *)hostComponentView
            tabScreenControllers:(nullable NSArray<RNSTabsScreenViewController *> *)tabScreenCtrls
                     imageLoader:(nullable RCTImageLoader *)imageLoader;

@end

NS_ASSUME_NONNULL_END
