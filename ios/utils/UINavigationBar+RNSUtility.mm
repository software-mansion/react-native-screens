#import "UINavigationBar+RNSUtility.h"

#import <React/RCTLog.h>

@implementation UINavigationBar (RNSUtility)

- (nullable UIView *)rnscreens_findContentView
{
  // Class names taken from iOS 17.5, tested on iPhone 15 Pro
  static Class ContentViewClass = NSClassFromString(@"_UINavigationBarContentView");

  // Fast path
  if (self.subviews.count > 1 && [self.subviews[1] isKindOfClass:ContentViewClass]) {
    return self.subviews[1];
  }

  for (UIView *subview in self.subviews) {
    if ([subview isKindOfClass:ContentViewClass]) {
      return subview;
    }
  }

  return nil;
}

- (nullable UIView *)rnscreens_findBackButtonWrapperView
{
  // Class names taken from iOS 17.5, tested on iPhone 15 Pro
  static Class BarButtonViewClass = NSClassFromString(@"_UIButtonBarButton");

  UIView *contentView = self.rnscreens_findContentView;

  if (contentView == nil) {
    return nil;
  }

  for (UIView *subview in contentView.subviews) {
    if ([subview isKindOfClass:BarButtonViewClass]) {
      return subview;
    }
  }

  return nil;
}

- (NSDirectionalEdgeInsets)rnscreens_computeTotalEdgeInsetsForView:(nullable UIView *)sourceView
{
  NSDirectionalEdgeInsets totalMargins = NSDirectionalEdgeInsetsMake(0, 0, 0, 0);

  if (!sourceView) {
    RCTLogWarn(@"[RNScreens] _UINavigationBarTitleControl not found under the UINavigationBar hierarchy");
    return totalMargins;
  }

  UIView *currentView = sourceView.superview;
  while (currentView && currentView != self) {
    NSDirectionalEdgeInsets margins = currentView.directionalLayoutMargins;
    totalMargins.top += margins.top;
    totalMargins.leading += margins.leading;
    totalMargins.bottom += margins.bottom;
    totalMargins.trailing += margins.trailing;
    currentView = currentView.superview;
  }
  return totalMargins;
}

+ (UIView *)findTitleControlInView:(UIView *)view
{
  static Class UINavBarTitleControlClass = NSClassFromString(@"_UINavigationBarTitleControl");

  if ([view isKindOfClass:UINavBarTitleControlClass]) {
    return view;
  }

  for (UIView *subview in view.subviews) {
    UIView *result = [UINavigationBar findTitleControlInView:subview];
    if (result) {
      return result;
    }
  }

  return nil;
}

@end
