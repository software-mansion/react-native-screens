#pragma once

#import "RNSContainer.h"
#include "RNSStackNavigationBarCoordinator.h"
#include "RNSStackScreenProviding.h"

@protocol RNSViewFrameChangeDelegate;

@interface RNSStackNavigationController : UINavigationController <RNSContainer>

@property (nonatomic, weak, nullable) id<RNSViewFrameChangeDelegate> navigationBarFrameChangeDelegate;

@property (nonatomic, readonly, nonnull) RNSStackNavigationBarCoordinator *navigationBarCoordinator;

- (void)enqueuePushOperation:(nonnull UIView<RNSStackScreenProviding> *)stackScreen;

- (void)enqueuePopOperation:(nonnull UIView<RNSStackScreenProviding> *)stackScreen;

- (void)performContainerUpdateIfNeeded;

@end
