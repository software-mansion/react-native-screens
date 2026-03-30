#pragma once

#import "RNSBaseNavigatorComponentView.h"

@class RNSStackController;
@class RNSStackScreenComponentView;

NS_ASSUME_NONNULL_BEGIN

@interface RNSStackHostComponentView : RNSBaseNavigatorComponentView

@property (nonatomic, nonnull, strong, readonly) RNSStackController *stackController;

- (nonnull NSMutableArray<RNSStackScreenComponentView *> *)reactSubviews;

@end

NS_ASSUME_NONNULL_END
