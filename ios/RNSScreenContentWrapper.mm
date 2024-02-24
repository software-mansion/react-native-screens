#import "RNSScreenContentWrapper.h"

@implementation RNSScreenContentWrapper

- (void)reactSetFrame:(CGRect)frame
{
  [super reactSetFrame:frame];
  if (self.delegate != nil) {
    [self.delegate reactDidSetFrame:frame forContentWrapper:self];
  }
}

@end

@implementation RNSScreenContentWrapperManager

RCT_EXPORT_MODULE()

- (UIView *)view
{
  return [RNSScreenContentWrapper new];
}

@end
