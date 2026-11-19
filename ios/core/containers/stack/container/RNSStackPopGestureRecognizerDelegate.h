#pragma once

#import <UIKit/UIKit.h>

#if !TARGET_OS_TV

NS_ASSUME_NONNULL_BEGIN

/**
 * Delegate of a navigation controller's system pop recognizers, in place of UIKit's own. UIKit's
 * delegate refuses every swipe once the navigation controller's delegate implements
 * `navigationController:animationControllerForOperation:fromViewController:toViewController:`, even
 * when it returns nil (undocumented). See https://developer.apple.com/forums/thread/116977.
 */
@interface RNSStackPopGestureRecognizerDelegate : NSObject <UIGestureRecognizerDelegate>

- (instancetype)initWithNavigationController:(UINavigationController *)navigationController;

@end

NS_ASSUME_NONNULL_END

#endif // !TARGET_OS_TV
