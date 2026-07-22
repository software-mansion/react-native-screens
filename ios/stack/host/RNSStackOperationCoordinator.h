#pragma once

#import "RNSStackNavigationController.h"
#import "RNSStackScreenComponentView.h"

@interface RNSStackOperationCoordinator : NSObject

- (void)addPushOperation:(nonnull RNSStackScreenComponentView *)screen;

- (void)addPopOperation:(nonnull RNSStackScreenComponentView *)screen;

- (void)executePendingOperationsIfNeeded:(nonnull RNSStackNavigationController *)controller
                     withRenderedScreens:(nonnull NSMutableArray<RNSStackScreenComponentView *> *)renderedScreens;

@end
