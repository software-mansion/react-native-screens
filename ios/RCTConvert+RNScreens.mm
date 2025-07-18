#import "RCTConvert+RNScreens.h"

#if !RCT_NEW_ARCH_ENABLED

#import "RNSEnums.h"

@implementation RCTConvert (RNScreens)

+ (NSMutableDictionary *)blurEffectsForIOSVersion
{
  NSMutableDictionary *blurEffects = [NSMutableDictionary new];
  [blurEffects addEntriesFromDictionary:@{
    @"none" : @(RNSBlurEffectStyleNone),
    @"extraLight" : @(RNSBlurEffectStyleExtraLight),
    @"light" : @(RNSBlurEffectStyleLight),
    @"dark" : @(RNSBlurEffectStyleDark),
    @"regular" : @(RNSBlurEffectStyleRegular),
    @"prominent" : @(RNSBlurEffectStyleProminent),
  }];

#if !TARGET_OS_TV
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
#endif
  return blurEffects;
}

RCT_ENUM_CONVERTER(RNSBlurEffectStyle, ([self blurEffectsForIOSVersion]), RNSBlurEffectStyleNone, integerValue)

+ (NSMutableDictionary *)extendedBlurEffectsForIOSVersion
{
  NSMutableDictionary *blurEffects = [NSMutableDictionary new];
  [blurEffects addEntriesFromDictionary:@{
    @"none" : @(RNSExtendedBlurEffectStyleNone),
    @"default" : @(RNSExtendedBlurEffectStyleDefault),
    @"extraLight" : @(RNSExtendedBlurEffectStyleExtraLight),
    @"light" : @(RNSExtendedBlurEffectStyleLight),
    @"dark" : @(RNSExtendedBlurEffectStyleDark),
    @"regular" : @(RNSExtendedBlurEffectStyleRegular),
    @"prominent" : @(RNSExtendedBlurEffectStyleProminent),
  }];

#if !TARGET_OS_TV
  [blurEffects addEntriesFromDictionary:@{
    @"systemUltraThinMaterial" : @(RNSExtendedBlurEffectStyleSystemUltraThinMaterial),
    @"systemThinMaterial" : @(RNSExtendedBlurEffectStyleSystemThinMaterial),
    @"systemMaterial" : @(RNSExtendedBlurEffectStyleSystemMaterial),
    @"systemThickMaterial" : @(RNSExtendedBlurEffectStyleSystemThickMaterial),
    @"systemChromeMaterial" : @(RNSExtendedBlurEffectStyleSystemChromeMaterial),
    @"systemUltraThinMaterialLight" : @(RNSExtendedBlurEffectStyleSystemUltraThinMaterialLight),
    @"systemThinMaterialLight" : @(RNSExtendedBlurEffectStyleSystemThinMaterialLight),
    @"systemMaterialLight" : @(RNSExtendedBlurEffectStyleSystemMaterialLight),
    @"systemThickMaterialLight" : @(RNSExtendedBlurEffectStyleSystemThickMaterialLight),
    @"systemChromeMaterialLight" : @(RNSExtendedBlurEffectStyleSystemChromeMaterialLight),
    @"systemUltraThinMaterialDark" : @(RNSExtendedBlurEffectStyleSystemUltraThinMaterialDark),
    @"systemThinMaterialDark" : @(RNSExtendedBlurEffectStyleSystemThinMaterialDark),
    @"systemMaterialDark" : @(RNSExtendedBlurEffectStyleSystemMaterialDark),
    @"systemThickMaterialDark" : @(RNSExtendedBlurEffectStyleSystemThickMaterialDark),
    @"systemChromeMaterialDark" : @(RNSExtendedBlurEffectStyleSystemChromeMaterialDark),
  }];
#endif
  return blurEffects;
}

RCT_ENUM_CONVERTER(
    RNSExtendedBlurEffectStyle,
    ([self extendedBlurEffectsForIOSVersion]),
    RNSExtendedBlurEffectStyleDefault,
    integerValue)

@end

#endif // !RCT_NEW_ARCH_ENABLED
