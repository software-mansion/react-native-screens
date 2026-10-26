#import "RNSContainedModalPresentationManager.h"
#import "RNSContainedModalContentController.h"
#import "RNSContainedModalPresentationState.h"

@implementation RNSContainedModalPresentationManager {
  RNSContainedModalPresentationState _state;
}

- (instancetype)init
{
  if (self = [super init]) {
    _state = RNSContainedModalPresentationStateDismissed;
  }
  return self;
}

- (void)updatePresentationIfNeededWithProvider:(id<RNSContainedModalPresentationProvider>)provider
                                    controller:(RNSContainedModalContentController *)controller
{
  BOOL shouldBeOpen = provider.isOpen;

  if (shouldBeOpen) {
    [self presentIfNeededWithProvider:provider controller:controller];
  } else {
    [self dismissIfNeededWithProvider:provider controller:controller];
  }
}

// Every early return below is one of two kinds. A DEFERRAL keeps the request
// pending: `isOpen` still holds and a later update (window attach, dismiss
// completion, appearance) re-runs this method. A REJECTION drops the request
// for good and tells the delegate, because nothing would ever retry it.
- (void)presentIfNeededWithProvider:(id<RNSContainedModalPresentationProvider>)provider
                         controller:(RNSContainedModalContentController *)controller
{
  // Deferral: already presented, or a dismissal is in flight and its
  // completion re-runs the update.
  if (_state != RNSContainedModalPresentationStateDismissed) {
    return;
  }

  // Deferral: UIKit silently ignores a presentation request from an off-window
  // view (the completion never fires); the host re-flushes on window attach.
  if (provider.hostWindow == nil) {
    return;
  }

  // Rejection: no provider resolves for this modal (missing or mismatched
  // target), and nothing retries a request until the next prop change.
  UIViewController *presentationSourceViewController = provider.presentationSourceViewController;
  if (presentationSourceViewController == nil) {
    [controller.delegate modalControllerDidRejectPresentation:controller];
    return;
  }

  UIViewController *presentedViewController = presentationSourceViewController.presentedViewController;

  // Deferral: our own request already landed (or was accepted this runloop);
  // `handleDidPresent` syncs the state when the view appears.
  if (presentedViewController == controller) {
    return;
  }

  // Rejection: one open modal per provider. `presentedViewController` also
  // reports a presentation made by an ancestor (a sheet or a modal above the
  // provider), which does not occupy this context, so only a presentation the
  // source itself made counts as busy. UIKit silently ignores a presentation
  // request on an already-presenting controller (the completion never fires),
  // so reject deterministically instead; the request is not queued.
  if (presentedViewController != nil &&
      presentedViewController.presentingViewController == presentationSourceViewController) {
    [controller.delegate modalControllerDidRejectPresentation:controller];
    return;
  }

  // Rejection: a request made while an ancestor is being dismissed is
  // unreliable. UIKit may ignore it, or perform it after the transition
  // without ever calling its completion. Reject deterministically, like the
  // busy case.
  UIViewController *topmostAncestor = presentationSourceViewController;
  while (topmostAncestor.parentViewController != nil) {
    topmostAncestor = topmostAncestor.parentViewController;
  }
  if (topmostAncestor.isBeingDismissed) {
    [controller.delegate modalControllerDidRejectPresentation:controller];
    return;
  }

  // The call is optimistic: UIKit may perform it now, defer it past an
  // in-flight transition, or never perform it - and the completion is not
  // called in the deferred case, so it carries no signal. The state therefore
  // stays Dismissed until the content controller actually appears
  // (`handleDidPresent`); an unperformed request is retried by the next
  // update, a deferred one is adopted when it lands.
  [presentationSourceViewController presentViewController:controller animated:YES completion:nil];
}

- (void)handleDidPresent
{
  // A restore appearance can race a programmatic dismissal; the dismiss
  // completion owns the state in that case.
  if (_state == RNSContainedModalPresentationStateDismissing) {
    return;
  }

  _state = RNSContainedModalPresentationStatePresented;
}

- (void)dismissIfNeededWithProvider:(id<RNSContainedModalPresentationProvider>)provider
                         controller:(RNSContainedModalContentController *)controller
{
  if (_state != RNSContainedModalPresentationStatePresented) {
    return;
  }

  UIViewController *presentingViewController = controller.presentingViewController;
  if (presentingViewController == nil) {
    _state = RNSContainedModalPresentationStateDismissed;
    return;
  }

  _state = RNSContainedModalPresentationStateDismissing;

  // The content controller owns this manager, so a strong capture of either
  // would keep both alive until the completion runs. Weak captures let an
  // unmount mid-dismissal (host `invalidate`) release the whole chain; the
  // completion then has nothing to update.
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

                                                 strongSelf->_state = RNSContainedModalPresentationStateDismissed;

                                                 auto strongProvider = weakProvider;
                                                 if (strongProvider == nil) {
                                                   return;
                                                 }
                                                 [strongSelf updatePresentationIfNeededWithProvider:strongProvider
                                                                                         controller:strongController];
                                               }];
}

@end
