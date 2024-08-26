#import "RNSScreenContentWrapper.h"

#ifdef RCT_NEW_ARCH_ENABLED
#import <React/RCTConversions.h>
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

- (void)triggerDelegateUpdate
{
  [self.delegate reactDidSetFrame:self.frame forContentWrapper:self];
}

#ifdef RCT_NEW_ARCH_ENABLED

- (void)updateLayoutMetrics:(const facebook::react::LayoutMetrics &)layoutMetrics
           oldLayoutMetrics:(const facebook::react::LayoutMetrics &)oldLayoutMetrics
{
  [super updateLayoutMetrics:layoutMetrics oldLayoutMetrics:oldLayoutMetrics];
  if (self.delegate != nil) {
    [self.delegate reactDidSetFrame:RCTCGRectFromRect(layoutMetrics.frame) forContentWrapper:self];
  }
}

// Needed because of this: https://github.com/facebook/react-native/pull/37274
+ (void)load
{
  [super load];
}

+ (react::ComponentDescriptorProvider)componentDescriptorProvider
{
  return react::concreteComponentDescriptorProvider<react::RNSScreenContentWrapperComponentDescriptor>();
}

Class<RCTComponentViewProtocol> RNSScreenContentWrapperCls(void)
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
