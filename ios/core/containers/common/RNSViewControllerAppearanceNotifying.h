#pragma once

#import <UIKit/UIKit.h>

NS_ASSUME_NONNULL_BEGIN

@protocol RNSViewControllerAppearanceDelegate <NSObject>

- (void)viewControllerWillAppear:(UIViewController *)viewController;
- (void)viewControllerDidAppear:(UIViewController *)viewController;
- (void)viewControllerWillDisappear:(UIViewController *)viewController;
- (void)viewControllerDidDisappear:(UIViewController *)viewController;

@end

/**
 * A view controller that reports its appearance to a delegate, so that an object which does not own it can follow
 * its lifecycle: the Split column whose slot the controller takes.
 */
@protocol RNSViewControllerAppearanceNotifying <NSObject>

@property (nonatomic, weak, nullable) id<RNSViewControllerAppearanceDelegate> appearanceDelegate;

@end

NS_ASSUME_NONNULL_END
