#pragma once

#import <UIKit/UIKit.h>

NS_ASSUME_NONNULL_BEGIN

@interface RNSPresentationSourceProvider : NSObject

/**
 * Starting from the `rootViewController` associated to provided `UIWindow`, iterates through the
 * `presentedViewController` chain until it finds a view controller that is not presenting anything else.
 *
 * This traversal is necessary to support stacking modals, ensuring that any new modal
 * is presented on the currently visible top-most view controller.
 *
 * @param window The UIWindow to search within.
 * @return The top-most view controller available for presentation, or nil if the window or its root view controller is
 * nil.
 */
+ (nullable UIViewController *)findViewControllerForPresentationInWindow:(nullable UIWindow *)window;

@end

NS_ASSUME_NONNULL_END
