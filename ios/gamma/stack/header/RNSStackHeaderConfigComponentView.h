#pragma once

#import "RNSReactBaseView.h"

NS_ASSUME_NONNULL_BEGIN

@class RNSStackHeaderItemComponentView;

@interface RNSStackHeaderConfigComponentView : RNSReactBaseView

@property (nonatomic, readonly, nonnull) NSArray<RNSStackHeaderItemComponentView *> *headerItems;

- (void)updateShadowStateToMatchNavigationBar:(nonnull UINavigationBar *)navigationBar;

@end

NS_ASSUME_NONNULL_END
