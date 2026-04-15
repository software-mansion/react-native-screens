#import "RNSStackNavigationController.h"
#import "RNSLog.h"
#import "RNSStackOperation.h"
#import "React/RCTAssert.h"

@implementation RNSStackNavigationController {
  NSMutableArray<RNSPushOperation *> *_Nonnull _pendingPushOperations;
  NSMutableArray<RNSPopOperation *> *_Nonnull _pendingPopOperations;
}

- (instancetype)init
{
  if (self = [super init]) {
    [self initState];
  }
  return self;
}

- (void)initState
{
  _pendingPushOperations = [NSMutableArray array];
  _pendingPopOperations = [NSMutableArray array];
}

- (BOOL)hasPendingOperations
{
  return _pendingPushOperations.count > 0 || _pendingPopOperations.count > 0;
}

- (void)enqueuePushOperation:(nonnull RNSStackScreenComponentView *)stackScreen
{
  RNSPushOperation *operation = [[RNSPushOperation alloc] initWithScreen:stackScreen];
  [_pendingPushOperations addObject:operation];
}

- (void)enqueuePopOperation:(nonnull RNSStackScreenComponentView *)stackScreen
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

  for (RNSPopOperation *op in _pendingPopOperations) {
    UIViewController *controller = static_cast<UIViewController *>(op.stackScreen.controller);
    RCTAssert([self.viewControllers count] > 1, @"[RNScreens] Attempt to pop last screen from the stack");
    RCTAssert(self.topViewController == controller, @"[RNScreens] Attempt to pop non-top screen");
    [self popViewControllerAnimated:YES];
  }

  for (RNSPushOperation *op in _pendingPushOperations) {
    UIViewController *controller = static_cast<UIViewController *>(op.stackScreen.controller);
    [self pushViewController:controller animated:YES];
  }

  RCTAssert([self.viewControllers count] > 0, @"[RNScreens] Stack should never be empty after updates");

  [self dumpStackModel];

  [_pendingPopOperations removeAllObjects];
  [_pendingPushOperations removeAllObjects];
}

- (void)dumpStackModel
{
  RNSLog(@"[RNScreens] StackContainer [%ld] MODEL BEGIN", self.view.tag);
  for (UIViewController *viewController in self.viewControllers) {
    RNSLog(@"[RNScreens] %@", static_cast<RNSStackScreenComponentView *>(viewController.view).screenKey);
  }
}

@end
