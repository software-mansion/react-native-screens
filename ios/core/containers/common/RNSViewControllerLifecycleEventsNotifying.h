#pragma once

#import <UIKit/UIKit.h>

NS_ASSUME_NONNULL_BEGIN

@protocol RNSViewControllerLifecycleEventsDelegate <NSObject>

- (void)viewControllerWillAppear:(UIViewController *)viewController;
- (void)viewControllerDidAppear:(UIViewController *)viewController;
- (void)viewControllerWillDisappear:(UIViewController *)viewController;
- (void)viewControllerDidDisappear:(UIViewController *)viewController;

@end

/**
 * A view controller that reports its lifecycle events to a delegate, so that an object which does not own it can
 * follow them: the Split column whose slot the controller takes.
 */
@protocol RNSViewControllerLifecycleEventsNotifying <NSObject>

@property (nonatomic, weak, nullable) id<RNSViewControllerLifecycleEventsDelegate> lifecycleEventsDelegate;

@end

NS_ASSUME_NONNULL_END
