#import "RNSFormSheetContentController.h"
#import "RNSFormSheetConfigurationApplicator.h"
#import "RNSFormSheetContentView.h"
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

  BOOL _needsInitialDetentReset;
}

- (instancetype)init
{
  if (self = [super init]) {
    self.modalPresentationStyle = UIModalPresentationFormSheet;

    _updateCoordinator = [RNSFormSheetUpdateCoordinator new];
    _configurationApplicator = [RNSFormSheetConfigurationApplicator new];

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

  if (presentationProvider.isOpen) {
    UIWindow *window = presentationProvider.hostWindow;
    if (window != nil) {
      [self presentFromWindowIfNeeded:window];
    }
  } else {
    [self dismissIfNeeded];
  }
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

// TODO: @t0maboro - This presentation logic is currently quite primitive.
// We are not entirely safe from rapid conflicting updates, and there are edge cases
// where the presentation state might become desynchronized. Addressing this robustly
// might require an approach similar to the tabs implementation using state provenance,
// which will be handled separately.
// Followup ticket: https://github.com/software-mansion/react-native-screens-labs/issues/1420
- (void)presentFromWindowIfNeeded:(nonnull UIWindow *)window
{
  if (self.presentingViewController != nil) {
    return;
  }

  UIViewController *presentationSourceViewController =
      [RNSPresentationSourceProvider findViewControllerForPresentationInWindow:window];
  if (presentationSourceViewController == nil) {
    RCTLogError(
        @"[RNScreens] Failed to present form sheet: The source view controller cannot be found for target window.");
    return;
  }

  [self prepareForPresentation];
  [presentationSourceViewController presentViewController:self animated:YES completion:nil];
}

- (void)dismissIfNeeded
{
  if (self.presentingViewController == nil) {
    return;
  }
  [self dismissViewControllerAnimated:YES completion:nil];
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
