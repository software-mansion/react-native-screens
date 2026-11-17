#pragma once

#import <UIKit/UIKit.h>
#import "RNSStackNavigationController.h"
#import "RNSViewControllerViewLifecycleEventsObserver.h"

NS_ASSUME_NONNULL_BEGIN

@protocol RNSViewFrameChangeDelegate;

/**
 * @class RNSSplitNavigationController
 * @brief A subclass of RNSStackNavigationController, creates a view that wraps view associated with
 * RNSSplitScreenController.
 *
 * UISplitViewController resizes column views natively - on display mode change or column resize, so
 * these updates should be passed to React to allow syncing the ShadowTree layout of SplitViewScreen
 * subtree. This controller observes its own view's frame via KVO and notifies `frameOriginChangeDelegate`
 * whenever the frame origin changes.
 */
@interface RNSSplitNavigationController : RNSStackNavigationController

/**
 * Notified whenever the origin of this controller's view frame changes.
 */
@property (nonatomic, weak, nullable) id<RNSViewFrameChangeDelegate> frameOriginChangeDelegate;

/**
 * Notified about the lifecycle events of this controller's view.
 */
@property (nonatomic, weak, nullable) id<RNSViewControllerViewLifecycleEventsObserver> viewLifecycleEventsObserver;

@end

NS_ASSUME_NONNULL_END
