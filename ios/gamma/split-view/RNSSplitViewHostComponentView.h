#pragma once

#import "RNSDefines.h"
#import "RNSEnums.h"
#import "RNSReactBaseView.h"
#import "RNSSplitViewHostComponentEventEmitter.h"

NS_ASSUME_NONNULL_BEGIN

@class RNSSplitViewHostController;
@class RNSSplitViewScreenComponentView;

/**
 * @class RNSSplitViewHostComponentView
 * @brief A view component representing top-level native component for SplitView.
 *
 * Responsible for managing multi-column layouts via associated native UISplitViewController.
 * Manages updates to the layout properties, column configuration, and event emission.
 */
@interface RNSSplitViewHostComponentView : RNSReactBaseView

- (nonnull NSMutableArray<RNSSplitViewScreenComponentView *> *)reactSubviews;

@property (nonatomic, nonnull, strong, readonly) RNSSplitViewHostController *splitViewHostController;

@end

#pragma mark - Props

/**
 * @category Props
 * @brief Definitions for React Native props.
 */
@interface RNSSplitViewHostComponentView ()

@property (nonatomic, readonly) UISplitViewControllerSplitBehavior preferredSplitBehavior;
@property (nonatomic, readonly) UISplitViewControllerPrimaryEdge primaryEdge;
@property (nonatomic, readonly) UISplitViewControllerDisplayMode preferredDisplayMode;
@property (nonatomic, readonly) UISplitViewControllerDisplayModeButtonVisibility displayModeButtonVisibility;
#if !TARGET_OS_TV
@property (nonatomic, readonly) UISplitViewControllerBackgroundStyle primaryBackgroundStyle;
#endif // !TARGET_OS_TV
@property (nonatomic, readonly) BOOL presentsWithGesture;
@property (nonatomic, readonly) BOOL showSecondaryToggleButton;
@property (nonatomic, readonly) BOOL showInspector;

@property (nonatomic, readonly) double minimumPrimaryColumnWidth;
@property (nonatomic, readonly) double maximumPrimaryColumnWidth;
@property (nonatomic, readonly) double preferredPrimaryColumnWidthOrFraction;
@property (nonatomic, readonly) double minimumSupplementaryColumnWidth;
@property (nonatomic, readonly) double maximumSupplementaryColumnWidth;
@property (nonatomic, readonly) double preferredSupplementaryColumnWidthOrFraction;

#if RNS_IPHONE_OS_VERSION_AVAILABLE(26_0)
@property (nonatomic, readonly) double minimumSecondaryColumnWidth;
@property (nonatomic, readonly) double preferredSecondaryColumnWidthOrFraction;
@property (nonatomic, readonly) double minimumInspectorColumnWidth;
@property (nonatomic, readonly) double maximumInspectorColumnWidth;
@property (nonatomic, readonly) double preferredInspectorColumnWidthOrFraction;
#endif // RNS_IPHONE_OS_VERSION_AVAILABLE(26_0)

@property (nonatomic, readonly) RNSOrientation orientation;

@end

#pragma mark - Events

/**
 * @category Events
 * @brief APIs related to event emission to React Native.
 */
@interface RNSSplitViewHostComponentView ()

- (nonnull RNSSplitViewHostComponentEventEmitter *)reactEventEmitter;

@end

NS_ASSUME_NONNULL_END
