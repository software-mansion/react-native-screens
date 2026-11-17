#import "RNSStackNavigationController.h"
#import "RNSAssert.h"
#import "RNSContainer.h"
#import "RNSDefines.h"
#import "RNSLog.h"
#import "RNSParentContainerItemRegistry.h"
#import "RNSStackInteractivePopGestureDelegate.h"
#import "RNSStackNavigationBar.h"
#import "RNSStackOperation.h"
#import "RNSStackScreenController.h"
#import "RNSViewFrameChangeDelegate.h"

@implementation RNSStackNavigationController {
  NSMutableArray<RNSPushOperation *> *_Nonnull _pendingPushOperations;
  NSMutableArray<RNSPopOperation *> *_Nonnull _pendingPopOperations;
  RNSParentContainerItemRegistry *_Nonnull _parentContainerRegistry;
#if !TARGET_OS_TV
  RNSStackInteractivePopGestureDelegate *_Nonnull _interactivePopGestureDelegate;
  // Delegates set up by UIKit, keyed by their gesture recognizers. Both held weakly - UIKit owns them.
  NSMapTable<UIGestureRecognizer *, id<UIGestureRecognizerDelegate>> *_Nonnull _originalInteractivePopGestureDelegates;
#endif // !TARGET_OS_TV
}

- (instancetype)init
{
#if !TARGET_OS_TV
  self = [super initWithNavigationBarClass:RNSStackNavigationBar.class toolbarClass:nil];
#else // !TARGET_OS_TV
  self = [super init];
#endif // !TARGET_OS_TV
  if (self != nil) {
    _navigationBarCoordinator = [RNSStackNavigationBarCoordinator new];
    [_navigationBarCoordinator initializeNavigationBarOfNavigationController:self];
    [self initState];
  }
  return self;
}

- (void)initState
{
  _pendingPushOperations = [NSMutableArray array];
  _pendingPopOperations = [NSMutableArray array];
  _parentContainerRegistry = [RNSParentContainerItemRegistry new];
#if !TARGET_OS_TV
  _interactivePopGestureDelegate = [[RNSStackInteractivePopGestureDelegate alloc] initWithNavigationController:self];
  _originalInteractivePopGestureDelegates = [NSMapTable weakToWeakObjectsMapTable];
#endif // !TARGET_OS_TV
}

#pragma mark - Interactive pop gesture

#if !TARGET_OS_TV
- (void)updateInteractivePopGestureDelegates
{
  UIViewController *topController = self.topViewController;
  BOOL topControllerUsesScreenNavigationBar = [topController isKindOfClass:RNSStackScreenController.class] &&
      static_cast<RNSStackScreenController *>(topController).isScreenNavigationBarEnabled;

  [self updateDelegateOfInteractivePopGestureRecognizer:self.interactivePopGestureRecognizer
                                    usingCustomDelegate:topControllerUsesScreenNavigationBar];
#if RNS_IPHONE_OS_VERSION_AVAILABLE(26_0)
  if (@available(iOS 26.0, *)) {
    [self updateDelegateOfInteractivePopGestureRecognizer:self.interactiveContentPopGestureRecognizer
                                      usingCustomDelegate:topControllerUsesScreenNavigationBar];
  }
#endif // RNS_IPHONE_OS_VERSION_AVAILABLE(26_0)
}

- (void)updateDelegateOfInteractivePopGestureRecognizer:(nullable UIGestureRecognizer *)recognizer
                                    usingCustomDelegate:(BOOL)usesCustomDelegate
{
  if (recognizer == nil) {
    return;
  }

  // UIKit assigns its delegate lazily - remember it, so that it can be restored.
  id<UIGestureRecognizerDelegate> currentDelegate = recognizer.delegate;
  if (currentDelegate != nil && currentDelegate != _interactivePopGestureDelegate) {
    [_originalInteractivePopGestureDelegates setObject:currentDelegate forKey:recognizer];
  }

  id<UIGestureRecognizerDelegate> originalDelegate = [_originalInteractivePopGestureDelegates objectForKey:recognizer];
  if (originalDelegate == nil) {
    // UIKit has not set up the recognizer yet
    return;
  }

  id<UIGestureRecognizerDelegate> targetDelegate =
      usesCustomDelegate ? _interactivePopGestureDelegate : originalDelegate;
  if (recognizer.delegate != targetDelegate) {
    recognizer.delegate = targetDelegate;
  }
}
#endif // !TARGET_OS_TV

#pragma mark-- Layout

- (void)viewDidLayoutSubviews
{
  [super viewDidLayoutSubviews];
#if !TARGET_OS_TV
  [self updateInteractivePopGestureDelegates];
#endif // !TARGET_OS_TV
  [_navigationBarFrameChangeDelegate viewFrameDidChange:self.navigationBar];
}

#pragma mark - RNSContainer

- (nullable UIScrollView *)resolveCurrentContentScrollView
{
  // We assume `topViewController` corresponds to the currently presented screen.
  UIViewController *topController = self.topViewController;
  if (![topController isKindOfClass:RNSStackScreenController.class]) {
    return nil;
  }
  return [static_cast<RNSStackScreenController *>(topController) findContentScrollView];
}

- (void)attachToParentContainerItem
{
  [_parentContainerRegistry attachContainer:self];
}

- (void)detachFromParentContainerItem
{
  [_parentContainerRegistry detachContainer:self];
}

#pragma mark - View controller containment

- (void)didMoveToParentViewController:(UIViewController *)parent
{
  [super didMoveToParentViewController:parent];

  if (parent != nil) {
    [self attachToParentContainerItem];
  } else {
    [self detachFromParentContainerItem];
  }
}

- (BOOL)hasPendingOperations
{
  return _pendingPushOperations.count > 0 || _pendingPopOperations.count > 0;
}

- (void)enqueuePushOperation:(nonnull RNSStackScreenController *)screenController
{
  RNSPushOperation *operation = [[RNSPushOperation alloc] initWithScreenController:screenController];
  [_pendingPushOperations addObject:operation];
}

- (void)enqueuePopOperation:(nonnull RNSStackScreenController *)screenController
{
  RNSPopOperation *operation = [[RNSPopOperation alloc] initWithScreenController:screenController];
  [_pendingPopOperations addObject:operation];
}

#pragma mark - RNSContainerTransactionSupporting

- (void)beginTransaction
{
  // noop
}

- (void)commitTransaction
{
  // NOTE: We consider UINavigationController.viewControllers to be part of
  // the internal state of our stack implementation and expect it to be
  // *synchronously* updated by UIKit while we perform our pop and push operations
  //
  // The assertions below work under this assumption

  if (![self hasPendingOperations]) {
    return;
  }

  for ([[maybe_unused]] RNSPopOperation *op in _pendingPopOperations) {
    RNSAssert([self.viewControllers count] > 1, @"[RNScreens] Attempt to pop last screen from the stack");
    RNSAssert(self.topViewController == static_cast<UIViewController *>(op.screenController),
              @"[RNScreens] Attempt to pop non-top screen");
    [self popViewControllerAnimated:YES];
  }

  for (RNSPushOperation *op in _pendingPushOperations) {
    [self pushViewController:op.screenController animated:YES];
  }

  RNSAssert([self.viewControllers count] > 0, @"[RNScreens] Stack should never be empty after updates");

  [self dumpStackModel];

  [_pendingPopOperations removeAllObjects];
  [_pendingPushOperations removeAllObjects];
}

#pragma mark - Debug

- (void)dumpStackModel
{
#ifdef RNS_DEBUG_LOGGING
  RNSLogD(@"[RNScreens] StackContainer [%ld] MODEL BEGIN", self.view.tag);
  for (UIViewController *viewController in self.viewControllers) {
    RNSLogD(@"[RNScreens] %@", static_cast<RNSStackScreenController *>(viewController).configProvider.screenKey);
  }
#endif // RNS_DEBUG_LOGGING
}

@end
