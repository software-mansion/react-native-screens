#import "RNSStackHeaderMenuUpdateOptions.h"
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

#pragma mark - RNSMenuItemUpdateOptions

@implementation RNSMenuItemUpdateOptions

- (instancetype)initWithTitle:(nullable NSString *)title
                     hasTitle:(BOOL)hasTitle
                         icon:(nullable RNSStackHeaderIconData *)icon
                      hasIcon:(BOOL)hasIcon
               hasToggleState:(BOOL)hasToggleState
                  toggleState:(BOOL)toggleState
{
  if (self = [super init]) {
    _title = [title copy];
    _hasTitle = hasTitle;
    _icon = icon;
    _hasIcon = hasIcon;
    _hasToggleState = hasToggleState;
    _toggleState = toggleState;
  }
  return self;
}

+ (instancetype)fromDictionary:(NSDictionary *)dict
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

+ (RNSStackHeaderMenuItemData *)applyOptions:(RNSMenuItemUpdateOptions *)options
                                  toMenuItem:(RNSStackHeaderMenuItemData *)old
{
  NSString *title = options.hasTitle ? options.title : old.title;
  RNSStackHeaderIconData *icon = options.hasIcon ? options.icon : old.icon;

  return [[RNSStackHeaderMenuItemData alloc] initWithId:old.menuElementId
                                                  title:title
                                               itemType:old.itemType
                                     initialToggleState:old.initialToggleState
                                     keepsMenuPresented:old.keepsMenuPresented
                                                   icon:icon];
}

@end

#pragma mark - RNSMenuUpdateOptions

@implementation RNSMenuUpdateOptions

- (instancetype)initWithTitle:(nullable NSString *)title
                     hasTitle:(BOOL)hasTitle
                         icon:(nullable RNSStackHeaderIconData *)icon
                      hasIcon:(BOOL)hasIcon
{
  if (self = [super init]) {
    _title = [title copy];
    _hasTitle = hasTitle;
    _icon = icon;
    _hasIcon = hasIcon;
  }
  return self;
}

+ (instancetype)fromDictionary:(NSDictionary *)dict
{
  BOOL hasTitle = RNSDictHasKey(dict, @"title");
  NSString *title = hasTitle ? RNSResolveStringFromDict(dict, @"title", nil) : nil;

  BOOL hasIcon = RNSDictHasKey(dict, @"icon");
  RNSStackHeaderIconData *icon = hasIcon ? RNSResolveIconFromDict(dict, @"icon", nil) : nil;

  return [[RNSMenuUpdateOptions alloc] initWithTitle:title hasTitle:hasTitle icon:icon hasIcon:hasIcon];
}

+ (RNSStackHeaderMenuData *)applyOptions:(RNSMenuUpdateOptions *)options toMenu:(RNSStackHeaderMenuData *)old
{
  NSString *title = options.hasTitle ? options.title : old.title;
  RNSStackHeaderIconData *icon = options.hasIcon ? options.icon : old.icon;

  return [[RNSStackHeaderMenuData alloc] initWithId:old.menuElementId
                                              title:title
                                    singleSelection:old.singleSelection
                                      displayInline:old.displayInline
                                   displayAsPalette:old.displayAsPalette
                                           children:old.children
                                               icon:icon];
}

@end
