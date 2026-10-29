#pragma once

#import <UIKit/UIKit.h>
#import "RNSImageLoading.h"
#import "RNSTabsScreenViewController.h"

NS_ASSUME_NONNULL_BEGIN

/**
 * Responsible for creating & applying appearance to the tab bar.
 *
 * It does take into account all properties related to tab bar appearance and applies them accordingly in correct
 * order.
 */
@interface RNSTabBarAppearanceCoordinator : NSObject

/**
 * Applies the tab bar appearance to the tab bar and respective tab bar items, basing on information contained in
 * provided params.
 */
- (void)updateAppearanceOfTabBarController:(nonnull UITabBarController *)tabBarController
                             withTintColor:(nullable UIColor *)tintColor
                      tabScreenControllers:(nullable NSArray<RNSTabsScreenViewController *> *)tabScreenCtrls
                               imageLoader:(nullable id<RNSImageLoading>)imageLoader;

@end

NS_ASSUME_NONNULL_END
