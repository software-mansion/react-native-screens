#import "RNSEnums.h"

@protocol RNSScrollEdgeEffectProviding
- (RNSScrollEdgeEffect)bottomScrollEdgeEffect;
- (RNSScrollEdgeEffect)leftScrollEdgeEffect;
- (RNSScrollEdgeEffect)rightScrollEdgeEffect;
- (RNSScrollEdgeEffect)topScrollEdgeEffect;
@end

@interface RNSScrollEdgeEffectApplicator : NSObject
+ (void)applyToScrollView:(UIScrollView *)scrollView fromProvider:(id<RNSScrollEdgeEffectProviding>)provider;
@end
