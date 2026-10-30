#pragma once

#import <UIKit/UIKit.h>

NS_ASSUME_NONNULL_BEGIN

@interface RNSTabBarAppearanceMapper : NSObject

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
