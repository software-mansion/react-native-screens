#import "RNSStackOperationCoordinator.h"
#import "RNSStackNavigationController.h"
#import "RNSStackOperation.h"
#import "RNSStackScreenComponentView.h"

@implementation RNSStackOperationCoordinator {
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

- (void)addPushOperation:(nonnull RNSStackScreenComponentView *)stackScreen
{
  RNSPushOperation *operation = [[RNSPushOperation alloc] initWithScreen:stackScreen];
  [_pendingPushOperations addObject:operation];
}

- (void)addPopOperation:(nonnull RNSStackScreenComponentView *)stackScreen
{
  RNSPopOperation *operation = [[RNSPopOperation alloc] initWithScreen:stackScreen];
  [_pendingPopOperations addObject:operation];
}

- (void)executePendingOperationsIfNeeded:(nonnull RNSStackNavigationController *)controller
                     withRenderedScreens:(nonnull NSMutableArray<RNSStackScreenComponentView *> *)renderedScreens
{
  if (![self hasPendingOperations]) {
    return;
  }

  auto popOperations = [[[self orderedOperations:(NSMutableArray<id<RNSStackOperation>> *)_pendingPopOperations
                                 withIndicesFrom:renderedScreens] reverseObjectEnumerator] allObjects];
  for (id<RNSStackOperation> operation in popOperations) {
    [controller enqueuePopOperation:static_cast<RNSPopOperation *>(operation).stackScreen];
  }

  auto pushOperations = [self orderedOperations:(NSMutableArray<id<RNSStackOperation>> *)_pendingPushOperations
                                withIndicesFrom:renderedScreens];
  for (id<RNSStackOperation> operation in pushOperations) {
    [controller enqueuePushOperation:static_cast<RNSPushOperation *>(operation).stackScreen];
  }

  [controller performContainerUpdateIfNeeded];

  [_pendingPopOperations removeAllObjects];
  [_pendingPushOperations removeAllObjects];
}

- (NSMutableArray<id<RNSStackOperation>> *)orderedOperations:(nonnull NSMutableArray<id<RNSStackOperation>> *)operations
                                             withIndicesFrom:
                                                 (nonnull NSMutableArray<RNSStackScreenComponentView *> *)stackScreens
{
  NSMutableArray<NSDictionary *> *operationsWithIndices = [NSMutableArray array];
  for (id<RNSStackOperation> operation in operations) {
    NSInteger index = [stackScreens indexOfObject:operation.stackScreen];
    [operationsWithIndices addObject:@{@"index" : @(index), @"operation" : operation}];
  }

  [operationsWithIndices sortUsingComparator:^NSComparisonResult(NSDictionary *obj1, NSDictionary *obj2) {
    return [obj1[@"index"] compare:obj2[@"index"]];
  }];

  NSMutableArray<id<RNSStackOperation>> *orderedOperations = [NSMutableArray new];
  for (NSDictionary *dict in operationsWithIndices) {
    [orderedOperations addObject:dict[@"operation"]];
  }

  return orderedOperations;
}

@end
