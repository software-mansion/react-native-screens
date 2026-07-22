#import "RNSContainedModalContentController.h"
#import "RNSContainedModalContentView.h"
#import "RNSContainedModalPresentationManager.h"

#import <React/RCTAssert.h>

@implementation RNSContainedModalContentController {
  RNSContainedModalPresentationManager *_Nonnull _presentationManager;

  BOOL _needsPresentationUpdate;
}

- (instancetype)init
{
  if (self = [super init]) {
    // TODO: expose the transition animation as a prop
    self.modalTransitionStyle = UIModalTransitionStyleCrossDissolve;

    _presentationManager = [RNSContainedModalPresentationManager new];
  }
  return self;
}

- (RNSContainedModalContentView *)contentView
{
  RCTAssert([self.view isKindOfClass:[RNSContainedModalContentView class]],
            @"[RNScreens] ContentView must be of type RNSContainedModalContentView");
  return static_cast<RNSContainedModalContentView *>(self.view);
}

#pragma mark - UIKit callbacks

- (void)loadView
{
  self.view = [RNSContainedModalContentView new];
}

- (void)viewDidLayoutSubviews
{
  [super viewDidLayoutSubviews];

  [self.delegate modalControllerViewDidLayoutSubviews:self];
}

- (void)viewDidDisappear:(BOOL)animated
{
  [super viewDidDisappear:animated];

  [self.delegate modalControllerViewDidDisappear:self];
}

#pragma mark - Presentation Setup

- (void)updatePresentationState
{
  id<RNSContainedModalPresentationProvider> presentationProvider = self.presentationProvider;

  RCTAssert(presentationProvider != nil,
            @"[RNScreens] Presentation provider must be set before updating presentation state.");

  if (presentationProvider == nil) {
    return;
  }

  [_presentationManager updatePresentationIfNeededWithProvider:presentationProvider controller:self];
}

#pragma mark - Signals

- (void)setNeedsPresentationUpdate
{
  _needsPresentationUpdate = YES;
}

#pragma mark - Updates

- (void)flushPendingUpdates
{
  if (!_needsPresentationUpdate) {
    return;
  }
  _needsPresentationUpdate = NO;
  [self updatePresentationState];
}
@end
