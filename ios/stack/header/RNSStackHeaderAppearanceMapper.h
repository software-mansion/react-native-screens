#pragma once

#import <UIKit/UIKit.h>

NS_ASSUME_NONNULL_BEGIN

@interface RNSStackHeaderAppearanceMapper : NSObject

/**
 * Maps appearance props to a UINavigationBarAppearance object.
 * `appearanceDict` should be an NSDictionary with a flat structure, where entries correspond
 * to UIKit attributes, e.g. `titleFontFamily`, `subtitleFontColor`, or empty, for UIKit defaults.
 */
+ (nullable UINavigationBarAppearance *)appearanceFromDictionary:(nullable NSDictionary *)appearanceDict;

/**
 * Maps scroll edge appearance props to a UINavigationBarAppearance object.
 * `appearanceDict` should be an NSDictionary with a flat structure, where entries correspond
 * to UIKit attributes, e.g. `titleFontFamily`, `subtitleFontColor`, or empty, for UIKit defaults.
 * The appearance object is built with transparent background configured by default, matching UIKit.
 */
+ (nullable UINavigationBarAppearance *)scrollEdgeAppearanceFromDictionary:(nullable NSDictionary *)appearanceDict;

@end

NS_ASSUME_NONNULL_END
