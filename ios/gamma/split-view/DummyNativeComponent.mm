#import "DummyNativeComponent.h"
#import <react/renderer/components/rnscreens/ComponentDescriptors.h>

#import "Swift-Bridging.h"

namespace react = facebook::react;

@implementation DummyNativeComponent {
}

#pragma mark - RCTViewComponentViewProtocol

+ (react::ComponentDescriptorProvider)componentDescriptorProvider
{
  return react::concreteComponentDescriptorProvider<react::DummyNativeComponentComponentDescriptor>();
}

@end

Class<RCTComponentViewProtocol> DummyNativeComponentCls(void)
{
  return DummyNativeComponent.class;
}
