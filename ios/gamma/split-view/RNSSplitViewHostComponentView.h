#import "RNSEnums.h"
#import "RNSReactBaseView.h"
#import "RNSSplitViewHostComponentEventEmitter.h"

NS_ASSUME_NONNULL_BEGIN

@class RNSSplitViewHostController;
@class RNSSplitViewScreenComponentView;

@interface RNSSplitViewHostComponentView : RNSReactBaseView

- (nonnull NSMutableArray<RNSSplitViewScreenComponentView *> *)reactSubviews;

@property (nonatomic, nonnull, strong, readonly) RNSSplitViewHostController *splitViewHostController;

@end

#pragma mark - Props

@interface RNSSplitViewHostComponentView ()

@property (nonatomic, readonly) UISplitViewControllerSplitBehavior splitBehavior;
@property (nonatomic, readonly) UISplitViewControllerPrimaryEdge primaryEdge;
@property (nonatomic, readonly) UISplitViewControllerDisplayMode displayMode;
@property (nonatomic, readonly) UISplitViewControllerDisplayModeButtonVisibility displayModeButtonVisibility;
@property (nonatomic, readonly) BOOL presentsWithGesture;
@property (nonatomic, readonly) BOOL showSecondaryToggleButton;
@property (nonatomic, readonly) BOOL showInspector;

@property (nonatomic, readonly) int minimumPrimaryColumnWidth;
@property (nonatomic, readonly) int maximumPrimaryColumnWidth;
@property (nonatomic, readonly) int preferredPrimaryColumnWidth;
@property (nonatomic, readonly) int minimumSupplementaryColumnWidth;
@property (nonatomic, readonly) int maximumSupplementaryColumnWidth;
@property (nonatomic, readonly) int preferredSupplementaryColumnWidth;

@end

#pragma mark - Events

@interface RNSSplitViewHostComponentView ()

/**
 * Use returned object to emit appropriate React Events to Element Tree.
 */
- (nonnull RNSSplitViewHostComponentEventEmitter *)reactEventEmitter;

@end

NS_ASSUME_NONNULL_END
