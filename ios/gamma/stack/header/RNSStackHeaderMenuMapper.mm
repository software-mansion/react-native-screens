#import "RNSStackHeaderMenuMapper.h"

#import <React/RCTAssert.h>
#import <React/RCTLog.h>

@implementation RNSStackHeaderMenuMapper

+ (nullable RNSStackHeaderMenuData *)menuFromDictionary:(nullable id)dictionary
{
  if (![dictionary isKindOfClass:[NSDictionary class]]) {
    return nil;
  }
  NSDictionary *dict = (NSDictionary *)dictionary;

  if (![dict[@"type"] isEqual:@"menu"]) {
    return nil;
  }

  [RNSStackHeaderMenuMapper validateMenuKeys:dict];

  NSMutableArray<id<RNSStackHeaderMenuElement>> *children = [NSMutableArray new];
  id childrenValue = dict[@"children"];
  if ([childrenValue isKindOfClass:[NSArray class]]) {
    for (id child in (NSArray *)childrenValue) {
      id<RNSStackHeaderMenuElement> element = [self elementFromDictionary:child];
      if (element != nil) {
        [children addObject:element];
      }
    }
  }

  return [[RNSStackHeaderMenuData alloc] initWithId:[self stringForKey:@"menuElementId" in:dict]
                                              title:[self stringForKey:@"title" in:dict]
                                           children:children];
}

+ (nullable id<RNSStackHeaderMenuElement>)elementFromDictionary:(nullable id)dictionary
{
  if (![dictionary isKindOfClass:[NSDictionary class]]) {
    return nil;
  }
  NSDictionary *dict = (NSDictionary *)dictionary;

  id type = dict[@"type"];
  if ([type isEqual:@"menu"]) {
    return [self menuFromDictionary:dict];
  } else if ([type isEqual:@"menuItem"]) {
    [RNSStackHeaderMenuMapper validateMenuItemKeys:dict];
    return [[RNSStackHeaderMenuItemData alloc] initWithId:[self stringForKey:@"menuElementId" in:dict]
                                                    title:[self stringForKey:@"title" in:dict]];
  }

  return nil;
}

#pragma mark - Helpers

+ (void)validateMenuKeys:(NSDictionary *)dict
{
  for (NSString *key in dict) {
    RCTAssert([key isEqualToString:@"menuElementId"] || [key isEqualToString:@"type"] ||
                  [key isEqualToString:@"title"] || [key isEqualToString:@"children"],
              @"Invalid key \"%@\" found in menu",
              key);
  }
  RCTAssert(dict[@"menuElementId"], @"[RNScreens] missing menuElementId on one of menu elements");
}

+ (void)validateMenuItemKeys:(NSDictionary *)dict
{
  for (NSString *key in dict) {
    RCTAssert([key isEqualToString:@"menuElementId"] || [key isEqualToString:@"type"] || [key isEqualToString:@"title"],
              @"Invalid key \"%@\" found in menu item",
              key);
  }
  RCTAssert(dict[@"menuElementId"], @"[RNScreens] missing menuElementId on one of menu elements");
}

+ (nullable NSString *)stringForKey:(NSString *)key in:(NSDictionary *)dict
{
  id value = dict[key];
  return [value isKindOfClass:[NSString class]] ? value : nil;
}

@end
