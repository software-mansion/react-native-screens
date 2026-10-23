#pragma once

#import <UIKit/UIKit.h>

NS_ASSUME_NONNULL_BEGIN

@protocol RNSImageLoading <NSObject>

/**
 * Loads the image described by `source` and calls `completionBlock` with it, or with nil on failure.
 *
 * `source` is opaque to the caller: whoever provides it also implements the loader and decides what it is (e.g. an
 * image source built from React props). `core` passes it through without inspecting it.
 */
- (void)loadImageFromSource:(id)source
                 asTemplate:(BOOL)isTemplate
     withCompletionCallback:(void (^)(UIImage *_Nullable image))completionBlock;

@end

NS_ASSUME_NONNULL_END
