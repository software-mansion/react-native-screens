#pragma once

#import <UIKit/UIKit.h>
#import "RNSViewControllerViewLifecycleEventsObserver.h"

@class RNSSplitPlainColumnContentView;
@class RNSSplitColumnCoordinator;
@class RNSStackNavigationController;

NS_ASSUME_NONNULL_BEGIN

/**
 * @protocol RNSSplitColumnCoordinatorDelegate
 * @brief Receives layout and lifecycle notifications of a Split column from its coordinator.
 */
@protocol RNSSplitColumnCoordinatorDelegate <NSObject>

/**
 * @brief Called whenever the column frame changes.
 *
 * @param frame The column frame in the coordinate space of the SplitHost controller's view, or the column view frame
 * as is when the column is presented outside the SplitHost subtree (e.g. the inspector as a modal).
 */
- (void)splitColumnCoordinator:(RNSSplitColumnCoordinator *)coordinator didChangeColumnFrame:(CGRect)frame;

- (void)splitColumnWillAppear:(RNSSplitColumnCoordinator *)coordinator;
- (void)splitColumnDidAppear:(RNSSplitColumnCoordinator *)coordinator;
- (void)splitColumnWillDisappear:(RNSSplitColumnCoordinator *)coordinator;
- (void)splitColumnDidDisappear:(RNSSplitColumnCoordinator *)coordinator;

/**
 * @brief Called when `plainColumnContentView` of the coordinator is added to a window or removed from it.
 *
 * @param window The window the view is in now, or nil when it was removed from one.
 */
- (void)splitColumnCoordinator:(RNSSplitColumnCoordinator *)coordinator
    plainColumnContentViewDidMoveToWindow:(nullable UIWindow *)window;

@end

/**
 * @class RNSSplitColumnCoordinator
 * @brief Manages a Split column in a UISplitViewController.
 *
 * It owns what the Split shows for a plain column: the navigation controller, the stack screen it is rooted at and
 * the view of that screen. It observes the column layout and lifecycle and reports them to its delegate.
 *
 * The lifecycle of the column is the one of the view of the navigation controller the Split installs for it. In a
 * column that hosts a stack it is the navigation controller of the stack, and this coordinator has to be set as its
 * `viewLifecycleEventsObserver`.
 */
@interface RNSSplitColumnCoordinator : NSObject <RNSViewControllerViewLifecycleEventsObserver>

@property (nonatomic, weak, nullable) id<RNSSplitColumnCoordinatorDelegate> delegate;

#pragma mark - Content

/**
 * @brief The view the content of a plain column is added to. It is the view of the stack screen the navigation
 * controller of the column is rooted at.
 */
@property (nonatomic, strong, readonly) RNSSplitPlainColumnContentView *plainColumnContentView;

/**
 * @brief The navigation item of a plain column. It belongs to the stack screen the navigation controller of the
 * column is rooted at.
 */
@property (nonatomic, strong, readonly) UINavigationItem *plainColumnNavigationItem;

#pragma mark - Navigation controller

/**
 * @brief The navigation controller the Split installs for a plain column, i.e. a column that does not host a stack.
 * It is rooted at a stack screen that shows `plainColumnContentView`. The screen has no header configuration, and the
 * navigation bar of the column stays visible.
 *
 * Created on first access and kept until `releasePlainColumnNavigationController`.
 */
@property (nonatomic, strong, readonly) RNSStackNavigationController *plainColumnNavigationController;

/**
 * @brief Releases `plainColumnNavigationController`. A new one is created on next access.
 */
- (void)releasePlainColumnNavigationController;

#pragma mark - Signals

/**
 * @brief Determines if the plain column is nested inside a SplitHost hierarchy.
 *
 * Used to differentiate between screens embedded in the native host and modal presentations.
 *
 * @return true if inside RNSSplitHostController, false otherwise.
 */
- (BOOL)isInSplitHostSubtree;

#pragma mark - Layout

/**
 * @brief Called by the Split after it repositioned its columns.
 *
 * Reports the column frame. A column that hosts a stack or is not on screen has no frame to report.
 */
- (void)columnPositioningDidChange;

@end

NS_ASSUME_NONNULL_END
