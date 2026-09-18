#pragma once

#import <UIKit/UIKit.h>
#import "RNSDefines.h"
#import "RNSTabsScreenViewController.h"

NS_ASSUME_NONNULL_BEGIN

/**
 * Keeps the per-tab configuration (title, badge, accessibility) applied to UIKit objects in
 * sync with its react sources of truth. Icons are the appearance coordinator's job.
 */
@interface RNSTabBarItemsCoordinator : NSObject

/// Applies changed accessibility props (testID, accessibilityLabel) onto the
/// `UITabBarItem`s. Serves both children-management paths.
- (void)updateTabBarItemsA11yIfNeededInScreenControllers:
    (nullable NSArray<RNSTabsScreenViewController *> *)screenControllers;

#if RNS_IPHONE_OS_VERSION_AVAILABLE(18_0)
/// `UITab` API only. Mirrors title & badge onto the tabs and accessibility onto their
/// tab-managed `UITabBarItem`s. @return whether anything was mutated - the caller is
/// responsible for repainting the tab bar then.
- (BOOL)syncConfigurationOfTabs:(nullable NSArray<__kindof UITab *> *)tabs API_AVAILABLE(ios(18.0));
#endif // RNS_IPHONE_OS_VERSION_AVAILABLE(18_0)

@end

NS_ASSUME_NONNULL_END
