#import "RNSReactBaseView.h"

NS_ASSUME_NONNULL_BEGIN

@class RNSSplitViewScreenComponentView;

@interface RNSSplitViewHostComponentView : RNSReactBaseView
- (nonnull NSMutableArray<RNSSplitViewScreenComponentView *> *)reactSubviews;
@end

NS_ASSUME_NONNULL_END
