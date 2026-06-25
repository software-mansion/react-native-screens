#import "RNSImageLoadingHelper.h"
#import "RCTImageSource+AccessHiddenMembers.h"

@implementation RNSImageLoadingHelper

+ (void)loadImageFromDescriptor:(nonnull RNSImageDescriptor *)imageDescriptor
                withImageLoader:(nonnull RCTImageLoader *)reactImageLoader
                     asTemplate:(BOOL)isTemplate
                completionBlock:(void (^_Nonnull)(UIImage *_Nullable image))imageLoadingCompletionBlock
{
  RCTAssert(RCTIsMainQueue(), @"[RNScreens] Expected to run on the main queue");
  RCTAssert(imageDescriptor != nil, @"[RNScreens] Expected non-null image descriptor");
  RCTAssert(reactImageLoader != nil, @"[RNScreens] Expected non-null image loader");

  auto completionBlock = ^(UIImage *image) {
    imageLoadingCompletionBlock([self handleRenderingModeForImage:image isTemplate:isTemplate]);
  };

  if (imageDescriptor == nil || reactImageLoader == nil) {
    return;
  }

  switch (imageDescriptor.imageType) {
    case RNSImageTypeImage:
      break;
    case RNSImageTypeTemplate:
      break;
    case RNSImageTypeSfSymbol:
      [self loadSfSymbolFromSource:imageDescriptor.imageSource completionBlock:completionBlock];
      break;
    case RNSImageTypeXcasset:
      break;
  }
}

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

+ (void)loadSfSymbolFromSource:(nonnull RNSImageSource *)sourceDescriptor
               completionBlock:(void (^_Nonnull)(UIImage *_Nullable image))imageLoadingCompletionBlock
{
  if (sourceDescriptor.imageSourceType != RNSImageSourceTypeResourceName) {
    imageLoadingCompletionBlock(nil);
    return;
  }

  const auto *resourceNameSource = static_cast<RNSResourceNameSourceDescriptor *>(sourceDescriptor);
  UIImage *_Nullable loadedImage = [UIImage systemImageNamed:resourceNameSource.resourceName];
  imageLoadingCompletionBlock(loadedImage);
}

+ (void)loadTemplateFromSource:(nonnull RNSImageSource *)sourceDescriptor
               withImageLoader:(nonnull RCTImageLoader *)imageLoader
               completionBlock:(void (^_Nonnull)(UIImage *_Nullable image))imageLoadingCompletionBlock
{
  if (sourceDescriptor.imageSourceType != RNSImageSourceTypeReactImageSource) {
    imageLoadingCompletionBlock(nil);
    return;
  }

  const auto *reactImageSource = static_cast<RNSReactImageSourceSourceDescriptor *>(sourceDescriptor);
  [self loadImageFromSource:reactImageSource.imageSource
            withImageLoader:imageLoader
                 asTemplate:YES
            completionBlock:imageLoadingCompletionBlock];
}

+ (void)loadXcassetFromSource:(nonnull RNSImageSource *)imageSource
              completionBlock:(void (^_Nonnull)(UIImage *_Nullable image))imageLoadingCompletionBlock
{
  if (imageSource.imageSourceType != RNSImageSourceTypeResourceName) {
    imageLoadingCompletionBlock(nil);
    return;
  }
  const auto *resourceNameSource = static_cast<RNSResourceNameSourceDescriptor *>(imageSource);
  UIImage *_Nullable loadedImage = [UIImage imageNamed:resourceNameSource.resourceName];
  imageLoadingCompletionBlock(loadedImage);
}

@end

@interface RNSImageSource ()

@property (nonatomic) RNSImageSourceType imageSourceType;

@end

@implementation RNSImageSource

+ (nullable RNSImageSource *)imageSourceDescriptorWithResourceName:(nullable NSString *)resourceName
{
  if (resourceName == nil) {
    return nil;
  }

  return [[RNSResourceNameSourceDescriptor alloc] initWithResourceName:resourceName];
}

+ (nullable RNSImageSource *)xcassetSourceDescriptorWithResourceName:(nullable NSString *)resourceName
{
  if (resourceName == nil) {
    return nil;
  }

  return [[RNSResourceNameSourceDescriptor alloc] initWithResourceName:resourceName];
}

+ (nullable RNSImageSource *)sfSymbolSourceDescriptorWithResourceName:(nullable NSString *)resourceName
{
  if (resourceName == nil) {
    return nil;
  }

  return [[RNSResourceNameSourceDescriptor alloc] initWithResourceName:resourceName];
}

+ (nullable RNSImageSource *)reactImageSourceDescriptorWithImageSource:(nullable RCTImageSource *)imageSource
{
  if (imageSource == nil) {
    return nil;
  }
  return [[RNSReactImageSourceSourceDescriptor alloc] initWithReactImageSource:imageSource];
}

@end

@implementation RNSResourceNameSourceDescriptor

- (nullable instancetype)initWithResourceName:(nullable NSString *)resourceName
{
  if (self = [super init]) {
    self.imageSourceType = RNSImageSourceTypeResourceName;
    _resourceName = resourceName;
  }
  return self;
}

@end

@implementation RNSReactImageSourceSourceDescriptor

- (nullable instancetype)initWithReactImageSource:(nullable RCTImageSource *)imageSource
{
  if (self = [super init]) {
    self.imageSourceType = RNSImageSourceTypeReactImageSource;
    _imageSource = imageSource;
  }
  return self;
}

@end

/**
 * Information necessary to load an image with image loading helper.
 */
@implementation RNSImageDescriptor

@end
