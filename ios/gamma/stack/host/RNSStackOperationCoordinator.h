#pragma once

@interface RNSStackOperationCoordinator : NSObject

- (void)addPushOperation:(RNSStackScreenComponentView *)screen;

- (void)addPopOperation:(RNSStackScreenComponentView *)screen;

- (void)executePendingOperationsIfNeeded:(RNSStackNavigationController *)controller
                     withRenderedScreens:(NSMutableList<RNSStackScreenComponentView *>)renderedScreens;

@end
