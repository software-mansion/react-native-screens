#import "RNSReactBaseView.h"

NS_ASSUME_NONNULL_BEGIN

@class RNSStackScreenController;

@interface RNSStackScreenComponentView : RNSReactBaseView

@property (nonatomic, strong, readonly, nullable) RNSStackScreenController *controller;

@end

NS_ASSUME_NONNULL_END
