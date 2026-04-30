#pragma once

#import <Foundation/Foundation.h>

NS_ASSUME_NONNULL_BEGIN

/**
 * Describes navigation state of a tabs container.
 *
 * It holds information about key of a selected screen AND state provenance.
 * The provenance describes *a history of the state*. Conceptually, the state with provenance `N + 1`
 * MUST BE derived from state with provenance `N`.
 */
@interface RNSTabsNavigationState : NSObject

/** Screen key of the currently selected tab. */
@property (nonatomic, strong, readonly, nonnull) NSString *selectedScreenKey;

/** Monotonically increasing number describing the generation of this state instance.
 *  Used for stale update detection: state A is stale iff A.provenance <= B.provenance. */
@property (nonatomic, readonly) int provenance;

- (instancetype)initWithSelectedScreenKey:(nonnull NSString *)selectedScreenKey provenance:(int)provenance;

- (instancetype)cloneState;

+ (instancetype)stateWithSelectedScreenKey:(nonnull NSString *)selectedScreenKey provenance:(int)provenance;

@end

/**
 * Origin (actor) that requested a tab transition. Mirrors the public `actionOrigin` event field.
 *
 * - [User] direct native UI interaction (tab bar tap, drag-and-drop).
 * - [ProgrammaticJs] JS-initiated request delivered via the `navStateRequest` prop.
 * - [Implicit] platform side effect not attributable to an explicit actor — UIKit changed the selection
 *   as a side effect of another operation (e.g. More navigation controller disappearing during a
 *   horizontal size class transition on iPad).
 */
typedef NS_ENUM(NSInteger, RNSTabsActionOrigin) {
  RNSTabsActionOriginUser = 0,
  RNSTabsActionOriginProgrammaticJs,
  RNSTabsActionOriginImplicit,
};

/** Bundles a navigation state change together with metadata about the selection context. */
@interface RNSTabsNavigationStateUpdateContext : NSObject

/** The navigation state after the change. */
@property (nonatomic, readonly, strong, nonnull) RNSTabsNavigationState *navState;
/** Whether the same tab that was already selected has been selected again. */
@property (nonatomic, readonly) BOOL isRepeated;
/** Whether a special effect (e.g. scroll-to-top) was triggered by the selection. */
@property (nonatomic, readonly) BOOL hasTriggeredSpecialEffect;
/** Origin (actor) that requested this transition. */
@property (nonatomic, readonly) RNSTabsActionOrigin actionOrigin;

- (instancetype)initWithNavState:(nonnull RNSTabsNavigationState *)navState
                      isRepeated:(BOOL)isRepeated
       hasTriggeredSpecialEffect:(BOOL)hasTriggeredSpecialEffect
                    actionOrigin:(RNSTabsActionOrigin)actionOrigin;

@end

/** Reason why a navigation state update was rejected by the container. */
typedef NS_ENUM(NSInteger, RNSTabsNavigationStateRejectionReason) {
  /** The update's provenance is based on a stale state. */
  RNSTabsNavigationStateRejectionReasonStale = 0,
  /** The requested tab is already selected. */
  RNSTabsNavigationStateRejectionReasonRepeated,
};

NS_ASSUME_NONNULL_END
