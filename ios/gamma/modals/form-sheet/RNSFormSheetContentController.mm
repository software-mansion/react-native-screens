#import "RNSFormSheetContentController.h"
#import "RNSFormSheetConfigurationApplicator.h"
#import "RNSFormSheetContentView.h"
#import "RNSFormSheetPresentationManager.h"
#import "RNSFormSheetUpdateCoordinator.h"
#import "RNSFormSheetUpdateFlags.h"
#import "RNSPresentationSourceProvider.h"

#import <React/RCTAssert.h>
#import <React/RCTLog.h>

@interface RNSFormSheetContentController () <UIAdaptivePresentationControllerDelegate
#if !TARGET_OS_TV
                                             ,
                                             UISheetPresentationControllerDelegate
#endif // !TARGET_OS_TV
                                             >
@end

@implementation RNSFormSheetContentController {
  RNSFormSheetUpdateCoordinator *_Nonnull _updateCoordinator;
  RNSFormSheetConfigurationApplicator *_Nonnull _configurationApplicator;
  RNSFormSheetPresentationManager *_Nonnull _presentationManager;

  BOOL _needsInitialDetentReset;
}

- (instancetype)init
{
  if (self = [super init]) {
    self.modalPresentationStyle = UIModalPresentationFormSheet;

    _updateCoordinator = [RNSFormSheetUpdateCoordinator new];
    _configurationApplicator = [RNSFormSheetConfigurationApplicator new];
    _presentationManager = [RNSFormSheetPresentationManager new];

    _needsInitialDetentReset = NO;
  }
  return self;
}

- (RNSFormSheetContentView *)contentView
{
  RCTAssert([self.view isKindOfClass:[RNSFormSheetContentView class]],
            @"[RNScreens] ContentView must be of type RNSFormSheetContentView");
  return static_cast<RNSFormSheetContentView *>(self.view);
}

#pragma mark - UIKit callbacks

- (void)loadView
{
  self.view = [RNSFormSheetContentView new];
}

- (void)viewDidLayoutSubviews
{
  [super viewDidLayoutSubviews];

  [self.delegate sheetControllerViewDidLayoutSubviews:self];
}

#pragma mark - Presentation

- (void)updatePresentationIfNeeded
{
  [_updateCoordinator updateIfNeeded:RNSFormSheetUpdateFlagsPresentation
                   performOperations:^{
                     [self updatePresentationState];
                   }];
}

- (void)updatePresentationState
{
  id<RNSFormSheetPresentationProvider> presentationProvider = self.presentationProvider;

  RCTAssert(presentationProvider != nil,
            @"[RNScreens] Presentation provider must be set before updating presentation state.");

  if (presentationProvider == nil) {
    return;
  }

  [_presentationManager updatePresentationIfNeededWithProvider:presentationProvider controller:self];
}

- (void)prepareForPresentation
{
  // The presentation controller is recreated by UIKit on every present/dismiss cycle.
  // We must assign this delegate before actual presentation
  self.presentationController.delegate = self;
#if !TARGET_OS_TV
  self.sheetPresentationController.delegate = self;
#endif // !TARGET_OS_TV
}

#pragma mark - Sheet Configuration

- (void)updateConfigurationIfNeeded
{
  id<RNSFormSheetAppearanceProvider> appearanceProvider = self.appearanceProvider;
  id<RNSFormSheetBehaviorProvider> behaviorProvider = self.behaviorProvider;

  RCTAssert(appearanceProvider != nil, @"[RNScreens] Appearance provider must be set before updating appearance.");
  RCTAssert(behaviorProvider != nil, @"[RNScreens] Behavior provider must be set before updating behavior.");

  if (appearanceProvider == nil || behaviorProvider == nil) {
    return;
  }

  if (_needsInitialDetentReset) {
    _needsInitialDetentReset = NO;
    [_configurationApplicator resetInitialDetent];
  }

  [_configurationApplicator applyConfigurationIfNeededWithAppearanceProvider:appearanceProvider
                                                            behaviorProvider:behaviorProvider
                                                                  controller:self
                                                                 coordinator:_updateCoordinator];
}

#pragma mark - Signals

- (void)setNeedsPresentationUpdate
{
  [_updateCoordinator setNeeds:RNSFormSheetUpdateFlagsPresentation];
}

- (void)setNeedsAppearanceUpdate
{
  [_updateCoordinator setNeeds:RNSFormSheetUpdateFlagsAppearance];
}

- (void)setNeedsBehaviorUpdate
{
  [_updateCoordinator setNeeds:RNSFormSheetUpdateFlagsBehavior];
}

- (void)setNeedsInitialDetentReset
{
  _needsInitialDetentReset = YES;
}

#pragma mark - Updates

- (void)flushPendingUpdates
{
  [self updateConfigurationIfNeeded];
  [self updatePresentationIfNeeded];
}

#pragma mark - UIAdaptivePresentationControllerDelegate

- (void)presentationControllerDidDismiss:(UIPresentationController *)presentationController
{
  [_presentationManager handleNativeDismiss];

  [self.delegate sheetControllerDidNativeDismiss:self];
}

#if !TARGET_OS_TV
#pragma mark - UISheetPresentationControllerDelegate

- (void)sheetPresentationControllerDidChangeSelectedDetentIdentifier:
    (UISheetPresentationController *)sheetPresentationController
{
  [self.delegate sheetController:self didChangeDetentIdentifier:sheetPresentationController.selectedDetentIdentifier];
}
#endif // !TARGET_OS_TV

@end
