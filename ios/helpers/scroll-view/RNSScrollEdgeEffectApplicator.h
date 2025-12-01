#pragma once

#import "RNSEnums.h"

@protocol RNSScrollEdgeEffectProviding
- (RNSScrollEdgeEffect)bottomScrollEdgeEffect;
- (RNSScrollEdgeEffect)leftScrollEdgeEffect;
- (RNSScrollEdgeEffect)rightScrollEdgeEffect;
- (RNSScrollEdgeEffect)topScrollEdgeEffect;
@end

@interface RNSScrollEdgeEffectApplicator : NSObject
+ (void)applyToScrollView:(UIScrollView *)scrollView withProvider:(id<RNSScrollEdgeEffectProviding>)provider;
@end
