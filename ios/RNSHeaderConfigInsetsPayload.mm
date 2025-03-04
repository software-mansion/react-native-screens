#ifdef RCT_NEW_ARCH_ENABLED
#import <React/RCTConversions.h>
#import <React/RCTFabricComponentsPlugins.h>
#import <React/RCTImageComponentView.h>
#import <React/RCTMountingTransactionObserving.h>
#import <React/UIView+React.h>
#import <react/renderer/components/image/ImageProps.h>
#import <react/renderer/components/rnscreens/ComponentDescriptors.h>
#import <react/renderer/components/rnscreens/EventEmitters.h>
#import <react/renderer/components/rnscreens/Props.h>
#import <react/renderer/components/rnscreens/RCTComponentViewHelpers.h>
#import <rnscreens/RNSScreenStackHeaderConfigComponentDescriptor.h>
#import "RCTImageComponentView+RNSScreenStackHeaderConfig.h"
#ifndef NDEBUG
#import <react/utils/ManagedObjectWrapper.h>
#endif // !NDEBUG
#else
#import <React/RCTImageView.h>
#import <React/RCTShadowView.h>
#import <React/RCTUIManager.h>
#import <React/RCTUIManagerUtils.h>
#endif
#import <React/RCTBridge.h>
#import <React/RCTFont.h>
#import <React/RCTImageLoader.h>
#import <React/RCTImageSource.h>
#import "RNSConvert.h"
#import "RNSDefines.h"
#import "RNSScreen.h"
#import "RNSScreenStackHeaderConfig.h"
#import "RNSSearchBar.h"
#import "RNSUIBarButtonItem.h"

#ifdef RCT_NEW_ARCH_ENABLED
#else

@implementation RNSHeaderConfigInsetsPayload

- (instancetype)init
{
  return [self initWithInsets:NSDirectionalEdgeInsets{}];
}

- (instancetype)initWithInsets:(NSDirectionalEdgeInsets)insets
{
  if (self = [super init]) {
    self.insets = insets;
  }
  return self;
}

@end
#endif
