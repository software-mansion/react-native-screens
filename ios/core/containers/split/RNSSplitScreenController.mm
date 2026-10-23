#import "RNSSplitScreenController.h"

#import "RNSAssert.h"
#import "RNSSplitHostController.h"

@implementation RNSSplitScreenController

/**
 * @brief Returns the SplitHost controller the column is installed in.
 *
 * @return `splitViewController` if it is a RNSSplitHostController, otherwise nil (e.g. for the inspector presented as
 * a modal, outside the split hierarchy).
 */
- (nullable RNSSplitHostController *)findSplitHostController
{
  if ([self.splitViewController isKindOfClass:RNSSplitHostController.class]) {
    return (RNSSplitHostController *)self.splitViewController;
  }

  return nil;
}

- (BOOL)isInSplitHostSubtree
{
  return [self.splitViewController isKindOfClass:RNSSplitHostController.class];
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

#pragma mark - Events

- (void)viewWillAppear:(BOOL)animated
{
  [super viewWillAppear:animated];
  [_delegate splitScreenControllerWillAppear:self];
}

- (void)viewDidAppear:(BOOL)animated
{
  [super viewDidAppear:animated];
  [_delegate splitScreenControllerDidAppear:self];
}

- (void)viewWillDisappear:(BOOL)animated
{
  [super viewWillDisappear:animated];
  [_delegate splitScreenControllerWillDisappear:self];
}

- (void)viewDidDisappear:(BOOL)animated
{
  [super viewDidDisappear:animated];
  [_delegate splitScreenControllerDidDisappear:self];
}

@end
