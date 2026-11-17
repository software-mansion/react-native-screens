#import "RNSStackHeaderAppearanceMapper.h"
#import "RNSDefines.h"

#import <React/RCTConvert.h>
#import <React/RCTFont.h>
#import <React/RCTLog.h>

@implementation RNSStackHeaderAppearanceMapper

+ (nullable UINavigationBarAppearance *)appearanceFromDictionary:(nullable NSDictionary *)appearanceDict
{
  if (appearanceDict.count == 0) {
    return nil;
  }

  UINavigationBarAppearance *appearance = [UINavigationBarAppearance new];
  [self applyTextAttributesFromDictionary:appearanceDict toAppearance:appearance];
  return appearance;
}

+ (nullable UINavigationBarAppearance *)scrollEdgeAppearanceFromDictionary:(nullable NSDictionary *)appearanceDict
{
  if (appearanceDict.count == 0) {
    return nil;
  }

  UINavigationBarAppearance *appearance = [UINavigationBarAppearance new];

  // A nil navigationItem.scrollEdgeAppearance natively resolves to the item's (or bar's)
  // standard appearance with a transparent background. Start the explicit scroll edge
  // appearance from the same transparent base so that a text-only appearance prop does
  // not suddenly bring back the default bar background at the scroll edge.
  [appearance configureWithTransparentBackground];

  [self applyTextAttributesFromDictionary:appearanceDict toAppearance:appearance];
  return appearance;
}

+ (void)applyTextAttributesFromDictionary:(nullable NSDictionary *)appearanceDict
                             toAppearance:(nonnull UINavigationBarAppearance *)appearance
{
  appearance.titleTextAttributes = [self textAttributes:appearance.titleTextAttributes
                                  updatedWithDictionary:appearanceDict
                                              keyPrefix:@"title"];
  appearance.largeTitleTextAttributes = [self textAttributes:appearance.largeTitleTextAttributes
                                       updatedWithDictionary:appearanceDict
                                                   keyPrefix:@"largeTitle"];

#if RNS_IPHONE_OS_VERSION_AVAILABLE(26_0)
  if (@available(iOS 26.0, *)) {
    // UIKit derives both the regular and the large subtitle appearance from
    // subtitleTextAttributes; largeSubtitleTextAttributes is ignored.
    appearance.subtitleTextAttributes = [self textAttributes:appearance.subtitleTextAttributes
                                       updatedWithDictionary:appearanceDict
                                                   keyPrefix:@"subtitle"];
  }
#endif // RNS_IPHONE_OS_VERSION_AVAILABLE(26_0)

  UIBarButtonItemAppearance *buttonAppearance = [self barButtonItemAppearance:appearance.buttonAppearance
                                                        updatedWithDictionary:[self dictionaryForKey:@"button"
                                                                                                  in:appearanceDict]];
  if (buttonAppearance != nil) {
    appearance.buttonAppearance = buttonAppearance;
  }

  UIBarButtonItemAppearance *backButtonAppearance =
      [self barButtonItemAppearance:appearance.backButtonAppearance
              updatedWithDictionary:[self dictionaryForKey:@"backButton" in:appearanceDict]];
  if (backButtonAppearance != nil) {
    appearance.backButtonAppearance = backButtonAppearance;
  }

  NSDictionary *prominentButtonDict = [self dictionaryForKey:@"prominentButton" in:appearanceDict];
#if RNS_IPHONE_OS_VERSION_AVAILABLE(26_0)
  if (@available(iOS 26.0, *)) {
    UIBarButtonItemAppearance *prominentButtonAppearance =
        [self barButtonItemAppearance:appearance.prominentButtonAppearance updatedWithDictionary:prominentButtonDict];
    if (prominentButtonAppearance != nil) {
      appearance.prominentButtonAppearance = prominentButtonAppearance;
    }
  } else
#endif // RNS_IPHONE_OS_VERSION_AVAILABLE(26_0)
  {
    UIBarButtonItemAppearance *doneButtonAppearance = [self barButtonItemAppearance:appearance.doneButtonAppearance
                                                              updatedWithDictionary:prominentButtonDict];
    if (doneButtonAppearance != nil) {
      appearance.doneButtonAppearance = doneButtonAppearance;
    }
  }
}

/**
 Creates button item appearance object based on `baseAppearance`,
 updating each control state with the attributes from the state's sub-dictionary
 (`normal`, `highlighted`, `disabled`, `focused`) of `buttonDict`.
 */
+ (nullable UIBarButtonItemAppearance *)barButtonItemAppearance:(nonnull UIBarButtonItemAppearance *)baseAppearance
                                          updatedWithDictionary:(nullable NSDictionary *)buttonDict
{
  if (buttonDict == nil) {
    return nil;
  }

  UIBarButtonItemAppearance *updatedAppearance = [baseAppearance copy];

  BOOL didUpdate = NO;
  didUpdate |= [self updateStateAppearance:updatedAppearance.normal
                            fromDictionary:[self dictionaryForKey:@"normal" in:buttonDict]];
  didUpdate |= [self updateStateAppearance:updatedAppearance.highlighted
                            fromDictionary:[self dictionaryForKey:@"highlighted" in:buttonDict]];
  didUpdate |= [self updateStateAppearance:updatedAppearance.disabled
                            fromDictionary:[self dictionaryForKey:@"disabled" in:buttonDict]];
  didUpdate |= [self updateStateAppearance:updatedAppearance.focused
                            fromDictionary:[self dictionaryForKey:@"focused" in:buttonDict]];

  return didUpdate ? updatedAppearance : nil;
}

+ (BOOL)updateStateAppearance:(nonnull UIBarButtonItemStateAppearance *)stateAppearance
               fromDictionary:(nullable NSDictionary *)stateDict
{
  NSDictionary *textAttributes = [self textAttributes:stateAppearance.titleTextAttributes
                                updatedWithDictionary:stateDict
                                            keyPrefix:nil];
  if (textAttributes == nil) {
    return NO;
  }
  stateAppearance.titleTextAttributes = textAttributes;
  return YES;
}

/**
 Resolves the dictionary key for an attribute: bare camelCase name when `keyPrefix` is empty
 (`fontFamily`), prefixed otherwise (`titleFontFamily`).
 */
+ (nonnull NSString *)attributeKey:(nonnull NSString *)name withPrefix:(nullable NSString *)keyPrefix
{
  if (keyPrefix.length == 0) {
    return name;
  }
  NSString *capitalized =
      [[[name substringToIndex:1] uppercaseString] stringByAppendingString:[name substringFromIndex:1]];
  return [keyPrefix stringByAppendingString:capitalized];
}

+ (nullable NSDictionary *)textAttributes:(nullable NSDictionary *)baseAttributes
                    updatedWithDictionary:(nullable NSDictionary *)appearanceDict
                                keyPrefix:(nullable NSString *)keyPrefix
{
  NSString *fontFamily = [self stringForKey:[self attributeKey:@"fontFamily" withPrefix:keyPrefix] in:appearanceDict];
  NSNumber *fontSize = [self numberForKey:[self attributeKey:@"fontSize" withPrefix:keyPrefix] in:appearanceDict];
  NSString *fontWeight = [self stringForKey:[self attributeKey:@"fontWeight" withPrefix:keyPrefix] in:appearanceDict];
  NSString *fontStyle = [self stringForKey:[self attributeKey:@"fontStyle" withPrefix:keyPrefix] in:appearanceDict];
  id fontColor = [self colorValueForKey:[self attributeKey:@"fontColor" withPrefix:keyPrefix] in:appearanceDict];

  if (fontFamily == nil && fontSize == nil && fontWeight == nil && fontStyle == nil && fontColor == nil) {
    return nil;
  }

  NSMutableDictionary *textAttributes = [baseAttributes mutableCopy] ?: [NSMutableDictionary new];

  if (fontFamily != nil || fontSize != nil || fontWeight != nil || fontStyle != nil) {
    textAttributes[NSFontAttributeName] = [RCTFont updateFont:baseAttributes[NSFontAttributeName]
                                                   withFamily:fontFamily
                                                         size:fontSize
                                                       weight:fontWeight
                                                        style:fontStyle
                                                      variant:nil
                                              scaleMultiplier:1.0];
  }

  if (fontColor != nil) {
    textAttributes[NSForegroundColorAttributeName] = [RCTConvert UIColor:fontColor];
  }

  return textAttributes;
}

// The accessors below treat NSNull as an absent value (JS `undefined`/`null` arrive
// as NSNull via folly::dynamic) and warn when a present value has an unexpected type.

+ (nullable NSString *)stringForKey:(nonnull NSString *)key in:(nullable NSDictionary *)dict
{
  id value = [self presentValueForKey:key in:dict];
  if (value != nil && ![value isKindOfClass:[NSString class]]) {
    RCTLogWarn(@"[RNScreens] Invalid value for header appearance key '%@': expected a string", key);
    return nil;
  }
  return value;
}

+ (nullable NSNumber *)numberForKey:(nonnull NSString *)key in:(nullable NSDictionary *)dict
{
  id value = [self presentValueForKey:key in:dict];
  if (value != nil && ![value isKindOfClass:[NSNumber class]]) {
    RCTLogWarn(@"[RNScreens] Invalid value for header appearance key '%@': expected a number", key);
    return nil;
  }
  return value;
}

+ (nullable id)colorValueForKey:(nonnull NSString *)key in:(nullable NSDictionary *)dict
{
  id value = [self presentValueForKey:key in:dict];
  if (value != nil && !([value isKindOfClass:[NSNumber class]] || [value isKindOfClass:[NSDictionary class]])) {
    RCTLogWarn(@"[RNScreens] Invalid value for header appearance key '%@': expected a processed color", key);
    return nil;
  }
  return value;
}

+ (nullable NSDictionary *)dictionaryForKey:(nonnull NSString *)key in:(nullable NSDictionary *)dict
{
  id value = [self presentValueForKey:key in:dict];
  if (value != nil && ![value isKindOfClass:[NSDictionary class]]) {
    RCTLogWarn(@"[RNScreens] Invalid value for header appearance key '%@': expected an object", key);
    return nil;
  }
  return value;
}

+ (nullable id)presentValueForKey:(nonnull NSString *)key in:(nullable NSDictionary *)dict
{
  id value = dict[key];
  return value == (id)[NSNull null] ? nil : value;
}

@end
