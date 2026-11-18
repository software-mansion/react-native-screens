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

- (void)presentIfNeededWithProvider:(id<RNSContainedModalPresentationProvider>)provider
                         controller:(RNSContainedModalContentController *)controller
{
  UIViewController *presentationSourceViewController = nil;
  RNSContainedModalPresentationDecision decision =
      [self presentationDecisionWithProvider:provider
                                  controller:controller
            presentationSourceViewController:&presentationSourceViewController];

  switch (decision) {
    case RNSContainedModalPresentationDecisionDefer:
      return;
    case RNSContainedModalPresentationDecisionReject:
      [controller.delegate modalControllerDidRejectPresentation:controller];
      return;
    case RNSContainedModalPresentationDecisionPresent:
      break;
  }

  // The call is optimistic: UIKit may perform it now, defer it past an
  // in-flight transition, or never perform it - and the completion is not
  // called in the deferred case, so it carries no signal. The state therefore
  // stays Dismissed until the content controller actually appears
  // (`handleDidPresent`); an unperformed request is retried by the next
  // update, a deferred one is adopted when it lands.
  [presentationSourceViewController presentViewController:controller animated:YES completion:nil];
}

- (RNSContainedModalPresentationDecision)
    presentationDecisionWithProvider:(id<RNSContainedModalPresentationProvider>)provider
                          controller:(RNSContainedModalContentController *)controller
    presentationSourceViewController:(UIViewController *__autoreleasing _Nullable *_Nonnull)outSourceViewController
{
  // Deferral: already presented, or a dismissal is in flight and its
  // completion re-runs the update.
  if (_state != RNSContainedModalPresentationStateDismissed) {
    return RNSContainedModalPresentationDecisionDefer;
  }

  UIViewController *presentationSourceViewController = provider.presentationSourceViewController;
  UIViewController *presentedViewController = presentationSourceViewController.presentedViewController;
  BOOL isSourcePresentingAnotherModal = presentedViewController != nil && presentedViewController != controller &&
      presentedViewController.presentingViewController == presentationSourceViewController;

  // Deferral: UIKit silently ignores a presentation request from an off-window
  // view (the completion never fires); the host re-flushes on window attach.
  // Not when the provider is already presenting another modal: a replacing
  // presentation is exactly what takes the provider's content - this host
  // included - off-window, and deferring would surface the rejection only
  // once that other modal is dismissed.
  if (provider.hostWindow == nil) {
    return isSourcePresentingAnotherModal ? RNSContainedModalPresentationDecisionReject
                                          : RNSContainedModalPresentationDecisionDefer;
  }

  // Rejection: no provider resolves for this modal (missing or mismatched
  // target), and nothing retries a request until the next prop change.
  if (presentationSourceViewController == nil) {
    return RNSContainedModalPresentationDecisionReject;
  }

  // Deferral: our own request is in flight. UIKit already reports the
  // controller as presented, but `_state` is still Dismissed: it only flips
  // in `handleDidPresent`, once the view has actually appeared (the present
  // completion carries no signal). Until then this check is what keeps the
  // request from being re-issued onto a source that is already presenting.
  if (presentedViewController == controller) {
    return RNSContainedModalPresentationDecisionDefer;
  }

  // Rejection: one open modal per provider. `presentedViewController` also
  // reports presentations made by ancestors, hence the scoping.
  if (isSourcePresentingAnotherModal) {
    return RNSContainedModalPresentationDecisionReject;
  }

  // Rejection: a request made while an ancestor is being dismissed is
  // unreliable. UIKit may ignore it, or perform it after the transition
  // without ever calling its completion. Reject deterministically instead.
  UIViewController *topmostAncestor = presentationSourceViewController;
  while (topmostAncestor.parentViewController != nil) {
    topmostAncestor = topmostAncestor.parentViewController;
  }
  if (topmostAncestor.isBeingDismissed) {
    return RNSContainedModalPresentationDecisionReject;
  }

  *outSourceViewController = presentationSourceViewController;
  return RNSContainedModalPresentationDecisionPresent;
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

// Only the provider's `isOpen` drives dismissal. This presentation style has no
// user-driven dismissal (no gesture, no sheet, no system escape), and a parent
// modal going away suspends the presentation instead of dismissing it.
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
