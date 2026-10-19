#import "RNSContainedModalContentController.h"
#import "RNSContainedModalContentView.h"
#import "RNSContainedModalPresentationManager.h"

@implementation RNSContainedModalContentController {
  RNSContainedModalPresentationManager *_Nonnull _presentationManager;

  BOOL _needsPresentationUpdate;
}

- (instancetype)init
{
  if (self = [super init]) {
    // Native over-context style. The provider component view is a tight
    // wrapper around the context controller's view, so UIKit's presentation
    // container coincides with the provider and tracks it with no
    // intervention (see RNSContainedModalProviderController.h).
    self.modalPresentationStyle = UIModalPresentationOverCurrentContext;
    self.modalTransitionStyle = UIModalTransitionStyleCrossDissolve;

    _presentationManager = [RNSContainedModalPresentationManager new];
  }
  return self;
}

- (RNSContainedModalContentView *)contentView
{
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

- (void)viewDidAppear:(BOOL)animated
{
  [super viewDidAppear:animated];

  // Appearance is the ground truth for the present side of the state machine
  // (see `handleDidPresent`); the follow-up update dismisses right away if
  // `isOpen` flipped back while the presentation was landing.
  [_presentationManager handleDidPresent];
  [self updatePresentationState];

  [self.delegate modalControllerViewDidAppear:self];
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
