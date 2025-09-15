#import "ScrollEdgeEffectApplicator.h"
#import "RNSDefines.h"
#import "RNSEnums.h"

@implementation ScrollEdgeEffectApplicator

+ (void)applyToScrollView:(UIScrollView *)scrollView fromProvider:(id<ScrollEdgeEffectProviding>)provider
{
#if RNS_IPHONE_OS_VERSION_AVAILABLE(26_0)
  if (@available(iOS 26, *)) {
    [ScrollEdgeEffectApplicator configureSingleEffect:scrollView.bottomEdgeEffect
                                             withEnum:[provider bottomScrollEdgeEffect]];
    [ScrollEdgeEffectApplicator configureSingleEffect:scrollView.leftEdgeEffect
                                             withEnum:[provider leftScrollEdgeEffect]];
    [ScrollEdgeEffectApplicator configureSingleEffect:scrollView.rightEdgeEffect
                                             withEnum:[provider rightScrollEdgeEffect]];
    [ScrollEdgeEffectApplicator configureSingleEffect:scrollView.topEdgeEffect withEnum:[provider topScrollEdgeEffect]];
  }
#endif
}

+ (void)configureSingleEffect:(UIScrollEdgeEffect *)edgeEffect
                     withEnum:(RNSScrollEdgeEffect)effectEnum API_AVAILABLE(ios(26.0))
{
#if RNS_IPHONE_OS_VERSION_AVAILABLE(26_0)
  if (@available(iOS 26, *)) {
    switch (effectEnum) {
      case RNSScrollEdgeEffectAutomatic:
        edgeEffect.hidden = false;
        edgeEffect.style = UIScrollEdgeEffectStyle.automaticStyle;
        break;
      case RNSScrollEdgeEffectHard:
        edgeEffect.hidden = false;
        edgeEffect.style = UIScrollEdgeEffectStyle.hardStyle;
        break;
      case RNSScrollEdgeEffectSoft:
        edgeEffect.hidden = false;
        edgeEffect.style = UIScrollEdgeEffectStyle.softStyle;
        break;
      case RNSScrollEdgeEffectHidden:
        edgeEffect.hidden = true;
        edgeEffect.style = UIScrollEdgeEffectStyle.automaticStyle;
        break;
    }
  }
#endif
}

@end
