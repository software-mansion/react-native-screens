#import "RNSLog.h"
#import "UINavigationBar+RNSUtility.h"

@implementation UINavigationBar (RNSUtility)

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

- (nullable UIView *)rnscreens_findBackButtonWrapperView
{
  UIView *contentView = [self rnscreens_findContentView];

  return [self rnscreens_findDescendantBackButtonWrapperFromView:contentView];
}

- (nullable UIView *)rnscreens_findDescendantBackButtonWrapperFromView:(nullable UIView *)view
{
  static Class BarButtonViewClass = NSClassFromString(@"_UIButtonBarButton");

  if (@available(iOS 26.0, *)) {
    return [self rnscreens_ios26_findDescendantBackButtonWrapper:BarButtonViewClass fromView:view];
  } else {
    return [self rnscreens_ios15_findDescendantBackButtonWrapper:BarButtonViewClass fromView:view];
  }
}

- (nullable UIView *)rnscreens_ios26_findDescendantBackButtonWrapper:(Class)BarButtonViewClass
                                                            fromView:(nullable UIView *)view
{
  if (view == nil) {
    return nil;
  }

  if ([view isKindOfClass:BarButtonViewClass]) {
    return view;
  }

  UIView *maybeButtonWrapperView = nil;
  for (UIView *subview in view.subviews) {
    maybeButtonWrapperView = [self rnscreens_ios26_findDescendantBackButtonWrapper:BarButtonViewClass fromView:subview];
    if (maybeButtonWrapperView != nil) {
      return maybeButtonWrapperView;
    }
  }
  return nil;
}

- (nullable UIView *)rnscreens_ios15_findDescendantBackButtonWrapper:(Class)BarButtonViewClass
                                                            fromView:(nullable UIView *)view
{
  if (view == nil) {
    return nil;
  }

  for (UIView *subview in view.subviews) {
    if ([subview isKindOfClass:BarButtonViewClass]) {
      return subview;
    }
  }
  return nil;
}

+ (Class)rnscreens_getContentViewRuntimeClass
{
  if (@available(iOS 26.0, *)) {
    return NSClassFromString(@"UIKit.NavigationBarContentView"); // Sampled from iOS 26 Beta (iPhone 16)
  }

  return NSClassFromString(@"_UINavigationBarContentView"); // Sampled from iOS 17.5 (iPhone 15 Pro)
}

- (nullable UIView *)rnscreens_findSubviewOfClass:(Class)viewClass from:(nullable UIView *)view
{
  if (view == nil) {
    return nil;
  }

  if ([view isKindOfClass:viewClass]) {
    return view;
  }

  return [self rnscreens_findSubviewOfClass:viewClass from:view.superview];
}

- (nullable UIView *)rnscreens_findNavigationBarPlatterViewFromUIView:(UIView *_Nonnull)view
{
  Class platterItemViewClass = NSClassFromString(@"_UINavigationBarPlatterView");
  if (!platterItemViewClass) {
    RNSLog(@"[RNScreens] Class _UINavigationBarPlatterItemView not found.");
    return nil;
  }

  RNSLog(@"[RNScreens] Search for platter from %p", view);
  UIView *platterItemView = [self rnscreens_findSubviewOfClass:platterItemViewClass from:view];
  if (!platterItemView) {
    RNSLog(@"[RNScreens] No _UINavigationBarPlatterItemView found in UINavigationBar.");
    return nil;
  }

  return platterItemView;
}

@end
