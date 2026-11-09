#pragma once

#import <UIKit/UIKit.h>

#if !TARGET_OS_TV

NS_ASSUME_NONNULL_BEGIN

/**
 * Delegate of a navigation controller's system pop recognizers, in place of UIKit's own.
 */
@interface RNSStackPopGestureRecognizerDelegate : NSObject <UIGestureRecognizerDelegate>

- (instancetype)initWithNavigationController:(UINavigationController *)navigationController;

@end

NS_ASSUME_NONNULL_END

#endif // !TARGET_OS_TV
