#pragma once

#import <UIKit/UIKit.h>

NS_ASSUME_NONNULL_BEGIN

@protocol RNSViewFrameChangeDelegate <NSObject>

- (void)viewFrameDidChange:(nonnull UINavigationBar *)navigationBar;

@end

NS_ASSUME_NONNULL_END
