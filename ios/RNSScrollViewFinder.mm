#import "RNSScrollViewFinder.h"

@implementation RNSScrollViewFinder

+ (UIScrollView *)findScrollViewInFirstDescendantChainFrom:(UIView *)view
{
  UIView *currentView = view;

  while (currentView != nil) {
    if ([currentView isKindOfClass:UIScrollView.class]) {
      return static_cast<UIScrollView *>(currentView);
    } else if ([currentView.subviews count] > 0) {
      currentView = currentView.subviews[0];
    } else {
      break;
    }
  }

  return nil;
}

@end
