#pragma once

#import "RNSContainer.h"
#import "RNSContainerTransactionSupporting.h"
#include "RNSStackNavigationBarCoordinator.h"

@class RNSStackScreenController;
@protocol RNSViewFrameChangeDelegate;

@interface RNSStackNavigationController : UINavigationController <RNSContainer, RNSContainerTransactionSupporting>

@property (nonatomic, weak, nullable) id<RNSViewFrameChangeDelegate> navigationBarFrameChangeDelegate;

@property (nonatomic, readonly, nonnull) RNSStackNavigationBarCoordinator *navigationBarCoordinator;

#if !TARGET_OS_TV
/**
 * Makes the interactive pop gesture available for the top screen when it displays its own navigation bar
 * (the shared navigation bar is hidden then, which disables the gesture set up by UIKit).
 */
- (void)updateInteractivePopGestureDelegates;
#endif // !TARGET_OS_TV

- (void)enqueuePushOperation:(nonnull RNSStackScreenController *)screenController;

- (void)enqueuePopOperation:(nonnull RNSStackScreenController *)screenController;

@end
