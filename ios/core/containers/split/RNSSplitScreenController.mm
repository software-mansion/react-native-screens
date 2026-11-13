#import "RNSSplitScreenController.h"

#import "RNSAssert.h"
#import "RNSSplitHostController.h"
#import "RNSSplitNavigationController.h"
#import "RNSViewControllerViewLifecycleEventsObserver.h"

@interface RNSSplitScreenController () <RNSViewControllerViewLifecycleEventsObserver>
@end

@implementation RNSSplitScreenController {
  RNSSplitNavigationController *_Nullable _columnNavigationController;
}

- (instancetype)init
{
  if (self = [super init]) {
#if !TARGET_OS_TV
    // Navigation bar prefers large titles, so opt out unless a navigation item customizer sets a mode.
    self.navigationItem.largeTitleDisplayMode = UINavigationItemLargeTitleDisplayModeNever;
#endif // !TARGET_OS_TV
  }

  return self;
}

/**
 * @brief Returns the SplitHost controller the column is installed in.
 *
 * The navigation controller of the column is asked, as this controller is not in the view controller hierarchy when
 * the column hosts a stack.
 *
 * @return `splitViewController` of the navigation controller if it is a RNSSplitHostController, otherwise nil (e.g.
 * for the inspector presented as a modal, outside the split hierarchy).
 */
- (nullable RNSSplitHostController *)findSplitHostController
{
  UISplitViewController *splitViewController = _columnNavigationController.splitViewController;
  if ([splitViewController isKindOfClass:RNSSplitHostController.class]) {
    return (RNSSplitHostController *)splitViewController;
  }

  return nil;
}

- (BOOL)isInSplitHostSubtree
{
  return [self findSplitHostController] != nil;
}

#pragma mark - Navigation controller

/**
 * TODO: Make the content of a column that does not host a stack a stack screen as well: an RNSStackScreenController
 * with a plain view, under which the React content of the column is mounted. This controller leaves the view
 * controller hierarchy then.
 *
 * RNSSplitNavigationController is a stack navigation controller, which is meant to hold RNSStackScreenController
 * instances only. For a column that does not host a stack, this controller is still the root, as it was before the
 * navigation controller of a column became a stack one.
 *
 * A navigation controller that holds this controller is never used by a stack: nothing is pushed onto it or popped
 * from it.
 */
- (RNSSplitNavigationController *)columnNavigationController
{
  if (_columnNavigationController == nil) {
    // `initWithRootViewController:` would skip the `init` of RNSStackNavigationController, which sets up its navigation
    // bar. The controller is created with `init` and gets its root afterwards.
    _columnNavigationController = [RNSSplitNavigationController new];
    _columnNavigationController.viewLifecycleEventsObserver = self;
    if (_hostsStack) {
      [_delegate splitScreenController:self didCreateNavigationControllerForStack:_columnNavigationController];
    } else {
      _columnNavigationController.viewControllers = @[ self ];
    }
  }
  return _columnNavigationController;
}

- (void)setHostsStack:(BOOL)hostsStack
{
  if (_hostsStack == hostsStack) {
    return;
  }
  _hostsStack = hostsStack;

  // The column gets a new navigation controller. The current one is released and the Split is asked to install the
  // one created in its place. The Split is asked first, because it is looked up through the current navigation
  // controller.
  [self setNeedsLifecycleStateUpdate];
  [self releaseColumnNavigationController];
}

- (void)releaseColumnNavigationController
{
  _columnNavigationController.viewLifecycleEventsObserver = nil;
  _columnNavigationController = nil;
}

#pragma mark - Signals

- (void)setNeedsLifecycleStateUpdate
{
  [[self findSplitHostController] setNeedsUpdateOfChildViewControllers];
}

#pragma mark - Layout

- (void)viewDidLayoutSubviews
{
  [super viewDidLayoutSubviews];

  // For modals, which are presented outside the SplitHost subtree (and RN hierarchy),
  // we're attaching our touch handler and we don't need to apply any offset corrections,
  // because it's positioned relatively to the column view
  if (![self isInSplitHostSubtree]) {
    [_delegate splitScreenController:self didChangeColumnFrame:self.view.frame];
    return;
  }

  UIView *ancestorView = [self findSplitHostController].view;
  RNSAssert(ancestorView != nil, @"[RNScreens] Expected to find RNSSplitHost component for RNSSplitScreen component");

  [self reportColumnFrameInContextOfView:ancestorView];
}

- (void)columnPositioningDidChangeInSplitViewController:(UISplitViewController *)splitViewController
{
  [self reportColumnFrameInContextOfView:splitViewController.view];
}

- (void)reportColumnFrameInContextOfView:(UIView *)ancestorView
{
  CGRect frame = [self.view convertRect:self.view.frame toView:ancestorView];
  [_delegate splitScreenController:self didChangeColumnFrame:frame];
}

#pragma mark - RNSViewControllerViewLifecycleEventsObserver

- (void)viewControllerViewWillAppear:(UIViewController *)viewController
{
  [_delegate splitScreenControllerWillAppear:self];
}

- (void)viewControllerViewDidAppear:(UIViewController *)viewController
{
  [_delegate splitScreenControllerDidAppear:self];
}

- (void)viewControllerViewWillDisappear:(UIViewController *)viewController
{
  [_delegate splitScreenControllerWillDisappear:self];
}

- (void)viewControllerViewDidDisappear:(UIViewController *)viewController
{
  [_delegate splitScreenControllerDidDisappear:self];
}

@end
