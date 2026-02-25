#import "RNSTabsBottomAccessoryContentComponentView.h"
#import "RNSConversions.h"
#import "RNSTabsBottomAccessoryComponentView.h"
#import "RNSTabsBottomAccessoryHelper.h"

#if RCT_NEW_ARCH_ENABLED
#import <react/renderer/components/rnscreens/ComponentDescriptors.h>
#endif // RCT_NEW_ARCH_ENABLED

namespace react = facebook::react;

#pragma mark - View implementation

@implementation RNSTabsBottomAccessoryContentComponentView {
#if RNS_TABS_BOTTOM_ACCESSORY_AVAILABLE && REACT_NATIVE_VERSION_MINOR >= 82
  RNSTabsBottomAccessoryComponentView *__weak _Nullable _accessoryView;
#endif // RNS_TABS_BOTTOM_ACCESSORY_AVAILABLE && REACT_NATIVE_VERSION_MINOR >= 82
}

- (instancetype)initWithFrame:(CGRect)frame
{
  self = [super initWithFrame:frame];
  return self;
}

#pragma mark - UIKit callbacks

#if RNS_TABS_BOTTOM_ACCESSORY_AVAILABLE && REACT_NATIVE_VERSION_MINOR >= 82

- (void)didMoveToWindow
{
  if ([self.superview isKindOfClass:[RNSTabsBottomAccessoryComponentView class]]) {
    RNSTabsBottomAccessoryComponentView *accessoryView =
        static_cast<RNSTabsBottomAccessoryComponentView *>(self.superview);
    _accessoryView = accessoryView;
    [_accessoryView.helper setContentView:(self.window != nil ? self : nil) forEnvironment:_environment];
  } else {
    [_accessoryView.helper setContentView:nil forEnvironment:_environment];
    _accessoryView = nil;
  }
}

// `RCTViewComponentView` uses this deprecated callback to invalidate layer when trait collection
// `hasDifferentColorAppearanceComparedToTraitCollection`. This updates opacity which breaks our
// content view switching workaround. To mitigate this, we update content view visibility after
// RCTViewComponentView handles the change. We need to use the same deprecated callback as it's
// called after callbacks registered via the new API.
- (void)traitCollectionDidChange:(UITraitCollection *)previousTraitCollection
{
  [super traitCollectionDidChange:previousTraitCollection];
  if ([self.traitCollection hasDifferentColorAppearanceComparedToTraitCollection:previousTraitCollection]) {
    [_accessoryView.helper handleContentViewVisibilityForEnvironmentIfNeeded];
  }
}

#endif // RNS_TABS_BOTTOM_ACCESSORY_AVAILABLE && REACT_NATIVE_VERSION_MINOR >= 82

#if RCT_NEW_ARCH_ENABLED

#pragma mark - RCTViewComponentViewProtocol

#if RNS_TABS_BOTTOM_ACCESSORY_AVAILABLE

#if REACT_NATIVE_VERSION_MINOR >= 82

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

- (void)finalizeUpdates:(RNComponentViewUpdateMask)updateMask
{
  [super finalizeUpdates:updateMask];

  // In finalize updates, `invalidateLayer` is called. It resets `view.layer.opacity`
  // which we use to switch visible bottom accessory content view. In order to mitigate
  // this, we update visibility after `[super finalizeUpdates:updateMask]`. Without this,
  // both content views are visible on first render. It does not happen on subsequent
  // renders because `updateState` is called before trait changes but there might be other
  // cases when `finalizeUpdates` will run so to make sure that we maintain correct
  // visibility, we call `handleContentViewVisibilityForEnvironmentIfNeeded` here.
  [_accessoryView.helper handleContentViewVisibilityForEnvironmentIfNeeded];
}

#endif // REACT_NATIVE_VERSION_MINOR >= 82

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

#endif // RCT_NEW_ARCH_ENABLED

@end

#if RCT_NEW_ARCH_ENABLED
#pragma mark - View class exposure

Class<RCTComponentViewProtocol> RNSTabsBottomAccessoryContentCls(void)
{
  return RNSTabsBottomAccessoryContentComponentView.class;
}

#endif // RCT_NEW_ARCH_ENABLED
