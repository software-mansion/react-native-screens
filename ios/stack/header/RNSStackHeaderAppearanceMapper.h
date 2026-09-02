#pragma once

#import <UIKit/UIKit.h>

NS_ASSUME_NONNULL_BEGIN

@interface RNSStackHeaderAppearanceMapper : NSObject

/**
 * Maps appearance props to a UINavigationBarAppearance object.
 *
 * `appearanceDict` should be an NSDictionary with a flat structure, where entries correspond
 * to UIKit attributes, e.g. `titleFontFamily`, `subtitleFontColor`.
 */
+ (nullable UINavigationBarAppearance *)appearanceFromDictionary:(nullable NSDictionary *)appearanceDict;

/**
 * Maps scroll edge appearance props to a standalone UINavigationBarAppearance object.
 *
 * Returns nil for an empty dictionary — the navigation item's scroll edge appearance
 * should then stay nil, so that UIKit's native resolution applies: the item's (or bar's)
 * standard appearance with a transparent background. When a dictionary is provided, the
 * result is built on the same transparent-background base with the given attributes on
 * top; it intentionally does NOT inherit attributes from the standard appearance,
 * mirroring how UIKit treats an explicitly assigned scroll edge appearance object as a
 * complete description.
 */
+ (nullable UINavigationBarAppearance *)scrollEdgeAppearanceFromDictionary:(nullable NSDictionary *)appearanceDict;

@end

NS_ASSUME_NONNULL_END
