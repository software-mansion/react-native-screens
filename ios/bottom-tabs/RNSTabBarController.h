#import <UIKit/UIKit.h>
#import "RNSTabBarAppearanceCoordinator.h"
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

- (instancetype)initWithTabsHostComponentView:(nullable RNSBottomTabsHostComponentView *)tabsHostComponentView;

/**
 * Get reference to the host component view that owns this tab bar controller.
 *
 * Might return null in cases where the controller view hierararchy is not attached to parent.
 */
@property (nonatomic, readonly, nullable) RNSBottomTabsHostComponentView *tabsHostComponentView;

/**
 * Tab bar appearance coordinator. If you need to update tab bar appearance avoid using this one directly. Send the
 * controller a signal, invalidate the tab bar appearance & either wait for the update flush or flush it manually.
 */
@property (nonatomic, readonly, strong, nonnull) RNSTabBarAppearanceCoordinator *tabBarAppearanceCoordinator;

/**
 * Update tab controller state with previously provided children.
 *
 * This method does nothing if the children have not been changed / update has not been requested before.
 * The requested update is performed immediately. If you do not need this, consider just raising an appropriate
 * invalidation signal & let the controller decide when to flush the updates.
 */
- (void)updateReactChildrenControllersIfNeeded;

/**
 * Force update of the tab controller state with previously provided children.
 *
 * The requested update is performed immediately. If you do not need this, consider just raising an appropriate
 * invalidation signal & let the controller decide when to flush the updates.
 */
- (void)updateReactChildrenControllers;

/**
 * Find out which tab bar controller is currently focused & select it.
 *
 * This method does nothing if the update has not been previoulsy requested.
 * If needed, the requested update is performed immediately. If you do not need this, consider just raising an
 * appropriate invalidation signal & let the controller decide when to flush the updates.
 */
- (void)updateSelectedViewControllerIfNeeded;

/**
 * Find out which tab bar controller is currently focused & select it.
 *
 * The requested update is performed immediately. If you do not need this, consider just raising an appropriate
 * invalidation signal & let the controller decide when to flush the updates.
 */
- (void)updateSelectedViewController;

/**
 * Updates the tab bar appearance basing on configuration sources (host view, tab screens).
 *
 * This method does nothing if the update has not been previoulsy requested.
 * If needed, the requested update is performed immediately. If you do not need this, consider just raising an
 * appropriate invalidation signal & let the controller decide when to flush the updates.
 */
- (void)updateTabBarAppearanceIfNeeded;

/**
 * Updates the tab bar appearance basing on configuration sources (host view, tab screens).
 *
 * The requested update is performed immediately. If you do not need this, consider just raising an appropriate
 * invalidation signal & let the controller decide when to flush the updates.
 */
- (void)updateTabBarAppearance;

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

/**
 * Tell the controller that some configuration regarding the tab bar apperance has changed & the appearance requires
 * update.
 */
@property (nonatomic, readwrite) bool needsUpdateOfTabBarAppearance;

@end

NS_ASSUME_NONNULL_END
