#import "RNSStackHeaderAppearanceMapper.h"
#import "RNSDefines.h"

#import <React/RCTConvert.h>
#import <React/RCTFont.h>

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
                                                        updatedWithDictionary:appearanceDict
                                                                    keyPrefix:@"button"];
  if (buttonAppearance != nil) {
    appearance.buttonAppearance = buttonAppearance;
  }

  // UIKit draws unset backButtonAppearance attributes from buttonAppearance,
  // so backButton attributes only override the button ones where set.
  appearance.backButtonAppearance = [self barButtonItemAppearance:appearance.backButtonAppearance
                                            updatedWithDictionary:appearanceDict
                                                        keyPrefix:@"backButton"];

  // Prominent items use the done style below iOS 26 and the prominent style on
  // iOS 26+, so the prominent button attributes go to the appearance object
  // matching each style. doneButtonAppearance is written on iOS 26+ too, keeping
  // done-styled buttons consistent with prominent ones.
  appearance.doneButtonAppearance = [self barButtonItemAppearance:appearance.doneButtonAppearance
                                            updatedWithDictionary:appearanceDict
                                                        keyPrefix:@"prominentButton"];
#if RNS_IPHONE_OS_VERSION_AVAILABLE(26_0)
  if (@available(iOS 26.0, *)) {
    UIBarButtonItemAppearance *prominentButtonAppearance =
        [self barButtonItemAppearance:appearance.prominentButtonAppearance
                updatedWithDictionary:appearanceDict
                            keyPrefix:@"prominentButton"];
    if (prominentButtonAppearance != nil) {
      appearance.prominentButtonAppearance = prominentButtonAppearance;
    }
  } else
#endif // RNS_IPHONE_OS_VERSION_AVAILABLE(26_0)
  {
    UIBarButtonItemAppearance *doneButtonAppearance = [self barButtonItemAppearance:appearance.doneButtonAppearance
                                                              updatedWithDictionary:appearanceDict
                                                                          keyPrefix:@"prominentButton"];
    if (doneButtonAppearance != nil) {
      appearance.doneButtonAppearance = doneButtonAppearance;
    }
  }
}

/**
 Creates button item appearance object based on `baseAppearance`,
 updating it with well-known attributes prefixed with `keyPrefix` ("button" or "prominentButton")
 */
+ (nullable UIBarButtonItemAppearance *)barButtonItemAppearance:(nonnull UIBarButtonItemAppearance *)baseAppearance
                                          updatedWithDictionary:(nullable NSDictionary *)appearanceDict
                                                      keyPrefix:(nonnull NSString *)keyPrefix
{
  UIBarButtonItemAppearance *updatedAppearance = [baseAppearance copy];

  BOOL didUpdate = NO;
  didUpdate |= [self updateStateAppearance:updatedAppearance.normal fromDictionary:appearanceDict keyPrefix:keyPrefix];
  didUpdate |= [self updateStateAppearance:updatedAppearance.highlighted
                            fromDictionary:appearanceDict
                                 keyPrefix:[keyPrefix stringByAppendingString:@"Highlighted"]];
  didUpdate |= [self updateStateAppearance:updatedAppearance.disabled
                            fromDictionary:appearanceDict
                                 keyPrefix:[keyPrefix stringByAppendingString:@"Disabled"]];
  didUpdate |= [self updateStateAppearance:updatedAppearance.focused
                            fromDictionary:appearanceDict
                                 keyPrefix:[keyPrefix stringByAppendingString:@"Focused"]];

  return didUpdate ? updatedAppearance : nil;
}

+ (BOOL)updateStateAppearance:(nonnull UIBarButtonItemStateAppearance *)stateAppearance
               fromDictionary:(nullable NSDictionary *)appearanceDict
                    keyPrefix:(nonnull NSString *)keyPrefix
{
  NSDictionary *textAttributes = [self textAttributes:stateAppearance.titleTextAttributes
                                updatedWithDictionary:appearanceDict
                                            keyPrefix:keyPrefix];
  if (textAttributes == nil) {
    return NO;
  }
  stateAppearance.titleTextAttributes = textAttributes;
  return YES;
}

+ (nullable NSDictionary *)textAttributes:(nullable NSDictionary *)baseAttributes
                    updatedWithDictionary:(nullable NSDictionary *)appearanceDict
                                keyPrefix:(nonnull NSString *)keyPrefix
{
  NSString *fontFamily = [self stringForKey:[keyPrefix stringByAppendingString:@"FontFamily"] in:appearanceDict];
  NSNumber *fontSize = [self numberForKey:[keyPrefix stringByAppendingString:@"FontSize"] in:appearanceDict];
  NSString *fontWeight = [self stringForKey:[keyPrefix stringByAppendingString:@"FontWeight"] in:appearanceDict];
  NSString *fontStyle = [self stringForKey:[keyPrefix stringByAppendingString:@"FontStyle"] in:appearanceDict];
  id fontColor = [self colorValueForKey:[keyPrefix stringByAppendingString:@"FontColor"] in:appearanceDict];

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

+ (nullable NSString *)stringForKey:(nonnull NSString *)key in:(nullable NSDictionary *)dict
{
  id value = dict[key];
  return [value isKindOfClass:[NSString class]] ? value : nil;
}

+ (nullable NSNumber *)numberForKey:(nonnull NSString *)key in:(nullable NSDictionary *)dict
{
  id value = dict[key];
  return [value isKindOfClass:[NSNumber class]] ? value : nil;
}

+ (nullable id)colorValueForKey:(nonnull NSString *)key in:(nullable NSDictionary *)dict
{
  id value = dict[key];
  return ([value isKindOfClass:[NSNumber class]] || [value isKindOfClass:[NSDictionary class]]) ? value : nil;
}

@end
