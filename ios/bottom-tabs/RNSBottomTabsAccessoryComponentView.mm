#import "RNSBottomTabsAccessoryComponentView.h"
#import "RNSBottomAccessoryViewController.h"

#import <rnscreens/RNSBottomTabsAccessoryComponentDescriptor.h>

namespace react = facebook::react;

#pragma mark - View implementation

@implementation RNSBottomTabsAccessoryComponentView {
  RNSBottomAccessoryViewController *_controller;
  RNSBottomTabsHostComponentView *__weak _Nullable _reactSuperview;
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
  _controller = [RNSBottomAccessoryViewController new];
  _controller.view = self;
  
  _reactSuperview = nil;
}

+ (react::ComponentDescriptorProvider)componentDescriptorProvider
{
  return react::concreteComponentDescriptorProvider<react::RNSBottomTabsAccessoryComponentDescriptor>();
}

RNS_IGNORE_SUPER_CALL_BEGIN
- (nullable RNSBottomTabsHostComponentView *)reactSuperview
{
  return _reactSuperview;
}
RNS_IGNORE_SUPER_CALL_END

@end

#if RCT_NEW_ARCH_ENABLED
#pragma mark - View class exposure

Class<RCTComponentViewProtocol> RNSBottomTabsAccessoryCls(void)
{
  return RNSBottomTabsAccessoryComponentView.class;
}

#endif // RCT_NEW_ARCH_ENABLED
