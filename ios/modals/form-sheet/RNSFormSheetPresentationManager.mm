#import "RNSFormSheetPresentationManager.h"
#import "RNSFormSheetContentController.h"
#import "RNSFormSheetPresentationState.h"
#import "RNSPresentationSourceProvider.h"

#import <React/RCTLog.h>

@implementation RNSFormSheetPresentationManager {
  RNSFormSheetPresentationState _state;
}

- (instancetype)init
{
  if (self = [super init]) {
    _state = RNSFormSheetPresentationStateDismissed;
  }
  return self;
}

- (void)updatePresentationIfNeededWithProvider:(id<RNSFormSheetPresentationProvider>)provider
                                    controller:(RNSFormSheetContentController *)controller
{
  BOOL shouldBeOpen = provider.isOpen;

  if (shouldBeOpen) {
    [self presentIfNeededWithProvider:provider controller:controller];
  } else {
    [self dismissIfNeededWithProvider:provider controller:controller];
  }
}

- (void)presentIfNeededWithProvider:(id<RNSFormSheetPresentationProvider>)provider
                         controller:(RNSFormSheetContentController *)controller
{
  if (_state != RNSFormSheetPresentationStateDismissed) {
    return;
  }

  UIWindow *window = provider.hostWindow;
  if (window == nil) {
    return;
  }

  UIViewController *presentationSourceViewController =
      [RNSPresentationSourceProvider findViewControllerForPresentationInWindow:window];
  if (presentationSourceViewController == nil) {
    RCTLogError(
        @"[RNScreens] Failed to present form sheet: The source view controller cannot be found for target window.");
    return;
  }

  _state = RNSFormSheetPresentationStatePresenting;
  [controller prepareForPresentation];

  __weak auto weakSelf = self;
  [presentationSourceViewController presentViewController:controller
                                                 animated:YES
                                               completion:^{
                                                 auto strongSelf = weakSelf;
                                                 if (!strongSelf) {
                                                   return;
                                                 }

                                                 strongSelf->_state = RNSFormSheetPresentationStatePresented;
                                                 [strongSelf updatePresentationIfNeededWithProvider:provider
                                                                                         controller:controller];
                                               }];
}

- (void)dismissIfNeededWithProvider:(id<RNSFormSheetPresentationProvider>)provider
                         controller:(RNSFormSheetContentController *)controller
{
  if (_state != RNSFormSheetPresentationStatePresented) {
    return;
  }

  UIViewController *presentingViewController = controller.presentingViewController;
  if (presentingViewController == nil) {
    _state = RNSFormSheetPresentationStateDismissed;
    return;
  }

  _state = RNSFormSheetPresentationStateDismissing;

  __weak auto weakSelf = self;
  [presentingViewController dismissViewControllerAnimated:YES
                                               completion:^{
                                                 auto strongSelf = weakSelf;
                                                 if (!strongSelf) {
                                                   return;
                                                 }

                                                 strongSelf->_state = RNSFormSheetPresentationStateDismissed;
                                                 [strongSelf updatePresentationIfNeededWithProvider:provider
                                                                                         controller:controller];

                                                 [controller.delegate sheetControllerDidDismiss:controller];
                                               }];
}

- (BOOL)handleNativeDismiss
{
  if (_state == RNSFormSheetPresentationStateDismissing || _state == RNSFormSheetPresentationStateDismissed) {
    return NO;
  }

  _state = RNSFormSheetPresentationStateDismissed;
  return YES;
}

@end
