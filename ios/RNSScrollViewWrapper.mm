#import "RNSScrollViewWrapper.h"
#import <react/renderer/components/rnscreens/ComponentDescriptors.h>
#import <React/RCTLog.h>

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

Class<RCTComponentViewProtocol> RNSScrollViewWrapperCls(void)
{
  return RNSScrollViewWrapper.class;
}
