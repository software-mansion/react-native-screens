#import "RNSScrollViewHelper.h"
#import "RNSScrollViewFinder.h"

@implementation RNSScrollViewHelper

+ (void)overrideScrollViewBehaviorInFirstDescendantChainFrom:(nullable UIView *)view
{
  [self overrideScrollViewBehavior:[RNSScrollViewFinder findScrollViewInFirstDescendantChainFrom:view]];
}

+ (void)overrideScrollViewBehavior:(nullable UIScrollView *)scrollView
{
  if ([scrollView contentInsetAdjustmentBehavior] == UIScrollViewContentInsetAdjustmentNever) {
    [scrollView setContentInsetAdjustmentBehavior:UIScrollViewContentInsetAdjustmentAutomatic];
  }
}

@end
