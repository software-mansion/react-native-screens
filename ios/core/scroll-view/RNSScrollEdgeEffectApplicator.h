#pragma once

#import "RNSEnums.h"

@protocol RNSScrollEdgeEffectProviding
- (RNSScrollEdgeEffect)bottomScrollEdgeEffect;
- (RNSScrollEdgeEffect)leftScrollEdgeEffect;
- (RNSScrollEdgeEffect)rightScrollEdgeEffect;
- (RNSScrollEdgeEffect)topScrollEdgeEffect;
@end

@interface RNSScrollEdgeEffectApplicator : NSObject
+ (void)applyToScrollView:(nonnull UIScrollView *)scrollView
             withProvider:(nonnull id<RNSScrollEdgeEffectProviding>)provider;
@end
