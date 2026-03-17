#pragma once

@interface RNSStackOperationCoordinator : NSObject

- (void)executePendingOperationsIfNeeded:(RNSStackNavigationController *)controller
                     withRenderedScreens:(NSMutableList<RNSStackScreenComponentView *>)renderedScreens;

@end
