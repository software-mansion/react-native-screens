#import "UINavigationBar+RNSUtility.h"

@implementation UINavigationBar (RNSUtility)

+ (Class)rnscreens_getContentViewRuntimeClass
{
  if (@available(iOS 26.0, *)) {
    return NSClassFromString(@"UIKit.NavigationBarContentView"); // Sampled from iOS 26 Beta (iPhone 16)
  }

  return NSClassFromString(@"_UINavigationBarContentView"); // Sampled from iOS 17.5 (iPhone 15 Pro)
}

- (nullable UIView *)rnscreens_findContentView
{
  static Class ContentViewClass = [UINavigationBar rnscreens_getContentViewRuntimeClass];

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

- (nullable UIView *)rnscreens_findNestedBackButtonWrapperInView:(nullable UIView *)view
{
  if (view == nil) {
    return nil;
  }

  static Class BarButtonViewClass = NSClassFromString(@"_UIButtonBarButton");

  UIView *foundView = nil;

  for (UIView *subview in view.subviews) {
    if ([subview isKindOfClass:BarButtonViewClass]) {
      return subview;
    }

    foundView = [self rnscreens_findNestedBackButtonWrapperInView:subview];
    if (foundView != nil) {
      return foundView;
    }
  }

  return nil;
}

- (nullable UIView *)rnscreens_findBackButtonWrapperView
{
  UIView *contentView = [self rnscreens_findContentView];

  return [self rnscreens_findNestedBackButtonWrapperInView:contentView];
}

@end
