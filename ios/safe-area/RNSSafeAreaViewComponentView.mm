// Implementation adapted from `react-native-safe-area-context`:
// https://github.com/AppAndFlow/react-native-safe-area-context/blob/v5.6.1/ios/Fabric/RNCSafeAreaViewComponentView.mm
#import "RNSSafeAreaViewComponentView.h"

#if RCT_NEW_ARCH_ENABLED
#import <react/renderer/components/rnscreens/ComponentDescriptors.h>
#import <react/renderer/components/rnscreens/Props.h>
#import <rnscreens/RNSSafeAreaViewComponentDescriptor.h>
#endif // RCT_NEW_ARCH_ENABLED

#if RCT_NEW_ARCH_ENABLED
namespace react = facebook::react;
#endif // RCT_NEW_ARCH_ENABLED

#pragma mark - View implementation
@implementation RNSSafeAreaViewComponentView {
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
#if RCT_NEW_ARCH_ENABLED
  static const auto defaultProps = std::make_shared<const react::RNSSafeAreaViewProps>();
  _props = defaultProps;
#endif // RCT_NEW_ARCH_ENABLED

  //  [self resetProps];
}

//- (void)resetProps
//{
//  return;
//}

#if RCT_NEW_ARCH_ENABLED
#pragma mark - RCTViewComponentViewProtocol

//- (void)updateProps:(const facebook::react::Props::Shared &)props
//           oldProps:(const facebook::react::Props::Shared &)oldProps
//{
//  [super updateProps:props oldProps:oldProps];
//}

//- (void)prepareForRecycle
//{
//  [super prepareForRecycle];
//}

+ (react::ComponentDescriptorProvider)componentDescriptorProvider
{
  return react::concreteComponentDescriptorProvider<react::RNSSafeAreaViewComponentDescriptor>();
}

#else
#pragma mark - LEGACY RCTComponent protocol

#endif
@end

#if RCT_NEW_ARCH_ENABLED
#pragma mark - View class exposure

Class<RCTComponentViewProtocol> RNSSafeAreaView(void)
{
  return RNSSafeAreaViewComponentView.class;
}
#endif // RCT_NEW_ARCH_ENABLED
