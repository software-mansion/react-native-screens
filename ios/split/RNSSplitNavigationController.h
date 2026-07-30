#pragma once

#import <UIKit/UIKit.h>

NS_ASSUME_NONNULL_BEGIN

@protocol RNSViewFrameOriginChangeDelegate;

/**
 * @class RNSSplitNavigationController
 * @brief A subclass of UINavigationController, creates a view that wraps view associated with
 * RNSSplitScreenController.
 *
 * This subclass is responsible for tracking when the underlying view's frame origin changes,
 * allowing for syncing the ShadowTree layout.
 *
 * It observes origin changes via key-value observer and notifies a delegate.
 */
@interface RNSSplitNavigationController : UINavigationController

@property (nonatomic, weak, nullable) id<RNSViewFrameOriginChangeDelegate> viewFrameOriginChangeDelegate;

/**
 * Notifies `viewFrameOriginChangeDelegate` that the origin of this controller's view frame has changed.
 * Called by the frame observer helper when it detects the change.
 */
- (void)viewFrameOriginDidChange;

@end

NS_ASSUME_NONNULL_END
