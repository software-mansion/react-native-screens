#import <UIKit/UIKit.h>

NS_ASSUME_NONNULL_BEGIN

@class RNSTabsScreenViewController;

@protocol RNSBottomTabsSpecialEffectsSupporting

/**
 * Handle repeated tab selection (e.g. in order to pop UINavigationController to root).
 * Returns boolean indicating whether the action has been handled.
 */
- (bool)onRepeatedTabSelectionOfTabScreenController:(nonnull RNSTabsScreenViewController *)tabScreenController;

@end

NS_ASSUME_NONNULL_END
