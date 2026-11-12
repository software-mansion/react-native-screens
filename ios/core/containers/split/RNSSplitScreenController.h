#pragma once

#import <UIKit/UIKit.h>
#import "RNSNavigationControllerProviding.h"

@class RNSSplitScreenController;

NS_ASSUME_NONNULL_BEGIN

/**
 * @protocol RNSSplitScreenControllerDelegate
 * @brief Receives layout and lifecycle notifications of a Split column from its controller.
 */
@protocol RNSSplitScreenControllerDelegate <NSObject>

/**
 * @brief Called whenever the column frame changes.
 *
 * @param frame The column frame in the coordinate space of the SplitHost controller's view, or the column view frame
 * as is when the column is presented outside the SplitHost subtree (e.g. the inspector as a modal).
 */
- (void)splitScreenController:(RNSSplitScreenController *)controller didChangeColumnFrame:(CGRect)frame;

- (void)splitScreenControllerWillAppear:(RNSSplitScreenController *)controller;
- (void)splitScreenControllerDidAppear:(RNSSplitScreenController *)controller;
- (void)splitScreenControllerWillDisappear:(RNSSplitScreenController *)controller;
- (void)splitScreenControllerDidDisappear:(RNSSplitScreenController *)controller;

@end

/**
 * @class RNSSplitScreenController
 * @brief A UIViewController subclass that manages a Split column in a UISplitViewController.
 *
 * It observes the column layout and lifecycle and reports them to its delegate.
 */
@interface RNSSplitScreenController : UIViewController

@property (nonatomic, weak, nullable) id<RNSSplitScreenControllerDelegate> delegate;

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

#pragma mark - Nested container

/**
 * @brief The provider whose navigation controller backs the column instead of this controller.
 *
 * Set by the column view when its **only** child conforms to `RNSNavigationControllerProviding`. The Split host
 * installs the provided navigation controller in place of one rooted at this controller, so neither the column view
 * nor the provider's view enter the UIKit hierarchy. The column's lifecycle events come from the provided
 * controller then, which must conform to `RNSViewControllerLifecycleEventsNotifying`.
 */
@property (nonatomic, weak, nullable) UIView<RNSNavigationControllerProviding> *navigationControllerProvider;

#pragma mark - Layout

/**
 * @brief Reports the column frame change after the Split repositioned its columns.
 *
 * @param splitViewController The UISplitViewController whose layout positioning changed, represented by
 * RNSSplitHostController.
 */
- (void)columnPositioningDidChangeInSplitViewController:(UISplitViewController *)splitViewController;

@end

NS_ASSUME_NONNULL_END
