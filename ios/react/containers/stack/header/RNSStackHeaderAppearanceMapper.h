#pragma once

#import <UIKit/UIKit.h>

NS_ASSUME_NONNULL_BEGIN

@interface RNSStackHeaderAppearanceMapper : NSObject

/**
 * Maps appearance props to a UINavigationBarAppearance object.
 * `appearanceDict` should be an NSDictionary where flat entries correspond to UIKit text
 * attributes, e.g. `titleFontFamily`, `subtitleFontColor`, and the `button` / `prominentButton`
 * entries hold per-state sub-dictionaries (`normal`, `highlighted`, `disabled`, `focused`)
 * of bare attributes, e.g. `fontFamily`. An empty dictionary means UIKit defaults.
 */
+ (nullable UINavigationBarAppearance *)appearanceFromDictionary:(nullable NSDictionary *)appearanceDict;

/**
 * Maps scroll edge appearance props to a UINavigationBarAppearance object.
 * `appearanceDict` has the same structure as in `appearanceFromDictionary:`.
 * The appearance object is built with transparent background configured by default, matching UIKit.
 */
+ (nullable UINavigationBarAppearance *)scrollEdgeAppearanceFromDictionary:(nullable NSDictionary *)appearanceDict;

@end

NS_ASSUME_NONNULL_END
