#pragma once

#include "RNSStackScreenComponentView.h"

@interface RNSStackNavigationController : UINavigationController

- (void)enqueuePushOperation:(nonnull RNSStackScreenComponentView *)stackScreen;

- (void)enqueuePopOperation:(nonnull RNSStackScreenComponentView *)stackScreen;

- (void)performContainerUpdateIfNeeded;

@end
