#import "RNSStackHeaderIconMapper.h"

static RNSStackHeaderIconImageSource RNSStackHeaderIconImageSourceFromDictionary(NSDictionary *source)
{
  return RNSStackHeaderIconImageSource{
      .source = source,
      .size = CGSizeMake([source[@"width"] doubleValue], [source[@"height"] doubleValue]),
      .scale = [source[@"scale"] doubleValue],
  };
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
                                            imageSource:RNSStackHeaderIconImageSource{}];
  }

  if ([type isEqualToString:@"xcasset"]) {
    return [[RNSStackHeaderIconData alloc] initWithType:RNSStackHeaderIconTypeXcasset
                                           resourceName:dict[@"name"]
                                            imageSource:RNSStackHeaderIconImageSource{}];
  }

  if ([type isEqualToString:@"imageSource"]) {
    NSDictionary *source = dict[@"imageSource"];
    if (![source isKindOfClass:[NSDictionary class]]) {
      return nil;
    }
    return [[RNSStackHeaderIconData alloc] initWithType:RNSStackHeaderIconTypeImageSource
                                           resourceName:nil
                                            imageSource:RNSStackHeaderIconImageSourceFromDictionary(source)];
  }

  if ([type isEqualToString:@"templateSource"]) {
    NSDictionary *source = dict[@"templateSource"];
    if (![source isKindOfClass:[NSDictionary class]]) {
      return nil;
    }
    return [[RNSStackHeaderIconData alloc] initWithType:RNSStackHeaderIconTypeTemplateSource
                                           resourceName:nil
                                            imageSource:RNSStackHeaderIconImageSourceFromDictionary(source)];
  }

  return nil;
}

@end
