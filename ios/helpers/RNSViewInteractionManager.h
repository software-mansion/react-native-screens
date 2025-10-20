#pragma once

@interface RNSViewInteractionManager : NSObject

- (instancetype)init;

- (void)disableInteractionsForSubtreeWith:(UIView *)view;

- (void)enableInteractionsForLastSubtree;

@end
