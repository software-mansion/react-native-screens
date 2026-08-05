#pragma once

#import <Foundation/Foundation.h>

NS_ASSUME_NONNULL_BEGIN

@protocol RNSReactMountingTransactionObserving

- (void)reactMountingTransactionWillMount;

- (void)reactMountingTransactionDidMount;

@end

NS_ASSUME_NONNULL_END
