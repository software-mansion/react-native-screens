#import "RNSReactBaseView.h"

NS_ASSUME_NONNULL_BEGIN

@class RNSSplitViewScreenController;

@interface RNSSplitViewScreenComponentView : RNSReactBaseView

@property (nonatomic, strong, readonly, nonnull) RNSSplitViewScreenController *controller;

@end

NS_ASSUME_NONNULL_END
