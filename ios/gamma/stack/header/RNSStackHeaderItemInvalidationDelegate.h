#pragma once

#import <UIKit/UIKit.h>

NS_ASSUME_NONNULL_BEGIN

@protocol RNSStackHeaderItemInvalidationDelegate <NSObject>

- (void)headerItemDidInvalidate;

@end

NS_ASSUME_NONNULL_END
