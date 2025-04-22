#import "RNSHeaderSubviewContentWrapper.h"

#ifdef RCT_NEW_ARCH_ENABLED
#import <react/renderer/components/rnscreens/ComponentDescriptors.h>
#import <react/renderer/components/rnscreens/EventEmitters.h>
#import <react/renderer/components/rnscreens/Props.h>
#import <react/renderer/components/rnscreens/RCTComponentViewHelpers.h>

namespace react = facebook::react;
#else
#import <React/RCTScrollView.h>
#endif // RCT_NEW_ARCH_ENABLED

@implementation RNSHeaderSubviewContentWrapper

+ (react::ComponentDescriptorProvider)componentDescriptorProvider
{
  return react::concreteComponentDescriptorProvider<react::RNSHeaderSubviewContentWrapperComponentDescriptor>();
}

Class<RCTComponentViewProtocol> RNSHeaderSubviewContentWrapperCls(void)
{
  return RNSHeaderSubviewContentWrapper.class;
}

// Needed because of this: https://github.com/facebook/react-native/pull/37274
+ (void)load
{
  [super load];
}

@end

@implementation RNSHeaderSubviewContentWrapperManager

RCT_EXPORT_MODULE()

#if !defined(RCT_NEW_ARCH_ENABLED)
- (UIView *)view
{
  return [RNSHeaderSubviewContentWrapper new];
}
#endif

@end
