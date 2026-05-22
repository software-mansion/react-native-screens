#import "RNSFormSheetContentController.h"
#import "RNSFormSheetAppearanceApplicator.h"
#import "RNSFormSheetAppearanceCoordinator.h"
#import "RNSFormSheetAppearanceUpdateFlags.h"
#import "RNSFormSheetContentView.h"
#import "RNSFormSheetHostComponentView.h"
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

#pragma mark - Appearance

- (void)updateAppearanceIfNeeded
{
  id<RNSFormSheetAppearanceProvider> appearanceProvider = self.appearanceProvider;
  id<RNSFormSheetBehaviorProvider> behaviorProvider = self.behaviorProvider;

  RCTAssert(appearanceProvider != nil, @"[RNScreens] Appearance provider must be set before updating appearance.");

  RCTAssert(behaviorProvider != nil, @"[RNScreens] Behavior provider must be set before updating appearance.");

  if (appearanceProvider == nil || behaviorProvider == nil) {
    return;
  }

  if (_needsInitialDetentReset) {
    _needsInitialDetentReset = NO;
    [_appearanceApplicator resetInitialDetent];
  }

  [_appearanceApplicator updateAppearanceIfNeededForAppearanceProvider:appearanceProvider
                                                      behaviorProvider:behaviorProvider
                                                            controller:self
                                                           coordinator:_appearanceCoordinator];

  // TODO: @t0maboro - decouple presentation logic from AppearanceCoordinator
  [_appearanceCoordinator updateIfNeeds:RNSFormSheetAppearanceUpdateFlagsPresentation
                      performOperations:^{
                        [self updatePresentationState];
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

#pragma mark - Updating

- (void)flushPendingUpdates
{
  [self updateAppearanceIfNeeded];
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
