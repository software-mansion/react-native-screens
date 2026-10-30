#pragma once

#import <UIKit/UIKit.h>

NS_ASSUME_NONNULL_BEGIN

@protocol RNSImageLoading <NSObject>

/**
 * Loads the image described by `source` and calls `completionBlock` on the main queue with it, or with nil on failure.
 *
 * `source` is opaque to `core`: the layer that provides the sources also provides the loader, and the two agree on
 * what a source is (e.g. an image source built from React props). `core` passes it through without inspecting it.
 */
- (void)loadImageFromSource:(id)source
                 asTemplate:(BOOL)isTemplate
     withCompletionCallback:(void (^)(UIImage *_Nullable image))completionBlock;

/**
 * Loads a symbol image by name, synchronously: a built-in SF Symbol if one matches, otherwise a custom symbol from
 * the app's asset catalog. Returns nil if neither exists.
 */
- (nullable UIImage *)symbolImageNamed:(NSString *)name;

@end

NS_ASSUME_NONNULL_END
