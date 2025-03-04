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
#import "RCTConvert+RNSScreenStackHeader.h"
#import "RNSConvert.h"
#import "RNSDefines.h"
#import "RNSScreen.h"
#import "RNSScreenStackHeaderConfig.h"
#import "RNSSearchBar.h"
#import "RNSUIBarButtonItem.h"

@implementation RCTConvert (RNSScreenStackHeader)

+ (NSMutableDictionary *)blurEffectsForIOSVersion
{
  NSMutableDictionary *blurEffects = [NSMutableDictionary new];
  [blurEffects addEntriesFromDictionary:@{
    @"none" : @(RNSBlurEffectStyleNone),
    @"extraLight" : @(RNSBlurEffectStyleExtraLight),
    @"light" : @(RNSBlurEffectStyleLight),
    @"dark" : @(RNSBlurEffectStyleDark),
  }];

  if (@available(iOS 10.0, *)) {
    [blurEffects addEntriesFromDictionary:@{
      @"regular" : @(RNSBlurEffectStyleRegular),
      @"prominent" : @(RNSBlurEffectStyleProminent),
    }];
  }
#if !TARGET_OS_TV && defined(__IPHONE_OS_VERSION_MAX_ALLOWED) && defined(__IPHONE_13_0) && \
    __IPHONE_OS_VERSION_MAX_ALLOWED >= __IPHONE_13_0
  if (@available(iOS 13.0, *)) {
    [blurEffects addEntriesFromDictionary:@{
      @"systemUltraThinMaterial" : @(RNSBlurEffectStyleSystemUltraThinMaterial),
      @"systemThinMaterial" : @(RNSBlurEffectStyleSystemThinMaterial),
      @"systemMaterial" : @(RNSBlurEffectStyleSystemMaterial),
      @"systemThickMaterial" : @(RNSBlurEffectStyleSystemThickMaterial),
      @"systemChromeMaterial" : @(RNSBlurEffectStyleSystemChromeMaterial),
      @"systemUltraThinMaterialLight" : @(RNSBlurEffectStyleSystemUltraThinMaterialLight),
      @"systemThinMaterialLight" : @(RNSBlurEffectStyleSystemThinMaterialLight),
      @"systemMaterialLight" : @(RNSBlurEffectStyleSystemMaterialLight),
      @"systemThickMaterialLight" : @(RNSBlurEffectStyleSystemThickMaterialLight),
      @"systemChromeMaterialLight" : @(RNSBlurEffectStyleSystemChromeMaterialLight),
      @"systemUltraThinMaterialDark" : @(RNSBlurEffectStyleSystemUltraThinMaterialDark),
      @"systemThinMaterialDark" : @(RNSBlurEffectStyleSystemThinMaterialDark),
      @"systemMaterialDark" : @(RNSBlurEffectStyleSystemMaterialDark),
      @"systemThickMaterialDark" : @(RNSBlurEffectStyleSystemThickMaterialDark),
      @"systemChromeMaterialDark" : @(RNSBlurEffectStyleSystemChromeMaterialDark),
    }];
  }
#endif
  return blurEffects;
}

RCT_ENUM_CONVERTER(
    UISemanticContentAttribute,
    (@{
      @"ltr" : @(UISemanticContentAttributeForceLeftToRight),
      @"rtl" : @(UISemanticContentAttributeForceRightToLeft),
    }),
    UISemanticContentAttributeUnspecified,
    integerValue)

RCT_ENUM_CONVERTER(
    UINavigationItemBackButtonDisplayMode,
    (@{
      @"default" : @(UINavigationItemBackButtonDisplayModeDefault),
      @"generic" : @(UINavigationItemBackButtonDisplayModeGeneric),
      @"minimal" : @(UINavigationItemBackButtonDisplayModeMinimal),
    }),
    UINavigationItemBackButtonDisplayModeDefault,
    integerValue)

RCT_ENUM_CONVERTER(RNSBlurEffectStyle, ([self blurEffectsForIOSVersion]), RNSBlurEffectStyleNone, integerValue)

@end
