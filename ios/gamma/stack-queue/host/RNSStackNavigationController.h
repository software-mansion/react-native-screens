#pragma once

#include "RNSStackScreenComponentView.h"

@interface RNSStackNavigationController : UINavigationController

- (void)enqueuePushOperation:(RNSStackScreenComponentView *)screen;

- (void)enqueuePopOperation:(RNSStackScreenComponentView *)screen;

- (void)performContainerUpdateIfNeeded;

@end
