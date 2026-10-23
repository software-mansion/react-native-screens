#pragma once

#import <UIKit/UIKit.h>
#import "RNSImageLoading.h"
#import "RNSTabsScreenViewController.h"

NS_ASSUME_NONNULL_BEGIN

/**
 * Responsible for creating & applying appearance to the tab bar.
 *
 * It does take into account the host's tint color & all properties of the tab screen controllers related to tab bar
 * appearance and applies them accordingly in correct order.
 */
@interface RNSTabBarAppearanceCoordinator : NSObject

/**
 * Applies the tint color to the tab bar of the given controller, and the appearance and icons of every tab screen to
 * its tab bar item. Icons given as image sources are loaded through `imageLoader`.
 */
- (void)updateAppearanceOfTabBarController:(nonnull UITabBarController *)tabBarController
                             withTintColor:(nullable UIColor *)tintColor
                      tabScreenControllers:(nullable NSArray<RNSTabsScreenViewController *> *)tabScreenCtrls
                               imageLoader:(nullable id<RNSImageLoading>)imageLoader;

@end

NS_ASSUME_NONNULL_END
