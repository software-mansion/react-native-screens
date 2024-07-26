#ifdef RNS_NEW_ARCH_ENABLED

#include "RCTImageComponentView+RNSScreenStackHeaderConfig.h"

@implementation RCTImageComponentView (RNSScreenStackHeaderConfig)

- (UIImage *)image
{
  return _imageView.image;
}

@end

#endif // RNS_NEW_ARCH_ENABLED
