#pragma once

#import <Foundation/Foundation.h>
#import "RNSTabsScreenViewController.h"

NS_ASSUME_NONNULL_BEGIN

@interface RNSTabBarItemCoordinator : NSObject

/**
 * Returns a new `UITabBarItem` with the given system item, or nil for `RNSTabsScreenSystemItemNone`.
 */
+ (nullable UITabBarItem *)tabBarItemWithSystemItem:(RNSTabsScreenSystemItem)systemItem;

/**
 * Title the tab of the given screen should display: the screen's own title, or the system item's default one.
 */
- (nullable NSString *)titleForTabScreenController:(nonnull RNSTabsScreenViewController *)tabScreenCtrl;

- (void)createTabBarItemsForTabScreenControllers:(nullable NSArray<RNSTabsScreenViewController *> *)tabScreenCtrls;

- (void)updateTabBarItemsForTabScreenControllers:(nullable NSArray<RNSTabsScreenViewController *> *)tabScreenCtrls;

@end

NS_ASSUME_NONNULL_END
