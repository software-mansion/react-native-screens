#import "RNSEnums.h"

@protocol ScrollEdgeEffectProviding
@property RNSScrollEdgeEffect bottomScrollEdgeEffect;
@property RNSScrollEdgeEffect leftScrollEdgeEffect;
@property RNSScrollEdgeEffect rightScrollEdgeEffect;
@property RNSScrollEdgeEffect topScrollEdgeEffect;
@end

@interface ScrollEdgeEffectApplicator : NSObject
+ (void)applyToScrollView:(UIScrollView *)scrollView fromProvider:(id<ScrollEdgeEffectProviding>)provider;
@end
