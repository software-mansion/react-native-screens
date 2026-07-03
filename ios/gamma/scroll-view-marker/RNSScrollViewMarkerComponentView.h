#pragma once

#import "RNSReactBaseView.h"

NS_ASSUME_NONNULL_BEGIN

@class UIScrollView;

@interface RNSScrollViewMarkerComponentView : RNSReactBaseView

- (BOOL)hasScrollEdgeEffects;
- (void)applyScrollEdgeEffectsToScrollView:(nullable UIScrollView *)scrollView;

@end

NS_ASSUME_NONNULL_END
