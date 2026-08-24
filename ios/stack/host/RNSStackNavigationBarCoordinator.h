#pragma once

#import <UIKit/UIKit.h>

NS_ASSUME_NONNULL_BEGIN

@interface RNSStackNavigationBarCoordinator : NSObject

- (void)setHidden:(BOOL)hidden
    forNavigationController:(UINavigationController *)navigationController
                   animated:(BOOL)animated;

/**
 * Enables or disables the back button's long-press navigation history menu.
 * Takes effect only when the navigation bar is an RNSStackNavigationBar; no-op on tvOS.
 */
- (void)setBackButtonMenuEnabled:(BOOL)enabled forNavigationController:(UINavigationController *)navigationController;

- (void)initializeNavigationBarOfNavigationController:(UINavigationController *)navigationController;

@end

NS_ASSUME_NONNULL_END
