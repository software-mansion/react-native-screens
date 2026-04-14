#pragma once

#import "RNSReactBaseView.h"
#import "RNSSplitHeaderItemSpacerPlacement.h"
#import "RNSSplitHeaderItemInvalidationDelegate.h"

NS_ASSUME_NONNULL_BEGIN

@interface RNSSplitHeaderItemSpacerComponentView : RNSReactBaseView

@property (nonatomic, weak, nullable) id<RNSSplitHeaderItemInvalidationDelegate> invalidationDelegate;

@property (nonatomic, readonly) RNSSplitHeaderItemSpacerPlacement placement;

- (nonnull UIBarButtonItem *)makeBarButtonItem;

@end

NS_ASSUME_NONNULL_END
