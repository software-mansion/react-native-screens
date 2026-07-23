#import "RNSStackHeaderMenuMapper.h"
#import "RNSStackHeaderIconMapper.h"

#import <React/RCTAssert.h>
#import <React/RCTLog.h>

static NSSet<NSString *> *const kRNSAllowedMenuKeys = [NSSet setWithObjects:@"id",
                                                                            @"type",
                                                                            @"title",
                                                                            @"children",
                                                                            @"singleSelection",
                                                                            @"displayInline",
                                                                            @"displayAsPalette",
                                                                            @"icon",
                                                                            nil];
static NSSet<NSString *> *const kRNSAllowedMenuItemKeys = [NSSet
    setWithObjects:@"id", @"type", @"title", @"itemType", @"initialToggleState", @"keepsMenuPresented", @"icon", nil];

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

  BOOL singleSelection = [self boolForKey:@"singleSelection" in:dict];
  BOOL displayInline = [self boolForKey:@"displayInline" in:dict];
  BOOL displayAsPalette = [self boolForKey:@"displayAsPalette" in:dict];

  RNSStackHeaderIconData *icon = [RNSStackHeaderIconMapper iconFromDictionary:dict[@"icon"]];

  return [[RNSStackHeaderMenuData alloc] initWithId:[self stringForKey:@"id" in:dict]
                                              title:[self stringForKey:@"title" in:dict]
                                    singleSelection:singleSelection
                                      displayInline:displayInline
                                   displayAsPalette:displayAsPalette
                                           children:children
                                               icon:icon];
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

    RNSStackHeaderIconData *icon = [RNSStackHeaderIconMapper iconFromDictionary:dict[@"icon"]];

    return [[RNSStackHeaderMenuItemData alloc] initWithId:[self stringForKey:@"id" in:dict]
                                                    title:[self stringForKey:@"title" in:dict]
                                                 itemType:[self itemTypeFromString:[self stringForKey:@"itemType"
                                                                                                   in:dict]]
                                       initialToggleState:[self boolForKey:@"initialToggleState" in:dict]
                                       keepsMenuPresented:[self boolForKey:@"keepsMenuPresented" in:dict]
                                                     icon:icon];
  }

  return nil;
}

#pragma mark - Helpers

+ (void)validateMenuKeys:(NSDictionary *)dict
{
  for (NSString *key in dict) {
    RCTAssert([kRNSAllowedMenuKeys containsObject:key], @"[RNScreens] Invalid key \"%@\" found in menu", key);
  }
  RCTAssert(dict[@"children"], @"[RNScreens] missing key \"children\" in menu");
  RCTAssert(dict[@"id"], @"[RNScreens] missing id on one of menu elements");
}

+ (void)validateMenuItemKeys:(NSDictionary *)dict
{
  for (NSString *key in dict) {
    RCTAssert([kRNSAllowedMenuItemKeys containsObject:key], @"[RNScreens] Invalid key \"%@\" found in menu item", key);
  }
  RCTAssert(dict[@"id"], @"[RNScreens] missing id on one of menu elements");
}

+ (nullable NSString *)stringForKey:(NSString *)key in:(NSDictionary *)dict
{
  id value = dict[key];
  return [value isKindOfClass:[NSString class]] ? value : nil;
}

+ (BOOL)boolForKey:(NSString *)key in:(NSDictionary *)dict
{
  id value = dict[key];
  return [value isKindOfClass:[NSNumber class]] ? [value boolValue] : NO;
}

+ (RNSMenuItemType)itemTypeFromString:(nullable NSString *)string
{
  if ([string isEqualToString:@"action"]) {
    return RNSMenuItemTypeAction;
  } else if ([string isEqualToString:@"toggle"]) {
    return RNSMenuItemTypeToggle;
  }
  return RNSMenuItemTypeAutomatic;
}

@end
