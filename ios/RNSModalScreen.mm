#import "RNSModalScreen.h"

#ifdef RCT_NEW_ARCH_ENABLED
#import <React/RCTFabricComponentsPlugins.h>
#import <rnscreens/RNSModalScreenComponentDescriptor.h>
#endif

@implementation RNSModalScreen

- (void)traitCollectionDidChange:(UITraitCollection *)previousTraitCollection
{
  [super traitCollectionDidChange:previousTraitCollection];

  // Describe following facts:
  // 1. With full screen modal react root view is mounted in the initial view hierarchy
  // 2. Thus the trait observation in react root view does not work anymore
  // 3. we need to send theme-chanages notification our selves
  // Describe this in-depth in PR and paste link here
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
