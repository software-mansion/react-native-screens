#import "RNSStackNavigationController.h"
#import "RNSAssert.h"
#import "RNSContainer.h"
#import "RNSDefines.h"
#import "RNSLog.h"
#import "RNSParentContainerItemRegistry.h"
#import "RNSStackAnimationResolver.h"
#import "RNSStackAnimationTransitionTimeline.h"
#import "RNSStackNavigationBar.h"
#import "RNSStackNavigationControllerDelegate.h"
#import "RNSStackOperation.h"
#import "RNSStackPopGestureRecognizerDelegate.h"
#import "RNSStackScreenController.h"
#import "RNSViewFrameChangeDelegate.h"

@implementation RNSStackNavigationController {
  // The screens in the stack, bottom to top. `viewControllers` cannot serve as the model (undocumented):
  // it ignores a `setViewControllers:` UIKit queues behind its running transition, and it drops the
  // swiped screen when the swipe begins, before it commits or cancels.
  NSMutableArray<RNSStackScreenController *> *_Nonnull _stackModel;
  NSMutableArray<RNSPushOperation *> *_Nonnull _pendingPushOperations;
  NSMutableArray<RNSPopOperation *> *_Nonnull _pendingPopOperations;
  RNSParentContainerItemRegistry *_Nonnull _parentContainerRegistry;
  // UIKit holds both delegates weakly.
  RNSStackNavigationControllerDelegate *_Nonnull _navigationControllerDelegate;
#if !TARGET_OS_TV
  RNSStackPopGestureRecognizerDelegate *_Nonnull _popGestureRecognizerDelegate;
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
  _stackModel = [NSMutableArray array];
  _pendingPushOperations = [NSMutableArray array];
  _pendingPopOperations = [NSMutableArray array];
  _parentContainerRegistry = [RNSParentContainerItemRegistry new];
  _navigationControllerDelegate = [RNSStackNavigationControllerDelegate new];
  self.delegate = _navigationControllerDelegate;
#if !TARGET_OS_TV
  _popGestureRecognizerDelegate = [[RNSStackPopGestureRecognizerDelegate alloc] initWithNavigationController:self];
#endif // !TARGET_OS_TV
}

- (void)viewDidLoad
{
  [super viewDidLoad];
#if !TARGET_OS_TV
  // UIKit creates the system pop recognizers with the view.
  for (UIGestureRecognizer *recognizer in [self systemPopGestureRecognizers]) {
    recognizer.delegate = _popGestureRecognizerDelegate;
  }
#endif // !TARGET_OS_TV
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
  RNSStackScreenController *outgoing = _stackModel.lastObject;
  RNSStackScreenController *incoming = target.lastObject;
  BOOL animated = outgoing != nil;
  // A change below an unchanged top is neither a push nor a pop, so no screen's animation applies to it.
  if (animated && incoming != outgoing) {
    RNSStackAnimationTransitionTimeline *timeline =
        [RNSStackAnimationResolver transitionTimelineForKind:[self transitionKindTo:target]
                                                    outgoing:outgoing
                                                    incoming:incoming];
    animated = !timeline.isStatic;
  }
  [_stackModel setArray:target];
  [self setViewControllers:target animated:animated];
  [self dumpStackModel];
}

- (RNSStackAnimationTransitionKind)transitionKindTo:(nonnull NSArray<RNSStackScreenController *> *)target
{
  // UIKit plays `setViewControllers:` as a pop when the new top was already in the stack.
  return [_stackModel containsObject:target.lastObject] ? RNSStackAnimationTransitionKindPop
                                                        : RNSStackAnimationTransitionKindPush;
}

#pragma mark - Native pops

- (nullable UIViewController *)popViewControllerAnimated:(BOOL)animated
{
  // The system pop recognizers call this when they begin (undocumented). The swipe can still cancel,
  // so the screen leaves the model only when it commits, through the coordinator `super` creates.
  if ([self isSystemPopGestureBeginning]) {
    RNSStackScreenController *top = _stackModel.lastObject;
    UIViewController *popped = [super popViewControllerAnimated:animated];
    [self removeFromStackModelWhenSwipeCommits:top];
    return popped;
  }
  [self removeTopFromStackModel];
  return [super popViewControllerAnimated:animated];
}

// The back button menu pops through here.
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
  for (UIGestureRecognizer *recognizer in [self systemPopGestureRecognizers]) {
    if (recognizer.state == UIGestureRecognizerStateBegan) {
      return YES;
    }
  }
#endif // !TARGET_OS_TV
  return NO;
}

#if !TARGET_OS_TV
- (nonnull NSArray<UIGestureRecognizer *> *)systemPopGestureRecognizers
{
#if RNS_IPHONE_OS_VERSION_AVAILABLE(26_0)
  if (@available(iOS 26.0, *)) {
    return @[ self.interactivePopGestureRecognizer, self.interactiveContentPopGestureRecognizer ];
  }
#endif // RNS_IPHONE_OS_VERSION_AVAILABLE(26_0)
  return @[ self.interactivePopGestureRecognizer ];
}
#endif // !TARGET_OS_TV

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
