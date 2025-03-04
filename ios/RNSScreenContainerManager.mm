#import "RNSScreenContainerManager.h"
#import "RNSDefines.h"
#import "RNSScreen.h"
#import "RNSScreenContainer.h"
#import "RNSScreenView.h"

#ifdef RCT_NEW_ARCH_ENABLED
#import <React/RCTConversions.h>
#import <React/RCTFabricComponentsPlugins.h>
#import <react/renderer/components/rnscreens/ComponentDescriptors.h>
#import <react/renderer/components/rnscreens/Props.h>

namespace react = facebook::react;

#endif // RCT_NEW_ARCH_ENABLED

@implementation RNSScreenContainerManager

RCT_EXPORT_MODULE()

- (UIView *)view
{
  return [[RNSScreenContainerView alloc] init];
}

@end
