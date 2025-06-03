#import <React/RCTViewComponentView.h>
#import <react/renderer/components/rnscreens/EventEmitters.h>

NS_ASSUME_NONNULL_BEGIN

@class RNSStackScreenController;

@interface RNSStackScreenComponentView : RCTViewComponentView

@property (nonatomic, strong, readonly, nullable) RNSStackScreenController *controller;

@end

NS_ASSUME_NONNULL_END
