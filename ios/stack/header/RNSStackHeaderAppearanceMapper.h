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
 * Maps appearance props to a UINavigationBarAppearance object derived from `baseAppearance`.
 *
 * The result inherits from `baseAppearance` and uses a transparent background, mirroring
 * how UIKit resolves a nil scroll edge appearance from the standard one. Entries in
 * `appearanceDict` override the inherited attributes.
 */
+ (nullable UINavigationBarAppearance *)appearanceFromDictionary:(nullable NSDictionary *)appearanceDict
                                                  inheritingFrom:(nullable UINavigationBarAppearance *)baseAppearance;

@end

NS_ASSUME_NONNULL_END
