#pragma once

#import "RNSStackNavigationController.h"
#import "RNSStackScreenComponentView.h"

@interface RNSStackOperationCoordinator : NSObject

- (void)addPushOperation:(RNSStackScreenComponentView *)screen;

- (void)addPopOperation:(RNSStackScreenComponentView *)screen;

- (void)executePendingOperationsIfNeeded:(RNSStackNavigationController *)controller
                     withRenderedScreens:(NSMutableArray<RNSStackScreenComponentView *> *)renderedScreens;

@end
