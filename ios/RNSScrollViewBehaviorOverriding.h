#include <UIKit/UIKit.h>

NS_ASSUME_NONNULL_BEGIN

/**
 * Views that require ScrollView contentInsetAdjustmentBehavior overriding should conform to this protocol.
 */
@protocol RNSScrollViewBehaviorOverriding

/**
 * Returns whether view should override contentInsetAdjustmentBehavior for first ScrollView in first descendant chain.
 * It can be a property or method involving some logic to determine if ScrollView's behavior should be overriden.
 */
- (BOOL)shouldOverrideScrollViewContentInsetAdjustmentBehavior;

/**
 * Overrides contentInsetAdjustmentBehavior for first ScrollView in first descendant chain
 * if overrideScrollViewContentInsetAdjustmentBehavior returns true.
 */
- (void)overrideScrollViewBehaviorInFirstDescendantChainIfNeeded;

@end

NS_ASSUME_NONNULL_END
