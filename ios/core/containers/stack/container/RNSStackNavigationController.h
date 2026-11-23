#pragma once

#import "RNSContainer.h"
#import "RNSContainerTransactionSupporting.h"
#include "RNSStackNavigationBarCoordinator.h"

@class RNSStackScreenController;
@protocol RNSViewControllerViewLifecycleEventsObserver;
@protocol RNSViewFrameChangeDelegate;

@interface RNSStackNavigationController : UINavigationController <RNSContainer, RNSContainerTransactionSupporting>

@property (nonatomic, weak, nullable) id<RNSViewFrameChangeDelegate> navigationBarFrameChangeDelegate;

/**
 * Notified about the lifecycle events of this controller's view.
 */
@property (nonatomic, weak, nullable) id<RNSViewControllerViewLifecycleEventsObserver> viewLifecycleEventsObserver;

@property (nonatomic, readonly, nonnull) RNSStackNavigationBarCoordinator *navigationBarCoordinator;

- (void)enqueuePushOperation:(nonnull RNSStackScreenController *)screenController;

- (void)enqueuePopOperation:(nonnull RNSStackScreenController *)screenController;

@end
