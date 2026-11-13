#pragma once

#import <UIKit/UIKit.h>

NS_ASSUME_NONNULL_BEGIN

@protocol RNSViewControllerViewLifecycleEventsObserver <NSObject>

- (void)viewControllerViewWillAppear:(UIViewController *)viewController;
- (void)viewControllerViewDidAppear:(UIViewController *)viewController;
- (void)viewControllerViewWillDisappear:(UIViewController *)viewController;
- (void)viewControllerViewDidDisappear:(UIViewController *)viewController;

@end

NS_ASSUME_NONNULL_END
