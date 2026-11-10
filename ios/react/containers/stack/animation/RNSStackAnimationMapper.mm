#import "RNSStackAnimationMapper.h"
#import "RNSLog.h"
#import "RNSStackPresetConfig.h"
#import "RNSStackPresets.h"

static NSString *const kTypeKey = @"type";
static NSString *const kNameKey = @"name";
static NSString *const kTypePreset = @"preset";
static NSString *const kTypeCustom = @"custom";

@implementation RNSStackAnimationMapper

+ (id<RNSStackAnimationConfig>)animationConfigFromProp:(nullable id)value
{
  if (value == nil) {
    return RNSStackPresetConfig.defaultConfig;
  }
  RNSStackPresetConfig *preset = [self presetConfigFromValue:value];
  if (preset == nil) {
    return RNSStackPresetConfig.defaultConfig;
  }
  if (preset.name != RNSStackPresetNameDefault &&
      [RNSStackPresets transitionTimelineForConfig:preset kind:RNSStackTransitionKindPush] == nil) {
    RNSLogW(@"[RNScreens] Animation preset '%@' is not supported on iOS. UIKit's default transition plays instead.",
            RNSStackPresetNameToString(preset.name));
  }
  return preset;
}

+ (nullable RNSStackPresetConfig *)presetConfigFromValue:(id)value
{
  if ([value isKindOfClass:NSString.class]) {
    return [self presetConfigFromName:value];
  }
  if (![value isKindOfClass:NSDictionary.class]) {
    return [self rejectWithReason:@"[RNScreens] An animation must be a preset name or an object."];
  }
  NSDictionary *map = value;
  id type = map[kTypeKey];
  if (![type isKindOfClass:NSString.class]) {
    return [self rejectWithReason:@"[RNScreens] type property must be a non-null string."];
  }
  if ([type isEqualToString:kTypePreset]) {
    return [self presetConfigFromDictionary:map];
  }
  if ([type isEqualToString:kTypeCustom]) {
    return [self rejectWithReason:@"[RNScreens] Custom animations are not supported on iOS."];
  }
  return [self rejectWithReason:[NSString stringWithFormat:@"[RNScreens] Unknown animation type: %@.", type]];
}

+ (nullable RNSStackPresetConfig *)presetConfigFromName:(NSString *)string
{
  RNSStackPresetName name;
  if (!RNSStackPresetNameFromString(string, &name)) {
    return [self rejectWithReason:[NSString stringWithFormat:@"[RNScreens] Unknown animation preset: %@.", string]];
  }
  return [[RNSStackPresetConfig alloc] initWithName:name];
}

+ (nullable RNSStackPresetConfig *)presetConfigFromDictionary:(NSDictionary *)map
{
  id name = map[kNameKey];
  if (![name isKindOfClass:NSString.class]) {
    return [self rejectWithReason:@"[RNScreens] name property must be a non-null string."];
  }
  RNSStackPresetConfig *preset = [self presetConfigFromName:name];
  if (preset == nil) {
    return nil;
  }

  NSMutableArray<NSString *> *options = [NSMutableArray array];
  for (NSString *key in map) {
    if ([key isEqualToString:kTypeKey] || [key isEqualToString:kNameKey]) {
      continue;
    }
    if (![@[ @"duration", @"easing", @"distance" ] containsObject:key]) {
      return
          [self rejectWithReason:[NSString stringWithFormat:@"[RNScreens] Unknown animation preset option: %@.", key]];
    }
    [options addObject:key];
  }
  // Options of the other presets are accepted and ignored: those presets play `default`.
  if (options.count > 0 && (preset.name == RNSStackPresetNameDefault || preset.name == RNSStackPresetNameNone)) {
    return [self rejectWithReason:[NSString stringWithFormat:@"[RNScreens] Option '%@' is not supported by animation "
                                                             @"preset '%@' as the whole animation.",
                                                             options.firstObject,
                                                             RNSStackPresetNameToString(preset.name)]];
  }
  return preset;
}

+ (nullable id)rejectWithReason:(NSString *)reason
{
  RNSLogW(@"%@ Falling back to the default animation.", reason);
  return nil;
}

@end
