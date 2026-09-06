#pragma once

#import <UIKit/UIKit.h>

NS_ASSUME_NONNULL_BEGIN

@protocol RNSSplitNavigationControllerFrameOriginChangeDelegate;

/**
 * @class RNSSplitNavigationController
 * @brief A subclass of UINavigationController, creates a view that wraps view associated with
 * RNSSplitScreenController.
 *
 * UISplitViewController resizes column views natively - on display mode change or column resize, so
 * these updates should be passed to React to allow syncing the ShadowTree layout of SplitViewScreen
 * subtree. This controller observes its own view's frame via KVO and notifies `viewFrameOriginChangeDelegate`
 * whenever the frame origin changes.
 */
@interface RNSSplitNavigationController : UINavigationController

/**
 * Initializes the controller with a delegate notified whenever the origin of this controller's
 * view frame changes.
 */
- (instancetype)initWithRootViewController:(UIViewController *)rootViewController
                 frameOriginChangeDelegate:
                     (nullable id<RNSSplitNavigationControllerFrameOriginChangeDelegate>)frameOriginChangeDelegate;

@end

NS_ASSUME_NONNULL_END
