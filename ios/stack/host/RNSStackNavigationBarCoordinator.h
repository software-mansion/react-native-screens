#pragma once

#import <UIKit/UIKit.h>

NS_ASSUME_NONNULL_BEGIN

@interface RNSStackNavigationBarCoordinator : NSObject

- (void)setHidden:(BOOL)hidden
    forNavigationController:(UINavigationController *)navigationController
                   animated:(BOOL)animated;

#if !TARGET_OS_TV
/**
 * Enables or disables the back button's long-press navigation history menu.
 * Takes effect only when the navigation bar is an RNSStackNavigationBar.
 */
- (void)setBackButtonMenuEnabled:(BOOL)enabled forNavigationController:(UINavigationController *)navigationController;
#endif // !TARGET_OS_TV

- (void)initializeNavigationBarOfNavigationController:(UINavigationController *)navigationController;

@end

NS_ASSUME_NONNULL_END
