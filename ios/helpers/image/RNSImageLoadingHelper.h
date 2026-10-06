#pragma once

#if defined(__cplusplus)

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
                    prefersSynchronousLoading:(BOOL)prefersSynchronousLoading
                                   asTemplate:(BOOL)isTemplate
                              completionBlock:(void (^_Nonnull)(UIImage *_Nullable image))imageLoadingCompletionBlock;

/**
 * Attempts immediate loading of local PNG files when requested, otherwise uses `RCTImageLoader`.
 * Other sources and failed local reads or decodes also use `RCTImageLoader`.
 * `completionBlock` is executed on main queue.
 */
+ (void)loadImageFromSource:(nonnull RCTImageSource *)imageSource
              withImageLoader:(nonnull RCTImageLoader *)imageLoader
    prefersSynchronousLoading:(BOOL)prefersSynchronousLoading
                   asTemplate:(BOOL)isTemplate
              completionBlock:(void (^_Nonnull)(UIImage *_Nullable image))imageLoadingCompletionBlock;

@end

#endif // defined(__cplusplus)
