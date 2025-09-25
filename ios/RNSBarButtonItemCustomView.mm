#import "RNSBarButtonItemCustomView.h"
#import "RNSDefines.h"
#ifdef RCT_NEW_ARCH_ENABLED
#import <React/RCTConversions.h>
#import <React/RCTFabricComponentsPlugins.h>
#import <react/renderer/components/rnscreens/ComponentDescriptors.h>
#import <react/renderer/components/rnscreens/EventEmitters.h>
#import <react/renderer/components/rnscreens/Props.h>
#import "RNSConvert.h"
#endif // RCT_NEW_ARCH_ENABLED

#ifdef RCT_NEW_ARCH_ENABLED
namespace react = facebook::react;
#endif // RCT_NEW_ARCH_ENABLED

@implementation RNSBarButtonItemCustomView {
  UIBarButtonItem *_barButtonItem;
  BOOL _hidesSharedBackground;
}

#ifdef RCT_NEW_ARCH_ENABLED
- (void)updateProps:(react::Props::Shared const &)props oldProps:(react::Props::Shared const &)oldProps
{
  const auto &newComponentProps = *std::static_pointer_cast<const react::RNSBarButtonItemCustomViewProps>(props);
  _hidesSharedBackground = newComponentProps.hidesSharedBackground;
  [self configureUIBarButtonItem];
  [super updateProps:props oldProps:oldProps];
}

+ (react::ComponentDescriptorProvider)componentDescriptorProvider
{
  return react::concreteComponentDescriptorProvider<react::RNSBarButtonItemCustomViewComponentDescriptor>();
}
#endif

- (void)setUIBarButtonItem:(UIBarButtonItem *)barButtonItem
{
  _barButtonItem = barButtonItem;
  [self configureUIBarButtonItem];
}

- (void)setHidesSharedBackground:(BOOL)hidesSharedBackground
{
  _hidesSharedBackground = hidesSharedBackground;
  [self configureUIBarButtonItem];
}

- (void)configureUIBarButtonItem
{
#if RNS_IPHONE_OS_VERSION_AVAILABLE(26_0)
  if (@available(iOS 26.0, *)) {
    if (_barButtonItem != nil) {
      dispatch_async(dispatch_get_main_queue(), ^{
        [self->_barButtonItem setHidesSharedBackground:self->_hidesSharedBackground];
      });
    }
  }
#endif
}
@end

@implementation RNSBarButtonItemCustomViewManager

RCT_EXPORT_MODULE()

#ifdef RCT_NEW_ARCH_ENABLED
#else
- (UIView *)view
{
  return [RNSBarButtonItemCustomView new];
}
#endif

RCT_EXPORT_VIEW_PROPERTY(hidesSharedBackground, BOOL)

@end
