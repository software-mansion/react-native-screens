#import "RNSContainedModalContentController.h"
#import "RNSContainedModalConfigurationApplicator.h"
#import "RNSContainedModalContentView.h"
#import "RNSContainedModalPresentationManager.h"
#import "RNSContainedModalUpdateCoordinator.h"
#import "RNSContainedModalUpdateFlags.h"

#import <React/RCTAssert.h>

@implementation RNSContainedModalContentController {
  RNSContainedModalUpdateCoordinator *_Nonnull _updateCoordinator;
  RNSContainedModalConfigurationApplicator *_Nonnull _configurationApplicator;
  RNSContainedModalPresentationManager *_Nonnull _presentationManager;
}

- (instancetype)init
{
  if (self = [super init]) {
    // TODO: expose these as props - the transition animation and the presentation style
    // (UIModalPresentationOverCurrentContext vs UIModalPresentationCurrentContext should be configurable from JS).
    self.modalPresentationStyle = UIModalPresentationOverCurrentContext;
    self.modalTransitionStyle = UIModalTransitionStyleCrossDissolve;

    _updateCoordinator = [RNSContainedModalUpdateCoordinator new];
    _configurationApplicator = [RNSContainedModalConfigurationApplicator new];
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

- (void)updatePresentationIfNeeded
{
  [_updateCoordinator updateIfNeeded:RNSContainedModalUpdateFlagsPresentation
                   performOperations:^{
                     [self updatePresentationState];
                   }];
}

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
  [_updateCoordinator setNeeds:RNSContainedModalUpdateFlagsPresentation];
}

- (void)setNeedsAppearanceUpdate
{
  [_updateCoordinator setNeeds:RNSContainedModalUpdateFlagsAppearance];
}

- (void)setNeedsBehaviorUpdate
{
  [_updateCoordinator setNeeds:RNSContainedModalUpdateFlagsBehavior];
}

#pragma mark - Updates

- (void)flushPendingUpdates
{
  [self updatePresentationIfNeeded];
}
@end
