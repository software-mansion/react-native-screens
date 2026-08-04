#import "RNSStackHeaderItemSpacerComponentView.h"
#import "RNSConversions-Stack.h"

#import <React/RCTLog.h>
#import <react/renderer/components/rnscreens/ComponentDescriptors.h>
#import <react/renderer/components/rnscreens/Props.h>
#import <react/renderer/components/rnscreens/RCTComponentViewHelpers.h>

namespace react = facebook::react;

@implementation RNSStackHeaderItemSpacerComponentView {
  BOOL _didSetHeaderItemSpacerPlacement;
}

- (instancetype)initWithFrame:(CGRect)frame
{
  if (self = [super initWithFrame:frame]) {
    static const auto defaultProps = std::make_shared<const react::RNSStackHeaderItemSpacerIOSProps>();
    _props = defaultProps;
    [self resetProps];
  }
  return self;
}

- (void)resetProps
{
  _placement = RNSHeaderItemSpacerPlacementTrailing;
  _didSetHeaderItemSpacerPlacement = NO;
  _isFlexible = YES;
  _width = 0;
}

#pragma mark - RCTComponentViewProtocol

- (void)updateProps:(const react::Props::Shared &)props oldProps:(const react::Props::Shared &)oldProps
{
  const auto &newSpacerProps = *std::static_pointer_cast<const react::RNSStackHeaderItemSpacerIOSProps>(props);
  const auto &oldSpacerProps = *std::static_pointer_cast<const react::RNSStackHeaderItemSpacerIOSProps>(_props);

  BOOL needsUpdate = NO;

  if (oldSpacerProps.placement != newSpacerProps.placement) {
    if (_didSetHeaderItemSpacerPlacement) {
      RCTLogWarn(@"[RNScreens] Changing header item spacer placement at runtime is not supported");
    } else {
      _placement = rnscreens::conversion::convert<RNSHeaderItemSpacerPlacement>(newSpacerProps.placement);
    }
  }
  _didSetHeaderItemSpacerPlacement = YES;

  if (oldSpacerProps.sizing != newSpacerProps.sizing) {
    _isFlexible = newSpacerProps.sizing == react::RNSStackHeaderItemSpacerIOSSizing::Flexible;
    needsUpdate = YES;
  }

  if (oldSpacerProps.width != newSpacerProps.width) {
    _width = newSpacerProps.width;
    needsUpdate = YES;
  }

  [super updateProps:props oldProps:oldProps];

  if (needsUpdate) {
    [_invalidationDelegate headerItemSpacerDidInvalidate];
  }
}

+ (react::ComponentDescriptorProvider)componentDescriptorProvider
{
  return react::concreteComponentDescriptorProvider<react::RNSStackHeaderItemSpacerIOSComponentDescriptor>();
}

+ (BOOL)shouldBeRecycled
{
  return NO;
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

Class<RCTComponentViewProtocol> RNSStackHeaderItemSpacerComponentViewCls(void)
{
  return RNSStackHeaderItemSpacerComponentView.class;
}
