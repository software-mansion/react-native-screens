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
  if (_state != RNSContainedModalPresentationStateDismissed) {
    return;
  }

  // UIKit silently ignores a presentation request from an off-window view
  // (the completion never fires); stay dismissed - the host re-flushes on
  // window attach.
  if (provider.hostWindow == nil) {
    return;
  }

  UIViewController *presentationSourceViewController = provider.presentationSourceViewController;
  if (presentationSourceViewController == nil) {
    return;
  }

  UIViewController *presentedViewController = presentationSourceViewController.presentedViewController;

  // Our own request already landed (or was accepted this runloop); nothing to
  // do - `handleDidPresent` syncs the state when the view appears.
  if (presentedViewController == controller) {
    return;
  }

  // One open modal per provider. UIKit silently ignores a presentation
  // request on an already-presenting controller (the completion never
  // fires), so reject deterministically instead; the request is not queued.
  if (presentedViewController != nil) {
    [controller.delegate modalControllerDidRejectPresentation:controller];
    return;
  }

  // A request made while an ancestor is being dismissed is unreliable: UIKit
  // may ignore it, or perform it after the transition without ever calling
  // its completion. Reject deterministically instead, like the busy case.
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

  __weak auto weakSelf = self;
  [presentingViewController dismissViewControllerAnimated:YES
                                               completion:^{
                                                 auto strongSelf = weakSelf;
                                                 if (!strongSelf) {
                                                   return;
                                                 }

                                                 strongSelf->_state = RNSContainedModalPresentationStateDismissed;
                                                 [strongSelf updatePresentationIfNeededWithProvider:provider
                                                                                         controller:controller];
                                               }];
}

@end
