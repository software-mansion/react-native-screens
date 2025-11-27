#pragma once

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
 * Applies the tab bar appearance props to the tab bar and respective tab bar items, basing on information contained in
 * provided params.
 *
 * TODO: Do not take references to component view & controllers here. Put the tab bar appearance properites in single
 * type & only take it here.
 */
- (void)updateAppearanceOfTabBar:(nullable UITabBar *)tabBar
           withHostComponentView:(nullable RNSBottomTabsHostComponentView *)hostComponentView
            tabScreenControllers:(nullable NSArray<RNSTabsScreenViewController *> *)tabScreenCtrls
                     imageLoader:(nullable RCTImageLoader *)imageLoader;

/**
 * Configures UITabBarAppearance object using appearance props provided in the param.
 *
 * `appearanceProps` should be an NSDictionary with hierarchical structure that corresponds to UIKit's
 * UITabBarAppearance object:
 * - `appearanceProps` can contain:
 *   - `stacked`, `inline` and `compactInline` keys that map to dictionaries corresponding to UIKit's
 * UITabBarItemAppearance objects (`itemAppearanceProps`),
 *   - entries that correspond to other props from UITabBarItemAppearance (UIBarAppearance) object, e.g.
 * `backgroundColor`,
 * - `itemAppearanceProps` can contain `normal`, `selected`, `disabled`, `focused` keys that map to dictionaries
 * corresponding to UIKit's UITabBarItemStateAppearance objects (`itemStateAppearanceProps`),
 * - `itemStateAppearanceProps` can contain entries that correspond to props from UITabBarItemStateAppearance object,
 * e.g. `tabBarItemIconColor`.
 */
+ (void)configureTabBarAppearance:(nonnull UITabBarAppearance *)tabBarAppearance
              fromAppearanceProps:(nonnull NSDictionary *)appearanceProps;

@end

NS_ASSUME_NONNULL_END
