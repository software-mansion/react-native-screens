#import "RNSStackNavigationController.h"
#import "RNSStackOperation.h"
#import "React/RCTAssert.h"

@implementation RNSStackNavigationController {
  NSMutableArray<RNSPushOperation *> *_pendingPushOperations;
  NSMutableArray<RNSPopOperation *> *_pendingPopOperations;
}

- (instancetype)init
{
  if (self = [super init]) {
    _pendingPushOperations = [NSMutableArray array];
    _pendingPopOperations = [NSMutableArray array];
  }
  return self;
}

- (BOOL)hasPendingOperations
{
  return _pendingPushOperations.count > 0 || _pendingPopOperations.count > 0;
}

- (void)enqueuePushOperation:(RNSStackScreenComponentView *)screen
{
  RNSPushOperation *operation = [[RNSPushOperation alloc] initWithScreen:screen];
  [_pendingPushOperations addObject:operation];
}

- (void)enqueuePopOperation:(RNSStackScreenComponentView *)screen
{
  RNSPopOperation *operation = [[RNSPopOperation alloc] initWithScreen:screen];
  [_pendingPopOperations addObject:operation];
}

- (void)performContainerUpdateIfNeeded
{
  if ([self hasPendingOperations]) {
    for (RNSPopOperation *op in _pendingPopOperations) {
      UIViewController *controller = static_cast<UIViewController *>(op.screen.controller);
      RCTAssert(self.topViewController == controller, @"[RNScreens] Attempting to pop non-top screen");
      [self popViewControllerAnimated:true];
    }

    for (RNSPushOperation *op in _pendingPushOperations) {
      UIViewController *controller = static_cast<UIViewController *>(op.screen.controller);
      [self pushViewController:controller animated:true];
    }
  }
}

@end
