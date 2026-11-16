#import "RNSStackAnimationMapper.h"
#import "RNSLog.h"
#import "RNSStackAnimationEasing.h"
#import "RNSStackAnimationLength.h"
#import "RNSStackAnimationPresetConfig.h"

static NSString *const kTypeKey = @"type";
static NSString *const kNameKey = @"name";
static NSString *const kTypePreset = @"preset";
static NSString *const kTypeCustom = @"custom";
static NSString *const kDurationKey = @"duration";
static NSString *const kEasingKey = @"easing";
static NSString *const kDistanceKey = @"distance";
static NSString *const kPercentSuffix = @"%";

@implementation RNSStackAnimationMapper

+ (id<RNSStackAnimationConfig>)animationConfigFromProp:(nullable id)value
{
  if (value == nil) {
    return RNSStackAnimationPresetConfig.defaultConfig;
  }
  RNSStackAnimationPresetConfig *preset = [self presetConfigFromValue:value];
  if (preset == nil) {
    return RNSStackAnimationPresetConfig.defaultConfig;
  }
  return preset;
}

+ (nullable RNSStackAnimationPresetConfig *)presetConfigFromValue:(id)value
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

+ (nullable RNSStackAnimationPresetConfig *)presetConfigFromName:(NSString *)string
{
  RNSStackAnimationPresetConfig *preset = [RNSStackAnimationPresetConfig configNamed:string];
  if (preset == nil) {
    return [self rejectWithReason:[NSString stringWithFormat:@"[RNScreens] Unknown animation preset: %@.", string]];
  }
  return preset;
}

+ (nullable RNSStackAnimationPresetConfig *)presetConfigFromDictionary:(NSDictionary *)map
{
  id nameValue = map[kNameKey];
  if (![nameValue isKindOfClass:NSString.class]) {
    return [self rejectWithReason:@"[RNScreens] name property must be a non-null string."];
  }
  RNSStackAnimationPresetConfig *namedPreset = [RNSStackAnimationPresetConfig configNamed:nameValue];
  if (namedPreset == nil) {
    return [self rejectWithReason:[NSString stringWithFormat:@"[RNScreens] Unknown animation preset: %@.", nameValue]];
  }
  RNSStackAnimationPresetName name = namedPreset.name;
  NSNumber *durationMs;
  RNSStackAnimationEasing *easing;
  RNSStackAnimationLength *distance;
  for (NSString *key in map) {
    if ([key isEqualToString:kTypeKey] || [key isEqualToString:kNameKey]) {
      continue;
    }
    RNSStackAnimationPresetOption option;
    if ([key isEqualToString:kDurationKey]) {
      option = RNSStackAnimationPresetOptionDuration;
    } else if ([key isEqualToString:kEasingKey]) {
      option = RNSStackAnimationPresetOptionEasing;
    } else if ([key isEqualToString:kDistanceKey]) {
      option = RNSStackAnimationPresetOptionDistance;
    } else {
      return
          [self rejectWithReason:[NSString stringWithFormat:@"[RNScreens] Unknown animation preset option: %@.", key]];
    }
    if (![RNSStackAnimationPresetConfig presetNamed:name acceptsOption:option]) {
      return [self rejectWithReason:[NSString stringWithFormat:@"[RNScreens] Option '%@' is not supported by animation "
                                                               @"preset '%@' as the whole animation.",
                                                               key,
                                                               [RNSStackAnimationPresetConfig stringFromName:name]]];
    }
    id value = map[key];
    switch (option) {
      case RNSStackAnimationPresetOptionDuration:
        if ((durationMs = [self durationFromValue:value]) == nil) {
          return nil;
        }
        break;
      case RNSStackAnimationPresetOptionEasing:
        if ((easing = [self easingFromValue:value]) == nil) {
          return nil;
        }
        break;
      case RNSStackAnimationPresetOptionDistance:
        if ((distance = [self distanceFromValue:value]) == nil) {
          return nil;
        }
        break;
    }
  }
  return [[RNSStackAnimationPresetConfig alloc]
      initWithName:name
           options:[[RNSStackAnimationPresetOptions alloc] initWithDurationMs:durationMs
                                                                       easing:easing
                                                                     distance:distance]];
}

+ (nullable NSNumber *)durationFromValue:(id)value
{
  double ms = [value isKindOfClass:NSNumber.class] ? [value doubleValue] : NAN;
  if (!isfinite(ms)) {
    return [self rejectWithReason:@"[RNScreens] duration must be a finite number of milliseconds."];
  }
  // `lround` is undefined past `NSIntegerMax`.
  NSInteger rounded = ms >= NSIntegerMax ? NSIntegerMax : lround(ms);
  if (rounded < 1) {
    return [self rejectWithReason:@"[RNScreens] duration must be at least 1 ms."];
  }
  return @(rounded);
}

+ (nullable RNSStackAnimationEasing *)easingFromValue:(id)value
{
  if ([value isKindOfClass:NSString.class]) {
    RNSStackAnimationEasing *easing = [RNSStackAnimationEasing easingNamed:value];
    if (easing == nil) {
      return [self rejectWithReason:[NSString stringWithFormat:@"[RNScreens] Unknown animation easing: %@.", value]];
    }
    return easing;
  }
  if (![value isKindOfClass:NSArray.class]) {
    return [self rejectWithReason:@"[RNScreens] easing must be a curve name or a bezier array."];
  }
  NSArray *array = value;
  BOOL isFourNumbers = array.count == 4;
  for (id element in array) {
    isFourNumbers = isFourNumbers && [element isKindOfClass:NSNumber.class];
  }
  if (!isFourNumbers) {
    return [self rejectWithReason:@"[RNScreens] A bezier easing must be an array of four numbers."];
  }
  CGFloat x1 = [array[0] doubleValue];
  CGFloat y1 = [array[1] doubleValue];
  CGFloat x2 = [array[2] doubleValue];
  CGFloat y2 = [array[3] doubleValue];
  if (!(x1 >= 0 && x1 <= 1 && x2 >= 0 && x2 <= 1)) {
    return [self rejectWithReason:@"[RNScreens] A bezier easing needs x1 and x2 in [0, 1]."];
  }
  if (!isfinite(y1) || !isfinite(y2)) {
    return [self rejectWithReason:@"[RNScreens] A bezier easing needs finite control points."];
  }
  return [RNSStackAnimationEasing bezierWithX1:x1 y1:y1 x2:x2 y2:y2];
}

+ (nullable RNSStackAnimationLength *)distanceFromValue:(id)value
{
  RNSStackAnimationLength *length = [self lengthFromValue:value];
  if (length == nil) {
    return
        [self rejectWithReason:@"[RNScreens] distance must be a number of points or a percentage string like '30%'."];
  }
  if (!isfinite(length.value)) {
    return [self rejectWithReason:@"[RNScreens] A length must be finite."];
  }
  if (length.value <= 0) {
    return [self rejectWithReason:@"[RNScreens] distance must be positive."];
  }
  return length;
}

// A number of points or a percentage string like `'-30%'`; nil for anything else.
+ (nullable RNSStackAnimationLength *)lengthFromValue:(id)value
{
  if ([value isKindOfClass:NSNumber.class]) {
    return [RNSStackAnimationLength points:[value doubleValue]];
  }
  if (![value isKindOfClass:NSString.class] || ![value hasSuffix:kPercentSuffix]) {
    return nil;
  }
  NSString *string = value;
  NSScanner *scanner = [NSScanner scannerWithString:[string substringToIndex:string.length - kPercentSuffix.length]];
  double percent;
  return [scanner scanDouble:&percent] && scanner.isAtEnd ? [RNSStackAnimationLength fraction:percent / 100] : nil;
}

+ (nullable id)rejectWithReason:(NSString *)reason
{
  RNSLogW(@"%@ Falling back to the default animation.", reason);
  return nil;
}

@end
