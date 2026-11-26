#pragma once

#import "RNSContainer.h"
#import "RNSContainerTransactionSupporting.h"
#include "RNSStackNavigationBarCoordinator.h"
#import "RNSStackNavigationState.h"

@class RNSStackScreenController;
@protocol RNSViewControllerViewLifecycleEventsObserver;
@protocol RNSViewFrameChangeDelegate;

NS_ASSUME_NONNULL_BEGIN

/**
 * `UINavigationController` subclass that backs `Stack.Host` on iOS.
 *
 * The controller holds the navigation state of the stack (RFC-1941): the list of screens in the stack and the
 * provenance of that state. The list is kept by the controller itself and is the only model of the stack;
 * `viewControllers` is never read back as the model (undocumented): it ignores a `setViewControllers:` UIKit queues
 * behind its running transition, and it drops the swiped screen when a swipe begins, before it commits or cancels.
 *
 * The controller owns its `delegate` and the delegate of its system pop gesture recognizers. Do not replace them.
 *
 * # Public API
 *
 * Members under `#pragma mark - Public API` are the contract third-party native consumers may rely on:
 *   - read the current navigation state via `navigationState`,
 *   - observe its changes via `addNavigationStateObserver:` / `removeNavigationStateObserver:` (see
 *     `RNSStackNavigationStateObserver` in `RNSStackNavigationState.h`).
 *
 * # Internal API
 *
 * Members under `#pragma mark - Internal API` are host-only (the view that owns this controller) and may change
 * without notice.
 */
@interface RNSStackNavigationController : UINavigationController <RNSContainer, RNSContainerTransactionSupporting>

#pragma mark - Public API

/**
 * The current navigation state. Nil until the first state of the stack is committed, never nil afterwards.
 *
 * The provenance grows by one with each transition. The controller manages this state; it MUST NOT be changed by any
 * external actor.
 */
@property (nonatomic, strong, readonly, nullable) RNSStackNavigationState *navigationState;

/**
 * Registers an observer of the navigation state. Observers are held strongly: remove the observer before it is
 * deallocated, or rely on the host calling `tearDown`.
 *
 * @returns NO if the observer is already registered, or if called from an observer callback.
 */
- (BOOL)addNavigationStateObserver:(id<RNSStackNavigationStateObserver>)observer;

/**
 * Unregisters an observer.
 *
 * @returns NO if the observer is not registered, or if called from an observer callback.
 */
- (BOOL)removeNavigationStateObserver:(id<RNSStackNavigationStateObserver>)observer;

#pragma mark - Internal API (host-only; subject to change without notice)

@property (nonatomic, weak, nullable) id<RNSViewFrameChangeDelegate> navigationBarFrameChangeDelegate;

/**
 * Notified when this controller lays out its view.
 */
@property (nonatomic, weak, nullable) id<RNSViewFrameChangeDelegate> viewFrameChangeDelegate;

/**
 * Notified about the lifecycle events of this controller's view.
 */
@property (nonatomic, weak, nullable) id<RNSViewControllerViewLifecycleEventsObserver> viewLifecycleEventsObserver;

@property (nonatomic, readonly, nonnull) RNSStackNavigationBarCoordinator *navigationBarCoordinator;

/**
 * Whether a JS request based on `baseProvenance` is stale, i.e. a transition of an origin other than JS has happened
 * since the state with that provenance (RFC-1941, "Staleness and invalidation"). A request based on
 * `RNSStackNavigationStateInitialProvenance` is stale iff any such transition has happened since the controller was
 * created.
 *
 * Does not check whether `baseProvenance` is known to the controller.
 */
- (BOOL)isJsRequestBaseProvenanceStale:(int)baseProvenance;

/**
 * Idempotent teardown. Releases the observers. Called by the host when its view is invalidated.
 */
- (void)tearDown;

@end

NS_ASSUME_NONNULL_END
