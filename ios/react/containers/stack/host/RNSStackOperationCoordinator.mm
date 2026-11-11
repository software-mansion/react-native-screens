#import "RNSStackOperationCoordinator.h"
#import "RNSStackNavigationController.h"
#import "RNSStackScreenComponentView.h"

@implementation RNSStackOperationCoordinator {
  NSMutableArray<RNSStackScreenComponentView *> *_Nonnull _pendingPushScreens;
  NSMutableArray<RNSStackScreenComponentView *> *_Nonnull _pendingPopScreens;
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
  _pendingPushScreens = [NSMutableArray array];
  _pendingPopScreens = [NSMutableArray array];
}

- (BOOL)hasPendingOperations
{
  return _pendingPushScreens.count > 0 || _pendingPopScreens.count > 0;
}

- (void)addPushOperation:(nonnull RNSStackScreenComponentView *)stackScreen
{
  [_pendingPushScreens addObject:stackScreen];
}

- (void)addPopOperation:(nonnull RNSStackScreenComponentView *)stackScreen
{
  [_pendingPopScreens addObject:stackScreen];
}

- (void)enqueuePendingOperationsIfNeeded:(nonnull RNSStackNavigationController *)controller
                     withRenderedScreens:(nonnull NSMutableArray<RNSStackScreenComponentView *> *)renderedScreens
{
  if (![self hasPendingOperations]) {
    return;
  }

  auto popScreens = [[[self orderedScreens:_pendingPopScreens
                           withIndicesFrom:renderedScreens] reverseObjectEnumerator] allObjects];

  for (RNSStackScreenComponentView *screen in popScreens) {
    [controller enqueuePopOperation:screen.controller];
  }

  auto pushScreens = [self orderedScreens:_pendingPushScreens withIndicesFrom:renderedScreens];

  for (RNSStackScreenComponentView *screen in pushScreens) {
    [controller enqueuePushOperation:screen.controller];
  }

  [_pendingPopScreens removeAllObjects];
  [_pendingPushScreens removeAllObjects];
}

- (NSArray<RNSStackScreenComponentView *> *)orderedScreens:(nonnull NSArray<RNSStackScreenComponentView *> *)screens
                                           withIndicesFrom:
                                               (nonnull NSArray<RNSStackScreenComponentView *> *)renderedScreens
{
  return [screens sortedArrayUsingComparator:^NSComparisonResult(RNSStackScreenComponentView *screen1,
                                                                 RNSStackScreenComponentView *screen2) {
    return [@([renderedScreens indexOfObject:screen1]) compare:@([renderedScreens indexOfObject:screen2])];
  }];
}

@end
