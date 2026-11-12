#pragma once

#import "RNSContainer.h"
#import "RNSContainerTransactionSupporting.h"
#include "RNSStackNavigationBarCoordinator.h"
#import "RNSViewControllerLifecycleEventsNotifying.h"

@class RNSStackScreenController;
@protocol RNSViewFrameChangeDelegate;

@interface RNSStackNavigationController : UINavigationController <RNSContainer,
                                                                  RNSContainerTransactionSupporting,
                                                                  RNSViewControllerLifecycleEventsNotifying>

@property (nonatomic, weak, nullable) id<RNSViewFrameChangeDelegate> navigationBarFrameChangeDelegate;

@property (nonatomic, weak, nullable) id<RNSViewControllerLifecycleEventsDelegate> lifecycleEventsDelegate;

@property (nonatomic, readonly, nonnull) RNSStackNavigationBarCoordinator *navigationBarCoordinator;

- (void)enqueuePushOperation:(nonnull RNSStackScreenController *)screenController;

- (void)enqueuePopOperation:(nonnull RNSStackScreenController *)screenController;

@end
