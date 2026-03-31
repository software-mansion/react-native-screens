#import "RNSStackHeaderItemSpacerComponentView.h"
#import "RNSConversions-Stack.h"

#import <react/renderer/components/rnscreens/ComponentDescriptors.h>
#import <react/renderer/components/rnscreens/Props.h>
#import <react/renderer/components/rnscreens/RCTComponentViewHelpers.h>

namespace react = facebook::react;

@implementation RNSStackHeaderItemSpacerComponentView {
  react::RNSStackHeaderItemSpacerIOSPlacement _placement;
  BOOL _isFlexible;
  CGFloat _width;
}

// Needed because of this: https://github.com/facebook/react-native/pull/37274
+ (void)load
{
  [super load];
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
  _placement = react::RNSStackHeaderItemSpacerIOSPlacement::Right;
  _isFlexible = NO;
  _width = 0;
}

#pragma mark - Placement

- (RNSHeaderItemSpacerPlacement)placement
{
  return rnscreens::conversion::convert<RNSHeaderItemSpacerPlacement>(_placement);
}

#pragma mark - Bar Button Item

- (nonnull UIBarButtonItem *)makeBarButtonItem
{
  if (_isFlexible) {
    return [UIBarButtonItem flexibleSpaceItem];
  }

  return [UIBarButtonItem fixedSpaceItemOfWidth:_width];
}

#pragma mark - RCTComponentViewProtocol

- (void)updateProps:(const react::Props::Shared &)props oldProps:(const react::Props::Shared &)oldProps
{
  const auto &newSpacerProps = *std::static_pointer_cast<const react::RNSStackHeaderItemSpacerIOSProps>(props);
  const auto &oldSpacerProps = *std::static_pointer_cast<const react::RNSStackHeaderItemSpacerIOSProps>(_props);

  BOOL needsUpdate = NO;

  if (oldSpacerProps.placement != newSpacerProps.placement) {
    _placement = newSpacerProps.placement;
  }
  if (oldSpacerProps.size != newSpacerProps.size) {
    _isFlexible = newSpacerProps.size == react::RNSStackHeaderItemSpacerIOSSize::Flexible;
    needsUpdate = YES;
  }
  if (oldSpacerProps.width != newSpacerProps.width) {
    _width = newSpacerProps.width;
    RCTLogInfo(@"%f %f", _width, newSpacerProps.width);
    needsUpdate = YES;
  }

  [super updateProps:props oldProps:oldProps];

  if (needsUpdate) {
    [_invalidationDelegate headerItemDidInvalidate];
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

@end

Class<RCTComponentViewProtocol> RNSStackHeaderItemSpacerComponentViewCls(void)
{
  return RNSStackHeaderItemSpacerComponentView.class;
}
