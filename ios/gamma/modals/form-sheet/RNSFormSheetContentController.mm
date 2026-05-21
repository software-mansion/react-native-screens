#import "RNSFormSheetContentController.h"
#import "RNSFormSheetAppearanceApplicator.h"
#import "RNSFormSheetAppearanceCoordinator.h"
#import "RNSFormSheetAppearanceUpdateFlags.h"
#import "RNSFormSheetContentView.h"
#import "RNSFormSheetDetentResolver.h"
#import "RNSFormSheetHostComponentView.h"
#import "RNSFormSheetHostEventEmitter.h"
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
  RNSFormSheetAppearanceCoordinator *_Nonnull _appearanceCoordinator;
  RNSFormSheetAppearanceApplicator *_Nonnull _appearanceApplicator;

  BOOL _needsInitialDetentReset;
}

- (instancetype)init
{
  if (self = [super init]) {
    self.modalPresentationStyle = UIModalPresentationFormSheet;

    _appearanceCoordinator = [RNSFormSheetAppearanceCoordinator new];
    _appearanceApplicator = [RNSFormSheetAppearanceApplicator new];

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

- (void)updatePresentationStateForHost:(nonnull RNSFormSheetHostComponentView *)host
{
  if (host.isOpen) {
    if (host.window != nil) {
      [self presentFromWindowIfNeeded:host.window];
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

#pragma mark - Appearance

- (void)updateAppearanceIfNeededForHost:(nonnull RNSFormSheetHostComponentView *)host
{
  if (_needsInitialDetentReset) {
    _needsInitialDetentReset = NO;
    [_appearanceApplicator resetInitialDetent];
  }

  [_appearanceApplicator updateAppearanceIfNeededForHost:host controller:self coordinator:_appearanceCoordinator];

  // TODO: @t0maboro - move presentation logic to dedicated presentationCoordinator with 4-state logic
  [_appearanceCoordinator updateIfNeeds:RNSFormSheetAppearanceUpdateFlagsPresentation
                      performOperations:^{
                        [self updatePresentationStateForHost:host];
                      }];
}

#pragma mark - Signals

- (void)setNeedsPresentationUpdate
{
  [_appearanceCoordinator setNeeds:RNSFormSheetAppearanceUpdateFlagsPresentation];
}

- (void)setNeedsAppearanceUpdate
{
  [_appearanceCoordinator setNeeds:RNSFormSheetAppearanceUpdateFlagsConfiguration];
}

- (void)setNeedsInitialDetentReset
{
  _needsInitialDetentReset = YES;
}

#pragma mark - Mounting transaction signals

- (void)reactMountingTransactionWillMount
{
  // noop
}

- (void)reactMountingTransactionDidMount
{
  RNSFormSheetHostComponentView *host = self.hostComponentView;
  RCTAssert(host != nil, @"[RNScreens] hostComponentView must be set before mounting transactions are observed");
  [self updateAppearanceIfNeededForHost:host];
}

#pragma mark - UIAdaptivePresentationControllerDelegate

- (void)presentationControllerDidDismiss:(UIPresentationController *)presentationController
{
  RNSFormSheetHostComponentView *host = self.hostComponentView;
  RCTAssert(host != nil, @"[RNScreens] hostComponentView must be set before delegate callbacks fire");
  [host onNativeDismiss];
  [[host reactEventEmitter] emitOnNativeDismiss];
}

#if !TARGET_OS_TV
#pragma mark - UISheetPresentationControllerDelegate

- (void)sheetPresentationControllerDidChangeSelectedDetentIdentifier:
    (UISheetPresentationController *)sheetPresentationController
{
  RNSFormSheetHostComponentView *host = self.hostComponentView;
  RCTAssert(host != nil, @"[RNScreens] hostComponentView must be set before delegate callbacks fire");
  NSInteger index =
      [RNSFormSheetDetentResolver detentIndexFromDetentIdentifier:sheetPresentationController.selectedDetentIdentifier
                                                    forRawDetents:host.detents];
  if (index >= 0) {
    [[host reactEventEmitter] emitOnDetentChangedWithIndex:index];
  }
}
#endif // !TARGET_OS_TV

@end
