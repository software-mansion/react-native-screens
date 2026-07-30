#pragma once

#import <UIKit/UIKit.h>

NS_ASSUME_NONNULL_BEGIN

@class RNSSplitNavigationController;

@protocol RNSViewFrameOriginChangeDelegate <NSObject>

- (void)viewFrameOriginDidChange:(RNSSplitNavigationController *)splitNavCtrl;

@end

NS_ASSUME_NONNULL_END
