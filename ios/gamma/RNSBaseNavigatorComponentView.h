#pragma once

#import "RNSBaseScreenComponentView.h"
#import "RNSReactBaseView.h"

@class RNSBaseNavigatorController;

NS_ASSUME_NONNULL_BEGIN

/**
 * @class RNSBaseNavigatorComponentView
 * @brief Base Fabric component view for gamma stack host and split navigator components.
 *
 * Captures the shared communication pattern between a navigator component view and its child
 * screen component views:
 * - reactSubviews — typed access to child RNSBaseScreenComponentView instances.
 * - screenChangedActivityMode: forwards activity-mode change notifications to the navigator controller.
 * - mountingTransactionWillMount: / mountingTransactionDidMount: drive deferred child-VC updates.
 *
 * Subclasses must override:
 * - navigatorController — return the concrete RNSBaseNavigatorController instance.
 * - reactSubviews — return the typed array of child screen views.
 *
 * Each subclass's mountChildComponentView: / unmountChildComponentView: must call
 * markSubviewsModifiedInCurrentTransaction to trigger a child-VC update after the transaction.
 */
@interface RNSBaseNavigatorComponentView : RNSReactBaseView

/// All child screen component views managed by this navigator.
/// Used by RNSBaseNavigatorController.updateChildViewControllers to build the VC stack.
/// Subclasses may override to narrow the generic parameter for typed access.
- (nonnull NSMutableArray<RNSBaseScreenComponentView *> *)reactSubviews;

@end

#pragma mark - Abstract interface

@interface RNSBaseNavigatorComponentView ()

/**
 * @brief Return the concrete navigator controller.
 *
 * Used by screenChangedActivityMode: and the mounting-transaction callbacks to forward
 * setNeedsUpdateOfChildViewControllers / reactMountingTransactionDidMount.
 */
- (nonnull RNSBaseNavigatorController *)navigatorController;

@end

#pragma mark - Screen communication

@interface RNSBaseNavigatorComponentView ()

/**
 * @brief Called by a child RNSBaseScreenComponentView when its activityMode changes.
 *
 * Forwards the signal to the navigator controller so it can schedule a child-VC update.
 */
- (void)screenChangedActivityMode:(nonnull RNSBaseScreenComponentView *)screen;

/**
 * @brief Call from mountChildComponentView: and unmountChildComponentView: to mark that
 * reactSubviews were modified in the current Fabric transaction.
 *
 * Causes mountingTransactionDidMount: to schedule a child-VC update.
 */
- (void)markSubviewsModifiedInCurrentTransaction;

/**
 * @brief Whether reactSubviews were modified during the current Fabric transaction.
 *
 * Readable during mountingTransactionDidMount: (before the next mountingTransactionWillMount: resets it).
 * Useful for subclasses that need to react to subview changes (e.g. debug logging).
 */
@property (nonatomic, readonly) BOOL hadSubviewsModifiedInCurrentTransaction;

/**
 * @brief Called by the base after processing a mounting transaction.
 *
 * The default implementation is a no-op. Subclasses override to react to transaction completion
 * without needing to redeclare RCTMountingTransactionObserving (which pulls in C++ headers).
 * hadSubviewsModifiedInCurrentTransaction is still readable at this point.
 */
- (void)navigatorDidMountTransaction;

@end

NS_ASSUME_NONNULL_END
