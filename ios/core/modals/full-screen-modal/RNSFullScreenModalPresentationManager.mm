#import "RNSFullScreenModalPresentationManager.h"
#import "RNSFullScreenModalContentController.h"
#import "RNSFullScreenModalPresentationState.h"
#import "RNSPresentationSourceProvider.h"

#import "RNSLog.h"

@implementation RNSFullScreenModalPresentationManager {
  RNSFullScreenModalPresentationState _state;
}

- (instancetype)init
{
  if (self = [super init]) {
    _state = RNSFullScreenModalPresentationStateDismissed;
  }
  return self;
}

- (void)updatePresentationIfNeededWithProvider:(id<RNSFullScreenModalPresentationProvider>)provider
                                    controller:(RNSFullScreenModalContentController *)controller
{
  BOOL shouldBeOpen = provider.isOpen;

  if (shouldBeOpen) {
    [self presentIfNeededWithProvider:provider controller:controller];
  } else {
    [self dismissIfNeededWithProvider:provider controller:controller];
  }
}

- (void)presentIfNeededWithProvider:(id<RNSFullScreenModalPresentationProvider>)provider
                         controller:(RNSFullScreenModalContentController *)controller
{
  if (_state != RNSFullScreenModalPresentationStateDismissed) {
    return;
  }

  UIWindow *window = provider.hostView.window;
  if (window == nil) {
    return;
  }

  UIViewController *presentationSourceViewController =
      [RNSPresentationSourceProvider findViewControllerForPresentationInWindow:window];
  if (presentationSourceViewController == nil) {
    RNSLogE(
        @"[RNScreens] Failed to present full-screen modal: The source view controller cannot be found for target window.");
    return;
  }

  __weak auto weakSelf = self;
  __weak auto weakController = controller;
  __weak auto weakProvider = provider;

  // The top-most controller may be a modal on its way out, e.g. a replacing modal whose dismissal just put this host
  // back into the window. UIKit refuses to present on it, so retry once its dismissal is over.
  if (presentationSourceViewController.isBeingDismissed) {
    id<UIViewControllerTransitionCoordinator> transitionCoordinator =
        presentationSourceViewController.transitionCoordinator;
    if (transitionCoordinator == nil) {
      return;
    }

    [transitionCoordinator
        animateAlongsideTransition:nil
                        completion:^(id<UIViewControllerTransitionCoordinatorContext> _Nonnull context) {
                          auto strongSelf = weakSelf;
                          auto strongController = weakController;
                          auto strongProvider = weakProvider;
                          if (strongSelf == nil || strongController == nil || strongProvider == nil) {
                            return;
                          }
                          [strongSelf updatePresentationIfNeededWithProvider:strongProvider
                                                                  controller:strongController];
                        }];
    return;
  }

  _state = RNSFullScreenModalPresentationStatePresenting;

  [presentationSourceViewController
      presentViewController:controller
                   animated:YES
                 completion:^{
                   auto strongSelf = weakSelf;
                   auto strongController = weakController;
                   if (strongSelf == nil || strongController == nil) {
                     return;
                   }

                   // `viewDidAppear` may have moved the state on already.
                   if (strongSelf->_state == RNSFullScreenModalPresentationStatePresenting) {
                     strongSelf->_state = RNSFullScreenModalPresentationStatePresented;
                   }

                   auto strongProvider = weakProvider;
                   if (strongProvider == nil) {
                     return;
                   }
                   [strongSelf updatePresentationIfNeededWithProvider:strongProvider controller:strongController];
                 }];

  // UIKit refused the presentation (it only logs a warning) and will never call the completion.
  if (controller.presentingViewController == nil) {
    _state = RNSFullScreenModalPresentationStateDismissed;
  }
}

- (void)handleDidPresent
{
  if (_state == RNSFullScreenModalPresentationStatePresenting) {
    _state = RNSFullScreenModalPresentationStatePresented;
  }
}

- (void)dismissIfNeededWithProvider:(id<RNSFullScreenModalPresentationProvider>)provider
                         controller:(RNSFullScreenModalContentController *)controller
{
  if (_state != RNSFullScreenModalPresentationStatePresented) {
    return;
  }

  UIViewController *presentingViewController = controller.presentingViewController;
  if (presentingViewController == nil) {
    _state = RNSFullScreenModalPresentationStateDismissed;
    return;
  }

  _state = RNSFullScreenModalPresentationStateDismissing;

  __weak auto weakSelf = self;
  __weak auto weakController = controller;
  __weak auto weakProvider = provider;
  [presentingViewController dismissViewControllerAnimated:YES
                                               completion:^{
                                                 auto strongSelf = weakSelf;
                                                 auto strongController = weakController;
                                                 if (strongSelf == nil || strongController == nil) {
                                                   return;
                                                 }
                                                 [strongSelf finishDismissalWithProvider:weakProvider
                                                                              controller:strongController];
                                               }];
}

- (void)handleDidLeavePresentationHierarchyWithProvider:(nullable id<RNSFullScreenModalPresentationProvider>)provider
                                             controller:(RNSFullScreenModalContentController *)controller
{
  if (_state == RNSFullScreenModalPresentationStateDismissing) {
    [self finishDismissalWithProvider:provider controller:controller];
    return;
  }

  // Covers a dismissal this manager did not initiate, e.g. UIKit tearing the modal down together with a controller
  // below it, also while the presentation was still landing.
  if (_state == RNSFullScreenModalPresentationStatePresented ||
      _state == RNSFullScreenModalPresentationStatePresenting) {
    _state = RNSFullScreenModalPresentationStateDismissed;
    [controller.delegate modalControllerDidNativeDismiss:controller];
  }
}

// Reached from `viewDidDisappear` or the dismiss completion, whichever comes first.
- (void)finishDismissalWithProvider:(nullable id<RNSFullScreenModalPresentationProvider>)provider
                         controller:(RNSFullScreenModalContentController *)controller
{
  if (_state != RNSFullScreenModalPresentationStateDismissing) {
    return;
  }

  _state = RNSFullScreenModalPresentationStateDismissed;
  [controller.delegate modalControllerDidDismiss:controller];

  if (provider == nil) {
    return;
  }

  [self updatePresentationIfNeededWithProvider:provider controller:controller];
}

@end
