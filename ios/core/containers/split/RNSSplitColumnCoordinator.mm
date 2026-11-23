#import "RNSSplitColumnCoordinator.h"

#import "RNSAssert.h"
#import "RNSSplitHostController.h"
#import "RNSSplitPlainColumnContentView.h"
#import "RNSStackNavigationController.h"
#import "RNSStackScreenController.h"
#import "RNSStackScreenHeaderCoordinator.h"

@interface RNSSplitColumnCoordinator () <RNSSplitPlainColumnContentViewDelegate>
@end

@implementation RNSSplitColumnCoordinator {
  RNSStackNavigationController *_Nullable _plainColumnNavigationController;
  RNSStackScreenController *_Nonnull _plainColumnScreenController;
}

- (instancetype)init
{
  if (self = [super init]) {
    _plainColumnContentView = [RNSSplitPlainColumnContentView new];
    _plainColumnContentView.delegate = self;

    // The content of a plain column is a stack screen.
    _plainColumnScreenController = [RNSStackScreenController new];
    _plainColumnScreenController.view = _plainColumnContentView;

    // The screen has no header configuration, and the column keeps its navigation bar. UIKit places the display mode
    // button and the back button of a collapsed Split there.
    _plainColumnScreenController.headerCoordinator.showsNavigationBarWithoutHeaderConfig = YES;
#if !TARGET_OS_TV
    // Navigation bar prefers large titles, so opt out unless a navigation item customizer sets a mode.
    _plainColumnScreenController.navigationItem.largeTitleDisplayMode = UINavigationItemLargeTitleDisplayModeNever;
#endif // !TARGET_OS_TV
  }

  return self;
}

/**
 * @brief Returns the SplitHost controller the plain column is installed in.
 *
 * The navigation controller of the plain column is asked, as the coordinator is not in the view controller hierarchy.
 *
 * @return `splitViewController` of the navigation controller if it is a RNSSplitHostController, otherwise nil (e.g.
 * for the inspector presented as a modal, outside the split hierarchy).
 */
- (nullable RNSSplitHostController *)findSplitHostController
{
  UISplitViewController *splitViewController = _plainColumnNavigationController.splitViewController;
  if ([splitViewController isKindOfClass:RNSSplitHostController.class]) {
    return (RNSSplitHostController *)splitViewController;
  }

  return nil;
}

- (BOOL)isInSplitHostSubtree
{
  return [self findSplitHostController] != nil;
}

#pragma mark - Content

- (UINavigationItem *)plainColumnNavigationItem
{
  return _plainColumnScreenController.navigationItem;
}

#pragma mark - Navigation controller

- (RNSStackNavigationController *)plainColumnNavigationController
{
  if (_plainColumnNavigationController == nil) {
    // `initWithRootViewController:` would skip the `init` of RNSStackNavigationController, which sets up its navigation
    // bar. The controller is created with `init` and gets its root afterwards.
    _plainColumnNavigationController = [RNSStackNavigationController new];
    _plainColumnNavigationController.viewControllers = @[ _plainColumnScreenController ];
    _plainColumnNavigationController.viewLifecycleEventsObserver = self;
  }
  return _plainColumnNavigationController;
}

- (void)releasePlainColumnNavigationController
{
  _plainColumnNavigationController.viewLifecycleEventsObserver = nil;
  _plainColumnNavigationController = nil;
}

#pragma mark - Layout

- (void)reportColumnFrame
{
  // For modals, which are presented outside the SplitHost subtree (and RN hierarchy),
  // we're attaching our touch handler and we don't need to apply any offset corrections,
  // because it's positioned relatively to the column view
  if (![self isInSplitHostSubtree]) {
    [_delegate splitColumnCoordinator:self didChangeColumnFrame:_plainColumnContentView.frame];
    return;
  }

  UIView *ancestorView = [self findSplitHostController].view;
  RNSAssert(ancestorView != nil, @"[RNScreens] Expected to find RNSSplitHost component for RNSSplitScreen component");

  CGRect frame = [_plainColumnContentView convertRect:_plainColumnContentView.frame toView:ancestorView];
  [_delegate splitColumnCoordinator:self didChangeColumnFrame:frame];
}

- (void)columnPositioningDidChange
{
  if (_plainColumnContentView.window == nil) {
    // The column is not on screen, or it hosts a stack and its content view is not in the view hierarchy.
    return;
  }

  [self reportColumnFrame];
}

#pragma mark - RNSSplitPlainColumnContentViewDelegate

- (void)splitPlainColumnContentViewDidLayoutSubviews:(RNSSplitPlainColumnContentView *)contentView
{
  [self reportColumnFrame];
}

- (void)splitPlainColumnContentViewDidMoveToWindow
{
  [_delegate splitColumnCoordinator:self plainColumnContentViewDidMoveToWindow:_plainColumnContentView.window];
}

#pragma mark - RNSViewControllerViewLifecycleEventsObserver

- (void)viewControllerViewWillAppear:(UIViewController *)viewController
{
  [_delegate splitColumnWillAppear:self];
}

- (void)viewControllerViewDidAppear:(UIViewController *)viewController
{
  [_delegate splitColumnDidAppear:self];
}

- (void)viewControllerViewWillDisappear:(UIViewController *)viewController
{
  [_delegate splitColumnWillDisappear:self];
}

- (void)viewControllerViewDidDisappear:(UIViewController *)viewController
{
  [_delegate splitColumnDidDisappear:self];
}

@end
