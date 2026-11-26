#pragma once

#import <Foundation/Foundation.h>
#import "RNSStackNavigationState.h"

NS_ASSUME_NONNULL_BEGIN

/**
 * Holds the `RNSStackNavigationStateObserver`s registered against an `RNSStackNavigationController` and fans out the
 * container's events to all of them, in registration order.
 *
 * Observers are held strongly: remove an observer before it is deallocated, or rely on the host calling `tearDown` on
 * the container, which clears the registry.
 */
@interface RNSStackNavigationStateObserverRegistry : NSObject

/**
 * @returns NO if the observer is already registered, or if called during an emission.
 */
- (BOOL)addObserver:(id<RNSStackNavigationStateObserver>)observer;

/**
 * @returns NO if the observer is not registered, or if called during an emission.
 */
- (BOOL)removeObserver:(id<RNSStackNavigationStateObserver>)observer;

/**
 * Drops all observers.
 *
 * @returns NO if called during an emission.
 */
- (BOOL)clear;

- (void)emitDidUpdateStateTo:(RNSStackNavigationState *)navState
                 withContext:(RNSStackNavigationStateUpdateContext *)context
                      sender:(RNSStackNavigationController *)sender;

- (void)emitRejectedStateUpdate:(RNSStackNavigationStateUpdateRequest *)rejectedRequest
                   currentState:(RNSStackNavigationState *)currentNavState
                     withReason:(RNSStackNavigationStateRejectionReason)reason
                         sender:(RNSStackNavigationController *)sender;

- (void)emitDidReleaseScreensWithKeys:(NSArray<NSString *> *)screenKeys sender:(RNSStackNavigationController *)sender;

@end

NS_ASSUME_NONNULL_END
