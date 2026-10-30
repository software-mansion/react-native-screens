#import "RNSStackHeaderIconData.h"

@implementation RNSStackHeaderIconData

- (instancetype)initWithType:(RNSStackHeaderIconType)iconType
                resourceName:(nullable NSString *)resourceName
                 imageSource:(nullable id)imageSource
             imageSourceSize:(CGSize)imageSourceSize
            imageSourceScale:(CGFloat)imageSourceScale
{
  if (self = [super init]) {
    _iconType = iconType;
    _resourceName = [resourceName copy];
    _imageSource = imageSource;
    _imageSourceSize = imageSourceSize;
    _imageSourceScale = imageSourceScale;
  }
  return self;
}

@end
