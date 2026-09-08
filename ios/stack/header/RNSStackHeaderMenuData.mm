#import "RNSStackHeaderMenuData.h"

@implementation RNSStackHeaderMenuItemData

@synthesize menuElementId = _menuElementId;

- (instancetype)initWithId:(NSString *)menuElementId
                     title:(nullable NSString *)title
                  itemType:(RNSMenuItemType)itemType
        initialToggleState:(BOOL)initialToggleState
        keepsMenuPresented:(BOOL)keepsMenuPresented
                      icon:(nullable RNSStackHeaderIconData *)icon
{
  if (self = [super init]) {
    _menuElementId = [menuElementId copy];
    _title = [title copy];
    _itemType = itemType;
    _initialToggleState = initialToggleState;
    _keepsMenuPresented = keepsMenuPresented;
    _icon = icon;
  }
  return self;
}

@end

@implementation RNSStackHeaderMenuData

@synthesize menuElementId = _menuElementId;

- (instancetype)initWithId:(NSString *)menuElementId
                     title:(nullable NSString *)title
           singleSelection:(BOOL)singleSelection
             displayInline:(BOOL)displayInline
          displayAsPalette:(BOOL)displayAsPalette
                  children:(NSArray<id<RNSStackHeaderMenuElement>> *)children
                      icon:(nullable RNSStackHeaderIconData *)icon
{
  if (self = [super init]) {
    _menuElementId = [menuElementId copy];
    _title = [title copy];
    _singleSelection = singleSelection;
    _displayInline = displayInline;
    _displayAsPalette = displayAsPalette;
    _children = [children copy];
    _icon = icon;
  }
  return self;
}

@end
