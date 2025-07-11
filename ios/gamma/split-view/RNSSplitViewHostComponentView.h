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

@property (nonatomic, readonly) RNSSplitViewSplitBehavior splitBehavior;
@property (nonatomic, readonly) RNSSplitViewPrimaryEdge primaryEdge;
@property (nonatomic, readonly) RNSSplitViewDisplayMode displayMode;

@end

NS_ASSUME_NONNULL_END
