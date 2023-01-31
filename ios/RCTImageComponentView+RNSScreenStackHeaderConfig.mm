#ifdef RN_FABRIC_ENABLED

#include "RCTImageComponentView+RNSScreenStackHeaderConfig.h"

@implementation RCTImageComponentView (RNSScreenStackHeaderConfig)

- (UIImage *)image
{
  return _imageView.image;
}

@end

#endif // RN_FABRIC_ENABLED
