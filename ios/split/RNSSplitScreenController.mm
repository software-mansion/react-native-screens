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

- (RNSSplitScreenShadowStateProxy *)shadowStateProxy
{
  return [_splitScreenComponentView shadowStateProxy];
}

- (RNSSplitScreenComponentEventEmitter *)reactEventEmitter
{
  return [_splitScreenComponentView reactEventEmitter];
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

  [self updateShadowTreeState];
}

/**
 * @brief Handles frame layout changes and updates Shadow Tree accordingly.
 *
 * Requests for the ShadowNode updates through the shadow state proxy.
 * Differentiates cases when we're in the Host hierarchy to calculate frame relatively
 * to the Host view from the modal case where we're passing absolute layout metrics to the ShadowNode.
 */
- (void)updateShadowTreeState
{
  // For modals, which are presented outside the SplitHost subtree (and RN hierarchy),
  // we're attaching our touch handler and we don't need to apply any offset corrections,
  // because it's positioned relatively to our RNSSplitScreenComponentView
  if (![self isInSplitHostSubtree]) {
    [[self shadowStateProxy] updateShadowStateOfComponent:_splitScreenComponentView];
    return;
  }

  UIView *ancestorView = [self findSplitHostController].view;
  RCTAssert(ancestorView != nil, @"[RNScreens] Expected to find RNSSplitHost component for RNSSplitScreen component");

  [[self shadowStateProxy] updateShadowStateOfComponent:_splitScreenComponentView inContextOfAncestorView:ancestorView];
}

- (void)columnPositioningDidChangeInSplitViewController:(UISplitViewController *)splitViewController
{
  [[self shadowStateProxy] updateShadowStateOfComponent:_splitScreenComponentView
                                inContextOfAncestorView:splitViewController.view];
}

#pragma mark - Events

- (void)viewWillAppear:(BOOL)animated
{
  [super viewWillAppear:animated];
  [[self reactEventEmitter] emitOnWillAppear];
}

- (void)viewDidAppear:(BOOL)animated
{
  [super viewDidAppear:animated];
  [[self reactEventEmitter] emitOnDidAppear];
}

- (void)viewWillDisappear:(BOOL)animated
{
  [super viewWillDisappear:animated];
  [[self reactEventEmitter] emitOnWillDisappear];
}

- (void)viewDidDisappear:(BOOL)animated
{
  [super viewDidDisappear:animated];
  [[self reactEventEmitter] emitOnDidDisappear];
}

@end
