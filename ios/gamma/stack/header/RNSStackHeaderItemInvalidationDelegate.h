#pragma once

#import <UIKit/UIKit.h>

NS_ASSUME_NONNULL_BEGIN

@protocol RNSStackHeaderItemInvalidationDelegate <NSObject>

- (void)headerItemDidInvalidateWithId:(NSString *)itemId;

- (void)headerItemMenuDidChangeWithId:(NSString *)itemId;

- (void)headerItemSpacerDidInvalidate;

@end

NS_ASSUME_NONNULL_END
