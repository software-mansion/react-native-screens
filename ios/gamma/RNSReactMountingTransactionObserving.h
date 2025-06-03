#pragma once

#include <react/renderer/mounting/MountingTransaction.h>

@protocol RNSReactMountingTransactionObserving

- (void)reactMountingTransactionWillMount:(const facebook::react::MountingTransaction &)transaction;

- (void)reactMountingTransactionDidMount:(const facebook::react::MountingTransaction &)transaction;

@end
