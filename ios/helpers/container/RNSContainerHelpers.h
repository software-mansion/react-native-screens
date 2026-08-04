#pragma once

#import <UIKit/UIKit.h>

NS_ASSUME_NONNULL_BEGIN

@interface RNSContainerHelpers : NSObject

+ (BOOL)addChildViewController:(nullable UIViewController *)childViewController
      toViewControllerManaging:(nullable UIView *)startingView
             withContainerView:(nullable UIView *)containerView;

@end

NS_ASSUME_NONNULL_END
