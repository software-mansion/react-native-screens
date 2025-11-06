#import "RNSBottomTabsAccessoryContentComponentView.h"
#import "RNSBottomAccessoryHelper.h"
#import "RNSBottomTabsAccessoryComponentView.h"
#import "RNSConversions.h"

#if RCT_NEW_ARCH_ENABLED
#import <react/renderer/components/rnscreens/ComponentDescriptors.h>
#endif // RCT_NEW_ARCH_ENABLED

namespace react = facebook::react;

#pragma mark - View implementation

@implementation RNSBottomTabsAccessoryContentComponentView {
#if RNS_IPHONE_OS_VERSION_AVAILABLE(26_0) && !TARGET_OS_TV && !TARGET_OS_VISION && RCT_NEW_ARCH_ENABLED && \
    REACT_NATIVE_VERSION_MINOR >= 82
  RNSBottomTabsAccessoryComponentView *__weak _Nullable _accessoryView;
#endif // RNS_IPHONE_OS_VERSION_AVAILABLE(26_0) && !TARGET_OS_TV && !TARGET_OS_VISION \
          && RCT_NEW_ARCH_ENABLED && REACT_NATIVE_VERSION_MINOR >= 82
}

- (instancetype)initWithFrame:(CGRect)frame
{
  self = [super initWithFrame:frame];
  return self;
}

#pragma mark - UIKit callbacks

#if RNS_IPHONE_OS_VERSION_AVAILABLE(26_0) && !TARGET_OS_TV && !TARGET_OS_VISION && RCT_NEW_ARCH_ENABLED && \
    REACT_NATIVE_VERSION_MINOR >= 82

- (void)didMoveToWindow
{
  if ([self.superview isKindOfClass:[RNSBottomTabsAccessoryComponentView class]]) {
    RNSBottomTabsAccessoryComponentView *accessoryView =
        static_cast<RNSBottomTabsAccessoryComponentView *>(self.superview);
    _accessoryView = accessoryView;
    [_accessoryView.helper setContentView:(self.window != nil ? self : nil) forEnvironment:_environment];
  } else {
    [_accessoryView.helper setContentView:nil forEnvironment:_environment];
    _accessoryView = nil;
  }
}

#endif // RNS_IPHONE_OS_VERSION_AVAILABLE(26_0) && !TARGET_OS_TV && !TARGET_OS_VISION && RCT_NEW_ARCH_ENABLED && \
          REACT_NATIVE_VERSION_MINOR >= 82

#if RCT_NEW_ARCH_ENABLED

#pragma mark - RCTViewComponentViewProtocol

#if RNS_IPHONE_OS_VERSION_AVAILABLE(26_0) && !TARGET_OS_TV && !TARGET_OS_VISION

#if REACT_NATIVE_VERSION_MINOR >= 82

- (void)updateProps:(const facebook::react::Props::Shared &)props
           oldProps:(const facebook::react::Props::Shared &)oldProps
{
  const auto &oldComponentProps = *std::static_pointer_cast<const react::RNSBottomTabsAccessoryContentProps>(_props);
  const auto &newComponentProps = *std::static_pointer_cast<const react::RNSBottomTabsAccessoryContentProps>(props);

  if (newComponentProps.environment != oldComponentProps.environment) {
    _environment =
        rnscreens::conversion::RNSBottomTabsAccessoryEnvironmentFromCppEquivalent(newComponentProps.environment);
  }

  [super updateProps:props oldProps:oldProps];
}

- (void)finalizeUpdates:(RNComponentViewUpdateMask)updateMask
{
  [super finalizeUpdates:updateMask];
  [_accessoryView.helper handleContentViewVisibilityForEnvironmentIfNeeded];
}

#endif // REACT_NATIVE_VERSION_MINOR >= 82

+ (react::ComponentDescriptorProvider)componentDescriptorProvider
{
  return react::concreteComponentDescriptorProvider<react::RNSBottomTabsAccessoryContentComponentDescriptor>();
}

#endif // RNS_IPHONE_OS_VERSION_AVAILABLE(26_0) && !TARGET_OS_TV && !TARGET_OS_VISION

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

Class<RCTComponentViewProtocol> RNSBottomTabsAccessoryContentCls(void)
{
  return RNSBottomTabsAccessoryContentComponentView.class;
}

#endif // RCT_NEW_ARCH_ENABLED
