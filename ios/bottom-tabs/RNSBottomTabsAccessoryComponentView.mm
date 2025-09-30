#import "RNSBottomTabsAccessoryComponentView.h"

#import <rnscreens/RNSBottomTabsAccessoryComponentDescriptor.h>

namespace react = facebook::react;

#pragma mark - View implementation

@implementation RNSBottomTabsAccessoryComponentView {
}

- (instancetype)initWithFrame:(CGRect)frame
{
  if (self = [super initWithFrame:frame]) {
    [self initState];
  }
  return self;
}

- (void)initState
{
  return;
}

+ (react::ComponentDescriptorProvider)componentDescriptorProvider
{
  return react::concreteComponentDescriptorProvider<react::RNSBottomTabsAccessoryComponentDescriptor>();
}

@end

#if RCT_NEW_ARCH_ENABLED
#pragma mark - View class exposure

Class<RCTComponentViewProtocol> RNSBottomTabsAccessoryCls(void)
{
  return RNSBottomTabsAccessoryComponentView.class;
}

#endif // RCT_NEW_ARCH_ENABLED
