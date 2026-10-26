#pragma once

#import <UIKit/UIKit.h>

NS_ASSUME_NONNULL_BEGIN

@protocol RNSNavigationItemCustomizerProtocol <NSObject>

- (void)customizeNavigationItem:(UINavigationItem *)navigationItem;

@end

NS_ASSUME_NONNULL_END
