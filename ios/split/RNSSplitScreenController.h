#pragma once

#import <UIKit/UIKit.h>

@class RNSSplitScreenComponentView;

NS_ASSUME_NONNULL_BEGIN

/**
 * @class RNSSplitScreenController
 * @brief A UIViewController subclass that manages a Split column in a UISplitViewController.
 *
 * Associated with a RNSSplitScreenComponentView, it handles layout synchronization with the
 * Shadow Tree, emits React lifecycle events, and interacts with the SplitHost hierarchy.
 */
@interface RNSSplitScreenController : UIViewController

- (instancetype)initWithSplitScreenComponentView:(RNSSplitScreenComponentView *)splitScreenComponentView;

#pragma mark - Signals

/**
 * @brief Determines if this controller is nested inside a SplitHost hierarchy.
 *
 * Used to differentiate between screens embedded in the native host and modal presentations.
 *
 * @return true if inside RNSSplitHostController, false otherwise.
 */
- (BOOL)isInSplitHostSubtree;

- (void)setNeedsLifecycleStateUpdate;

#pragma mark - Layout

/**
 * @brief Request ShadowNode state update when the Split screen frame origin has changed.
 *
 * @param splitViewController The UISplitViewController whose layout positioning changed, represented by
 * RNSSplitHostController.
 */
- (void)columnPositioningDidChangeInSplitViewController:(UISplitViewController *)splitViewController;

@end

NS_ASSUME_NONNULL_END
