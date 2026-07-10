#import "RNSStackHeaderIconMapper.h"

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
                                             jsonSource:nil];
  }

  if ([type isEqualToString:@"xcasset"]) {
    return [[RNSStackHeaderIconData alloc] initWithType:RNSStackHeaderIconTypeXcasset
                                           resourceName:dict[@"name"]
                                             jsonSource:nil];
  }

  if ([type isEqualToString:@"imageSource"]) {
    NSDictionary *source = dict[@"imageSource"];
    if (![source isKindOfClass:[NSDictionary class]]) {
      return nil;
    }
    return [[RNSStackHeaderIconData alloc] initWithType:RNSStackHeaderIconTypeImageSource
                                           resourceName:nil
                                             jsonSource:source];
  }

  if ([type isEqualToString:@"templateSource"]) {
    NSDictionary *source = dict[@"templateSource"];
    if (![source isKindOfClass:[NSDictionary class]]) {
      return nil;
    }
    return [[RNSStackHeaderIconData alloc] initWithType:RNSStackHeaderIconTypeTemplateSource
                                           resourceName:nil
                                             jsonSource:source];
  }

  return nil;
}

@end
