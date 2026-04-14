#pragma once

#import "RNSReactBaseView.h"
#import "RNSSplitHeaderItemComponentView.h"
#import "RNSSplitHeaderItemInvalidationDelegate.h"
#import "RNSSplitHeaderItemSpacerComponentView.h"

NS_ASSUME_NONNULL_BEGIN

@interface RNSSplitHeaderConfigComponentView : RNSReactBaseView

@property (nonatomic, readonly, nonnull) NSArray<RNSSplitHeaderItemComponentView *> *headerItems;

- (void)updateShadowStateToMatchNavigationBar:(nonnull UINavigationBar *)navigationBar;

@end

NS_ASSUME_NONNULL_END
