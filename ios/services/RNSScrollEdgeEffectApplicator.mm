#import "RNSScrollEdgeEffectApplicator.h"
#import <React/RCTLog.h>
#import "RNSDefines.h"
#import "RNSEnums.h"

@implementation RNSScrollEdgeEffectApplicator

+ (void)applyToScrollView:(UIScrollView *)scrollView withProvider:(id<RNSScrollEdgeEffectProviding>)provider
{
#if RNS_IPHONE_OS_VERSION_AVAILABLE(26_0)
  if (@available(iOS 26, *)) {
    [RNSScrollEdgeEffectApplicator configureEffect:scrollView.bottomEdgeEffect
                                          withEnum:[provider bottomScrollEdgeEffect]];
    [RNSScrollEdgeEffectApplicator configureEffect:scrollView.leftEdgeEffect withEnum:[provider leftScrollEdgeEffect]];
    [RNSScrollEdgeEffectApplicator configureEffect:scrollView.rightEdgeEffect
                                          withEnum:[provider rightScrollEdgeEffect]];
    [RNSScrollEdgeEffectApplicator configureEffect:scrollView.topEdgeEffect withEnum:[provider topScrollEdgeEffect]];
  }
#endif
}

#if RNS_IPHONE_OS_VERSION_AVAILABLE(26_0)
+ (void)configureEffect:(UIScrollEdgeEffect *)edgeEffect
               withEnum:(RNSScrollEdgeEffect)effectEnum API_AVAILABLE(ios(26.0))
{
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
      default:
        RCTLogError(@"[RNScreens] unsupported edge effect");
        break;
    }
  }
}
#endif

@end
