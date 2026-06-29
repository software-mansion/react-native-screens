#pragma once

#import "RNSContainer.h"
#include "RNSStackNavigationBarCoordinator.h"
#include "RNSStackScreenComponentView.h"

@protocol RNSViewFrameChangeDelegate;

@interface RNSStackNavigationController : UINavigationController <RNSContainer>

@property (nonatomic, weak, nullable) id<RNSViewFrameChangeDelegate> navigationBarFrameChangeDelegate;

@property (nonatomic, readonly, nonnull) RNSStackNavigationBarCoordinator *navigationBarCoordinator;

- (void)enqueuePushOperation:(nonnull RNSStackScreenComponentView *)stackScreen;

- (void)enqueuePopOperation:(nonnull RNSStackScreenComponentView *)stackScreen;

- (void)performContainerUpdateIfNeeded;

/**
 * Register this container with the nearest parent `RNSContainerItem` in the view-controller
 * hierarchy (if any). Call when the owning host view is attached to a window.
 */
- (void)attachToParentContainerItem;

/**
 * Unregister this container from its parent `RNSContainerItem`. Call when the owning host view is
 * detached from its window.
 */
- (void)detachFromParentContainerItem;

@end
