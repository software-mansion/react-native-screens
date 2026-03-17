#import "RNSStackOperationCoordinator.h"
#import "RNSStackNavigationController.h"
#import "RNSStackOperation.h"
#import "RNSStackScreenComponentView.h"

@implementation RNSStackOperationCoordinator {
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

- (void)addPushOperation:(RNSStackScreenComponentView *)screen
{
  RNSPushOperation *operation = [[RNSPushOperation alloc] initWithScreen:screen];
  [_pendingPushOperations addObject:operation];
}

- (void)addPopOperation:(RNSStackScreenComponentView *)screen
{
  RNSPopOperation *operation = [[RNSPopOperation alloc] initWithScreen:screen];
  [_pendingPopOperations addObject:operation];
}

- (void)executePendingOperationsIfNeeded:(RNSStackNavigationController *)controller
                     withRenderedScreens:(NSMutableArray<RNSStackScreenComponentView *> *)renderedScreens
{
  if (![self hasPendingOperations]) {
    return;
  }

  for (id<RNSStackOperation> operation in
       [[[self orderedOperations:(NSMutableArray<id<RNSStackOperation>> *)_pendingPopOperations
                 withIndicesFrom:renderedScreens] reverseObjectEnumerator] allObjects]) {
    [controller enqueuePopOperation:static_cast<RNSPopOperation *>(operation).screen];
  }

  for (id<RNSStackOperation> operation in
       [self orderedOperations:(NSMutableArray<id<RNSStackOperation>> *)_pendingPushOperations
               withIndicesFrom:renderedScreens]) {
    [controller enqueuePushOperation:static_cast<RNSPushOperation *>(operation).screen];
  }

  [controller performContainerUpdateIfNeeded];

  [_pendingPopOperations removeAllObjects];
  [_pendingPushOperations removeAllObjects];
}

- (NSMutableArray<id<RNSStackOperation>> *)orderedOperations:(NSMutableArray<id<RNSStackOperation>> *)operations
                                             withIndicesFrom:(NSMutableArray<RNSStackScreenComponentView *> *)screens
{
  NSMutableArray<NSDictionary *> *operationsWithIndices = [NSMutableArray array];
  for (id<RNSStackOperation> operation in operations) {
    NSInteger index = [screens indexOfObject:operation.screen];
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
