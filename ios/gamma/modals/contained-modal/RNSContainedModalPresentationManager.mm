#import "RNSContainedModalPresentationManager.h"
#import "RNSContainedModalContentController.h"
#import "RNSContainedModalPresentationState.h"
#import "RNSContainedModalProviderComponentView.h"

#import <React/RCTAssert.h>

@implementation RNSContainedModalPresentationManager {
  RNSContainedModalPresentationState _state;
  __weak RNSContainedModalProviderComponentView *_cachedProviderView;
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

#pragma mark - Provider resolution

// A contained modal is presented from the provider whose `containerId` matches the
// modal's `targetContainerId`, so it stays contained within that provider's bounds.
- (nullable RNSContainedModalProviderComponentView *)findProviderViewForProvider:
    (id<RNSContainedModalPresentationProvider>)provider
{
  NSString *targetContainerId = [provider targetContainerId];

  if (targetContainerId == nil) {
    RCTAssert(NO, @"[RNScreens] ContainedModal has a nil targetContainerId; cannot resolve a provider to present in.");
    return nil;
  }

  UIView *currentView = [provider hostView];
  while (currentView != nil) {
    if ([currentView isKindOfClass:[RNSContainedModalProviderComponentView class]]) {
      RNSContainedModalProviderComponentView *providerView = (RNSContainedModalProviderComponentView *)currentView;

      if ([targetContainerId isEqualToString:providerView.containerId]) {
        return providerView;
      }
    }
    currentView = currentView.superview;
  }

  RCTAssert(NO, @"[RNScreens] No ContainedModalProvider found matching targetContainerId '%@'.", targetContainerId);
  return nil;
}

- (void)presentIfNeededWithProvider:(id<RNSContainedModalPresentationProvider>)provider
                         controller:(RNSContainedModalContentController *)controller
{
  if (_state != RNSContainedModalPresentationStateDismissed) {
    return;
  }

  // This resolves the provider only once - on the first presentation.
  // The provider is an ancestor of the ContainedModal in the React tree, so it cannot
  // be unmounted without also unmounting the modal.
  if (_cachedProviderView == nil) {
    _cachedProviderView = [self findProviderViewForProvider:provider];
  }

  UIViewController *presentationSourceViewController = _cachedProviderView.contextViewController;
  if (presentationSourceViewController == nil) {
    return;
  }

  controller.modalPresentationStyle =
      provider.transparent ? UIModalPresentationOverCurrentContext : UIModalPresentationCurrentContext;

  _state = RNSContainedModalPresentationStatePresenting;

  __weak auto weakSelf = self;
  [presentationSourceViewController presentViewController:controller
                                                 animated:YES
                                               completion:^{
                                                 auto strongSelf = weakSelf;
                                                 if (!strongSelf) {
                                                   return;
                                                 }

                                                 strongSelf->_state = RNSContainedModalPresentationStatePresented;
                                                 [strongSelf updatePresentationIfNeededWithProvider:provider
                                                                                         controller:controller];
                                               }];
}

- (void)dismissIfNeededWithProvider:(id<RNSContainedModalPresentationProvider>)provider
                         controller:(RNSContainedModalContentController *)controller
{
  if (_state != RNSContainedModalPresentationStatePresented) {
    return;
  }

  if (controller.presentingViewController == nil) {
    _state = RNSContainedModalPresentationStateDismissed;
    return;
  }

  _state = RNSContainedModalPresentationStateDismissing;

  __weak auto weakSelf = self;
  [controller dismissViewControllerAnimated:YES
                                 completion:^{
                                   auto strongSelf = weakSelf;
                                   if (!strongSelf) {
                                     return;
                                   }

                                   strongSelf->_state = RNSContainedModalPresentationStateDismissed;
                                   [strongSelf updatePresentationIfNeededWithProvider:provider controller:controller];
                                 }];
}

- (void)handleNativeDismiss
{
  _state = RNSContainedModalPresentationStateDismissed;
}

@end
