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

+ (nullable UINavigationBarAppearance *)appearanceFromDictionary:(nullable NSDictionary *)appearanceDict
                                                  inheritingFrom:(nullable UINavigationBarAppearance *)baseAppearance
{
  if (appearanceDict.count == 0 && baseAppearance == nil) {
    return nil;
  }

  UINavigationBarAppearance *appearance = baseAppearance != nil
      ? [[UINavigationBarAppearance alloc] initWithBarAppearance:baseAppearance]
      : [UINavigationBarAppearance new];

  // UIKit resolves a nil scroll edge appearance to the standard one with a transparent
  // background; configureWithTransparentBackground resets only the background & shadow
  // properties, keeping the inherited text attributes.
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
}

+ (nonnull NSDictionary *)textAttributes:(nullable NSDictionary *)baseAttributes
                   updatedWithDictionary:(nullable NSDictionary *)appearanceDict
                               keyPrefix:(nonnull NSString *)keyPrefix
{
  id fontFamily = appearanceDict[[keyPrefix stringByAppendingString:@"FontFamily"]];
  id fontSize = appearanceDict[[keyPrefix stringByAppendingString:@"FontSize"]];
  id fontWeight = appearanceDict[[keyPrefix stringByAppendingString:@"FontWeight"]];
  id fontStyle = appearanceDict[[keyPrefix stringByAppendingString:@"FontStyle"]];
  id fontColor = appearanceDict[[keyPrefix stringByAppendingString:@"FontColor"]];

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

@end
