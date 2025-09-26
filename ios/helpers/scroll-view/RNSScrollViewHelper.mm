#import "RNSScrollViewHelper.h"
#import "RNSScrollViewFinder.h"

@implementation RNSScrollViewHelper

+ (void)overrideScrollViewBehaviorInFirstDescendantChainFrom:(nullable UIView *)view
{
  UIScrollView *scrollView = [RNSScrollViewFinder findContentScrollViewWithFirstDescendantsChain:view];

  if ([scrollView contentInsetAdjustmentBehavior] == UIScrollViewContentInsetAdjustmentNever) {
    [scrollView setContentInsetAdjustmentBehavior:UIScrollViewContentInsetAdjustmentAutomatic];
  }
}

@end
