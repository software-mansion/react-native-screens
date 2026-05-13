#pragma once

#include "RNSStackScreenComponentView.h"

@protocol RNSViewFrameChangeDelegate;

@interface RNSStackNavigationController : UINavigationController

@property (nonatomic, weak, nullable) id<RNSViewFrameChangeDelegate> navigationBarFrameChangeDelegate;

- (void)enqueuePushOperation:(nonnull RNSStackScreenComponentView *)stackScreen;

- (void)enqueuePopOperation:(nonnull RNSStackScreenComponentView *)stackScreen;

- (void)performContainerUpdateIfNeeded;

@end
