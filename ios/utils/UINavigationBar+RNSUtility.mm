#import "UINavigationBar+RNSUtility.h"

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

@end
