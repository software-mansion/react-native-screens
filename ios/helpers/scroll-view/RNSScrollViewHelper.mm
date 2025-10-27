#import "RNSScrollViewHelper.h"
#import "RNSScrollViewFinder.h"

@implementation RNSScrollViewHelper

+ (void)overrideScrollViewBehaviorInFirstDescendantChainFrom:(nullable UIView *)view
{
  UIScrollView *scrollView = [RNSScrollViewFinder findScrollViewInFirstDescendantChainFrom:view];

  if ([scrollView contentInsetAdjustmentBehavior] == UIScrollViewContentInsetAdjustmentNever) {
    [scrollView setContentInsetAdjustmentBehavior:UIScrollViewContentInsetAdjustmentAutomatic];
  }
}

@end
