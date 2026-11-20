#pragma once

#import <UIKit/UIKit.h>
#import "RNSDefines.h"
#import "RNSEnums.h"

NS_ASSUME_NONNULL_BEGIN

@class RNSSplitColumnCoordinator;
@class RNSStackNavigationController;

/**
 * @brief Configuration of the UISplitViewController appearance.
 */
@protocol RNSSplitHostAppearanceProvider <NSObject>

- (UISplitViewControllerSplitBehavior)preferredSplitBehavior;
- (UISplitViewControllerPrimaryEdge)primaryEdge;
- (UISplitViewControllerDisplayMode)preferredDisplayMode;
- (UISplitViewControllerDisplayModeButtonVisibility)displayModeButtonVisibility;
#if !TARGET_OS_TV
- (UISplitViewControllerBackgroundStyle)primaryBackgroundStyle;
#endif // !TARGET_OS_TV
- (BOOL)presentsWithGesture;
- (BOOL)showSecondaryToggleButton;
- (BOOL)showInspector;

- (double)minimumPrimaryColumnWidth;
- (double)maximumPrimaryColumnWidth;
- (double)preferredPrimaryColumnWidthOrFraction;
- (double)minimumSupplementaryColumnWidth;
- (double)maximumSupplementaryColumnWidth;
- (double)preferredSupplementaryColumnWidthOrFraction;

#if RNS_IPHONE_OS_VERSION_AVAILABLE(26_0)
- (double)minimumSecondaryColumnWidth;
- (double)preferredSecondaryColumnWidthOrFraction;
- (double)minimumInspectorColumnWidth;
- (double)maximumInspectorColumnWidth;
- (double)preferredInspectorColumnWidthOrFraction;
#endif // RNS_IPHONE_OS_VERSION_AVAILABLE(26_0)

- (RNSOrientation)orientation;
- (UIUserInterfaceStyle)colorScheme;

@end

/**
 * @brief Behavior consulted by the UISplitViewController delegate callbacks.
 */
@protocol RNSSplitHostBehaviorProvider <NSObject>

- (BOOL)hasCustomTopColumnForCollapsing;
- (UISplitViewControllerColumn)topColumnForCollapsingColumn;

@end

/**
 * @brief Coordinators of the columns mounted in the host, in React order, split by column type.
 */
@protocol RNSSplitHostColumnsProvider <NSObject>

- (NSArray<RNSSplitColumnCoordinator *> *)columnCoordinators;
- (NSArray<RNSSplitColumnCoordinator *> *)inspectorCoordinators;

/**
 * @brief Navigation controllers the host installs for the columns, in the order of `columnCoordinators`.
 */
- (NSArray<RNSStackNavigationController *> *)columnNavigationControllers;

@end

NS_ASSUME_NONNULL_END
