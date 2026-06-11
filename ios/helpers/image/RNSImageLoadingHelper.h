#pragma once

#import <React/RCTImageLoader.h>
#import <React/RCTImageSource.h>

typedef NS_ENUM(NSInteger, RNSImageType) {
  RNSImageTypeImage,
  RNSImageTypeTemplate,
  RNSImageTypeSfSymbol,
  RNSImageTypeXcasset,
};

typedef NS_ENUM(NSInteger, RNSImageSourceType) {
  RNSImageSourceTypeResourceName,
  RNSImageSourceTypeReactImageSource,
};

@interface RNSImageSource : NSObject

@property (nonatomic, readonly) RNSImageSourceType imageSourceType;

+ (nullable RNSImageSource *)imageSourceDescriptorWithResourceName:(nullable NSString *)resourceName;

+ (nullable RNSImageSource *)xcassetSourceDescriptorWithResourceName:(nullable NSString *)resourceName;

+ (nullable RNSImageSource *)sfSymbolSourceDescriptorWithResourceName:(nullable NSString *)resourceName;

+ (nullable RNSImageSource *)reactImageSourceDescriptorWithImageSource:(nullable RCTImageSource *)imageSource;

@end

@interface RNSResourceNameSourceDescriptor : RNSImageSource

- (nullable instancetype)initWithResourceName:(nullable NSString *)resourceName;

@property (nonatomic, readonly, nullable) NSString *resourceName;

@end

@interface RNSReactImageSourceSourceDescriptor : RNSImageSource

- (nullable instancetype)initWithReactImageSource:(nullable RCTImageSource *)imageSource;

@property (nonatomic, readonly, nullable) RCTImageSource *imageSource;

@end

/**
 * Information necessary to load an image with image loading helper.
 */
@interface RNSImageDescriptor : NSObject

@property (nonatomic, readonly) RNSImageType imageType;

@property (nonatomic, readonly, nonnull) RNSImageSource *imageSource;

@end

@interface RNSImageLoadingHelper : NSObject

+ (void)loadImageFromDescriptor:(nonnull RNSImageDescriptor *)imageDescriptor
                withImageLoader:(nonnull RCTImageLoader *)reactImageLoader
                     asTemplate:(BOOL)isTemplate
                completionBlock:(void (^_Nonnull)(UIImage *_Nullable image))imageLoadingCompletionBlock;

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
