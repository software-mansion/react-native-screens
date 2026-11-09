#import "RNSStackNavigationController.h"
#import "RNSAssert.h"
#import "RNSContainer.h"
#import "RNSDefines.h"
#import "RNSLog.h"
#import "RNSParentContainerItemRegistry.h"
#import "RNSStackNavigationBar.h"
#import "RNSStackOperation.h"
#import "RNSStackScreenController.h"
#import "RNSViewFrameChangeDelegate.h"

@implementation RNSStackNavigationController {
  // The screens in the stack, bottom to top. Kept here because `viewControllers` lags behind
  // calls UIKit queues during its transition and drops the screen being swiped before the swipe commits.
  NSMutableArray<RNSStackScreenController *> *_Nonnull _stackModel;
  NSMutableArray<RNSPushOperation *> *_Nonnull _pendingPushOperations;
  NSMutableArray<RNSPopOperation *> *_Nonnull _pendingPopOperations;
  RNSParentContainerItemRegistry *_Nonnull _parentContainerRegistry;
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
  _stackModel = [NSMutableArray array];
  _pendingPushOperations = [NSMutableArray array];
  _pendingPopOperations = [NSMutableArray array];
  _parentContainerRegistry = [RNSParentContainerItemRegistry new];
}

#pragma mark-- Layout

- (void)viewDidLayoutSubviews
{
  [super viewDidLayoutSubviews];
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
  if (![self hasPendingOperations]) {
    return;
  }

  NSMutableArray<RNSStackScreenController *> *target = [_stackModel mutableCopy];
  for (RNSPopOperation *op in _pendingPopOperations) {
    RNSAssert(target.count > 1, @"[RNScreens] Attempt to pop last screen from the stack");
    RNSAssert(target.lastObject == op.screenController, @"[RNScreens] Attempt to pop non-top screen");
    [target removeObject:op.screenController];
  }
  for (RNSPushOperation *op in _pendingPushOperations) {
    [target addObject:op.screenController];
  }
  RNSAssert(target.count > 0, @"[RNScreens] Stack should never be empty after updates");

  [_pendingPopOperations removeAllObjects];
  [_pendingPushOperations removeAllObjects];

  [self applyStackModel:target];
}

- (void)applyStackModel:(nonnull NSArray<RNSStackScreenController *> *)target
{
  if ([target isEqualToArray:_stackModel]) {
    return;
  }
  BOOL animated = _stackModel.count > 0;
  [_stackModel setArray:target];
  [self setViewControllers:target animated:animated];
  [self dumpStackModel];
}

#pragma mark - Native pops

- (nullable UIViewController *)popViewControllerAnimated:(BOOL)animated
{
  if ([self isSystemPopGestureBeginning]) {
    RNSStackScreenController *top = _stackModel.lastObject;
    UIViewController *popped = [super popViewControllerAnimated:animated];
    [self removeFromStackModelWhenSwipeCommits:top];
    return popped;
  }
  [self removeTopFromStackModel];
  return [super popViewControllerAnimated:animated];
}

- (nullable NSArray<UIViewController *> *)popToViewController:(UIViewController *)viewController animated:(BOOL)animated
{
  NSUInteger index = [_stackModel indexOfObject:static_cast<RNSStackScreenController *>(viewController)];
  if (index != NSNotFound) {
    [_stackModel removeObjectsInRange:NSMakeRange(index + 1, _stackModel.count - index - 1)];
    [self dumpStackModel];
  }
  return [super popToViewController:viewController animated:animated];
}

- (void)removeTopFromStackModel
{
  // UIKit refuses to pop the root.
  if (_stackModel.count > 1) {
    [_stackModel removeLastObject];
    [self dumpStackModel];
  }
}

- (void)removeFromStackModelWhenSwipeCommits:(nullable RNSStackScreenController *)screenController
{
  __weak auto weakSelf = self;
  [self.transitionCoordinator
      notifyWhenInteractionChangesUsingBlock:^(id<UIViewControllerTransitionCoordinatorContext> context) {
        auto strongSelf = weakSelf;
        if (strongSelf != nil && !context.isCancelled) {
          [strongSelf->_stackModel removeObject:screenController];
          [strongSelf dumpStackModel];
        }
      }];
}

- (BOOL)isSystemPopGestureBeginning
{
#if !TARGET_OS_TV
  if (self.interactivePopGestureRecognizer.state == UIGestureRecognizerStateBegan) {
    return YES;
  }
#if RNS_IPHONE_OS_VERSION_AVAILABLE(26_0)
  if (@available(iOS 26.0, *)) {
    return self.interactiveContentPopGestureRecognizer.state == UIGestureRecognizerStateBegan;
  }
#endif // RNS_IPHONE_OS_VERSION_AVAILABLE(26_0)
#endif // !TARGET_OS_TV
  return NO;
}

#pragma mark - Debug

- (void)dumpStackModel
{
#ifdef RNS_DEBUG_LOGGING
  RNSLogD(@"[RNScreens] StackContainer [%ld] MODEL BEGIN", self.view.tag);
  for (RNSStackScreenController *screenController in _stackModel) {
    RNSLogD(@"[RNScreens] %@", screenController.configProvider.screenKey);
  }
#endif // RNS_DEBUG_LOGGING
}

@end
