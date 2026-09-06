#pragma once

#import <UIKit/UIKit.h>

NS_ASSUME_NONNULL_BEGIN

@protocol RNSImageLoading <NSObject>

- (void)loadImageFromJsonSource:(NSDictionary *)jsonSource
                     asTemplate:(BOOL)isTemplate
         withCompletionCallback:(void (^)(UIImage *_Nullable image))completionBlock;

@end

NS_ASSUME_NONNULL_END
