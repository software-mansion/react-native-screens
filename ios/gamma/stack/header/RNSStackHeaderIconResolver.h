#pragma once

#import <UIKit/UIKit.h>

#import "RNSImageLoading.h"
#import "RNSStackHeaderIconData.h"

NS_ASSUME_NONNULL_BEGIN

@interface RNSStackHeaderIconResolver : NSObject

/**
 Resolves an icon synchronously if possible, otherwise starts an async load.

 @return UIImage if resolved synchronously, nil if async load was started.
 For async loads, the completion block is called on the main queue with the loaded image,
 and iconData.resolvedImage is set automatically.
 */
+ (nullable UIImage *)resolveIcon:(RNSStackHeaderIconData *)iconData
                  withImageLoader:(id<RNSImageLoading>)imageLoader
             asyncCompletionBlock:(nullable void (^)(UIImage *_Nullable))completionBlock;

@end

NS_ASSUME_NONNULL_END
