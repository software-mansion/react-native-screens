#pragma once

#import "RNSReactBaseView.h"
#import "RNSHeaderItemPlacement.h"
#import "RNSStackHeaderItemInvalidationDelegate.h"

NS_ASSUME_NONNULL_BEGIN

@interface RNSStackHeaderItemComponentView : RNSReactBaseView

@property (nonatomic, weak, nullable) id<RNSStackHeaderItemInvalidationDelegate> invalidationDelegate;

@property (nonatomic, readonly) RNSHeaderItemPlacement placement;
@property (nonatomic, readonly) BOOL hasCustomView;

- (nonnull UIBarButtonItem *)makeBarButtonItem;

- (void)updateShadowStateToMatchNavigationBar:(nonnull UINavigationBar *)navigationBar;

@end

NS_ASSUME_NONNULL_END
