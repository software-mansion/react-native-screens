#pragma once

#import <UIKit/UIKit.h>
#import "RNSOrientationProviding.h"
#import "RNSReactMountingTransactionObserving.h"

@class RNSSplitHostComponentView;

NS_ASSUME_NONNULL_BEGIN

/**
 * @class RNSSplitHostController
 * @brief A controller associated with the RN native component representing Split host.
 *
 * Manages a collection of RNSSplitScreenComponentView instances,
 * synchronizes appearance settings with props, observes component lifecycle, and emits events.
 */
@interface RNSSplitHostController
    : UISplitViewController <RNSReactMountingTransactionObserving, RNSOrientationProviding>

/**
 * @brief Initializes the Split host controller with provided style.
 *
 * The style for the Split component can be passed only in the initialization method and cannot be changed dynamically.
 *
 * @param splitHostComponentView The view managed by this controller.
 * @param numberOfColumns Expected number of visible columns.
 */
- (instancetype)initWithSplitHostComponentView:(RNSSplitHostComponentView *)splitHostComponentView
                               numberOfColumns:(NSInteger)numberOfColumns;

#pragma mark - Signals

- (void)setNeedsUpdateOfChildViewControllers;

- (void)setNeedsAppearanceUpdate;

- (void)setNeedsSecondaryScreenNavBarUpdate;

- (void)setNeedsDisplayModeUpdate;

- (void)setNeedsOrientationUpdate;

#pragma mark - Updating

- (void)updateChildViewControllersIfNeeded;

/**
 * @brief Creates and attaches the Split child controllers based on the current React subviews.
 *
 * It validates constraints for Split hierarchy and it will crash after recognizing an invalid state,
 * e. g. dynamically changed number of columns or number of columns that isn't between defined bounds.
 * If Split constraints are met, it attaches SplitScreen representatives to SplitHost component.
 */
- (void)updateChildViewControllers;

/**
 * @brief Triggering appearance updates on secondary column's UINavigationBar component
 *
 * It validates that the secondary VC is valid UINavigationController and it updates the navbar
 * state by toggling it's visibility, what should be performed in a single batch of updates.
 */
- (void)refreshSecondaryNavBar;

#pragma mark - Public setters

/**
 * @brief Shows or hides the inspector screen.
 * @remarks Inspector column is only available for iOS 26 or higher.
 *
 * @param showInspector Determines whether the inspector column should be visible.
 */
- (void)toggleSplitViewInspector:(BOOL)showInspector;

/**
 * @brief Programmatically shows a specific column identified by its string name.
 *
 * Maps the string column name to the corresponding `UISplitViewController.Column` and calls `show(_:)`.
 *
 * @param columnName A string representing the column to show: `"primary"`, `"supplementary"`, or `"secondary"`.
 */
- (void)showColumnNamed:(NSString *)columnName;

@end

NS_ASSUME_NONNULL_END
