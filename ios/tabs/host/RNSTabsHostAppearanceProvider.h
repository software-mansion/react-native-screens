#pragma once

#import <UIKit/UIKit.h>

NS_ASSUME_NONNULL_BEGIN

/**
 * Provides the host-level configuration of the tab bar to `RNSTabBarController`.
 */
@protocol RNSTabsHostAppearanceProvider <NSObject>

@property (nonatomic, readonly, nullable) UIColor *tabBarTintColor;
@property (nonatomic, readonly) UITraitEnvironmentLayoutDirection layoutDirection;

@end

NS_ASSUME_NONNULL_END
