#pragma once

#import <Foundation/Foundation.h>
#import "RNSTabsNavigationState.h"

NS_ASSUME_NONNULL_BEGIN

/**
 * Holds the set of `RNSTabsNavigationStateObserver`s registered against an
 * `RNSTabBarController` and fans out container events to all of them.
 *
 * Observers are held with strong references; callers must explicitly call
 * `removeObserver:` before observer dealloc, or rely on the host invoking
 * `clear` (via `RNSTabBarController.tearDown`) on container teardown.
 *
 * `emit*` methods invoke each observer in registration order. The `@optional`
 * More-tab callback is dispatched only to observers that respond to the selector.
 */
@interface RNSTabsNavigationStateObserverRegistry : NSObject

/**
 * Register an observer.
 *
 * @returns NO if the observer is already registered or if called
 * during an in-flight `emit*` (modifications during emission are rejected).
 */
- (BOOL)addObserver:(id<RNSTabsNavigationStateObserver>)observer;

/**
 * Unregister an observer.
 *
 * @returns NO if the observer was not registered or if called
 * during an in-flight `emit*` (modifications during emission are rejected).
 */
- (BOOL)removeObserver:(id<RNSTabsNavigationStateObserver>)observer;

/**
 * Drop all registered observers.
 *
 * @returns NO if called during in-flight `emit*` (modifications during emission are rejected).
 */
- (BOOL)clear;

- (void)emitDidUpdateStateTo:(nonnull RNSTabsNavigationState *)navState
                 withContext:(nonnull RNSTabsNavigationStateUpdateContext *)context
                      sender:(nonnull RNSTabBarController *)sender;

- (void)emitRejectedStateUpdate:(nonnull RNSTabsNavigationStateUpdateRequest *)rejectedRequest
                   currentState:(nonnull RNSTabsNavigationState *)currentNavState
                     withReason:(RNSTabsNavigationStateRejectionReason)reason
                         sender:(nonnull RNSTabBarController *)sender;

- (void)emitPreventedSelectionOf:(nonnull NSString *)preventedScreenKey
                    currentState:(nonnull RNSTabsNavigationState *)currentNavState
                          sender:(nonnull RNSTabBarController *)sender;

- (void)emitDidSelectMoreTabWithCurrentState:(nonnull RNSTabsNavigationState *)currentNavState
                                      sender:(nonnull RNSTabBarController *)sender;

@end

NS_ASSUME_NONNULL_END
