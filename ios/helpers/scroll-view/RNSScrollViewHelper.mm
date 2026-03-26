#import "RNSScrollViewHelper.h"
#import "RNSScrollViewFinder.h"

@implementation RNSScrollViewHelper

+ (void)overrideScrollViewBehaviorInFirstDescendantChainFrom:(nullable UIView *)view
{
  [self overrideContentInsetAdjustmentBehaviorIfNeededForScrollView:
            [RNSScrollViewFinder findScrollViewInFirstDescendantChainFrom:view]];
}

+ (void)overrideContentInsetAdjustmentBehaviorIfNeededForScrollView:(nullable UIScrollView *)scrollView
{
  if ([scrollView contentInsetAdjustmentBehavior] == UIScrollViewContentInsetAdjustmentNever) {
    [scrollView setContentInsetAdjustmentBehavior:UIScrollViewContentInsetAdjustmentAutomatic];
  }
}

@end
