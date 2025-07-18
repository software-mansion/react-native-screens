#import "RCTConvert+RNScreens.h"
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

@end
