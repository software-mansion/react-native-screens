#pragma once

#import <UIKit/UIKit.h>
#import "RNSContainerItem.h"

NS_ASSUME_NONNULL_BEGIN

@class RNSStackController;
@class RNSStackNavigationBar;
@class RNSStackScreenHeaderCoordinator;
@protocol RNSStackContainerItemConfigProviding;
@protocol RNSStackScreenControllerDelegate;

@interface RNSStackScreenController : UIViewController <RNSContainerItem>

@property (nonatomic, strong, readonly, nonnull) RNSStackScreenHeaderCoordinator *headerCoordinator;

@property (nonatomic, weak, nullable) id<RNSStackScreenControllerDelegate> delegate;
@property (nonatomic, weak, nullable) id<RNSStackContainerItemConfigProviding> configProvider;

#pragma mark - Screen navigation bar

/**
 * When YES, the screen renders its own navigation bar (`screenNavigationBar`) at the top of its view,
 * instead of using the navigation bar shared by the stack. The bar is a part of the screen's view,
 * so it moves together with the screen during transitions.
 */
@property (nonatomic, getter=isScreenNavigationBarEnabled) BOOL screenNavigationBarEnabled;

/**
 * Navigation bar owned by this screen. nil unless `screenNavigationBarEnabled` is YES.
 */
@property (nonatomic, strong, readonly, nullable) RNSStackNavigationBar *screenNavigationBar;

/**
 * Back item of `screenNavigationBar` (see `UINavigationBar.backItem`), which makes the bar display
 * the back button. nil unless `screenNavigationBarEnabled` is YES.
 */
@property (nonatomic, strong, readonly, nullable) UINavigationItem *screenNavigationBarBackItem;

/**
 * Navigation item that holds the header configuration of this screen: the top item of
 * `screenNavigationBar` when the screen navigation bar is enabled, `navigationItem` otherwise.
 *
 * The top item of `screenNavigationBar` is a separate item from `navigationItem`: the navigation bar
 * shared by the stack holds the `navigationItem`s of all its view controllers (even while hidden)
 * and an item can't be a part of two navigation bars at once.
 */
@property (nonatomic, readonly, nonnull) UINavigationItem *headerNavigationItem;

- (void)setScreenNavigationBarHidden:(BOOL)hidden;

/**
 * Updates the items of `screenNavigationBar` according to the position of this screen in the stack:
 * the back item is displayed for all screens except for the root one.
 */
- (void)updateScreenNavigationBarItems;

@end

/**
 * Receives the lifecycle of a stack screen from its controller.
 */
@protocol RNSStackScreenControllerDelegate <NSObject>

- (void)viewControllerViewWillAppear:(RNSStackScreenController *)controller;
- (void)viewControllerViewDidAppear:(RNSStackScreenController *)controller;
- (void)viewControllerViewWillDisappear:(RNSStackScreenController *)controller;
- (void)viewControllerViewDidDisappear:(RNSStackScreenController *)controller;

/**
 * Called when the controller has been removed from its navigation controller, after the pop transition completed.
 * The removal may have been requested by the owner of the screen or made by UIKit (e.g. the back gesture); the
 * delegate tells them apart.
 */
- (void)stackScreenControllerDidLeaveStack:(RNSStackScreenController *)controller;

@end

/**
 * What the view of a stack screen provides to its `RNSStackScreenController`.
 */
@protocol RNSStackContainerItemConfigProviding <NSObject>

@property (nonatomic, readonly, nullable) NSString *screenKey;

/**
 * Content scroll view registered within the screen, or nil if none has been registered.
 */
- (nullable UIScrollView *)cachedContentScrollView;

@end

NS_ASSUME_NONNULL_END
