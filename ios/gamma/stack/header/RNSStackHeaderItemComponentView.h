#pragma once

#import "RNSHeaderItemPlacement.h"
#import "RNSReactBaseView.h"
#import "RNSStackHeaderItemInvalidationDelegate.h"
#import "RNSViewFrameChangeDelegate.h"

NS_ASSUME_NONNULL_BEGIN

@interface RNSStackHeaderItemComponentView : RNSReactBaseView

@property (nonatomic, weak, nullable) id<RNSStackHeaderItemInvalidationDelegate> invalidationDelegate;

@property (nonatomic, readonly) RNSHeaderItemPlacement placement;
@property (nonatomic, readonly) BOOL hasCustomView;

- (nonnull UIBarButtonItem *)makeBarButtonItemWithFrameChangeDelegate:(id<RNSViewFrameChangeDelegate>)delegate;
- (nonnull UIView *)makeWrappedViewWithFrameChangeDelegate:(id<RNSViewFrameChangeDelegate>)delegate;

@end

NS_ASSUME_NONNULL_END
