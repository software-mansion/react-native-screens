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

+ (nullable UIScrollView *)findContentScrollViewWithDelegatingToProvider:(nullable UIView *)view
{
  UIView *currentView = view;

  while (currentView != nil) {
    if ([currentView isKindOfClass:UIScrollView.class]) {
      return static_cast<UIScrollView *>(currentView);
    } else if ([currentView respondsToSelector:@selector(findContentScrollView)]) {
      // When traversing the hierarchy, we don't check for conformance to protocol,
      // but whether the view responds to `RNSContentScrollViewProviding.findContentScrollView`.
      // This doesn't place locks and is faster.
      return [static_cast<id<RNSContentScrollViewProviding>>(currentView) findContentScrollView];
    } else if ([currentView.subviews count] > 0) {
      currentView = currentView.subviews[0];
    } else {
      break;
    }
  }

  return nil;
}

@end
