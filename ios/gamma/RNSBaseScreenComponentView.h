#pragma once

#import "RNSReactBaseView.h"

@class UIViewController;

NS_ASSUME_NONNULL_BEGIN

/**
 * @class RNSBaseScreenComponentView
 * @brief Base Fabric component view for gamma stack and split screen components.
 *
 * Provides shared infrastructure for activityMode tracking, screenKey management,
 * deferred parent notification on activity mode change, and controller lifecycle.
 *
 * Subclasses must override:
 * - setupController — create and store the concrete controller
 * - resetProps — set default props and clear ivar state
 * - notifyParentOfActivityModeChange — call the parent navigator/host
 * - isAttached — return whether activityMode == attached
 * - screenViewController — return the underlying UIViewController
 */
@interface RNSBaseScreenComponentView : RNSReactBaseView

/// Stable identifier for this screen within its navigator column.
/// Nil until set by the first updateProps: call.
@property (nonatomic, strong, readonly, nullable) NSString *screenKey;

/// Whether this screen is currently in the attached (active) state.
/// Used by RNSBaseNavigatorController.updateChildViewControllers to filter the visible stack.
@property (nonatomic, readonly) BOOL isAttached;

/// The underlying UIViewController managed by this screen component view.
/// Used by RNSBaseNavigatorController.updateChildViewControllers to build the VC stack.
@property (nonatomic, strong, readonly, nonnull) UIViewController *screenViewController;

@end

#pragma mark - Subclass API

/**
 * @category SubclassAPI
 * @brief Helpers available to subclasses. Call from updateProps:.
 */
@interface RNSBaseScreenComponentView ()

/// Mark that activityMode changed in the current prop update.
/// Causes finalizeUpdates: to call notifyParentOfActivityModeChange.
- (void)markActivityModeChanged;

/// Update the cached screenKey. Asserts it is set only once.
- (void)updateScreenKey:(nullable NSString *)newKey;

@end

#pragma mark - Abstract interface

/**
 * @category Abstract
 * @brief Methods that subclasses MUST override.
 */
@interface RNSBaseScreenComponentView ()

/// Create and store the concrete UIViewController subclass.
- (void)setupController;

/// Set props to their default values and clear ivar state.
- (void)resetProps;

/// Called from finalizeUpdates: when activityMode changed.
/// Notify the parent navigator or host so it can schedule a child-VCs update.
- (void)notifyParentOfActivityModeChange;

@end

NS_ASSUME_NONNULL_END
