#import "RNSContainerHelpers.h"
#import <React/UIView+React.h>

@implementation RNSContainerHelpers

+ (BOOL)addChildViewController:(nullable UIViewController *)childViewController
      toViewControllerManaging:(nullable UIView *)startingView
             withContainerView:(nullable UIView *)containerView
{
  if (startingView == nil || childViewController == nil || containerView == nil) {
    return NO;
  }

  if (childViewController.parentViewController != nil) {
    return NO;
  }

  UIViewController *_Nullable parentViewController = [self findParentViewControllerCandidateFromView:startingView];

  if (parentViewController == nil) {
    return NO;
  }

  return [self addChildController:childViewController toParent:parentViewController containerView:containerView];
}

+ (nullable UIViewController *)findParentViewControllerCandidateFromView:(nullable UIView *)view
{
  if (view == nil) {
    return nil;
  }

  UIView *currView = view;
  UIViewController *_Nullable maybeViewController;

  while (currView != nil) {
    maybeViewController = currView.reactViewController;

    if (maybeViewController != nil) {
      return maybeViewController;
    }

    currView = currView.reactSuperview;
  }

  return nil;
}

+ (BOOL)addChildController:(nullable UIViewController *)childViewController
                  toParent:(nullable UIViewController *)parentViewController
             containerView:(nullable UIView *)containerView
{
  if (!childViewController || !parentViewController || !containerView) {
    return NO;
  }

  [parentViewController addChildViewController:childViewController];
  [containerView addSubview:childViewController.view];
  [childViewController didMoveToParentViewController:parentViewController];

  return YES;
}

@end
