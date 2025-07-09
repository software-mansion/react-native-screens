#import <UIKit/UIKit.h>

NS_ASSUME_NONNULL_BEGIN

@protocol RNSBottomTabsSpecialEffectsSupporting

/**
 * Handle repeated tab selection (e.g. in order to pop UINavigationController to root).
 * Returns boolean indicating whether the action has been handled.
 */
- (bool)onRepeatedTabSelection;

@end

NS_ASSUME_NONNULL_END
