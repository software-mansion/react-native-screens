#pragma once

#import "RNSHeaderItemSpacerPlacement.h"
#import "RNSReactBaseView.h"
#import "RNSStackHeaderItemInvalidationDelegate.h"

NS_ASSUME_NONNULL_BEGIN

@interface RNSStackHeaderItemSpacerComponentView : RNSReactBaseView

@property (nonatomic, weak, nullable) id<RNSStackHeaderItemInvalidationDelegate> invalidationDelegate;

@property (nonatomic, readonly) RNSHeaderItemSpacerPlacement placement;

- (nonnull UIBarButtonItem *)makeBarButtonItem;

@end

NS_ASSUME_NONNULL_END
