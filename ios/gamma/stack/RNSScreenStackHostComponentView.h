#import "RNSReactBaseView.h"
#import "RNSStackScreenComponentView.h"

NS_ASSUME_NONNULL_BEGIN

@interface RNSScreenStackHostComponentView : RNSReactBaseView
- (nonnull NSMutableArray<RNSStackScreenComponentView *> *)reactSubviews;
@end

NS_ASSUME_NONNULL_END
