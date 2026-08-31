#pragma once

#import <UIKit/UIKit.h>

NS_ASSUME_NONNULL_BEGIN

/**
 * Navigation bar subclass used by RNSStackNavigationController.
 *
 * Its responsibility is to suppress the back button's navigation history
 * menu (long press and pointer secondary click).
 */
@interface RNSStackNavigationBar : UINavigationBar

/**
 * When NO, the back button's navigation history menu (long press and pointer
 * secondary click) is suppressed. Tapping the back button is unaffected.
 * No-op on tvOS.
 */
@property (nonatomic) BOOL backButtonMenuEnabled;

@end

NS_ASSUME_NONNULL_END
