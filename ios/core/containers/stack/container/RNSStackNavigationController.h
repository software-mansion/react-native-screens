#pragma once

#import "RNSContainer.h"
#import "RNSContainerTransactionSupporting.h"
#include "RNSStackNavigationBarCoordinator.h"

@class RNSStackScreenController;
@protocol RNSStackPopGestureObserver;
@protocol RNSViewControllerViewLifecycleEventsObserver;
@protocol RNSViewFrameChangeDelegate;

@interface RNSStackNavigationController : UINavigationController <RNSContainer, RNSContainerTransactionSupporting>

@property (nonatomic, weak, nullable) id<RNSViewFrameChangeDelegate> navigationBarFrameChangeDelegate;

/**
 * Notified when this controller lays out its view.
 */
@property (nonatomic, weak, nullable) id<RNSViewFrameChangeDelegate> viewFrameChangeDelegate;

/**
 * Notified about the lifecycle events of this controller's view.
 */
@property (nonatomic, weak, nullable) id<RNSViewControllerViewLifecycleEventsObserver> viewLifecycleEventsObserver;

@property (nonatomic, weak, nullable) id<RNSStackPopGestureObserver> popGestureObserver;

@property (nonatomic, readonly, nonnull) RNSStackNavigationBarCoordinator *navigationBarCoordinator;

/**
 * Layout direction the stack lays out by: the navigation bar, the system transitions and the edge swipe follow it, and
 * it propagates to nested containers. `Unspecified` inherits the direction of the parent view controller.
 */
@property (nonatomic) UITraitEnvironmentLayoutDirection layoutDirection;

- (void)enqueuePushOperation:(nonnull RNSStackScreenController *)screenController;

- (void)enqueuePopOperation:(nonnull RNSStackScreenController *)screenController;

/**
 * Jumps the transition animation the stack plays itself to its end before this returns, so the next navigation call
 * applies at once. Does nothing while UIKit plays the transition or none runs.
 */
- (void)finishRunningCustomTransition;

#if !TARGET_OS_TV
/**
 * Writes every screen's back-button config onto the navigation item of the screen below it, from the stack model.
 * Runs on every model change; a screen whose header config changed calls it too.
 */
- (void)applyBackButtonConfigs;
#endif // !TARGET_OS_TV

@end
