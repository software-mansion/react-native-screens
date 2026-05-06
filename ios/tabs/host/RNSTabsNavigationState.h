#pragma once

#import <Foundation/Foundation.h>

NS_ASSUME_NONNULL_BEGIN

@class RNSTabBarController;

/**
 * Origin (actor) that requested a tab transition. Mirrors the public `actionOrigin` event field.
 */
typedef NS_ENUM(NSInteger, RNSTabsActionOrigin) {
  /**
   * Direct native UI interaction (tab bar tap, drag-and-drop).
   */
  RNSTabsActionOriginUser = 0,
  /**
   * JS-initiated request delivered via the `navStateRequest` prop.
   */
  RNSTabsActionOriginProgrammaticJs,
  /**
   * Request initiated from the native side by some actor, e.g. a downstream
   * library integrating directly against `RNSTabBarController`.
   */
  RNSTabsActionOriginProgrammaticNative,
  /**
   * Platform side effect not attributable to an explicit actor — UIKit changed the selection
   * as a side effect of another operation (e.g. More navigation controller disappearing during a
   * horizontal size class transition on iPad).
   */
  RNSTabsActionOriginImplicit,
};

/**
 * Reason why a navigation state update was rejected by the container.
 */
typedef NS_ENUM(NSInteger, RNSTabsNavigationStateRejectionReason) {
  /**
   * The update's provenance is based on a stale state.
   */
  RNSTabsNavigationStateRejectionReasonStale = 0,
  /**
   * The requested tab is already selected.
   */
  RNSTabsNavigationStateRejectionReasonRepeated,
};

/**
 * Describes navigation state of a tabs container.
 *
 * It holds information about key of a selected screen AND state provenance.
 * The provenance describes *a history of the state*. Conceptually, the state with provenance `N + 1`
 * MUST BE derived from state with provenance `N`.
 */
@interface RNSTabsNavigationState : NSObject

/**
 * Screen key of the currently selected tab.
 */
@property (nonatomic, strong, readonly, nonnull) NSString *selectedScreenKey;

/**
 * Monotonically increasing number describing the generation of this state instance.
 * Used for stale update detection.
 */
@property (nonatomic, readonly) int provenance;

- (instancetype)initWithSelectedScreenKey:(nonnull NSString *)selectedScreenKey provenance:(int)provenance;

- (instancetype)cloneState;

+ (instancetype)stateWithSelectedScreenKey:(nonnull NSString *)selectedScreenKey provenance:(int)provenance;

@end

/**
 * A request to change navigation state.
 *
 * Carries the target `selectedScreenKey`, the `baseProvenance` of the state the request was derived from,
 * and the `actionOrigin` (actor) that initiated it. Mirrors the public
 * `TabsHostNavStateRequest` TS type plus an `actionOrigin` carried internally.
 */
@interface RNSTabsNavigationStateUpdateRequest : NSObject

@property (nonatomic, strong, readonly, nonnull) NSString *selectedScreenKey;
@property (nonatomic, readonly) int baseProvenance;
@property (nonatomic, readonly) RNSTabsActionOrigin actionOrigin;

- (instancetype)initWithSelectedScreenKey:(nonnull NSString *)selectedScreenKey
                           baseProvenance:(int)baseProvenance
                             actionOrigin:(RNSTabsActionOrigin)actionOrigin;

- (instancetype)cloneRequest;

+ (instancetype)requestWithSelectedScreenKey:(nonnull NSString *)selectedScreenKey
                              baseProvenance:(int)baseProvenance
                                actionOrigin:(RNSTabsActionOrigin)actionOrigin;

@end

/**
 * Bundles a navigation state change together with metadata about the selection context.
 */
@interface RNSTabsNavigationStateUpdateContext : NSObject

/**
 * The navigation state after the change.
 */
@property (nonatomic, readonly, strong, nonnull) RNSTabsNavigationState *navState;
/**
 * Whether the same tab that was already selected has been selected again.
 */
@property (nonatomic, readonly) BOOL isRepeated;
/**
 * Whether a special effect (e.g. scroll-to-top) was triggered by the selection.
 */
@property (nonatomic, readonly) BOOL hasTriggeredSpecialEffect;
/**
 * Origin (actor) that requested this transition.
 */
@property (nonatomic, readonly) RNSTabsActionOrigin actionOrigin;

- (instancetype)initWithNavState:(nonnull RNSTabsNavigationState *)navState
                      isRepeated:(BOOL)isRepeated
       hasTriggeredSpecialEffect:(BOOL)hasTriggeredSpecialEffect
                    actionOrigin:(RNSTabsActionOrigin)actionOrigin;

@end

/**
 * Observer of navigation state changes on a tabs container (`RNSTabBarController`).
 *
 * Multiple observers may register against a single container via
 * `RNSTabBarController addNavigationStateObserver:` / `removeNavigationStateObserver:`.
 * The host (`RNSTabsHostComponentView`) registers itself as an observer to relay events
 * to JS; downstream native libraries integrating directly against `RNSTabBarController`
 * may register additional observers.
 *
 * Observers are held with strong references; callers must explicitly call
 * `removeNavigationStateObserver:` before observer dealloc, or rely on the host
 * invoking `tearDown` (which clears the registry) on container teardown.
 */
@protocol RNSTabsNavigationStateObserver <NSObject>

@required

/**
 * Called when the container accepts a navigation state change.
 */
- (void)tabsContainer:(nonnull RNSTabBarController *)tabsContainer
     didUpdateStateTo:(nonnull RNSTabsNavigationState *)navState
          withContext:(nonnull RNSTabsNavigationStateUpdateContext *)context;

/**
 * Called when the container rejects a navigation state update.
 */
- (void)tabsContainer:(nonnull RNSTabBarController *)tabsContainer
    rejectedStateUpdate:(nonnull RNSTabsNavigationStateUpdateRequest *)rejectedRequest
           currentState:(nonnull RNSTabsNavigationState *)currentNavState
             withReason:(RNSTabsNavigationStateRejectionReason)reason;

/**
 * Called when a native user action (tap) attempts to select a tab that has
 * `preventNativeSelection` enabled. The navigation state remains unchanged.
 */
- (void)tabsContainer:(nonnull RNSTabBarController *)tabsContainer
    preventedSelectionOf:(nonnull NSString *)preventedScreenKey
            currentState:(nonnull RNSTabsNavigationState *)currentNavState;

@optional

/**
 * iOS-only. Called when the user taps the More tab on iPhone or in iPad split view
 * configurations where UIKit groups overflow tabs into a More navigation controller.
 *
 * This event is informational; the navigation state is not advanced as part of this callback.
 * Android does not emit an analogue.
 */
- (void)tabsContainer:(nonnull RNSTabBarController *)tabsContainer
    didSelectMoreTabWithCurrentState:(nonnull RNSTabsNavigationState *)currentNavState;

@end

NS_ASSUME_NONNULL_END
