#import "RNSEnums.h"
#import "RNSReactBaseView.h"

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
@property (nonatomic, readonly) BOOL presentsWithGesture;
@property (nonatomic, readonly) BOOL showSecondaryToggleButton;

@end

NS_ASSUME_NONNULL_END
