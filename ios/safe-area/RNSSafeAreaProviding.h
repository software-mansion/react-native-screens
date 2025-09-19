#import <UIKit/UIKit.h>

/**
 * @protocol RNSSafeAreaProviding
 * @brief Allows containers that obscure some part of its subviews to provide safe area.
 */
@protocol RNSSafeAreaProviding

/**
 @brief Responsible for providing current safe area insets.

 In most cases, this method should return `self.safeAreaInsets` unless it's necessary to modify the insets.

 @returns `UIEdgeInsets` describing the safe area.
 */
- (UIEdgeInsets)providerSafeAreaInsets;

/**
 @brief Responsible for notifying about a change in safe area.

 This method should be called in `UIView`'s `safeAreaInsetsDidChange`.

 Implementation of this method should use `NSNotificationCenter` to post notification with `RNSSafeAreaDidChange` name
 defined in `RNSSafeAreaViewNotifications.h`.
 */
- (void)dispatchSafeAreaDidChangeNotification;

@end
