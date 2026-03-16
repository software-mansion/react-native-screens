#pragma once

#import <React/RCTImageLoader.h>
#import <React/RCTImageSource.h>

@interface RNSImageLoadingHelper : NSObject

/**
 * Should be called from UI thread only.
 * If done so, the method **tries** to load the image synchronously from image source represented in JSON via
 * `NSDictionary`. There is no guarantee, because in release mode we rely on `RCTImageLoader` implementation details. No
 * matter how the image is loaded, `completionBlock` is executed on main queue.
 */
+ (void)loadImageSyncIfPossibleFromJsonSource:(nonnull NSDictionary *)jsonImageSource
                              withImageLoader:(nonnull RCTImageLoader *)imageLoader
                                   asTemplate:(BOOL)isTemplate
                              completionBlock:(void (^_Nonnull)(UIImage *_Nullable image))imageLoadingCompletionBlock;

/**
 * Loads image from `RCTImageSource`, relies on `RCTImageLoader` implementation.
 * `completionBlock` is executed on main queue.
 */
+ (void)loadImageFromSource:(nonnull RCTImageSource *)imageSource
            withImageLoader:(nonnull RCTImageLoader *)imageLoader
                 asTemplate:(BOOL)isTemplate
            completionBlock:(void (^_Nonnull)(UIImage *_Nullable image))imageLoadingCompletionBlock;

@end
