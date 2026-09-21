#import "RNSSplitScreenController.h"

#import <React/RCTAssert.h>
#import "RNSSplitHostComponentView.h"
#import "RNSSplitHostController.h"
#import "RNSSplitScreenComponentView.h"

@implementation RNSSplitScreenController {
  RNSSplitScreenComponentView *_splitScreenComponentView;
}

- (instancetype)initWithSplitScreenComponentView:(RNSSplitScreenComponentView *)splitScreenComponentView
{
  if (self = [super init]) {
    _splitScreenComponentView = splitScreenComponentView;
  }

  return self;
}

/**
 * @brief Searching for the SplitHost controller
 *
 * It checks whether the parent controller is our host controller.
 * If we're outside the structure, e. g. for inspector represented as a modal,
 * we're searching for that controller using a reference that Screen keeps for Host component view.
 *
 * @return If found - a RNSSplitHostController instance, otherwise nil.
 */
- (nullable RNSSplitHostController *)findSplitHostController
{
  if ([self.splitViewController isKindOfClass:RNSSplitHostController.class]) {
    return (RNSSplitHostController *)self.splitViewController;
  }

  RNSSplitHostComponentView *splitHost = _splitScreenComponentView.splitHost;
  if (splitHost != nil) {
    return splitHost.splitHostController;
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
  // because it's positioned relatively to our RNSSplitScreenComponentView
  if (![self isInSplitHostSubtree]) {
    [_delegate splitScreenController:self didChangeColumnFrame:self.view.frame];
    return;
  }

  UIView *ancestorView = [self findSplitHostController].view;
  RCTAssert(ancestorView != nil, @"[RNScreens] Expected to find RNSSplitHost component for RNSSplitScreen component");

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
