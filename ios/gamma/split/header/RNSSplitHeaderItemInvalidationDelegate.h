#pragma once

#import <UIKit/UIKit.h>

NS_ASSUME_NONNULL_BEGIN

@protocol RNSSplitHeaderItemInvalidationDelegate <NSObject>

- (void)headerItemDidInvalidate;

@end

NS_ASSUME_NONNULL_END
