#pragma once

#import <UIKit/UIKit.h>

NS_ASSUME_NONNULL_BEGIN

@interface RNSContainerHelpers : NSObject

+ (BOOL)addChildViewController:(nullable UIViewController *)childViewController
      toViewControllerManaging:(nullable UIView *)startingView
             withContainerView:(nullable UIView *)containerView;

/// Reverses `addChildViewController:toViewControllerManaging:withContainerView:`: detaches the controller & its view
/// from the parent. Does nothing when the controller has no parent. Must be called on the main thread.
+ (void)removeChildViewController:(nullable UIViewController *)childViewController;

@end

NS_ASSUME_NONNULL_END
