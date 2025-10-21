#pragma once

@interface RNSViewInteractionManager : NSObject

- (instancetype)init;

/**
 * Given a view, find a nearest parent on which it is safe to disable interactions, when transitioning between screens
 * in stack. When Stack is nested inside BottomTabs, it finds such view that the tabs are still interactive. Otherwise,
 * it will default to UIWindow. Makes sure that at most one view is disabled at any time, re-enabling interactions on
 * previously affected views.
 */
- (void)disableInteractionsForSubtreeWith:(UIView *)view;

/**
 * Re-enable interactions on the view that had them previously disabled.
 */
- (void)enableInteractionsForLastSubtree;

@end
