#pragma once

#import <UIKit/UIKit.h>
#import "RNSOrientationProviding.h"
#import "RNSReactMountingTransactionObserving.h"
#import "RNSSplitHostProviders.h"

@class RNSSplitHostController;

NS_ASSUME_NONNULL_BEGIN

/**
 * @protocol RNSSplitHostControllerEventsDelegate
 * @brief Receives UISplitViewController lifecycle notifications from the Split host controller.
 */
@protocol RNSSplitHostControllerEventsDelegate <NSObject>

- (void)splitHostControllerDidCollapse:(RNSSplitHostController *)controller;
- (void)splitHostControllerDidExpand:(RNSSplitHostController *)controller;
- (void)splitHostController:(RNSSplitHostController *)controller
    willChangeDisplayModeFrom:(UISplitViewControllerDisplayMode)fromDisplayMode
                           to:(UISplitViewControllerDisplayMode)toDisplayMode;
- (void)splitHostControllerDidHideInspector:(RNSSplitHostController *)controller;

@end

/**
 * @class RNSSplitHostController
 * @brief A controller associated with the RN native component representing Split host.
 *
 * Installs the column controllers, synchronizes appearance settings with the configuration exposed by the providers,
 * observes the UISplitViewController lifecycle and reports it to the delegate.
 */
@interface RNSSplitHostController
    : UISplitViewController <RNSReactMountingTransactionObserving, RNSOrientationProviding>

@property (nonatomic, weak, nullable) id<RNSSplitHostControllerEventsDelegate> eventsDelegate;
@property (nonatomic, weak, nullable) id<RNSSplitHostAppearanceProvider> appearanceProvider;
@property (nonatomic, weak, nullable) id<RNSSplitHostBehaviorProvider> behaviorProvider;
@property (nonatomic, weak, nullable) id<RNSSplitHostColumnsProvider> columnsProvider;

/**
 * @brief Initializes the Split host controller with provided style.
 *
 * The style for the Split component can be passed only in the initialization method and cannot be changed dynamically.
 *
 * @param numberOfColumns Expected number of visible columns.
 */
- (instancetype)initWithNumberOfColumns:(NSInteger)numberOfColumns;

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
