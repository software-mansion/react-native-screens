#import "RNSSplitViewScreenController.h"
#import "RNSSplitViewHostController.h"
#import "RNSSplitViewScreenComponentEventEmitter.h"
#import "RNSSplitViewScreenComponentView.h"
#import "RNSSplitViewScreenShadowStateProxy.h"

@interface RNSViewSizeTransitionState : NSObject
@property (nonatomic, strong, nullable) CADisplayLink *displayLink;
@property (nonatomic, assign) CGRect lastViewPresentationFrame;
- (void)setupDisplayLinkForTarget:(id)target selector:(SEL)selector;
- (void)invalidate;
@end

@implementation RNSViewSizeTransitionState

- (instancetype)init
{
  self = [super init];
  if (self) {
    _lastViewPresentationFrame = CGRectNull;
  }
  return self;
}

- (void)setupDisplayLinkForTarget:(id)target selector:(SEL)selector
{
  [self invalidate];
  self.displayLink = [CADisplayLink displayLinkWithTarget:target selector:selector];
  [self.displayLink addToRunLoop:[NSRunLoop mainRunLoop] forMode:NSRunLoopCommonModes];
}

- (void)invalidate
{
  [self.displayLink invalidate];
  self.displayLink = nil;
  self.lastViewPresentationFrame = CGRectNull;
}

@end

@interface RNSSplitViewScreenController ()

@property (nonatomic, strong) RNSSplitViewScreenComponentView *splitViewScreenComponentView;
@property (nonatomic, strong) RNSViewSizeTransitionState *viewSizeTransitionState;

@end

@implementation RNSSplitViewScreenController

- (instancetype)initWithSplitViewScreenComponentView:(RNSSplitViewScreenComponentView *)componentView
{
  self = [super initWithNibName:nil bundle:nil];
  if (self) {
    _splitViewScreenComponentView = componentView;
  }
  return self;
}

- (void)setNeedsLifecycleStateUpdate
{
  RNSSplitViewHostController *host = [self findSplitViewHostController];
  [host setNeedsUpdateOfChildViewControllers];
}

- (RNSSplitViewHostController *)findSplitViewHostController
{
  if ([self.splitViewController isKindOfClass:[RNSSplitViewHostController class]]) {
    return (RNSSplitViewHostController *)self.splitViewController;
  }

  if ([self.splitViewScreenComponentView splitViewHost] != nil) {
    return [self.splitViewScreenComponentView splitViewHost].splitViewHostController;
  }

  return nil;
}

- (BOOL)isInSplitViewHostSubtree
{
  return [self.splitViewController isKindOfClass:[RNSSplitViewHostController class]];
}

- (BOOL)isViewSizeTransitionInProgress
{
  return self.viewSizeTransitionState != nil;
}

- (void)viewWillTransitionToSize:(CGSize)size
       withTransitionCoordinator:(id<UIViewControllerTransitionCoordinator>)coordinator
{
  [super viewWillTransitionToSize:size withTransitionCoordinator:coordinator];

  self.viewSizeTransitionState = [[RNSViewSizeTransitionState alloc] init];

  __weak RNSSplitViewScreenController *weakSelf = self;
  [coordinator
      animateAlongsideTransition:^(id<UIViewControllerTransitionCoordinatorContext> _Nonnull context) {
        if (weakSelf.viewSizeTransitionState.displayLink == nil) {
          [weakSelf.viewSizeTransitionState setupDisplayLinkForTarget:weakSelf
                                                             selector:@selector(trackTransitionProgress)];
        }
      }
      completion:^(id<UIViewControllerTransitionCoordinatorContext> _Nonnull context) {
        [weakSelf cleanupViewSizeTransitionState];
        [weakSelf updateShadowTreeState];
      }];
}

- (void)cleanupViewSizeTransitionState
{
  [self.viewSizeTransitionState invalidate];
  self.viewSizeTransitionState = nil;
}

- (void)trackTransitionProgress
{
  CALayer *presentationLayer = self.view.layer.presentationLayer;
  if (!presentationLayer)
    return;

  CGRect frame = presentationLayer.frame;
  self.viewSizeTransitionState.lastViewPresentationFrame = frame;
  [self updateShadowTreeState];
}

- (void)viewDidLayoutSubviews
{
  [super viewDidLayoutSubviews];
  [self updateShadowTreeState];
}

- (void)updateShadowTreeState
{
  RNSSplitViewScreenShadowStateProxy *proxy = [self.splitViewScreenComponentView shadowStateProxy];

  if (![self isInSplitViewHostSubtree]) {
    [proxy updateShadowStateOfComponent:self.splitViewScreenComponentView];
    return;
  }

  UIView *ancestorView = [self findSplitViewHostController].view;
  NSAssert(ancestorView != nil, @"[RNScreens] Expected to find RNSSplitViewHost view");

  if (!CGRectIsNull(self.viewSizeTransitionState.lastViewPresentationFrame)) {
    [proxy updateShadowStateOfComponent:self.splitViewScreenComponentView
                              withFrame:self.viewSizeTransitionState.lastViewPresentationFrame
                inContextOfAncestorView:ancestorView];
    return;
  }

  if (![self isViewSizeTransitionInProgress]) {
    [proxy updateShadowStateOfComponent:self.splitViewScreenComponentView inContextOfAncestorView:ancestorView];
  }
}

- (void)columnPositioningDidChangeInSplitViewController:(UISplitViewController *)splitViewController
{
  if (![self isViewSizeTransitionInProgress]) {
    RNSSplitViewScreenShadowStateProxy *proxy = [self.splitViewScreenComponentView shadowStateProxy];
    [proxy updateShadowStateOfComponent:self.splitViewScreenComponentView
                inContextOfAncestorView:splitViewController.view];
  }
}

#pragma mark - React Lifecycle Events

- (void)viewWillAppear:(BOOL)animated
{
  [super viewWillAppear:animated];
  [self.splitViewScreenComponentView.reactEventEmitter emitOnWillAppear];
}

- (void)viewDidAppear:(BOOL)animated
{
  [super viewDidAppear:animated];
  [self.splitViewScreenComponentView.reactEventEmitter emitOnDidAppear];
}

- (void)viewWillDisappear:(BOOL)animated
{
  [super viewWillDisappear:animated];
  [self.splitViewScreenComponentView.reactEventEmitter emitOnWillDisappear];
}

- (void)viewDidDisappear:(BOOL)animated
{
  [super viewDidDisappear:animated];
  [self.splitViewScreenComponentView.reactEventEmitter emitOnDidDisappear];
}

@end
