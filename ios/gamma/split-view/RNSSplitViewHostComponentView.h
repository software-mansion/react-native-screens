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

/**
 * @brief Getter for the current list of React children which are representing SplitView columns.
 */
- (nonnull NSMutableArray<RNSSplitViewScreenComponentView *> *)reactSubviews;

/**
 * @brief Getter for the internal RNSSplitViewHostController that manages SplitView component.
 */
@property (nonatomic, nonnull, strong, readonly) RNSSplitViewHostController *splitViewHostController;

@end

#pragma mark - Props

/**
 * @category Props
 * @brief Definitions for React Native props.
 */
@interface RNSSplitViewHostComponentView ()

/**
 * @brief Determines how the child view controllers appear in relation to each other.
 */
@property (nonatomic, readonly) UISplitViewControllerSplitBehavior preferredSplitBehavior;

/**
 * @brief Determines on which side the primary sidebar is placed relative to the content.
 */
@property (nonatomic, readonly) UISplitViewControllerPrimaryEdge primaryEdge;

/**
 * @brief Determines the display mode for the split view.
 */
@property (nonatomic, readonly) UISplitViewControllerDisplayMode preferredDisplayMode;

/**
 * @brief Defines whether the system's display mode button is shown automatically.
 */
@property (nonatomic, readonly) UISplitViewControllerDisplayModeButtonVisibility displayModeButtonVisibility;

/**
 * @brief Enables presentation/dismissal of hidden column using swipe gesture.
 */
@property (nonatomic, readonly) BOOL presentsWithGesture;

/**
 * @brief Determines whether a custom button shows to toggle between full-screen and side-by-side secondary-only
 * display.
 */
@property (nonatomic, readonly) BOOL showSecondaryToggleButton;

/**
 * @brief Determines whether to show an inspector column.
 */
@property (nonatomic, readonly) BOOL showInspector;

/**
 * @brief Minimum width for the primary (leftmost) column in the layout.
 */
@property (nonatomic, readonly) int minimumPrimaryColumnWidth;

/**
 * @brief Maximum width for the primary (leftmost) column in the layout.
 */
@property (nonatomic, readonly) int maximumPrimaryColumnWidth;

/**
 * @brief Preferred width for the primary (leftmost) column.
 */
@property (nonatomic, readonly) double preferredPrimaryColumnWidthOrFraction;

/**
 * @brief Minimum width for the supplementary (middle) column in the layout.
 */
@property (nonatomic, readonly) int minimumSupplementaryColumnWidth;

/**
 * @brief Maximum width for the supplementary (middle) column in the layout.
 */
@property (nonatomic, readonly) int maximumSupplementaryColumnWidth;

/**
 * @brief Preferred width for the supplementary (middle) column.
 */
@property (nonatomic, readonly) double preferredSupplementaryColumnWidthOrFraction;

#if defined(__IPHONE_OS_VERSION_MAX_ALLOWED) && defined(__IPHONE_26_0) && \
    __IPHONE_OS_VERSION_MAX_ALLOWED >= __IPHONE_26_0

/**
 * @brief Minimum width for the secondary (main content) column.
 */
@property (nonatomic, readonly) int minimumSecondaryColumnWidth;

/**
 * @brief Preferred width for the secondary (main content) column.
 */
@property (nonatomic, readonly) double preferredSecondaryColumnWidthOrFraction;

/**
 * @brief Minimum width for the inspector column.
 */
@property (nonatomic, readonly) int minimumInspectorColumnWidth;

/**
 * @brief Maximum width for the inspector column.
 */
@property (nonatomic, readonly) int maximumInspectorColumnWidth;

/**
 * @brief Preferred width for the inspector column
 */
@property (nonatomic, readonly) double preferredInspectorColumnWidthOrFraction;
#endif

@end

#pragma mark - Events

/**
 * @category Events
 * @brief APIs related to event emission to React Native.
 */
@interface RNSSplitViewHostComponentView ()

/**
 * @brief Getter for the component's event emitter used for emitting events to React.
 *
 * @return A pointer to RNSSplitViewHostComponentEventEmitter instance.
 */
- (nonnull RNSSplitViewHostComponentEventEmitter *)reactEventEmitter;

@end

NS_ASSUME_NONNULL_END
