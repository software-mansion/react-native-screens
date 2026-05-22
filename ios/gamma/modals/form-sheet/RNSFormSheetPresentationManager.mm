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
    [self presentIfNeededForProvider:provider controller:controller];
  } else {
    [self dismissIfNeededForProvider:provider controller:controller];
  }
}

- (void)presentIfNeededForProvider:(id<RNSFormSheetPresentationProvider>)provider
                        controller:(RNSFormSheetContentController *)controller
{
  if (_state != RNSFormSheetPresentationStateDismissed) {
    return;
  }

  UIWindow *window = provider.hostWindow;
  if (window == nil) {
    return;
  }

  UIViewController *sourceVC = [RNSPresentationSourceProvider findViewControllerForPresentationInWindow:window];
  if (sourceVC == nil) {
    RCTLogError(
        @"[RNScreens] Failed to present form sheet: The source view controller cannot be found for target window.");
    return;
  }

  _state = RNSFormSheetPresentationStatePresenting;

  // The presentation controller is recreated by UIKit on every present/dismiss cycle.
  // We must assign this delegate before actual presentation
  [controller prepareForPresentation];

  __weak auto weakSelf = self;
  [sourceVC presentViewController:controller
                         animated:YES
                       completion:^{
                         auto strongSelf = weakSelf;
                         if (!strongSelf) {
                           return;
                         }

                         strongSelf->_state = RNSFormSheetPresentationStatePresented;
                         [strongSelf updatePresentationIfNeededWithProvider:provider controller:controller];
                       }];
}

- (void)dismissIfNeededForProvider:(id<RNSFormSheetPresentationProvider>)provider
                        controller:(RNSFormSheetContentController *)controller
{
  if (_state != RNSFormSheetPresentationStatePresented) {
    return;
  }

  if (controller.presentingViewController == nil) {
    _state = RNSFormSheetPresentationStateDismissed;
    return;
  }

  _state = RNSFormSheetPresentationStateDismissing;

  __weak auto weakSelf = self;
  [controller dismissViewControllerAnimated:YES
                                 completion:^{
                                   auto strongSelf = weakSelf;
                                   if (!strongSelf) {
                                     return;
                                   }

                                   strongSelf->_state = RNSFormSheetPresentationStateDismissed;
                                   [strongSelf updatePresentationIfNeededWithProvider:provider controller:controller];
                                 }];
}

- (void)handleNativeDismiss
{
  _state = RNSFormSheetPresentationStateDismissed;
}

@end
