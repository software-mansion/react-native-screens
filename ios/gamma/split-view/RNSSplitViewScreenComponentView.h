#import "RNSEnums.h"
#import "RNSReactBaseView.h"
#import "RNSSplitViewScreenComponentEventEmitter.h"
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

#pragma mark - Props

@interface RNSSplitViewScreenComponentView ()

@property (nonatomic, readonly) RNSSplitViewScreenColumnType columnType;

@end

#pragma mark - Events

@interface RNSSplitViewScreenComponentView ()

/**
 * Use returned object to emit appropriate React Events to Element Tree.
 */
- (nonnull RNSSplitViewScreenComponentEventEmitter *)reactEventEmitter;

@end

NS_ASSUME_NONNULL_END
