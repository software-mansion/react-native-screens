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

#if !TARGET_OS_TV
/**
 * When NO, the back button's navigation history menu (long press and pointer
 * secondary click) is suppressed. Tapping the back button is unaffected.
 */
@property (nonatomic) BOOL backButtonMenuEnabled;
#endif // !TARGET_OS_TV

@end

NS_ASSUME_NONNULL_END
