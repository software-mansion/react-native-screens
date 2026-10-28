#pragma once

#import <UIKit/UIKit.h>

NS_ASSUME_NONNULL_BEGIN

@protocol RNSNavigationItemCustomizing <NSObject>

- (void)configureNavigationItem:(UINavigationItem *)navigationItem;

@end

NS_ASSUME_NONNULL_END
