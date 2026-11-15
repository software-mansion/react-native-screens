#import "RNSScrollEdgeEffectApplicator.h"
#import <objc/runtime.h>
#import "RNSDefines.h"
#import "RNSEnums.h"
#import "RNSLog.h"

// UIKit can draw a hard top edge while nothing is under the bar (seen on iOS 27), so it stays hidden at the top.
@protocol RNSScrollDelegateSplitting
- (void)addDelegate:(id<UIScrollViewDelegate>)delegate;
@end

@protocol RNSScrollDelegateSplitterOwning
- (id<RNSScrollDelegateSplitting>)delegateSplitter;
@end

@interface RNSHardTopEdgeAtRestHider : NSObject <UIScrollViewDelegate>
@property (nonatomic) BOOL active;
- (void)updateForScrollView:(UIScrollView *)scrollView;
@end

@implementation RNSHardTopEdgeAtRestHider

- (void)updateForScrollView:(UIScrollView *)scrollView
{
#if RNS_IPHONE_OS_VERSION_AVAILABLE(26_0)
  if (@available(iOS 26, *)) {
    if (!_active) {
      return;
    }
    BOOL atRest = scrollView.contentOffset.y <= -scrollView.adjustedContentInset.top + 0.5;
    if (scrollView.topEdgeEffect.hidden != atRest) {
      scrollView.topEdgeEffect.hidden = atRest;
    }
  }
#endif
}

- (void)scrollViewDidScroll:(UIScrollView *)scrollView
{
  [self updateForScrollView:scrollView];
}

@end

static const void *const RNSHardTopEdgeAtRestHiderKey = &RNSHardTopEdgeAtRestHiderKey;

@implementation RNSScrollEdgeEffectApplicator

+ (void)applyToScrollView:(nonnull UIScrollView *)scrollView
             withProvider:(nonnull id<RNSScrollEdgeEffectProviding>)provider
{
#if RNS_IPHONE_OS_VERSION_AVAILABLE(26_0)
  if (@available(iOS 26, *)) {
    [RNSScrollEdgeEffectApplicator configureEffect:scrollView.bottomEdgeEffect
                                          withEnum:[provider bottomScrollEdgeEffect]];
    [RNSScrollEdgeEffectApplicator configureEffect:scrollView.leftEdgeEffect withEnum:[provider leftScrollEdgeEffect]];
    [RNSScrollEdgeEffectApplicator configureEffect:scrollView.rightEdgeEffect
                                          withEnum:[provider rightScrollEdgeEffect]];
    [RNSScrollEdgeEffectApplicator configureEffect:scrollView.topEdgeEffect withEnum:[provider topScrollEdgeEffect]];
    [RNSScrollEdgeEffectApplicator hideHardTopEdgeAtRestIn:scrollView
                                                    enabled:[provider topScrollEdgeEffect] == RNSScrollEdgeEffectHard];
  }
#endif
}

+ (void)hideHardTopEdgeAtRestIn:(nonnull UIScrollView *)scrollView enabled:(BOOL)enabled
{
  RNSHardTopEdgeAtRestHider *hider = objc_getAssociatedObject(scrollView, RNSHardTopEdgeAtRestHiderKey);
  if (!enabled) {
    hider.active = NO;
    return;
  }
  if (![scrollView respondsToSelector:@selector(delegateSplitter)]) {
    return;
  }
  if (hider == nil) {
    hider = [RNSHardTopEdgeAtRestHider new];
    objc_setAssociatedObject(scrollView, RNSHardTopEdgeAtRestHiderKey, hider, OBJC_ASSOCIATION_RETAIN_NONATOMIC);
    [[(id<RNSScrollDelegateSplitterOwning>)scrollView delegateSplitter] addDelegate:hider];
  }
  hider.active = YES;
  [hider updateForScrollView:scrollView];
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
        RNSLogE(@"[RNScreens] unsupported edge effect");
        break;
    }
  }
}
#endif

@end
