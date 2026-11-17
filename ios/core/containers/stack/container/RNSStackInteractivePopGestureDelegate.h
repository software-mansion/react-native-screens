#pragma once

#import <UIKit/UIKit.h>

NS_ASSUME_NONNULL_BEGIN

#if !TARGET_OS_TV

/**
 * Delegate of the interactive pop gesture recognizers of `RNSStackNavigationController`, used while the top
 * screen displays its own navigation bar.
 *
 * The navigation bar shared by the stack is hidden in that case, and the delegate set up by UIKit does not let
 * the interactive pop gesture begin while the navigation bar is hidden. The screen is still expected to be
 * poppable with the gesture, the same as with the shared navigation bar.
 *
 * In all other cases the navigation controller keeps the delegate set up by UIKit.
 */
@interface RNSStackInteractivePopGestureDelegate : NSObject <UIGestureRecognizerDelegate>

- (instancetype)initWithNavigationController:(UINavigationController *)navigationController;

@end

#endif // !TARGET_OS_TV

NS_ASSUME_NONNULL_END
