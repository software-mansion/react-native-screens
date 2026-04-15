#import "RNSModalScreen.h"

#import <React/RCTFabricComponentsPlugins.h>
#import <rnscreens/RNSModalScreenComponentDescriptor.h>

@implementation RNSModalScreen

// When using UIModalPresentationStyleFullScreen the whole view hierarchy mounted under primary `UITransitionView` is
// removed, including React's root view, which observes for trait collection changes & sends it to `Appearance` module
// via system notification centre. To workaround this detached-root-view-situation we emit the event to React's
// `Appearance` module ourselves. For the RCTRootView observer, visit
// https://github.com/facebook/react-native/blob/d3e0430deac573fd44792e6005d5de20e9ad2797/packages/react-native/React/Base/RCTRootView.m#L362
// For more information, see https://github.com/software-mansion/react-native-screens/pull/2211.
- (void)traitCollectionDidChange:(UITraitCollection *)previousTraitCollection
{
  [super traitCollectionDidChange:previousTraitCollection];
  if (RCTSharedApplication().applicationState == UIApplicationStateBackground ||
      self.stackPresentation != RNSScreenStackPresentationFullScreenModal) {
    return;
  }

  [[NSNotificationCenter defaultCenter]
      postNotificationName:RCTUserInterfaceStyleDidChangeNotification
                    object:self
                  userInfo:@{
                    RCTUserInterfaceStyleDidChangeNotificationTraitCollectionKey : self.traitCollection,
                  }];
}

+ (react::ComponentDescriptorProvider)componentDescriptorProvider
{
  return react::concreteComponentDescriptorProvider<react::RNSModalScreenComponentDescriptor>();
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

Class<RCTComponentViewProtocol> RNSModalScreenCls(void)
{
  return RNSModalScreen.class;
}

@implementation RNSModalScreenManager

RCT_EXPORT_MODULE()

@end
