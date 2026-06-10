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

+ (nullable UIScrollView *)findScrollViewBreadthFirstFrom:(nullable UIView *)view
{
  if (view == nil) {
    return nil;
  }

  static const NSUInteger kMaxVisitedViews = 2000;
  NSMutableArray<UIView *> *queue = [NSMutableArray arrayWithObject:view];
  NSUInteger index = 0;

  while (index < queue.count && queue.count < kMaxVisitedViews) {
    UIView *current = queue[index++];

    if ([current isKindOfClass:UIScrollView.class]) {
      UIScrollView *scrollView = static_cast<UIScrollView *>(current);
      // Skip horizontal-only scrollers (carousels). Unmeasured scroll views
      // (zero contentSize) pass, since the main list may not be laid out yet
      // when UIKit first resolves the content scroll view.
      BOOL isHorizontalOnly = scrollView.contentSize.width > scrollView.bounds.size.width &&
          scrollView.contentSize.height <= scrollView.bounds.size.height;
      if (!isHorizontalOnly) {
        return scrollView;
      }
      // Do not descend into a skipped horizontal scroller.
      continue;
    }

    [queue addObjectsFromArray:current.subviews];
  }

  return nil;
}

@end
