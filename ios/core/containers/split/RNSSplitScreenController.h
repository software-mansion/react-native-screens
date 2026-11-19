#pragma once

#import <UIKit/UIKit.h>
#import "RNSViewControllerViewLifecycleEventsObserver.h"

@class RNSSplitPlainColumnContentView;
@class RNSSplitScreenController;
@class RNSStackNavigationController;

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

/**
 * @brief Called when `plainColumnContentView` of the controller is added to a window or removed from it.
 *
 * @param window The window the view is in now, or nil when it was removed from one.
 */
- (void)splitScreenController:(RNSSplitScreenController *)controller
    plainColumnContentViewDidMoveToWindow:(nullable UIWindow *)window;

@end

/**
 * @class RNSSplitScreenController
 * @brief A UIViewController subclass that manages a Split column in a UISplitViewController.
 *
 * It observes the column layout and lifecycle and reports them to its delegate.
 *
 * The lifecycle of the column is the one of the view of the navigation controller the Split installs for it. In a
 * column that hosts a stack it is the navigation controller of the stack, and this controller has to be set as its
 * `viewLifecycleEventsObserver`.
 */
@interface RNSSplitScreenController : UIViewController <RNSViewControllerViewLifecycleEventsObserver>

@property (nonatomic, weak, nullable) id<RNSSplitScreenControllerDelegate> delegate;

#pragma mark - Content

/**
 * @brief The view the content of a plain column is added to. It is the view of this controller.
 */
@property (nonatomic, strong, readonly) RNSSplitPlainColumnContentView *plainColumnContentView;

#pragma mark - Navigation controller

/**
 * @brief The navigation controller the Split installs for a plain column, i.e. a column that does not host a stack.
 * It is rooted at this controller.
 *
 * Created on first access and kept until `releasePlainColumnNavigationController`.
 */
@property (nonatomic, strong, readonly) RNSStackNavigationController *plainColumnNavigationController;

/**
 * @brief Releases `plainColumnNavigationController`.
 *
 * The navigation controller retains this controller as its root, so the column has to call it before it is destroyed.
 */
- (void)releasePlainColumnNavigationController;

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
 * @brief Called by the Split after it repositioned its columns.
 *
 * Reports the column frame. A column that hosts a stack or is not on screen has no frame to report.
 */
- (void)columnPositioningDidChange;

@end

NS_ASSUME_NONNULL_END
