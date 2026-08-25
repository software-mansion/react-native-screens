#import "RNSScrollToTopGuard.h"
#import <react/renderer/components/rnscreens/ComponentDescriptors.h>
#import <react/renderer/components/rnscreens/EventEmitters.h>
#import <react/renderer/components/rnscreens/Props.h>
#import <react/renderer/components/rnscreens/RCTComponentViewHelpers.h>
#import "RNSDefines.h"
#import "RNSScrollToTopGuardGestureRecognizer.h"

namespace react = facebook::react;

@implementation RNSScrollToTopGuard

- (instancetype)initWithFrame:(CGRect)frame
{
  if (self = [super initWithFrame:frame]) {
    [self initState];
  }
  return self;
}

- (void)initState
{
  static const auto defaultProps = std::make_shared<const react::RNSScrollToTopGuardProps>();
  _props = defaultProps;

#if RNS_IPHONE_OS_VERSION_AVAILABLE(26_0)
  // Attach the guard once on mount, only on OS versions where the system scroll-to-top
  // interaction exists. On other versions this view is a plain passthrough.
  if ([RNSScrollToTopGuardGestureRecognizer shouldGuardScrollToTop]) {
    [RNSScrollToTopGuardGestureRecognizer applyToView:self];
  }
#endif // RNS_IPHONE_OS_VERSION_AVAILABLE(26_0)
}

+ (react::ComponentDescriptorProvider)componentDescriptorProvider
{
  return react::concreteComponentDescriptorProvider<react::RNSScrollToTopGuardComponentDescriptor>();
}

#pragma mark - Dynamic frameworks support

// Needed because of this: https://github.com/facebook/react-native/pull/37274
#ifdef RCT_DYNAMIC_FRAMEWORKS
+ (void)load
{
  [super load];
}
#endif // RCT_DYNAMIC_FRAMEWORKS

@end

#pragma mark - View class exposure

Class<RCTComponentViewProtocol> RNSScrollToTopGuardCls(void)
{
  return RNSScrollToTopGuard.class;
}
