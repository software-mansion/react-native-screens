#pragma once

#import <UIKit/UIKit.h>

#import "RNSImageLoading.h"
#import "RNSStackHeaderIconData.h"

NS_ASSUME_NONNULL_BEGIN

@interface RNSStackHeaderIconResolver : NSObject

/**
 * Resolves an icon synchronously if possible, otherwise starts an async load.
 *
 * @return UIImage if resolved synchronously, nil if async load was started.
 * For async loads, the completion block is called on the main queue with the loaded image,
 * and iconData.resolvedImage is set automatically.
 */
+ (nullable UIImage *)resolveIcon:(RNSStackHeaderIconData *)iconData
                  withImageLoader:(id<RNSImageLoading>)imageLoader
             asyncCompletionBlock:(nullable void (^)(UIImage *_Nullable))completionBlock;

/**
 Creates a transparent placeholder image matching the size declared in iconData's jsonSource.
 Falls back to 1x1 if size info is missing and returns nil if jsonSource is nil (sfSymbols, xcassets).
 */
+ (nullable UIImage *)placeholderImageForIcon:(RNSStackHeaderIconData *)iconData;

@end

NS_ASSUME_NONNULL_END
