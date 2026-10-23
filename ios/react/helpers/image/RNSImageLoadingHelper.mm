#import "RNSImageLoadingHelper.h"
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

+ (nullable UIImage *)handleRenderingModeForImage:(nullable UIImage *)image isTemplate:(BOOL)isTemplate
{
  if (isTemplate) {
    return [image imageWithRenderingMode:UIImageRenderingModeAlwaysTemplate];
  } else {
    return [image imageWithRenderingMode:UIImageRenderingModeAlwaysOriginal];
  }
}

@end
