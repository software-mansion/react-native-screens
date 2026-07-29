#pragma once

#import <UIKit/UIKit.h>

NS_ASSUME_NONNULL_BEGIN

@class RNSSplitNavigationController;

/// @brief A protocol that observes origin changes in a RNSSplitNavigationController’s view frame.
///
/// The subscriber will be notified when the view's origin changes.
@protocol RNSSplitNavigationControllerViewFrameObserver <NSObject>

- (void)splitNavCtrlViewDidChangeFrameOrigin:(RNSSplitNavigationController *)splitNavCtrl;

@end

/// @class RNSSplitNavigationController
/// @brief A subclass of UINavigationController, creates a view that wraps view associated with
/// RNSSplitScreenController.
///
/// This subclass is responsible for tracking when the underlying view's frame origin changes,
/// allowing for syncing the ShadowTree layout.
///
/// It observes origin changes via key-value observer and notifies a delegate.
@interface RNSSplitNavigationController : UINavigationController

@property (nonatomic, weak, nullable) id<RNSSplitNavigationControllerViewFrameObserver> viewFrameOriginChangeObserver;

@end

NS_ASSUME_NONNULL_END
