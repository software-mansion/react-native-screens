#import "RNSStackController.h"
#import <React/RCTAssert.h>
#import "RNSReactMountingTransactionObserving.h"

@implementation RNSStackController {
  NSArray<RNSStackScreenController *> *_Nullable _pendingChildViewControllers;
}

- (void)setNeedsUpdateOfChildViewControllers:(NSArray<RNSStackScreenController *> *)childViewControllers
{
  _pendingChildViewControllers = childViewControllers;
}

- (void)updateChildViewControllersIfNeeded
{
  if (_pendingChildViewControllers != nil) {
    [self updateChildViewControllers];
  }
}

- (void)updateChildViewControllers
{
  RCTAssert(_pendingChildViewControllers != nil, @"[RNScreens] Pending update must not be nil while it is forced!");
  [self setViewControllers:_pendingChildViewControllers animated:YES];
  _pendingChildViewControllers = nil;
}

#pragma mark-- RNSReactMountingTransactionObserving

- (void)reactMountingTransactionWillMount:(const facebook::react::MountingTransaction &)transaction
{
}

- (void)reactMountingTransactionDidMount:(const facebook::react::MountingTransaction &)transaction
{
  [self updateChildViewControllersIfNeeded];
}

@end
