#import "RNSModalScreen.h"

#ifdef RCT_NEW_ARCH_ENABLED
#import <React/RCTFabricComponentsPlugins.h>
#import <rnscreens/RNSModalScreenComponentDescriptor.h>
#endif

@implementation RNSModalScreen

// When using UIModalPresentationStyleFullScreen the views belonging to the presenting view controller are removed,
// Thus there is no RCTRootView mounted and no trait observer working.
// We have to set up an extra observer and send change notifications accoridngly
// For more information, see https://github.com/software-mansion/react-native-screens/pull/2211.
- (void)traitCollectionDidChange:(UITraitCollection *)previousTraitCollection
{
  [super traitCollectionDidChange:previousTraitCollection];
  if (RCTSharedApplication().applicationState == UIApplicationStateBackground ||
      (self.stackPresentation != RNSScreenStackPresentationFullScreenModal)) {
    return;
  }

  [[NSNotificationCenter defaultCenter]
      postNotificationName:RCTUserInterfaceStyleDidChangeNotification
                    object:self
                  userInfo:@{
                    RCTUserInterfaceStyleDidChangeNotificationTraitCollectionKey : self.traitCollection,
                  }];
}

#ifdef RCT_NEW_ARCH_ENABLED
+ (react::ComponentDescriptorProvider)componentDescriptorProvider
{
  return react::concreteComponentDescriptorProvider<react::RNSModalScreenComponentDescriptor>();
}
#endif
@end

#ifdef RCT_NEW_ARCH_ENABLED
Class<RCTComponentViewProtocol> RNSModalScreenCls(void)
{
  return RNSModalScreen.class;
}
#endif

@implementation RNSModalScreenManager

RCT_EXPORT_MODULE()

#ifdef RCT_NEW_ARCH_ENABLED
#else
- (UIView *)view
{
  return [[RNSModalScreen alloc] initWithBridge:self.bridge];
}
#endif // RCT_NEW_ARCH_ENABLED
@end
