#import "RNSStackHeaderMenuUpdateOptionsMapper.h"
#import "RNSStackHeaderIconMapper.h"

#pragma mark - Helpers

static BOOL RNSDictHasKey(NSDictionary *dict, NSString *key)
{
  return [dict objectForKey:key] != nil;
}

static NSString *_Nullable RNSResolveStringFromDict(NSDictionary *dict, NSString *key, NSString *_Nullable fallback)
{
  id value = dict[key];
  if (value == nil) {
    return fallback;
  }
  if ([value isKindOfClass:[NSNull class]]) {
    return nil;
  }
  if ([value isKindOfClass:[NSString class]]) {
    return value;
  }
  return fallback;
}

static RNSStackHeaderIconData *_Nullable RNSResolveIconFromDict(NSDictionary *dict,
                                                                NSString *key,
                                                                RNSStackHeaderIconData *_Nullable fallback)
{
  id value = dict[key];
  if (value == nil) {
    return fallback;
  }
  if ([value isKindOfClass:[NSNull class]]) {
    return nil;
  }
  return [RNSStackHeaderIconMapper iconFromDictionary:value] ?: fallback;
}

@implementation RNSStackHeaderMenuUpdateOptionsMapper

+ (RNSMenuItemUpdateOptions *)menuItemUpdateOptionsFromDictionary:(NSDictionary *)dict
{
  BOOL hasTitle = RNSDictHasKey(dict, @"title");
  NSString *title = hasTitle ? RNSResolveStringFromDict(dict, @"title", nil) : nil;

  BOOL hasIcon = RNSDictHasKey(dict, @"icon");
  RNSStackHeaderIconData *icon = hasIcon ? RNSResolveIconFromDict(dict, @"icon", nil) : nil;

  BOOL hasToggleState = NO;
  BOOL toggleState = NO;
  id toggleValue = dict[@"toggleState"];
  if ([toggleValue isKindOfClass:[NSNumber class]]) {
    hasToggleState = YES;
    toggleState = [toggleValue boolValue];
  }

  return [[RNSMenuItemUpdateOptions alloc] initWithTitle:title
                                                hasTitle:hasTitle
                                                    icon:icon
                                                 hasIcon:hasIcon
                                          hasToggleState:hasToggleState
                                             toggleState:toggleState];
}

+ (RNSMenuUpdateOptions *)menuUpdateOptionsFromDictionary:(NSDictionary *)dict
{
  BOOL hasTitle = RNSDictHasKey(dict, @"title");
  NSString *title = hasTitle ? RNSResolveStringFromDict(dict, @"title", nil) : nil;

  BOOL hasIcon = RNSDictHasKey(dict, @"icon");
  RNSStackHeaderIconData *icon = hasIcon ? RNSResolveIconFromDict(dict, @"icon", nil) : nil;

  return [[RNSMenuUpdateOptions alloc] initWithTitle:title hasTitle:hasTitle icon:icon hasIcon:hasIcon];
}

@end
