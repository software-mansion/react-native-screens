#pragma once

#import "RNSContainer.h"
#include "RNSStackNavigationBarCoordinator.h"
#include "RNSStackScreenProviding.h"

@protocol RNSViewFrameChangeDelegate;

@interface RNSStackNavigationController : UINavigationController <RNSContainer>

@property (nonatomic, weak, nullable) id<RNSViewFrameChangeDelegate> navigationBarFrameChangeDelegate;

@property (nonatomic, readonly, nonnull) RNSStackNavigationBarCoordinator *navigationBarCoordinator;

/** Split columns use a native placeholder while empty. Standalone stacks keep their root screen by default. */
@property (nonatomic) BOOL allowsEmptyStack;

@property (nonatomic, readonly, getter=isStackEmpty) BOOL stackEmpty;

- (void)enqueuePushOperation:(nonnull UIView<RNSStackScreenProviding> *)stackScreen;

- (void)enqueuePopOperation:(nonnull UIView<RNSStackScreenProviding> *)stackScreen;

- (void)performContainerUpdateIfNeeded;

@end
