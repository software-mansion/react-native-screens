#pragma once

#import <UIKit/UIKit.h>
#import "RNSTabBarAppearanceCoordinator.h"
#import "RNSTabsNavigationState.h"
#import "RNSTabsScreenViewController.h"

#if !TARGET_OS_TV
#import "RNSOrientationProviding.h"
#endif // !TARGET_OS_TV

NS_ASSUME_NONNULL_BEGIN

@protocol RNSReactTransactionObserving

- (void)reactMountingTransactionWillMount;

- (void)reactMountingTransactionDidMount;

@end

@class RNSTabsNavigationStateUpdateContext;

/**
 * This controller is responsible for tab management & all other responsibilities coming from the fact of inheritance
 * from `UITabBarController`. It is limited only to the child view controllers of type `RNSTabsScreenViewController`,
 * however.
 *
 * Updates made by this controller are synchronized by `RNSReactTransactionObserving` protocol,
 * i.e. if you made changes through one of signals method, unless you flush them immediately (not needed atm), they will
 * be executed only after react finishes the transaction (from within transaction execution block).
 */
@interface RNSTabBarController : UITabBarController <
                                     RNSReactTransactionObserving
#if !TARGET_OS_TV
                                     ,
                                     RNSOrientationProviding
#endif // !TARGET_OS_TV
                                     >

- (instancetype)initWithTabsHostComponentView:(nullable RNSTabsHostComponentView *)tabsHostComponentView;

/**
 * Get reference to the host component view that owns this tab bar controller.
 *
 * Might return null in cases where the controller view hierararchy is not attached to parent.
 * The reference is retained strongly and it is expected to be managed by `TabsHost`.
 */
@property (nonatomic, readonly, nullable) RNSTabsHostComponentView *tabsHostComponentView;

/**
 * Tab bar appearance coordinator. If you need to update tab bar appearance avoid using this one directly. Send the
 * controller a signal, invalidate the tab bar appearance & either wait for the update flush or flush it manually.
 */
@property (nonatomic, readonly, strong, nonnull) RNSTabBarAppearanceCoordinator *tabBarAppearanceCoordinator;

/**
 * Represents current navigation state.
 *
 * After each model update, the container (controller) udpates the navigation state. The `provenance` part is
 * incremented monotonically with each state update.
 *
 * The controller manages this state. It MUST NOT be overwritten by any external actor.
 */
@property (nonatomic, readonly, strong, nullable) RNSTabsNavigationState *navigationState;

/**
 * Update tab controller state with previously provided children.
 *
 * This method does nothing if the children have not been changed / update has not been requested before.
 * The requested update is performed immediately. If you do not need this, consider just raising an appropriate
 * invalidation signal & let the controller decide when to flush the updates.
 */
- (void)updateChildViewControllersIfNeeded;

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
 * This method does nothing if the update has not been previously requested.
 * If needed, the requested update is performed immediately. If you do not need this, consider just raising an
 * appropriate invalidation signal & let the controller decide when to flush the updates.
 */
- (void)updateSelectedViewControllerIfNeeded;

/**
 * Update the selected view controller to what's currently requested.
 *
 * To request update use `setPendingNavigationStateUpdate`.
 *
 * The requested update is performed immediately. If you do not need this, consider just raising an appropriate
 * invalidation signal & let the controller decide when to flush the updates.
 */
- (void)updateSelectedViewController;

/**
 * Updates the tab bar appearance basing on configuration sources (host view, tab screens).
 *
 * This method does nothing if the update has not been previously requested.
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

/**
 * Updates the interface orientation based on selected tab screen and its children.
 *
 * This method does nothing if the update has not been previously requested.
 * If needed, the requested update is performed immediately. If you do not need this, consider just raising an
 * appropriate invalidation signal & let the controller decide when to flush the updates.
 */
- (void)updateOrientationIfNeeded;

/**
 * Updates the interface orientation based on selected tab screen and its children.
 *
 * The requested update is performed immediately. If you do not need this, consider just raising an appropriate
 * invalidation signal & let the controller decide when to flush the updates.
 */
- (void)updateOrientation;

/**
 * Updates the layout direction based on property on host view.
 *
 * This method does nothing if the update has not been previously requested.
 * If needed, the requested update is performed immediately. If you do not need this, consider just raising an
 * appropriate invalidation signal & let the controller decide when to flush the updates.
 *
 * This method is necessary only on iOS versions prior to 17.
 * On iOS 17+, use `traitOverrides.layoutDirection` on the controller directly.
 */
- (void)updateLayoutDirectionBelowIOS17IfNeeded;

/**
 * Updates the layout direction based on property on host view.
 *
 * The requested update is performed immediately. If you do not need this, consider just raising an appropriate
 * invalidation signal & let the controller decide when to flush the updates.
 *
 * This method is necessary only on iOS versions prior to 17.
 * On iOS 17+, use `traitOverrides.layoutDirection` on the controller directly.
 *
 * This method can only be called when `parentViewController` is not nil.
 */
- (void)updateLayoutDirectionBelowIOS17;
@end

#pragma mark - Signals

/**
 * This extension defines various invalidation signals that you can send to the controller, to notify it that it needs
 * to take some action.
 */
@interface RNSTabBarController ()

/**
 * Tell the controller that react provided tabs have changed (count / instances) & the child view controllers need to be
 * updated.
 *
 * This also automatically raises `needsReactChildrenUpdate` flag, no need to call it manually.
 */
- (void)childViewControllersHaveChangedTo:(nonnull NSArray<RNSTabsScreenViewController *> *)childViewControllers;

/**
 * Request navigation state update from the controller to the given one.
 *
 * If you want to exectue multiple updates in sequence you must flush the container after each one separately.
 */
- (void)setPendingNavigationStateUpdate:(nullable RNSTabsNavigationState *)navState;

/**
 * Tell the controller that react provided tabs have changed (count / instances) & the child view controllers need to be
 * updated.
 *
 * Do not raise this signal only when focused state of the tab has changed - use `needsSelectedTabUpdate` instead.
 */
@property (nonatomic, readwrite) bool needsUpdateOfChildViewControllers;

/**
 * Tell the controller that some configuration regarding the tab bar apperance has changed & the appearance requires
 * update.
 */
@property (nonatomic, readwrite) bool needsUpdateOfTabBarAppearance;

/**
 * Tell the controller that some configuration regarding interface orientation has changed & it requires update.
 */
@property (nonatomic, readwrite) bool needsOrientationUpdate;

/**
 * Tell the controller that some configuration regarding layout direction has changed & it requires update.
 *
 * This flag is necessary only on iOS versions prior to 17.
 * On iOS 17+, use `traitOverrides.layoutDirection` on the controller directly.
 */
@property (nonatomic, readwrite) bool needsLayoutDirectionUpdateBelowIOS17;

@end

NS_ASSUME_NONNULL_END
