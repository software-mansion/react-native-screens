#import "RNSStackHeaderIconResolver.h"

@implementation RNSStackHeaderIconResolver

+ (nullable UIImage *)resolveIcon:(RNSStackHeaderIconData *)iconData
                  withImageLoader:(id<RNSImageLoading>)imageLoader
             asyncCompletionBlock:(nullable void (^)(UIImage *_Nullable))completionBlock
{
  if (iconData == nil) {
    return nil;
  }

  // If we already resolved this icon, return cached image
  if (iconData.resolvedImage != nil) {
    return iconData.resolvedImage;
  }

  switch (iconData.iconType) {
    case RNSStackHeaderIconTypeSfSymbol: {
      UIImage *image = [UIImage systemImageNamed:iconData.resourceName];
      iconData.resolvedImage = image;
      return image;
    }
    case RNSStackHeaderIconTypeXcasset: {
      UIImage *image = [UIImage imageNamed:iconData.resourceName];
      iconData.resolvedImage = image;
      return image;
    }
    case RNSStackHeaderIconTypeImageSource:
    case RNSStackHeaderIconTypeTemplateSource: {
      if (imageLoader == nil || iconData.jsonSource == nil) {
        return nil;
      }
      // Weak ref to iconData to avoid retaining it if the item is removed before load completes
      __weak RNSStackHeaderIconData *weakIconData = iconData;
      [imageLoader loadImageFromJsonSource:iconData.jsonSource
                                asTemplate:iconData.iconType == RNSStackHeaderIconTypeTemplateSource
                    withCompletionCallback:^(UIImage *_Nullable image) {
                      weakIconData.resolvedImage = image;
                      if (completionBlock) {
                        completionBlock(image);
                      }
                    }];
      // Completion may have already fired synchronously if image was cached
      return iconData.resolvedImage;
    }
  }
}

@end
