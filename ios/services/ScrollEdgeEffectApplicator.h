#import "RNSEnums.h"

@protocol ScrollEdgeEffectProviding
- (RNSScrollEdgeEffect)bottomScrollEdgeEffect;
- (RNSScrollEdgeEffect)leftScrollEdgeEffect;
- (RNSScrollEdgeEffect)rightScrollEdgeEffect;
- (RNSScrollEdgeEffect)topScrollEdgeEffect;
@end

@interface ScrollEdgeEffectApplicator : NSObject
+ (void)applyToScrollView:(UIScrollView *)scrollView fromProvider:(id<ScrollEdgeEffectProviding>)provider;
@end
