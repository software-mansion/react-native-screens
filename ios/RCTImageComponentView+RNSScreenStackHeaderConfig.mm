#ifdef RN_FABRIC_ENABLED

#include "RCTImageComponentView+RNSScreenStackHeaderConfig.h"

@implementation RCTImageComponentView (RNSScreenStackHeaderConfig)

- (UIImage *)image
{
  return self._imageView.image;
}

@end

#endif // RN_FABRIC_ENABLED
