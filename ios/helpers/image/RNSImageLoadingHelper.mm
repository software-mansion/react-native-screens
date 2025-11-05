#import "RNSImageLoadingHelper.h"
#import "RCTImageSource+AccessHiddenMembers.h"

@implementation RNSImageLoadingHelper

+ (void)loadImageSyncIfPossibleFromJsonSource:(nonnull id)jsonImageSource
                              withImageLoader:(nonnull RCTImageLoader *)imageLoader
                                   asTemplate:(BOOL)isTemplate
               synchronouslyInDebugIfPossible:(BOOL)shouldLoadSynchronouslyInDebug
                              completionBlock:(void (^_Nonnull)(UIImage *_Nullable image))imageLoadingCompletionBlock
{
  RCTAssert(RCTIsMainQueue(), @"[RNScreens] Expected to run on main queue");

  RCTImageSource *imageSource = [RCTConvert RCTImageSource:jsonImageSource];
  RCTAssert(imageSource != nil, @"[RNScreens] Expected nonnil image source");

#if !defined(NDEBUG) // We're in debug mode here
  if (imageSource.packagerAsset) {
    UIImage *loadedImage = [RCTConvert UIImage:jsonImageSource];
    imageLoadingCompletionBlock(loadedImage);
  } else
#endif // !defined(NDEBUG)
  {
    [self loadImageFromSource:imageSource
                withImageLoader:imageLoader
                     asTemplate:isTemplate
        synchronouslyIfPossible:YES
                completionBlock:imageLoadingCompletionBlock];
  }
}

+ (void)loadImageFromSource:(nonnull RCTImageSource *)imageSource
            withImageLoader:(nonnull RCTImageLoader *)imageLoader
                 asTemplate:(BOOL)isTemplate
    synchronouslyIfPossible:(BOOL)shouldLoadSynchronously
            completionBlock:(void (^_Nonnull)(UIImage *_Nullable image))imageLoadingCompletionBlock
{
  RCTAssert(imageSource != nil, @"[RNScreens] imageSource must not be nil");
  RCTAssert(imageLoader != nil, @"[RNScreens] imageLoader must not be nil");

  auto completionWrapper = ^(UIImage *image) {
    if (isTemplate) {
      imageLoadingCompletionBlock([image imageWithRenderingMode:UIImageRenderingModeAlwaysTemplate]);
    } else {
      imageLoadingCompletionBlock([image imageWithRenderingMode:UIImageRenderingModeAlwaysOriginal]);
    }
  };

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
        if (shouldLoadSynchronously && RCTIsMainQueue()) {
          completionWrapper(image);
        } else {
          dispatch_async(dispatch_get_main_queue(), ^{
            completionWrapper(image);
          });
        }
      }];
}

@end
