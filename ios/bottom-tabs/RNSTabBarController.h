#import <UIKit/UIKit.h>
#import "RNSTabsScreenViewController.h"

NS_ASSUME_NONNULL_BEGIN

@protocol RNSReactTransactionObserving

- (void)reactMountingTransactionWillMount;

- (void)reactMountingTransactionDidMount;

@end

/**
 * This controller is responsible for tab management & all other responsibilities coming from the fact of inheritance
 * from `UITabBarController`. It is limited only to the child view controllers of type `RNSTabsScreenViewController`,
 * however.
 *
 * Updates made by this controller are synchronized by `RNSReactTransactionObserving` protocol,
 * i.e. if you made changes through one of signals method, unless you flush them immediately (not needed atm), they will
 * be executed only after react finishes the transaction (from within transaction execution block).
 */
@interface RNSTabBarController : UITabBarController <RNSReactTransactionObserving>

/**
 * Apply appearance to the tab bar managed by this controller.
 *
 * @param appearance passed appearance instance will be set for all appearance modes (standard, scrollview, etc.)
 * supported by the tab bar. When set to `nil` the default system appearance will be used.
 */
- (void)applyTabBarAppearance:(nullable UITabBarAppearance *)appearance;

@end

#pragma mark - Signals

/**
 * This extension defines various invalidation signals that you can send to the controller, to notify it that it needs
 * to take some action.
 */
@interface RNSTabBarController ()

/**
 * Tell the controller that react provided tabs have changed (count / instances) & the child view controllers need to be
 * udpated.
 *
 * This also automatically raises `needsReactChildrenUpdate` flag, no need to call it manually.
 */
- (void)childViewControllersHaveChangedTo:(nonnull NSArray<RNSTabsScreenViewController *> *)childViewControllers;

/**
 * Tell the controller that react provided tabs have changed (count / instances) & the child view controllers need to be
 * udpated.
 *
 * Do not raise this signal only when focused state of the tab has changed - use `needsSelectedTabUpdate` instead.
 */
@property (nonatomic, readwrite) bool needsUpdateOfReactChildrenControllers;

/**
 * Tell the controller that react provided tabs have changed (count / instances) & the child view controllers need to be
 * udpated.
 */
@property (nonatomic, readwrite) bool needsUpdateOfSelectedTab;

@end

NS_ASSUME_NONNULL_END
