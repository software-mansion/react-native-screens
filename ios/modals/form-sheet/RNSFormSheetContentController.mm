#import "RNSFormSheetContentController.h"
#import "RNSFormSheetConfigurationApplicator.h"
#import "RNSFormSheetContentView.h"
#import "RNSFormSheetPresentationManager.h"
#import "RNSFormSheetUpdateCoordinator.h"
#import "RNSFormSheetUpdateFlags.h"
#import "RNSPresentationSourceProvider.h"

#import <React/RCTAssert.h>
#import <React/RCTLog.h>

@interface RNSFormSheetContentController () <UIAdaptivePresentationControllerDelegate,
                                             UIGestureRecognizerDelegate
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

  UITapGestureRecognizer *_Nullable _backdropTapGestureRecognizer;

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

- (void)viewWillAppear:(BOOL)animated
{
  [super viewWillAppear:animated];
  [self attachBackdropTapGestureRecognizer];

  [self.delegate sheetControllerWillAppear:self];
}

- (void)viewDidAppear:(BOOL)animated
{
  [super viewDidAppear:animated];

  [self.delegate sheetControllerDidAppear:self];
}

- (void)viewWillDisappear:(BOOL)animated
{
  [super viewWillDisappear:animated];

  [self.delegate sheetControllerWillDisappear:self];
}

- (void)viewDidDisappear:(BOOL)animated
{
  [super viewDidDisappear:animated];
  [self detachBackdropTapGestureRecognizer];

  // This covers the case when a sheet deeper in the stack is dismissed, UIKit tears down
  // every sheet above it without calling `presentationControllerDidDismiss:` on them.
  // Additionally, `viewDidDisappear:` can be triggered when this controller is temporarily
  // covered by another full-screen modal presented from it, not only when it is dismissed.
  // We need to gate this path to only run for actual dismissals when the controller no
  // longer has a presentingViewController.
  BOOL isStillInPresentationHierarchy = self.presentingViewController != nil;
  if (!isStillInPresentationHierarchy && [_presentationManager handleNativeDismiss]) {
    [self.delegate sheetControllerDidNativeDismiss:self];
  }

  [self.delegate sheetControllerDidDisappear:self];
}

#pragma mark - Presentation Setup

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

  // Since UIKit has recreated sheetPresentationController, any configuration that could be applied
  // during the Dismissed or Dismissing state was lost.
  // We must force a full configuration update for this new instance.
  [self setNeedsAppearanceUpdate];
  [self setNeedsBehaviorUpdate];
  [self setNeedsInitialDetentReset];
  [self updateConfigurationIfNeeded];
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

- (BOOL)presentationControllerShouldDismiss:(UIPresentationController *)presentationController
{
  if (_behaviorProvider.preventNativeDismiss) {
    return NO;
  }
  return YES;
}

- (void)presentationControllerDidAttemptToDismiss:(UIPresentationController *)presentationController
{
  [self.delegate sheetControllerDidPreventNativeDismiss:self];
}

- (void)presentationControllerDidDismiss:(UIPresentationController *)presentationController
{
  if ([_presentationManager handleNativeDismiss]) {
    [self.delegate sheetControllerDidNativeDismiss:self];
  }
}

#if !TARGET_OS_TV
#pragma mark - UISheetPresentationControllerDelegate

- (void)sheetPresentationControllerDidChangeSelectedDetentIdentifier:
    (UISheetPresentationController *)sheetPresentationController
{
  [self.delegate sheetController:self didChangeDetentIdentifier:sheetPresentationController.selectedDetentIdentifier];
}
#endif // !TARGET_OS_TV

#pragma mark - Backdrop tap handling

- (void)attachBackdropTapGestureRecognizer
{
  UIPresentationController *presentationController = self.presentationController;
  if (presentationController && presentationController.containerView && !_backdropTapGestureRecognizer) {
    _backdropTapGestureRecognizer = [[UITapGestureRecognizer alloc] initWithTarget:self
                                                                            action:@selector(handleBackdropTap:)];
    _backdropTapGestureRecognizer.delegate = self;
    _backdropTapGestureRecognizer.cancelsTouchesInView = NO;
    [presentationController.containerView addGestureRecognizer:_backdropTapGestureRecognizer];
  }
}

- (void)detachBackdropTapGestureRecognizer
{
  [_backdropTapGestureRecognizer.view removeGestureRecognizer:_backdropTapGestureRecognizer];
  _backdropTapGestureRecognizer = nil;
}

- (void)handleBackdropTap:(UITapGestureRecognizer *)gesture
{
  if (gesture.state == UIGestureRecognizerStateRecognized) {
    if (_behaviorProvider.preventNativeDismiss) {
      [self.delegate sheetControllerDidPreventNativeDismiss:self];
    }
  }
}

#pragma mark - UIGestureRecognizerDelegate

- (BOOL)gestureRecognizer:(UIGestureRecognizer *)gestureRecognizer shouldReceiveTouch:(UITouch *)touch
{
  if (gestureRecognizer == _backdropTapGestureRecognizer) {
    // When native dismissal is not being prevented, this recognizer should not
    // participate in handling touches to avoid interfering with UIKit.
    if (!_behaviorProvider.preventNativeDismiss) {
      return NO;
    }

    UIPresentationController *presentationController = self.presentationController;

    // Ignore any touches that land inside the actual sheet content.
    if (presentationController && presentationController.presentedView &&
        [touch.view isDescendantOfView:presentationController.presentedView]) {
      return NO;
    }
    return YES;
  }
  return YES;
}

- (BOOL)gestureRecognizer:(UIGestureRecognizer *)gestureRecognizer
    shouldRecognizeSimultaneouslyWithGestureRecognizer:(UIGestureRecognizer *)otherGestureRecognizer
{
  if (gestureRecognizer == _backdropTapGestureRecognizer) {
    return YES;
  }
  return NO;
}

@end
