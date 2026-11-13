#pragma once

#import "RNSContainer.h"
#import "RNSContainerTransactionSupporting.h"
#include "RNSStackNavigationBarCoordinator.h"
#import "RNSViewControllerViewLifecycleEventsObserver.h"

@class RNSStackScreenController;
@protocol RNSViewFrameChangeDelegate;

@interface RNSStackNavigationController : UINavigationController <RNSContainer, RNSContainerTransactionSupporting>

@property (nonatomic, weak, nullable) id<RNSViewFrameChangeDelegate> navigationBarFrameChangeDelegate;

@property (nonatomic, weak, nullable) id<RNSViewControllerViewLifecycleEventsObserver> viewLifecycleEventsObserver;

@property (nonatomic, readonly, nonnull) RNSStackNavigationBarCoordinator *navigationBarCoordinator;

- (void)enqueuePushOperation:(nonnull RNSStackScreenController *)screenController;

- (void)enqueuePopOperation:(nonnull RNSStackScreenController *)screenController;

@end
