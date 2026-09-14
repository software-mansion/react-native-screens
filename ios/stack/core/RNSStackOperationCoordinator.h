#pragma once

#import "RNSStackNavigationController.h"
#import "RNSStackScreenProviding.h"

@interface RNSStackOperationCoordinator : NSObject

- (void)addPushOperation:(nonnull UIView<RNSStackScreenProviding> *)screen;

- (void)addPopOperation:(nonnull UIView<RNSStackScreenProviding> *)screen;

- (void)executePendingOperationsIfNeeded:(nonnull RNSStackNavigationController *)controller
                     withRenderedScreens:(nonnull NSMutableArray<UIView<RNSStackScreenProviding> *> *)renderedScreens;

@end
