#import "RNSReactBaseView.h"
#import "RNSSplitViewScreenShadowStateProxy.h"

NS_ASSUME_NONNULL_BEGIN

@class RNSSplitViewHostComponentView;
@class RNSSplitViewScreenController;

@interface RNSSplitViewScreenComponentView : RNSReactBaseView

@property (nonatomic, strong, readonly, nonnull) RNSSplitViewScreenController *controller;
@property (nonatomic, weak, readwrite, nullable) RNSSplitViewHostComponentView *splitViewHost;

@end

#pragma mark - ShadowTreeState

@interface RNSSplitViewScreenComponentView ()

- (nonnull RNSSplitViewScreenShadowStateProxy *)shadowStateProxy;

@end

NS_ASSUME_NONNULL_END
