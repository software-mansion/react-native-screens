#import "RNSStackNavigationController.h"
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
  if ([self hasPendingOperations]) {
    for (RNSPopOperation *op in _pendingPopOperations) {
      UIViewController *controller = static_cast<UIViewController *>(op.stackScreen.controller);
      RCTAssert(self.topViewController == controller, @"[RNScreens] Attempting to pop non-top screen");
      [self popViewControllerAnimated:true];
    }

    for (RNSPushOperation *op in _pendingPushOperations) {
      UIViewController *controller = static_cast<UIViewController *>(op.stackScreen.controller);
      [self pushViewController:controller animated:true];
    }

    [_pendingPopOperations removeAllObjects];
    [_pendingPushOperations removeAllObjects];
  }
}

@end
