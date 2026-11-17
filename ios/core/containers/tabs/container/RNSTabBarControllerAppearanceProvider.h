#pragma once

#import <UIKit/UIKit.h>

NS_ASSUME_NONNULL_BEGIN

/**
 * Provides the configuration of the tab bar and of the whole tab bar controller (e.g. tint color, layout direction)
 * to `RNSTabBarController`.
 */
@protocol RNSTabBarControllerAppearanceProvider <NSObject>

@property (nonatomic, readonly, nullable) UIColor *tabBarTintColor;
@property (nonatomic, readonly) UITraitEnvironmentLayoutDirection layoutDirection;

@end

NS_ASSUME_NONNULL_END
