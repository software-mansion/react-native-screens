#pragma once

#import <Foundation/Foundation.h>

NS_ASSUME_NONNULL_BEGIN

@class RNSStackNavigationController;

/**
 * Base provenance of a request made before JS has seen any state of the container. Mirrors `Provenance.INITIAL` from
 * the JS side; the container never reports it as the provenance of a state.
 */
FOUNDATION_EXPORT const int RNSStackNavigationStateInitialProvenance;

/**
 * Origin (actor) of a stack transition. Mirrors the public `actionOrigin` event field.
 */
typedef NS_ENUM(NSInteger, RNSStackActionOrigin) {
  /**
   * Native UI action: back button, back button menu, swipe back.
   */
  RNSStackActionOriginUser = 0,
  /**
   * JS request delivered via the `navStateRequest` prop, or a JS-side removal of a child that is in the stack.
   */
  RNSStackActionOriginProgrammaticJs,
  /**
   * Request made by native code integrating directly against `RNSStackNavigationController`.
   */
  RNSStackActionOriginProgrammaticNative,
  /**
   * Platform side effect not attributable to an explicit actor.
   */
  RNSStackActionOriginImplicit,
};

/**
 * Reason why the container rejected a navigation state update.
 */
typedef NS_ENUM(NSInteger, RNSStackNavigationStateRejectionReason) {
  /**
   * The update is based on a state invalidated by a transition of another origin.
   */
  RNSStackNavigationStateRejectionReasonStale = 0,
  /**
   * The requested stack is equal to the current one.
   */
  RNSStackNavigationStateRejectionReasonRepeated,
  /**
   * The requested stack is not a valid target, or its base provenance is unknown to the container.
   */
  RNSStackNavigationStateRejectionReasonInvalid,
};

/**
 * Navigation state of a stack container: the screen keys in the stack and the provenance of the state.
 *
 * The provenance describes the history of the state: the state with provenance `N + 1` is derived from the state with
 * provenance `N`. Instances are immutable.
 */
@interface RNSStackNavigationState : NSObject

/**
 * Screen keys of the screens in the stack, bottom to top. Never empty.
 */
@property (nonatomic, copy, readonly) NSArray<NSString *> *stack;

/**
 * Grows by one with each transition.
 */
@property (nonatomic, readonly) int provenance;

- (instancetype)initWithStack:(NSArray<NSString *> *)stack provenance:(int)provenance;

+ (instancetype)stateWithStack:(NSArray<NSString *> *)stack provenance:(int)provenance;

@end

/**
 * A request to change the navigation state of a stack container. Mirrors the public `StackNavStateRequest` TS type,
 * plus the origin carried internally.
 */
@interface RNSStackNavigationStateUpdateRequest : NSObject

/**
 * Identifies the request. Only a new `requestId` makes the container evaluate a request.
 */
@property (nonatomic, readonly) int requestId;

/**
 * Requested screen keys, bottom to top.
 */
@property (nonatomic, copy, readonly) NSArray<NSString *> *stack;

/**
 * Provenance of the state the request was derived from, or `RNSStackNavigationStateInitialProvenance`.
 */
@property (nonatomic, readonly) int baseProvenance;

@property (nonatomic, readonly) RNSStackActionOrigin actionOrigin;

- (instancetype)initWithRequestId:(int)requestId
                            stack:(NSArray<NSString *> *)stack
                   baseProvenance:(int)baseProvenance
                     actionOrigin:(RNSStackActionOrigin)actionOrigin;

+ (instancetype)requestWithRequestId:(int)requestId
                               stack:(NSArray<NSString *> *)stack
                      baseProvenance:(int)baseProvenance
                        actionOrigin:(RNSStackActionOrigin)actionOrigin;

@end

/**
 * Bundles a navigation state change with its metadata.
 */
@interface RNSStackNavigationStateUpdateContext : NSObject

/**
 * The navigation state after the change.
 */
@property (nonatomic, strong, readonly) RNSStackNavigationState *navState;

/**
 * Origin (actor) of the transition.
 */
@property (nonatomic, readonly) RNSStackActionOrigin actionOrigin;

- (instancetype)initWithNavState:(RNSStackNavigationState *)navState actionOrigin:(RNSStackActionOrigin)actionOrigin;

@end

/**
 * Observer of the navigation state of a stack container (`RNSStackNavigationController`).
 *
 * Several observers may register against one container via `addNavigationStateObserver:` /
 * `removeNavigationStateObserver:`. The host (the view that owns the container) registers itself to relay the events
 * to JS; native libraries integrating directly against the container may register more.
 *
 * Observers are held strongly: remove an observer before it is deallocated, or rely on the host calling `tearDown`
 * on the container.
 */
@protocol RNSStackNavigationStateObserver <NSObject>

@required

/**
 * Called on every transition, whatever its origin, after the container committed it.
 */
- (void)stackContainer:(RNSStackNavigationController *)stackContainer
      didUpdateStateTo:(RNSStackNavigationState *)navState
           withContext:(RNSStackNavigationStateUpdateContext *)context;

/**
 * Called when the container rejects a navigation state update. The state stays unchanged.
 */
- (void)stackContainer:(RNSStackNavigationController *)stackContainer
    rejectedStateUpdate:(RNSStackNavigationStateUpdateRequest *)rejectedRequest
           currentState:(RNSStackNavigationState *)currentNavState
             withReason:(RNSStackNavigationStateRejectionReason)reason;

/**
 * Called when screens removed from the stack are no longer held by the container, i.e. their exit transition
 * finished.
 */
- (void)stackContainer:(RNSStackNavigationController *)stackContainer
    didReleaseScreensWithKeys:(NSArray<NSString *> *)screenKeys;

@end

NS_ASSUME_NONNULL_END
