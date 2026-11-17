#pragma once

#import <Foundation/Foundation.h>

NS_ASSUME_NONNULL_BEGIN

/**
 * A container that defers the updates it receives and applies them together on commit.
 *
 * `commitTransaction` applies every pending update, whether or not `beginTransaction` was called, and does nothing
 * when no update is pending. `beginTransaction` marks the start of a batch, but implementations must not depend on it:
 * a host may commit without beginning or begin without committing. (Under React Native, the transaction that creates
 * the host view has no begin, and the one that deletes it has no commit.) Transactions do not nest.
 *
 * Under React Native, the host component view calls these from the mounting-transaction callbacks.
 */
@protocol RNSContainerTransactionSupporting

/**
 * Marks the start of a batch of updates. A hint only; see the protocol documentation.
 */
- (void)beginTransaction;

/**
 * Applies every pending update. Does nothing when no update is pending.
 */
- (void)commitTransaction;

@end

NS_ASSUME_NONNULL_END
