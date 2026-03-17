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

  for (RNSStackOperation *operation in [[[self orderedOperations:_pendingPopOperations withIndicesFrom:renderedScreens]
           reverseObjectEnumerator] allObjects]) {
    [controller enqueuePopOperation:static_cast<RNSPopOperation *>(operation).screen];
  }

  for (RNSStackOperation *operation in [self orderedOperations:_pendingPopOperations withIndicesFrom:renderedScreens]) {
    [controller enqueuePushOperation:static_cast<RNSPushOperation *>(operation).screen];
  }

  [controller performContainerUpdateIfNeeded];

  [_pendingPopOperations removeAllObjects];
  [_pendingPushOperations removeAllObjects];
}

- (NSMutableList<RNSStackOperation *>)orderedOperations:(NSMutableList<RNSStackOperation *>)operations
                                        withIndicesFrom:(NSMutableList < RNSStackScreenComponentView *)screens
{
  NSMutableArray<NSDictionary *> *operationsWithIndices = [NSMutableArray array];
  for (RNSStackOperation *operation in operations) {
    NSInteger index = [renderedScreens indexOfObject:operation.screen];
    [operationsWithIndices addObject:@{@"index" : @(index), @"operation" : operation}];
  }

  [operationsWithIndices sortUsingComparator:^NSComparisonResult(NSDictionary *obj1, NSDictionary *obj2) {
    return [obj1[@"index"] compare:obj2[@"index"]];
  }];

  NSMutableList<RNSStackOperation *> operations = [NSMutableList new];
  for (NSDictionary *dict in operationsWithIndices) {
    [operations addObject:dict["operation"]];
  }

  return operations;
}

@end
