#pragma once

#import <Foundation/Foundation.h>
#import "RNSTabsScreenViewController.h"

@class RNSTabsHostComponentView;

NS_ASSUME_NONNULL_BEGIN

#if defined(__cplusplus)
@class RCTImageLoader;
#endif // defined(__cplusplus)

/**
 * Responsible for creating & applying appearance to the tab bar.
 *
 * It does take into account all properties from host component view & tab screen controllers related to tab bar
 * appearance and applies them accordingly in correct order.
 */
@interface RNSTabBarAppearanceCoordinator : NSObject

#if defined(__cplusplus)
/**
 * Applies the tab bar appearance props to the tab bar and respective tab bar items, basing on information contained in
 * provided params.
 *
 * TODO: Do not take references to component view & controllers here. Put the tab bar appearance properites in single
 * type & only take it here.
 */
- (void)updateAppearanceOfTabBar:(nullable UITabBar *)tabBar
           withHostComponentView:(nullable RNSTabsHostComponentView *)hostComponentView
            tabScreenControllers:(nullable NSArray<RNSTabsScreenViewController *> *)tabScreenCtrls
                     imageLoader:(nullable RCTImageLoader *)imageLoader;
#endif // defined(__cplusplus)

@end

NS_ASSUME_NONNULL_END
