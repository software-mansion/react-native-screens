#import "RNSStackNavigationController.h"
#import <React/RCTAssert.h>
#import "RNSContainer.h"
#import "RNSContainerItem.h"
#import "RNSLog.h"
#import "RNSParentContainerItemRegistry.h"
#import "RNSStackNavigationBar.h"
#import "RNSStackOperation.h"
#import "RNSViewFrameChangeDelegate.h"

@implementation RNSStackNavigationController {
  NSMutableArray<RNSPushOperation *> *_Nonnull _pendingPushOperations;
  NSMutableArray<RNSPopOperation *> *_Nonnull _pendingPopOperations;
  RNSParentContainerItemRegistry *_Nonnull _parentContainerRegistry;
  UIViewController *_emptyStackController;
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
}

- (void)setAllowsEmptyStack:(BOOL)allowsEmptyStack
{
  _allowsEmptyStack = allowsEmptyStack;
  if (allowsEmptyStack) {
    if (_emptyStackController == nil) {
      _emptyStackController = [UIViewController new];
    }
    if (self.viewControllers.count == 0) {
      [self setViewControllers:@[ _emptyStackController ] animated:NO];
    }
  } else if (self.topViewController == _emptyStackController) {
    [self setViewControllers:@[] animated:NO];
  }
}

- (BOOL)isStackEmpty
{
  return self.viewControllers.count == 0 || self.topViewController == _emptyStackController;
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
  if (![topController conformsToProtocol:@protocol(RNSContainerItem)]) {
    return nil;
  }
  return [(id<RNSContainerItem>)topController findContentScrollView];
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

- (void)enqueuePushOperation:(nonnull UIView<RNSStackScreenProviding> *)stackScreen
{
  RNSPushOperation *operation = [[RNSPushOperation alloc] initWithScreen:stackScreen];
  [_pendingPushOperations addObject:operation];
}

- (void)enqueuePopOperation:(nonnull UIView<RNSStackScreenProviding> *)stackScreen
{
  RNSPopOperation *operation = [[RNSPopOperation alloc] initWithScreen:stackScreen];
  [_pendingPopOperations addObject:operation];
}

- (void)performContainerUpdateIfNeeded
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
    RCTAssert(
        self.allowsEmptyStack ? !self.isStackEmpty : [self.viewControllers count] > 1,
        @"[RNScreens] Attempt to pop last screen from the stack");
    RCTAssert(self.topViewController == op.stackScreen.controller, @"[RNScreens] Attempt to pop non-top screen");
    if (self.allowsEmptyStack && self.viewControllers.count == 1) {
      // UIKit cannot show an empty nested navigation controller when the split is collapsed.
      [self setViewControllers:@[ _emptyStackController ] animated:NO];
    } else {
      // Intermediate pops must finish synchronously before starting the final transition.
      [self popViewControllerAnimated:op == _pendingPopOperations.lastObject];
    }
  }

  for (RNSPushOperation *op in _pendingPushOperations) {
    if (self.allowsEmptyStack && self.isStackEmpty) {
      // The first screen is the root, so the placeholder must not appear in its back stack.
      [self setViewControllers:@[ op.stackScreen.controller ] animated:NO];
    } else {
      [self pushViewController:op.stackScreen.controller animated:op == _pendingPushOperations.lastObject];
    }
  }

  RCTAssert(
      self.allowsEmptyStack || [self.viewControllers count] > 0,
      @"[RNScreens] Stack should never be empty after updates");

  [self dumpStackModel];

  [_pendingPopOperations removeAllObjects];
  [_pendingPushOperations removeAllObjects];
}

#pragma mark - Debug

- (void)dumpStackModel
{
#ifdef RNS_DEBUG_LOGGING
  RNSLog(@"[RNScreens] StackContainer [%ld] MODEL BEGIN", self.view.tag);
  for (UIViewController *viewController in self.viewControllers) {
    if (viewController == _emptyStackController) {
      continue;
    }
    RNSLog(@"[RNScreens] %@", [(id<RNSStackScreenProviding>)viewController.view screenKey]);
  }
#endif // RNS_DEBUG_LOGGING
}

@end
