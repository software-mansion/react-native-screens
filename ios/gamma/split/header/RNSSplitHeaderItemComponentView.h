#pragma once

#import "RNSReactBaseView.h"
#import "RNSSplitHeaderItemPlacement.h"
#import "RNSSplitHeaderItemInvalidationDelegate.h"

NS_ASSUME_NONNULL_BEGIN

@interface RNSSplitHeaderItemComponentView : RNSReactBaseView

@property (nonatomic, weak, nullable) id<RNSSplitHeaderItemInvalidationDelegate> invalidationDelegate;

@property (nonatomic, readonly) RNSSplitHeaderItemPlacement placement;
@property (nonatomic, readonly) BOOL hasCustomView;

- (nonnull UIBarButtonItem *)makeBarButtonItem;

- (void)updateShadowStateToMatchNavigationBar:(nonnull UINavigationBar *)navigationBar;

@end

NS_ASSUME_NONNULL_END
