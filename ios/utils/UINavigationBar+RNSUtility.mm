#import "UINavigationBar+RNSUtility.h"

@implementation UINavigationBar (RNSUtility)

- (nullable UIView *)rnscreens_findContentView
{
  static Class ContentViewClass;
  if (@available(iOS 26.0, *)) {
    ContentViewClass = NSClassFromString(@"UIKit.NavigationBarContentView");
  } else {
    ContentViewClass = NSClassFromString(@"_UINavigationBarContentView");
  }

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

+ (nullable UIView *)rnscreens_findNestedBackButtonWrapperInView:(nullable UIView *)view
{
  if (view == nil) {
    return nil;
  }

  static Class BarButtonViewClass = NSClassFromString(@"_UIButtonBarButton");

  UIView *foundView;

  for (UIView *subview in view.subviews) {
    if ([subview isKindOfClass:BarButtonViewClass]) {
      return subview;
    }

    foundView = [UINavigationBar rnscreens_findNestedBackButtonWrapperInView:subview];
    if (foundView != nil) {
      return foundView;
    }
  }

  return nil;
}

- (nullable UIView *)rnscreens_findBackButtonWrapperView
{
  UIView *contentView = self.rnscreens_findContentView;

  return [UINavigationBar rnscreens_findNestedBackButtonWrapperInView:contentView];
}

@end
