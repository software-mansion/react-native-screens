#pragma once

#import <Foundation/Foundation.h>

NS_ASSUME_NONNULL_BEGIN

/**
 * A container that batches the updates it receives and applies them together.
 *
 * Updates submitted between `beginTransaction` and `commitTransaction` are kept pending; `commitTransaction` applies
 * them, as in `CATransaction`. Transactions do not nest: call `commitTransaction` once for each `beginTransaction`.
 *
 * Under React Native, the host component view calls these from the mounting-transaction callbacks.
 */
@protocol RNSContainerTransactionSupporting

/**
 * Called before a batch of updates is submitted.
 */
- (void)beginTransaction;

/**
 * Applies the updates submitted since `beginTransaction`.
 */
- (void)commitTransaction;

@end

NS_ASSUME_NONNULL_END
