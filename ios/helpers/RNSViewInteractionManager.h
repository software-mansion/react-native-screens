#pragma once

@interface RNSViewInteractionManager : NSObject

/**
 * The behavior is controlled by `ios26AllowInteractionsDuringTransition` feature flag.
 * The default is `true`, which means that `disableInteractions`/`enableInteractions` do nothing.
 */
@property (nonatomic) BOOL disabled;

- (instancetype)init;

/**
 * Given a view, traverse its ancestors hierarchy and find a view that supports RNSViewInteractionAware protocol
 * and can disable interactions for the time of screen transition. Make sure that at most one view is disabled at any
 * time, re-enabling interactions on previously affected views when necessary.
 */
- (void)disableInteractionsForSubtreeWith:(UIView *)view;

/**
 * Re-enable interactions on the view that had them previously disabled.
 */
- (void)enableInteractionsForLastSubtree;

@end
