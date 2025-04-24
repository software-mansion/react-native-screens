#import "RNSHeaderSubviewContentWrapper.h"

#ifdef RCT_NEW_ARCH_ENABLED
#import <React/RCTConversions.h>
#import <react/renderer/components/rnscreens/ComponentDescriptors.h>
#import <react/renderer/components/rnscreens/EventEmitters.h>
#import <react/renderer/components/rnscreens/Props.h>
#import <react/renderer/components/rnscreens/RCTComponentViewHelpers.h>

namespace react = facebook::react;
#else
#import <React/RCTScrollView.h>
#endif // RCT_NEW_ARCH_ENABLED

@implementation RNSHeaderSubviewContentWrapper {
  CGRect _lastReactFrame;
}

- (void)notifyDelegateWithFrame:(CGRect)reactFrame
{
  BOOL didChange = NO;
  if (!CGRectEqualToRect(_lastReactFrame, reactFrame)) {
    _lastReactFrame = reactFrame;
    didChange = YES;
  }
  [self.delegate headerSubviewContentWrapper:self receivedReactFrame:reactFrame didChange:didChange];
}

#pragma mark - Fabric specific

- (instancetype)initWithFrame:(CGRect)frame
{
  self = [super initWithFrame:frame];
  if (self) {
    _lastReactFrame = CGRectNull;
  }
  return self;
}

#ifdef RCT_NEW_ARCH_ENABLED

#pragma mark - RCTComponentViewProtocol

- (void)updateLayoutMetrics:(const facebook::react::LayoutMetrics &)layoutMetrics
           oldLayoutMetrics:(const facebook::react::LayoutMetrics &)oldLayoutMetrics
{
  NSLog(
      @"HSContentWrapper [%ld] updateLayoutMetrics %@",
      self.tag,
      NSStringFromCGRect(RCTCGRectFromRect(layoutMetrics.frame)));
  [self notifyDelegateWithFrame:RCTCGRectFromRect(layoutMetrics.frame)];

  NSLog(@"HSContentWrapper [%ld] super call", self.tag);
  [super updateLayoutMetrics:layoutMetrics oldLayoutMetrics:oldLayoutMetrics];
}

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

#endif

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
