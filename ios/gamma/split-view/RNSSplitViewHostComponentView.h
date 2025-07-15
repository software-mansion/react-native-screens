#import "RNSReactBaseView.h"

NS_ASSUME_NONNULL_BEGIN

@class RNSSplitViewHostController;
@class RNSSplitViewScreenComponentView;

@interface RNSSplitViewHostComponentView : RNSReactBaseView

- (nonnull NSMutableArray<RNSSplitViewScreenComponentView *> *)reactSubviews;

@property (nonatomic, nonnull, strong, readonly) RNSSplitViewHostController *splitViewHostController;

@end

NS_ASSUME_NONNULL_END
