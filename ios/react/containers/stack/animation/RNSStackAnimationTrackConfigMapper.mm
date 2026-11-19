#import "RNSStackAnimationTrackConfigMapper.h"
#import "RNSLog.h"
#import "RNSStackAnimationCustomMotionConfig.h"
#import "RNSStackAnimationLength.h"
#import "RNSStackAnimationMapper.h"
#import "RNSStackAnimationTrackConfig.h"

#import <React/RCTConvert.h>

static NSString *const kTypeKey = @"type";
static NSString *const kTranslateXKey = @"translateX";
static NSString *const kTranslateYKey = @"translateY";
static NSString *const kOpacityKey = @"opacity";
static NSString *const kScaleKey = @"scale";
static NSString *const kScaleXKey = @"scaleX";
static NSString *const kScaleYKey = @"scaleY";
static NSString *const kRotateKey = @"rotate";
static NSString *const kDimKey = @"dim";
static NSString *const kFromKey = @"from";
static NSString *const kToKey = @"to";
static NSString *const kDurationKey = @"duration";
static NSString *const kDelayKey = @"delay";
static NSString *const kEasingKey = @"easing";
static NSString *const kColorKey = @"color";

// Every reader below returns nil both for an omitted value and after a warning, so each caller tells the two apart by
// the raw value. The Fabric conversion drops `null` values, so a `null` track or endpoint reads as omitted.
@implementation RNSStackAnimationTrackConfigMapper

+ (nullable RNSStackAnimationCustomMotionConfig *)customMotionConfigFromDictionary:(NSDictionary *)map
{
  if (![RNSStackAnimationMapper dictionary:map
                               hasOnlyKeys:@[
                                 kTypeKey,
                                 kTranslateXKey,
                                 kTranslateYKey,
                                 kOpacityKey,
                                 kScaleKey,
                                 kScaleXKey,
                                 kScaleYKey,
                                 kRotateKey,
                                 kDimKey
                               ]]) {
    return nil;
  }
  RNSStackAnimationTranslateTrackConfig *translateX = [self translateTrackForKey:kTranslateXKey in:map];
  if (translateX == nil && map[kTranslateXKey] != nil) {
    return nil;
  }
  RNSStackAnimationTranslateTrackConfig *translateY = [self translateTrackForKey:kTranslateYKey in:map];
  if (translateY == nil && map[kTranslateYKey] != nil) {
    return nil;
  }
  RNSStackAnimationScalarTrackConfig *opacity = [self scalarTrackForKey:kOpacityKey in:map isUnitRange:YES];
  if (opacity == nil && map[kOpacityKey] != nil) {
    return nil;
  }
  RNSStackAnimationScalarTrackConfig *scale = [self scalarTrackForKey:kScaleKey in:map isUnitRange:NO];
  if (scale == nil && map[kScaleKey] != nil) {
    return nil;
  }
  RNSStackAnimationScalarTrackConfig *scaleX = [self scalarTrackForKey:kScaleXKey in:map isUnitRange:NO];
  if (scaleX == nil && map[kScaleXKey] != nil) {
    return nil;
  }
  RNSStackAnimationScalarTrackConfig *scaleY = [self scalarTrackForKey:kScaleYKey in:map isUnitRange:NO];
  if (scaleY == nil && map[kScaleYKey] != nil) {
    return nil;
  }
  RNSStackAnimationScalarTrackConfig *rotate = [self scalarTrackForKey:kRotateKey in:map isUnitRange:NO];
  if (rotate == nil && map[kRotateKey] != nil) {
    return nil;
  }
  RNSStackAnimationDimTrackConfig *dim = [self dimTrackForKey:kDimKey in:map];
  if (dim == nil && map[kDimKey] != nil) {
    return nil;
  }
  return [[RNSStackAnimationCustomMotionConfig alloc] initWithTranslateX:translateX
                                                              translateY:translateY
                                                                 opacity:opacity
                                                                   scale:scale
                                                                  scaleX:scaleX
                                                                  scaleY:scaleY
                                                                  rotate:rotate
                                                                     dim:dim];
}

+ (nullable RNSStackAnimationTranslateTrackConfig *)translateTrackForKey:(NSString *)key in:(NSDictionary *)map
{
  NSDictionary *track = [self trackForKey:key
                                       in:map
                              allowedKeys:@[ kFromKey, kToKey, kDurationKey, kDelayKey, kEasingKey ]];
  RNSStackAnimationTrackTimingConfig *timing = track == nil ? nil : [self timingFromTrack:track];
  if (timing == nil) {
    return nil;
  }
  id fromValue = track[kFromKey];
  RNSStackAnimationLength *from = fromValue == nil ? nil : [self lengthEndpointFromValue:fromValue];
  if (from == nil && fromValue != nil) {
    return nil;
  }
  id toValue = track[kToKey];
  RNSStackAnimationLength *to = toValue == nil ? nil : [self lengthEndpointFromValue:toValue];
  if (to == nil && toValue != nil) {
    return nil;
  }
  return [[RNSStackAnimationTranslateTrackConfig alloc] initWithFrom:from to:to timing:timing];
}

+ (nullable RNSStackAnimationScalarTrackConfig *)scalarTrackForKey:(NSString *)key
                                                                in:(NSDictionary *)map
                                                       isUnitRange:(BOOL)isUnitRange
{
  NSDictionary *track = [self trackForKey:key
                                       in:map
                              allowedKeys:@[ kFromKey, kToKey, kDurationKey, kDelayKey, kEasingKey ]];
  RNSStackAnimationTrackTimingConfig *timing = track == nil ? nil : [self timingFromTrack:track];
  if (timing == nil) {
    return nil;
  }
  id fromValue = track[kFromKey];
  NSNumber *from = fromValue == nil ? nil : [self scalarEndpointFromValue:fromValue isUnitRange:isUnitRange];
  if (from == nil && fromValue != nil) {
    return nil;
  }
  id toValue = track[kToKey];
  NSNumber *to = toValue == nil ? nil : [self scalarEndpointFromValue:toValue isUnitRange:isUnitRange];
  if (to == nil && toValue != nil) {
    return nil;
  }
  return [[RNSStackAnimationScalarTrackConfig alloc] initWithFrom:from to:to timing:timing];
}

+ (nullable RNSStackAnimationDimTrackConfig *)dimTrackForKey:(NSString *)key in:(NSDictionary *)map
{
  NSDictionary *track = [self trackForKey:key
                                       in:map
                              allowedKeys:@[ kFromKey, kToKey, kDurationKey, kDelayKey, kEasingKey, kColorKey ]];
  RNSStackAnimationTrackTimingConfig *timing = track == nil ? nil : [self timingFromTrack:track];
  if (timing == nil) {
    return nil;
  }
  id fromValue = track[kFromKey];
  NSNumber *from = fromValue == nil ? nil : [self scalarEndpointFromValue:fromValue isUnitRange:YES];
  if (from == nil && fromValue != nil) {
    return nil;
  }
  id toValue = track[kToKey];
  NSNumber *to = toValue == nil ? nil : [self scalarEndpointFromValue:toValue isUnitRange:YES];
  if (to == nil && toValue != nil) {
    return nil;
  }
  return [[RNSStackAnimationDimTrackConfig alloc] initWithColor:[self colorFromValue:track[kColorKey]]
                                                           from:from
                                                             to:to
                                                         timing:timing];
}

+ (nullable NSDictionary *)trackForKey:(NSString *)key in:(NSDictionary *)map allowedKeys:(NSArray<NSString *> *)allowed
{
  id value = map[key];
  if (value == nil) {
    return nil;
  }
  if (![value isKindOfClass:NSDictionary.class]) {
    return [RNSStackAnimationMapper
        rejectWithReason:[NSString stringWithFormat:@"[RNScreens] %@ must be a track object.", key]];
  }
  return [RNSStackAnimationMapper dictionary:value hasOnlyKeys:allowed] ? value : nil;
}

+ (nullable RNSStackAnimationTrackTimingConfig *)timingFromTrack:(NSDictionary *)track
{
  id durationValue = track[kDurationKey];
  if (durationValue == nil) {
    return [RNSStackAnimationMapper rejectWithReason:@"[RNScreens] A track needs a duration."];
  }
  NSNumber *durationMs = [RNSStackAnimationMapper durationFromValue:durationValue];
  if (durationMs == nil) {
    return nil;
  }
  id delayValue = track[kDelayKey];
  NSNumber *delayMs = delayValue == nil ? @0 : [self delayFromValue:delayValue];
  if (delayMs == nil) {
    return nil;
  }
  id easingValue = track[kEasingKey];
  RNSStackAnimationEasing *easing = easingValue == nil ? nil : [RNSStackAnimationMapper easingFromValue:easingValue];
  if (easing == nil && easingValue != nil) {
    return nil;
  }
  return [[RNSStackAnimationTrackTimingConfig alloc] initWithDurationMs:durationMs.integerValue
                                                                delayMs:delayMs.integerValue
                                                                 easing:easing];
}

+ (nullable NSNumber *)delayFromValue:(id)value
{
  double ms = [value isKindOfClass:NSNumber.class] ? [value doubleValue] : NAN;
  if (!isfinite(ms)) {
    return [RNSStackAnimationMapper rejectWithReason:@"[RNScreens] delay must be a finite number of milliseconds."];
  }
  // `lround` is undefined past `NSIntegerMax`.
  NSInteger rounded = ms >= NSIntegerMax ? NSIntegerMax : lround(ms);
  if (rounded < 0) {
    return [RNSStackAnimationMapper rejectWithReason:@"[RNScreens] A track cannot start before the transition."];
  }
  return @(rounded);
}

+ (nullable NSNumber *)scalarEndpointFromValue:(id)value isUnitRange:(BOOL)isUnitRange
{
  if (![value isKindOfClass:NSNumber.class]) {
    return [RNSStackAnimationMapper rejectWithReason:@"[RNScreens] A track endpoint must be a number."];
  }
  double number = [value doubleValue];
  if (!isfinite(number)) {
    return [RNSStackAnimationMapper rejectWithReason:@"[RNScreens] A track needs finite endpoints."];
  }
  if (isUnitRange && !(number >= 0 && number <= 1)) {
    return [RNSStackAnimationMapper rejectWithReason:@"[RNScreens] opacity and dim values must be in [0, 1]."];
  }
  return value;
}

+ (nullable RNSStackAnimationLength *)lengthEndpointFromValue:(id)value
{
  RNSStackAnimationLength *length = [RNSStackAnimationMapper lengthFromValue:value];
  if (length == nil) {
    return [RNSStackAnimationMapper
        rejectWithReason:@"[RNScreens] A length must be a number of points or a percentage string like '30%'."];
  }
  if (!isfinite(length.value)) {
    return [RNSStackAnimationMapper rejectWithReason:@"[RNScreens] A length must be finite."];
  }
  return length;
}

// A color that cannot be read is the default one, as on Android. A processed color is an `NSNumber`, or an
// `NSDictionary` for `PlatformColor` and `DynamicColorIOS`; `RCTConvert` warns on its own for an unreadable dictionary.
+ (nullable UIColor *)colorFromValue:(nullable id)value
{
  if (value == nil) {
    return nil;
  }
  if ([value isKindOfClass:NSNumber.class] || [value isKindOfClass:NSDictionary.class]) {
    return [RCTConvert UIColor:value];
  }
  RNSLogW(@"[RNScreens] Could not parse color for key 'color'.");
  return nil;
}

@end
