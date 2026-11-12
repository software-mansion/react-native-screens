#import "RNSSheetPresentationManager.h"
#import "RNSPresentationSourceProvider.h"
#import "RNSSheetContentController.h"
#import "RNSSheetPresentationState.h"

#import "RNSLog.h"

@implementation RNSSheetPresentationManager {
  RNSSheetPresentationState _state;
}

- (instancetype)init
{
  if (self = [super init]) {
    _state = RNSSheetPresentationStateDismissed;
  }
  return self;
}

- (void)updatePresentationIfNeededWithProvider:(id<RNSSheetPresentationProvider>)provider
                                    controller:(RNSSheetContentController *)controller
{
  BOOL shouldBeOpen = provider.isOpen;

  if (shouldBeOpen) {
    [self presentIfNeededWithProvider:provider controller:controller];
  } else {
    [self dismissIfNeededWithProvider:provider controller:controller];
  }
}

- (void)presentIfNeededWithProvider:(id<RNSSheetPresentationProvider>)provider
                         controller:(RNSSheetContentController *)controller
{
  if (_state != RNSSheetPresentationStateDismissed) {
    return;
  }

  UIWindow *window = provider.hostWindow;
  if (window == nil) {
    return;
  }

  UIViewController *presentationSourceViewController =
      [RNSPresentationSourceProvider findViewControllerForPresentationInWindow:window];
  if (presentationSourceViewController == nil) {
    RNSLogE(@"[RNScreens] Failed to present sheet: The source view controller cannot be found for target window.");
    return;
  }

  if (![controller isPresentationStyleAvailable]) {
    RNSLogW(@"[RNScreens] Presentation style '%@' is not available on this platform; the sheet will not be presented.",
            RNSSheetPresentationStyleName(controller.presentationStyle));
    return;
  }

  _state = RNSSheetPresentationStatePresenting;
  [controller prepareForPresentation];

  __weak auto weakSelf = self;
  [presentationSourceViewController presentViewController:controller
                                                 animated:YES
                                               completion:^{
                                                 auto strongSelf = weakSelf;
                                                 if (!strongSelf) {
                                                   return;
                                                 }

                                                 strongSelf->_state = RNSSheetPresentationStatePresented;
                                                 [strongSelf updatePresentationIfNeededWithProvider:provider
                                                                                         controller:controller];
                                               }];
}

- (void)dismissIfNeededWithProvider:(id<RNSSheetPresentationProvider>)provider
                         controller:(RNSSheetContentController *)controller
{
  if (_state != RNSSheetPresentationStatePresented) {
    return;
  }

  UIViewController *presentingViewController = controller.presentingViewController;
  if (presentingViewController == nil) {
    _state = RNSSheetPresentationStateDismissed;
    return;
  }

  _state = RNSSheetPresentationStateDismissing;

  __weak auto weakSelf = self;
  [presentingViewController dismissViewControllerAnimated:YES
                                               completion:^{
                                                 auto strongSelf = weakSelf;
                                                 if (!strongSelf) {
                                                   return;
                                                 }

                                                 strongSelf->_state = RNSSheetPresentationStateDismissed;
                                                 [strongSelf updatePresentationIfNeededWithProvider:provider
                                                                                         controller:controller];

                                                 [controller.delegate sheetControllerDidDismiss:controller];
                                               }];
}

- (BOOL)handleNativeDismiss
{
  if (_state == RNSSheetPresentationStateDismissing || _state == RNSSheetPresentationStateDismissed) {
    return NO;
  }

  _state = RNSSheetPresentationStateDismissed;
  return YES;
}

@end
