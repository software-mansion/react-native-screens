#pragma once

#import <UIKit/UIKit.h>

NS_ASSUME_NONNULL_BEGIN

/**
 * Navigation bar subclass used by RNSStackNavigationController.
 *
 * Its sole responsibility is suppressing the back button's long-press
 * navigation history menu. Mutating the state UIKit keeps on the back button
 * control does not stick — UIKit re-derives it from the bar button item on
 * every button reconfigure and frame change. Instead the bar carries a
 * passive gesture recognizer that the menu-driving recognizers are made to
 * wait for (a dynamic failure requirement, re-evaluated per touch): while the
 * menu is disabled it fails only once the touch ends, so the long-press menu
 * can never fire. The menu machinery itself is left untouched.
 */
@interface RNSStackNavigationBar : UINavigationBar

/**
 * When NO, the back button's long-press navigation history menu is blocked
 * at gesture arbitration level. Tapping the back button is unaffected.
 * Defaults to YES. No-op on tvOS.
 */
@property (nonatomic) BOOL backButtonMenuEnabled;

@end

NS_ASSUME_NONNULL_END
