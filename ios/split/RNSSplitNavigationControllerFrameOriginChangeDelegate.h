#pragma once

#import <UIKit/UIKit.h>

NS_ASSUME_NONNULL_BEGIN

@class RNSSplitNavigationController;

@protocol RNSSplitNavigationControllerFrameOriginChangeDelegate <NSObject>

- (void)splitNavigationControllerFrameOriginDidChange:(RNSSplitNavigationController *)splitNavCtrl;

@end

NS_ASSUME_NONNULL_END
