#pragma once

#import <UIKit/UIKit.h>
#import "RNSTabBarAppearanceCoordinator.h"
#import "RNSTabsNavigationState.h"
#import "RNSTabsScreenViewController.h"

#if !TARGET_OS_TV
#import "RNSOrientationProviding.h"
#endif // !TARGET_OS_TV

NS_ASSUME_NONNULL_BEGIN

@class RNSTabsHostComponentView;
@class RNSTabBarController;

@protocol RNSReactTransactionObserving

- (void)reactMountingTransactionWillMount;

- (void)reactMountingTransactionDidMount;

@end

/**
 * UITabBarController subclass that backs `<TabsHost>` on iOS.
 *
 * This controller is responsible for tab management & all other responsibilities coming from the
 * fact of inheritance from `UITabBarController`. It is limited only to the child view controllers
 * of type `RNSTabsScreenViewController`, however.
 *
 * Updates made by this controller are synchronized by `RNSReactTransactionObserving` protocol,
 * i.e. if you made changes through one of signals method, unless you flush them immediately, they
 * will be executed only after react finishes the transaction (from within transaction execution
 * block).
 *
 * # Public API
 *
 * Methods and properties under `#pragma mark - Public API` below are the only contract
 * third-party native consumers should rely on:
 *   - read the current navigation state via `navigationState`,
 *   - request a tab change via `submitSelectionOfTabsScreenWithKey:` (transition is recorded with
 *     `RNSTabsActionOriginProgrammaticNative`),
 *   - apply pending updates via `flushPendingUpdates`,
 *   - observe results via `addNavigationStateObserver:` / `removeNavigationStateObserver:`
 *     (see `RNSTabsNavigationStateObserver` in `RNSTabsNavigationState.h`).
 *
 * # Internal API
 *
 * Members under `#pragma mark - Internal API` are host-only (`RNSTabsHostComponentView`)
 * implementation detail and may change without notice. Do not call from third-party code.
 */
@interface RNSTabBarController : UITabBarController <RNSReactTransactionObserving
#if !TARGET_OS_TV
                                                     ,
                                                     RNSOrientationProviding
#endif // !TARGET_OS_TV
                                                     >

#pragma mark - Public API

/**
 * Represents current navigation state.
 *
 * After each model update, the container (controller) updates the navigation state. The
 * `provenance` part is incremented monotonically with each state update.
 *
 * The controller manages this state. It MUST NOT be overwritten by any external actor.
 */
@property (nonatomic, readonly, strong, nullable) RNSTabsNavigationState *navigationState;

/**
 * Request a tab change. The transition is recorded with `RNSTabsActionOriginProgrammaticNative`,
 * and is built against the current `navigationState.provenance` so it is never treated as stale.
 *
 * The update is applied on the next `RNSReactTransactionObserving` callback, or call
 * `flushPendingUpdates` to apply it immediately. If you want to execute multiple updates in
 * sequence you must flush the container after each one separately.
 */
- (void)submitSelectionOfTabsScreenWithKey:(nonnull NSString *)screenKey;

/**
 * Apply any pending invalidations and state updates in a single coordinated pass.
 * No-op when nothing is dirty.
 */
- (void)flushPendingUpdates;

/**
 * Register an observer for navigation state events on this container.
 * Observers are held strongly; call `removeNavigationStateObserver:` before observer
 * dealloc, or rely on the host calling `tearDown` on container teardown.
 *
 * Returns NO if the observer is already registered or if called from within an
 * observer callback (modifications during emission are rejected).
 */
- (BOOL)addNavigationStateObserver:(id<RNSTabsNavigationStateObserver>)observer;

/**
 * Unregister a previously registered observer.
 *
 * Returns NO if the observer was not registered or if called from within an
 * observer callback (modifications during emission are rejected).
 */
- (BOOL)removeNavigationStateObserver:(id<RNSTabsNavigationStateObserver>)observer;

#pragma mark - Internal API (host-only; subject to change without notice)

- (instancetype)initWithTabsHostComponentView:(nullable RNSTabsHostComponentView *)tabsHostComponentView;

/**
 * Get reference to the host component view that owns this tab bar controller.
 *
 * Might return null in cases where the controller view hierararchy is not attached to parent.
 * The reference is retained strongly and it is expected to be managed by `TabsHost`.
 */
@property (nonatomic, readonly, nullable) RNSTabsHostComponentView *tabsHostComponentView;

/**
 * Tab bar appearance coordinator. If you need to update tab bar appearance avoid using this one
 * directly. Send the controller a signal, invalidate the tab bar appearance & either wait for the
 * update flush or flush it manually.
 */
@property (nonatomic, readonly, strong, nonnull) RNSTabBarAppearanceCoordinator *tabBarAppearanceCoordinator;

/**
 * If true, the controller will reject any navigation state updates if the provenance of the
 * update is stale.
 *
 * A navigation state update is considered stale if its provenance is older than the provenance
 * of the currently active navigation state.
 *
 * This can happen, e.g. when an update from JS is dispatched, but before it reaches the native
 * side, another update happens on UI thread, e.g. user selects another tab. For such situations,
 * where to-be-applied navigation state update had been dispatched w/o full context of actual
 * navigation state you can toggle this prop.
 *
 * If an update is rejected due to being stale, the controller will notify its observers.
 */
@property (nonatomic, readwrite) BOOL rejectStaleNavigationStateUpdates;

/**
 * Tell the controller that react provided tabs have changed (count / instances) & the child
 * view controllers need to be updated.
 *
 * This also automatically raises `needsUpdateOfChildViewControllers` flag, no need to call it
 * manually.
 */
- (void)childViewControllersHaveChangedTo:(nonnull NSArray<RNSTabsScreenViewController *> *)childViewControllers;

/**
 * Request navigation state update from the controller to the given one.
 *
 * Pass nil to clear any queued update.
 *
 * The update is applied on the next `RNSReactTransactionObserving` callback, or call
 * `flushPendingUpdates` to apply it immediately. If you want to execute multiple updates in
 * sequence you must flush the container after each one separately.
 *
 * Host-only: third-party native consumers should use `submitSelectionOfTabsScreenWithKey:` instead, which
 * forces `RNSTabsActionOriginProgrammaticNative`. This method allows the host to dispatch any
 * origin (e.g. `RNSTabsActionOriginProgrammaticJs` for JS-driven `navStateRequest` updates).
 */
- (void)setPendingNavigationStateUpdate:(nullable RNSTabsNavigationStateUpdateRequest *)stateUpdate;

/**
 * Idempotent teardown. Releases observer references and any retained host references.
 * Called by the host on view lifecycle end.
 */
- (void)tearDown;

#pragma mark Individual flush methods (internal)

/**
 * Update tab controller state with previously provided children.
 *
 * This method does nothing if the children have not been changed / update has not been requested
 * before. The requested update is performed immediately. If you do not need this, consider just
 * raising an appropriate invalidation signal & let the controller decide when to flush the
 * updates.
 */
- (void)updateChildViewControllersIfNeeded;

/**
 * Force update of the tab controller state with previously provided children.
 *
 * The requested update is performed immediately. If you do not need this, consider just raising
 * an appropriate invalidation signal & let the controller decide when to flush the updates.
 */
- (void)updateReactChildrenControllers;

/**
 * If any state update operation is pending - perform it.
 *
 * This method does nothing if the update has not been previously requested.
 * If needed, the requested update is performed immediately. If you do not need this, consider
 * just raising an appropriate invalidation signal & let the controller decide when to flush the
 * updates.
 */
- (void)updateSelectedViewControllerIfNeeded;

/**
 * Update the selected view controller to what's currently requested.
 *
 * To request update use `setPendingNavigationStateUpdate`.
 *
 * The requested update is performed immediately. If you do not need this, consider just raising
 * an appropriate invalidation signal & let the controller decide when to flush the updates.
 */
- (void)updateSelectedViewController;

/**
 * Updates the tab bar appearance basing on configuration sources (host view, tab screens).
 *
 * This method does nothing if the update has not been previously requested.
 * If needed, the requested update is performed immediately. If you do not need this, consider
 * just raising an appropriate invalidation signal & let the controller decide when to flush the
 * updates.
 */
- (void)updateTabBarAppearanceIfNeeded;

/**
 * Updates the tab bar appearance basing on configuration sources (host view, tab screens).
 *
 * The requested update is performed immediately. If you do not need this, consider just raising
 * an appropriate invalidation signal & let the controller decide when to flush the updates.
 */
- (void)updateTabBarAppearance;

/**
 * Updates the interface orientation based on selected tab screen and its children.
 *
 * This method does nothing if the update has not been previously requested.
 * If needed, the requested update is performed immediately. If you do not need this, consider
 * just raising an appropriate invalidation signal & let the controller decide when to flush the
 * updates.
 */
- (void)updateOrientationIfNeeded;

/**
 * Updates the interface orientation based on selected tab screen and its children.
 *
 * The requested update is performed immediately. If you do not need this, consider just raising
 * an appropriate invalidation signal & let the controller decide when to flush the updates.
 */
- (void)updateOrientation;

/**
 * Updates the layout direction based on property on host view.
 *
 * This method does nothing if the update has not been previously requested.
 * If needed, the requested update is performed immediately. If you do not need this, consider
 * just raising an appropriate invalidation signal & let the controller decide when to flush the
 * updates.
 *
 * This method is necessary only on iOS versions prior to 17.
 * On iOS 17+, use `traitOverrides.layoutDirection` on the controller directly.
 */
- (void)updateLayoutDirectionBelowIOS17IfNeeded;

/**
 * Updates the layout direction based on property on host view.
 *
 * The requested update is performed immediately. If you do not need this, consider just raising
 * an appropriate invalidation signal & let the controller decide when to flush the updates.
 *
 * This method is necessary only on iOS versions prior to 17.
 * On iOS 17+, use `traitOverrides.layoutDirection` on the controller directly.
 *
 * This method can only be called when `parentViewController` is not nil.
 */
- (void)updateLayoutDirectionBelowIOS17;

#pragma mark Individual invalidation flags (internal)

/**
 * Tell the controller that react provided tabs have changed (count / instances) & the child
 * view controllers need to be updated.
 *
 * Do not raise this signal only when you want to modify selected view controller. Use
 * `setPendingNavigationStateUpdate` instead.
 */
@property (nonatomic, readwrite) bool needsUpdateOfChildViewControllers;

/**
 * Tell the controller that some configuration regarding the tab bar apperance has changed & the
 * appearance requires update.
 */
@property (nonatomic, readwrite) bool needsUpdateOfTabBarAppearance;

/**
 * Tell the controller that some configuration regarding interface orientation has changed & it
 * requires update.
 */
@property (nonatomic, readwrite) bool needsOrientationUpdate;

/**
 * Tell the controller that some configuration regarding layout direction has changed & it
 * requires update.
 *
 * This flag is necessary only on iOS versions prior to 17.
 * On iOS 17+, use `traitOverrides.layoutDirection` on the controller directly.
 */
@property (nonatomic, readwrite) bool needsLayoutDirectionUpdateBelowIOS17;

@end

NS_ASSUME_NONNULL_END
