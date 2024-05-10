#import "RNSScreenContentWrapper.h"

#ifdef RCT_NEW_ARCH_ENABLED
#import <react/renderer/components/rnscreens/ComponentDescriptors.h>
#import <react/renderer/components/rnscreens/EventEmitters.h>
#import <react/renderer/components/rnscreens/Props.h>
#import <react/renderer/components/rnscreens/RCTComponentViewHelpers.h>

namespace react = facebook::react;
#endif // RCT_NEW_ARCH_ENABLED

@implementation RNSScreenContentWrapper

- (void)reactSetFrame:(CGRect)frame
{
  [super reactSetFrame:frame];
  if (self.delegate != nil) {
    [self.delegate reactDidSetFrame:frame forContentWrapper:self];
  }
}

#ifdef RCT_NEW_ARCH_ENABLED
+ (react::ComponentDescriptorProvider)componentDescriptorProvider
{
  return react::concreteComponentDescriptorProvider<react::RNSScreenContentWrapperComponentDescriptor>();
}

Class<RCTComponentViewProtocol> _RNSScreenContentWrapperCls(void)
{
  return RNSScreenContentWrapper.class;
}
#endif // RCT_NEW_ARCH_ENABLED

@end

@implementation RNSScreenContentWrapperManager

RCT_EXPORT_MODULE()

- (UIView *)view
{
  return [RNSScreenContentWrapper new];
}

@end
