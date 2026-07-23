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

@end
