#import "RNSStackHeaderIconMapper.h"

static CGSize RNSImageSourceSizeFromDictionary(NSDictionary *source)
{
  return CGSizeMake([source[@"width"] doubleValue], [source[@"height"] doubleValue]);
}

@implementation RNSStackHeaderIconMapper

+ (nullable RNSStackHeaderIconData *)iconFromDictionary:(nullable id)dictionary
{
  if (![dictionary isKindOfClass:[NSDictionary class]]) {
    return nil;
  }
  NSDictionary *dict = (NSDictionary *)dictionary;

  NSString *type = dict[@"type"];
  if (![type isKindOfClass:[NSString class]]) {
    return nil;
  }

  if ([type isEqualToString:@"sfSymbol"]) {
    return [[RNSStackHeaderIconData alloc] initWithType:RNSStackHeaderIconTypeSfSymbol
                                           resourceName:dict[@"name"]
                                            imageSource:nil
                                        imageSourceSize:CGSizeZero
                                       imageSourceScale:0];
  }

  if ([type isEqualToString:@"xcasset"]) {
    return [[RNSStackHeaderIconData alloc] initWithType:RNSStackHeaderIconTypeXcasset
                                           resourceName:dict[@"name"]
                                            imageSource:nil
                                        imageSourceSize:CGSizeZero
                                       imageSourceScale:0];
  }

  if ([type isEqualToString:@"imageSource"]) {
    NSDictionary *source = dict[@"imageSource"];
    if (![source isKindOfClass:[NSDictionary class]]) {
      return nil;
    }
    return [[RNSStackHeaderIconData alloc] initWithType:RNSStackHeaderIconTypeImageSource
                                           resourceName:nil
                                            imageSource:source
                                        imageSourceSize:RNSImageSourceSizeFromDictionary(source)
                                       imageSourceScale:[source[@"scale"] doubleValue]];
  }

  if ([type isEqualToString:@"templateSource"]) {
    NSDictionary *source = dict[@"templateSource"];
    if (![source isKindOfClass:[NSDictionary class]]) {
      return nil;
    }
    return [[RNSStackHeaderIconData alloc] initWithType:RNSStackHeaderIconTypeTemplateSource
                                           resourceName:nil
                                            imageSource:source
                                        imageSourceSize:RNSImageSourceSizeFromDictionary(source)
                                       imageSourceScale:[source[@"scale"] doubleValue]];
  }

  return nil;
}

@end
