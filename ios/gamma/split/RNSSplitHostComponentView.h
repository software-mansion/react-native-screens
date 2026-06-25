#pragma once

#import "RNSDefines.h"
#import "RNSEnums.h"
#import "RNSReactBaseView.h"
#import "RNSSplitHostComponentEventEmitter.h"

NS_ASSUME_NONNULL_BEGIN

@class RNSSplitHostComponentView;
@class RNSSplitScreenComponentView;

// ObjC-facing surface of the Swift `RNSSplitHostController`, resolved at runtime
// via NSClassFromString. Lets the ObjC sources drive the controller without
// importing `RNScreens-Swift.h`, so ObjC and Swift can build as separate SwiftPM
// targets (SwiftPM has no mixed-language target).
@protocol RNSSplitHostControlling <NSObject>
- (instancetype)initWithSplitHostComponentView:(RNSSplitHostComponentView *)splitHostComponentView
                                numberOfColumns:(NSInteger)numberOfColumns;
- (void)setNeedsAppearanceUpdate;
- (void)setNeedsDisplayModeUpdate;
- (void)setNeedsSecondaryScreenNavBarUpdate;
- (void)setNeedsOrientationUpdate;
- (void)setNeedsUpdateOfChildViewControllers;
- (void)reactMountingTransactionWillMount;
- (void)reactMountingTransactionDidMount;
- (void)showColumnNamed:(NSString *)columnName;
@end

/**
 * @class RNSSplitHostComponentView
 * @brief A view component representing top-level native component for SplitView.
 *
 * Responsible for managing multi-column layouts via associated native UISplitViewController.
 * Manages updates to the layout properties, column configuration, and event emission.
 */
@interface RNSSplitHostComponentView : RNSReactBaseView

- (nonnull NSMutableArray<RNSSplitScreenComponentView *> *)reactSubviews;

@property (nonatomic, nonnull, strong, readonly) UISplitViewController<RNSSplitHostControlling> *splitHostController;

@end

#pragma mark - Props

/**
 * @category Props
 * @brief Definitions for React Native props.
 */
@interface RNSSplitHostComponentView ()

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
@property (nonatomic, readonly) BOOL hasCustomTopColumnForCollapsing;
@property (nonatomic, readonly) UISplitViewControllerColumn topColumnForCollapsingColumn;

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
@property (nonatomic, readonly) UIUserInterfaceStyle colorScheme;

@end

#pragma mark - Events

/**
 * @category Events
 * @brief APIs related to event emission to React Native.
 */
@interface RNSSplitHostComponentView ()

- (nonnull RNSSplitHostComponentEventEmitter *)reactEventEmitter;

@end

NS_ASSUME_NONNULL_END
