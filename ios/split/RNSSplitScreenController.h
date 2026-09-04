#pragma once

#import <UIKit/UIKit.h>

@class RNSSplitScreenComponentView;
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
 * Associated with a RNSSplitScreenComponentView, it observes the column layout and lifecycle, reports them to its
 * delegate, and interacts with the SplitHost hierarchy.
 */
@interface RNSSplitScreenController : UIViewController

@property (nonatomic, weak, nullable) id<RNSSplitScreenControllerDelegate> delegate;

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
 * @brief Reports the column frame change after the Split repositioned its columns.
 *
 * @param splitViewController The UISplitViewController whose layout positioning changed, represented by
 * RNSSplitHostController.
 */
- (void)columnPositioningDidChangeInSplitViewController:(UISplitViewController *)splitViewController;

@end

NS_ASSUME_NONNULL_END
