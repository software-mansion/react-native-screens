#import "RNSImageLoadingHelper.h"
#import <React/RCTUtils.h>
#import "RCTImageSource+AccessHiddenMembers.h"

@implementation RNSImageLoadingHelper

+ (void)loadImageSyncIfPossibleFromJsonSource:(nonnull NSDictionary *)jsonImageSource
                              withImageLoader:(nonnull RCTImageLoader *)imageLoader
                                   asTemplate:(BOOL)isTemplate
                              completionBlock:(void (^_Nonnull)(UIImage *_Nullable image))imageLoadingCompletionBlock
{
  RCTAssert(RCTIsMainQueue(), @"[RNScreens] Expected to run on main queue");

  RCTImageSource *imageSource = [RCTConvert RCTImageSource:jsonImageSource];
  RCTAssert(imageSource != nil, @"[RNScreens] Expected nonnil image source");

#if !defined(NDEBUG) // We're in debug mode here
  if (imageSource.packagerAsset) {
    // We use `+ [RCTConvert UIImage:]` only in debug mode, because it is deprecated, however
    // we haven't found different way to load image synchronously in debug other than
    // writing the code manually.
    UIImage *image = [RCTConvert UIImage:jsonImageSource];
    imageLoadingCompletionBlock([RNSImageLoadingHelper handleRenderingModeForImage:image isTemplate:isTemplate]);
  } else
#endif // !defined(NDEBUG)
  {
    [self loadImageFromSource:imageSource
              withImageLoader:imageLoader
                   asTemplate:isTemplate
              completionBlock:imageLoadingCompletionBlock];
  }
}

+ (void)loadImageFromSource:(nonnull RCTImageSource *)imageSource
            withImageLoader:(nonnull RCTImageLoader *)imageLoader
                 asTemplate:(BOOL)isTemplate
            completionBlock:(void (^_Nonnull)(UIImage *_Nullable image))imageLoadingCompletionBlock
{
  RCTAssert(imageSource != nil, @"[RNScreens] imageSource must not be nil");
  RCTAssert(imageLoader != nil, @"[RNScreens] imageLoader must not be nil");

  // `RCTImageLoader` loads synchronously only images from the app bundle. Any other local file
  // (e.g. an icon rendered to disk or an asset downloaded by an OTA update) goes through
  // `RCTNetworking` and is always delivered asynchronously, so we read it here instead.
  // Reading on the calling thread keeps the guarantee that `completionBlock` runs on main queue.
  if (RCTIsMainQueue() && [self isLocalFileOutsideOfAppBundle:imageSource]) {
    UIImage *image = [self loadImageFromLocalFileSource:imageSource];
    // A missing or undecodable file falls through, so `RCTImageLoader` handles (and reports) it as before.
    if (image != nil) {
      imageLoadingCompletionBlock([RNSImageLoadingHelper handleRenderingModeForImage:image isTemplate:isTemplate]);
      return;
    }
  }

  [imageLoader loadImageWithURLRequest:imageSource.request
      size:imageSource.size
      scale:imageSource.scale
      clipped:true
      resizeMode:RCTResizeModeCenter
      progressBlock:^(int64_t progress, int64_t total) {
      }
      partialLoadBlock:^(UIImage *_Nonnull image) {
      }
      completionBlock:^(NSError *_Nullable error, UIImage *_Nullable image) {
        if (RCTIsMainQueue()) {
          imageLoadingCompletionBlock([RNSImageLoadingHelper handleRenderingModeForImage:image isTemplate:isTemplate]);
        } else {
          dispatch_async(dispatch_get_main_queue(), ^{
            imageLoadingCompletionBlock([RNSImageLoadingHelper handleRenderingModeForImage:image
                                                                                isTemplate:isTemplate]);
          });
        }
      }];
}

+ (BOOL)isLocalFileOutsideOfAppBundle:(nonnull RCTImageSource *)imageSource
{
  NSURL *url = imageSource.request.URL;
  return url.isFileURL && !RCTIsBundleAssetURL(url);
}

+ (nullable UIImage *)loadImageFromLocalFileSource:(nonnull RCTImageSource *)imageSource
{
  // Like `RCTImageLoader`, we decode exactly the referenced file at the scale of the source
  // (`imageWithContentsOfFile:` would pick `@2x` / `@3x` variants and infer the scale on its own).
  NSData *data = [NSData dataWithContentsOfURL:imageSource.request.URL];
  if (data == nil) {
    return nil;
  }
  return [UIImage imageWithData:data scale:imageSource.scale > 0 ? imageSource.scale : 1.0];
}

+ (nullable UIImage *)symbolImageNamed:(nonnull NSString *)name
{
  UIImage *image = [UIImage systemImageNamed:name];
  if (image == nil) {
    image = [UIImage imageNamed:name];
  }
  return image;
}

+ (nullable UIImage *)handleRenderingModeForImage:(nullable UIImage *)image isTemplate:(BOOL)isTemplate
{
  if (isTemplate) {
    return [image imageWithRenderingMode:UIImageRenderingModeAlwaysTemplate];
  } else {
    return [image imageWithRenderingMode:UIImageRenderingModeAlwaysOriginal];
  }
}

@end
