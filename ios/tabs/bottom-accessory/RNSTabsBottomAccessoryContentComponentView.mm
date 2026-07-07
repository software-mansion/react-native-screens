#import "RNSTabsBottomAccessoryContentComponentView.h"
#import "RNSConversions.h"
#import "RNSTabsBottomAccessoryComponentView.h"
#import "RNSTabsBottomAccessoryHelper.h"

#import <react/renderer/components/rnscreens/ComponentDescriptors.h>

namespace react = facebook::react;

#pragma mark - View implementation

@implementation RNSTabsBottomAccessoryContentComponentView {
#if RNS_TABS_BOTTOM_ACCESSORY_AVAILABLE
  RNSTabsBottomAccessoryComponentView *__weak _Nullable _accessoryView;
#endif // RNS_TABS_BOTTOM_ACCESSORY_AVAILABLE
}

- (instancetype)initWithFrame:(CGRect)frame
{
  self = [super initWithFrame:frame];
  return self;
}

#pragma mark - UIKit callbacks

#if RNS_TABS_BOTTOM_ACCESSORY_AVAILABLE

- (void)didMoveToWindow
{
  if (self.window != nil && [self.superview isKindOfClass:[RNSTabsBottomAccessoryComponentView class]]) {
    RNSTabsBottomAccessoryComponentView *accessoryView =
        static_cast<RNSTabsBottomAccessoryComponentView *>(self.superview);
    _accessoryView = accessoryView;
    [_accessoryView.helper setContentView:self forEnvironment:_environment];
  } else {
    // We are leaving the accessory. Detach from the helper so it removes its `hidden` KVO observer while we are still
    // alive. Must run on the `window == nil` path too (Fabric unmount removes from superview, then deallocates).
    [_accessoryView.helper setContentView:nil forEnvironment:_environment];
    _accessoryView = nil;
  }
}

#endif // RNS_TABS_BOTTOM_ACCESSORY_AVAILABLE

#pragma mark - RCTViewComponentViewProtocol

#if RNS_TABS_BOTTOM_ACCESSORY_AVAILABLE

- (void)updateProps:(const facebook::react::Props::Shared &)props
           oldProps:(const facebook::react::Props::Shared &)oldProps
{
  const auto &oldComponentProps = *std::static_pointer_cast<const react::RNSTabsBottomAccessoryContentProps>(_props);
  const auto &newComponentProps = *std::static_pointer_cast<const react::RNSTabsBottomAccessoryContentProps>(props);

  if (newComponentProps.environment != oldComponentProps.environment) {
    _environment =
        rnscreens::conversion::RNSTabsBottomAccessoryEnvironmentFromCppEquivalent(newComponentProps.environment);
  }

  [super updateProps:props oldProps:oldProps];
}

+ (react::ComponentDescriptorProvider)componentDescriptorProvider
{
  return react::concreteComponentDescriptorProvider<react::RNSTabsBottomAccessoryContentComponentDescriptor>();
}

#endif // RNS_TABS_BOTTOM_ACCESSORY_AVAILABLE

+ (BOOL)shouldBeRecycled
{
  // There won't be tens of instances of this component usually & it's easier for now.
  // We could consider enabling it someday though.
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

#pragma mark - View class exposure

Class<RCTComponentViewProtocol> RNSTabsBottomAccessoryContentCls(void)
{
  return RNSTabsBottomAccessoryContentComponentView.class;
}
