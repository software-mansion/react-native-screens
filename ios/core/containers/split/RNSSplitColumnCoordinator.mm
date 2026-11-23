#import "RNSSplitColumnCoordinator.h"

#import "RNSAssert.h"
#import "RNSSplitHostController.h"
#import "RNSSplitPlainColumnContentView.h"
#import "RNSStackNavigationController.h"
#import "RNSStackScreenController.h"
#import "RNSStackScreenHeaderCoordinator.h"
#import "RNSViewFrameChangeDelegate.h"

@interface RNSSplitColumnCoordinator () <RNSSplitPlainColumnContentViewDelegate, RNSViewFrameChangeDelegate>
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
    _plainColumnNavigationController.viewFrameChangeDelegate = self;
  }
  return _plainColumnNavigationController;
}

- (void)releasePlainColumnNavigationController
{
  _plainColumnNavigationController.viewLifecycleEventsObserver = nil;
  _plainColumnNavigationController.viewFrameChangeDelegate = nil;
  _plainColumnNavigationController = nil;
}

#pragma mark - Layout

/**
 * @brief Reports the frame of the column to the delegate.
 *
 * The frame of a column is the one of the view of its navigation controller. A column that hosts a stack or is not
 * on screen has no frame to report.
 */
- (void)reportColumnFrame
{
  UIView *columnView = _plainColumnNavigationController.viewIfLoaded;
  if (columnView.window == nil) {
    return;
  }

  // For modals, which are presented outside the SplitHost subtree (and RN hierarchy),
  // we're attaching our touch handler and we don't need to apply any offset corrections,
  // because it's positioned relatively to the column view
  if (![self isInSplitHostSubtree]) {
    [_delegate splitColumnCoordinator:self didChangeColumnFrame:columnView.bounds];
    return;
  }

  UIView *ancestorView = [self findSplitHostController].view;
  RNSAssert(ancestorView != nil, @"[RNScreens] Expected to find RNSSplitHost component for RNSSplitScreen component");

  CGRect frame = [columnView convertRect:columnView.bounds toView:ancestorView];
  [_delegate splitColumnCoordinator:self didChangeColumnFrame:frame];
}

- (void)columnPositioningDidChange
{
  [self reportColumnFrame];
}

#pragma mark - RNSSplitPlainColumnContentViewDelegate

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

#pragma mark - RNSViewFrameChangeDelegate

/**
 * Called when the navigation controller of the column lays out its view.
 */
- (void)viewFrameDidChange:(UIView *)view
{
  [self reportColumnFrame];
}

@end
