#import "RNSReactBaseView.h"
#import "RNSStackScreenComponentView.h"

@class RNSStackController;

NS_ASSUME_NONNULL_BEGIN

@interface RNSScreenStackHostComponentView : RNSReactBaseView

@property (nonatomic, nonnull, strong, readonly) RNSStackController *stackController;

- (nonnull NSMutableArray<RNSStackScreenComponentView *> *)reactSubviews;

@end

NS_ASSUME_NONNULL_END
