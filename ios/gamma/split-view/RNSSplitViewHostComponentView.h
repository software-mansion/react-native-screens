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
@property (nonatomic, readonly) BOOL presentsWithGesture;
@property (nonatomic, readonly) BOOL showSecondaryToggleButton;
@property (nonatomic, readonly) BOOL showInspector;
@property (nonatomic, readonly) int minimumPrimaryColumnWidth;
@property (nonatomic, readonly) int maximumPrimaryColumnWidth;
@property (nonatomic, readonly) double preferredPrimaryColumnWidthOrFraction;
@property (nonatomic, readonly) int minimumSupplementaryColumnWidth;
@property (nonatomic, readonly) int maximumSupplementaryColumnWidth;
@property (nonatomic, readonly) double preferredSupplementaryColumnWidthOrFraction;

#if defined(__IPHONE_OS_VERSION_MAX_ALLOWED) && defined(__IPHONE_26_0) && \
    __IPHONE_OS_VERSION_MAX_ALLOWED >= __IPHONE_26_0

@property (nonatomic, readonly) int minimumSecondaryColumnWidth;
@property (nonatomic, readonly) double preferredSecondaryColumnWidthOrFraction;
@property (nonatomic, readonly) int minimumInspectorColumnWidth;
@property (nonatomic, readonly) int maximumInspectorColumnWidth;
@property (nonatomic, readonly) double preferredInspectorColumnWidthOrFraction;

#endif

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
