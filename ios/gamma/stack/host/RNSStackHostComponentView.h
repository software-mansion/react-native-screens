#pragma once

#import "RNSReactBaseView.h"

@class RNSStackController;
@class RNSStackScreenComponentView;

NS_ASSUME_NONNULL_BEGIN

@interface RNSStackHostComponentView : RNSReactBaseView

@property (nonatomic, nonnull, strong, readonly) RNSStackController *stackController;

- (nonnull NSMutableArray<RNSStackScreenComponentView *> *)reactSubviews;

@end

#pragma mark - Communication with StackScreen

@interface RNSStackHostComponentView ()

- (void)stackScreenChangedActivityMode:(nonnull RNSStackScreenComponentView *)stackScreen;

@end

NS_ASSUME_NONNULL_END
