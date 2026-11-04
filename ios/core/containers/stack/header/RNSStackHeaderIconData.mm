#import "RNSStackHeaderIconData.h"

@implementation RNSStackHeaderIconData

- (instancetype)initWithType:(RNSStackHeaderIconType)iconType
                resourceName:(nullable NSString *)resourceName
                 imageSource:(RNSStackHeaderIconImageSource)imageSource
{
  if (self = [super init]) {
    _iconType = iconType;
    _resourceName = [resourceName copy];
    _imageSource = imageSource;
  }
  return self;
}

@end
