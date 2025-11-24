#import "RNSScrollViewWrapper.h"
#import <React/RCTLog.h>
#import <react/renderer/components/rnscreens/ComponentDescriptors.h>

namespace react = facebook::react;

@implementation RNSScrollViewWrapper {
}

- (void)didMoveToWindow
{
  RCTLogInfo(@"RNSScrollViewWrapper did move to window");
}

#pragma mark - RCTViewComponentViewProtocol

+ (react::ComponentDescriptorProvider)componentDescriptorProvider
{
  return react::concreteComponentDescriptorProvider<react::RNSScrollViewWrapperComponentDescriptor>();
}

@end

#if RCT_NEW_ARCH_ENABLED
Class<RCTComponentViewProtocol> RNSScrollViewWrapperCls(void)
{
  return RNSScrollViewWrapper.class;
}
#endif // RCT_NEW_ARCH_ENABLED

#if !RCT_NEW_ARCH_ENABLED

@implementation RNSScrollViewWrapperViewManager

RCT_EXPORT_MODULE(RNSScrollViewWrapper);

- (UIView *)view
{
  return [[RNSScrollViewWrapper alloc] init];
}

@end

#endif // !RCT_NEW_ARCH_ENABLED
