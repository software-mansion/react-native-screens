#import "RNSFullScreenModalPresentationManager.h"
#import "RNSFullScreenModalContentController.h"
#import "RNSPresentationSourceProvider.h"

static const NSTimeInterval kRNSFullScreenModalRetryDelay = 0.05;

@implementation RNSFullScreenModalPresentationManager {
  RNSFullScreenModalPresentationState _state;
  // Set from the present call until `viewDidAppear` or teardown; `_state` stays Dismissed meanwhile.
  BOOL _hasPendingPresentation;
  BOOL _isPresentationScheduled;
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
  // Already presented, or a dismissal is in flight and its end re-runs the update.
  if (_state != RNSFullScreenModalPresentationStateDismissed) {
    return;
  }

  // Our own request is scheduled or in flight; the latter lands in `handleDidPresent`.
  if (controller.presentingViewController != nil || _isPresentationScheduled) {
    return;
  }

  // Mount-transaction observers run in no fixed order. Deciding one turn later lets the other hosts of the same
  // transaction act first, e.g. a sheet closed in the same handler starts its dismissal.
  [self schedulePresentationAfterTransitionOf:nil provider:provider controller:controller];
}

- (void)presentNowIfPossibleWithProvider:(id<RNSFullScreenModalPresentationProvider>)provider
                              controller:(RNSFullScreenModalContentController *)controller
{
  if (_state != RNSFullScreenModalPresentationStateDismissed || controller.presentingViewController != nil) {
    return;
  }

  // UIKit silently ignores a presentation request from an off-window view; the host re-flushes on window attach.
  UIView *hostView = provider.hostView;
  UIWindow *window = hostView.window;
  if (window == nil) {
    return;
  }

  UIViewController *presentationSourceViewController =
      [RNSPresentationSourceProvider findViewControllerForPresentationInWindow:window];
  if (presentationSourceViewController == nil) {
    return;
  }

  // The host goes away together with the controller being dismissed; presenting from it would either be ignored or
  // leave a modal whose host is gone.
  if (presentationSourceViewController.isBeingDismissed &&
      [hostView isDescendantOfView:presentationSourceViewController.view]) {
    [controller.delegate modalControllerDidRejectPresentation:controller];
    return;
  }

  // A request made while the top-most controller is in transition is unreliable: UIKit may ignore it, or perform it
  // later without calling its completion. Present on whatever is top-most once it ends.
  if (presentationSourceViewController.isBeingPresented || presentationSourceViewController.isBeingDismissed) {
    [self schedulePresentationAfterTransitionOf:presentationSourceViewController
                                       provider:provider
                                     controller:controller];
    return;
  }

  _hasPendingPresentation = YES;
  // The completion is not called when UIKit defers the request, so it carries no signal; `handleDidPresent` does.
  [presentationSourceViewController presentViewController:controller animated:YES completion:nil];
}

- (void)schedulePresentationAfterTransitionOf:(nullable UIViewController *)viewController
                                     provider:(id<RNSFullScreenModalPresentationProvider>)provider
                                   controller:(RNSFullScreenModalContentController *)controller
{
  _isPresentationScheduled = YES;

  __weak auto weakSelf = self;
  __weak auto weakProvider = provider;
  __weak auto weakController = controller;
  dispatch_block_t attempt = ^{
    auto strongSelf = weakSelf;
    if (strongSelf == nil) {
      return;
    }
    strongSelf->_isPresentationScheduled = NO;

    auto strongProvider = weakProvider;
    auto strongController = weakController;
    if (strongProvider == nil || strongController == nil || !strongProvider.isOpen) {
      return;
    }
    [strongSelf presentNowIfPossibleWithProvider:strongProvider controller:strongController];
  };

  if (viewController == nil) {
    dispatch_async(dispatch_get_main_queue(), attempt);
    return;
  }

  // The coordinator completion runs before UIKit finishes the transition's bookkeeping, hence the extra turn.
  BOOL isQueued = [viewController.transitionCoordinator
      animateAlongsideTransition:nil
                      completion:^(id<UIViewControllerTransitionCoordinatorContext>) {
                        dispatch_async(dispatch_get_main_queue(), attempt);
                      }];
  // Bounded: the controller leaves its transition state once the transition ends.
  if (!isQueued) {
    dispatch_after(dispatch_time(DISPATCH_TIME_NOW, (int64_t)(kRNSFullScreenModalRetryDelay * NSEC_PER_SEC)),
                   dispatch_get_main_queue(),
                   attempt);
  }
}

- (void)handleDidPresent
{
  _hasPendingPresentation = NO;

  if (_state == RNSFullScreenModalPresentationStateDismissing) {
    return;
  }

  _state = RNSFullScreenModalPresentationStatePresented;
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

  if (_state == RNSFullScreenModalPresentationStatePresented) {
    _state = RNSFullScreenModalPresentationStateDismissed;
    [controller.delegate modalControllerDidNativeDismiss:controller];
    return;
  }

  // Torn down before it appeared. Without `isOpen` there is no request to report as natively dismissed.
  if (_hasPendingPresentation) {
    _hasPendingPresentation = NO;
    if (provider.isOpen) {
      [controller.delegate modalControllerDidNativeDismiss:controller];
    }
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

  // A presentation requested from here is made a run-loop turn later, once UIKit has finished the dismissal.
  [self updatePresentationIfNeededWithProvider:provider controller:controller];
}

@end
