#pragma once

#import <UIKit/UIKit.h>

NS_ASSUME_NONNULL_BEGIN

@protocol RNSViewControllerLifecycleEventsDelegate <NSObject>

- (void)viewControllerWillAppear:(UIViewController *)viewController;
- (void)viewControllerDidAppear:(UIViewController *)viewController;
- (void)viewControllerWillDisappear:(UIViewController *)viewController;
- (void)viewControllerDidDisappear:(UIViewController *)viewController;

@end

NS_ASSUME_NONNULL_END
