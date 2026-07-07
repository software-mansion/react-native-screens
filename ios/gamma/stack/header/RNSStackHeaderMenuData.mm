#import "RNSStackHeaderMenuData.h"

@implementation RNSStackHeaderMenuItemData

@synthesize menuElementId = _menuElementId;

- (instancetype)initWithId:(NSString *)menuElementId
                     title:(nullable NSString *)title
                  itemType:(RNSMenuItemType)itemType
        initialToggleState:(BOOL)initialToggleState
        keepsMenuPresented:(BOOL)keepsMenuPresented
{
  if (self = [super init]) {
    _menuElementId = [menuElementId copy];
    _title = [title copy];
    _itemType = itemType;
    _initialToggleState = initialToggleState;
    _keepsMenuPresented = keepsMenuPresented;
  }
  return self;
}

@end

@implementation RNSStackHeaderMenuData

@synthesize menuElementId = _menuElementId;

- (instancetype)initWithId:(NSString *)menuElementId
                     title:(nullable NSString *)title
           singleSelection:(BOOL)singleSelection
                  children:(NSArray<id<RNSStackHeaderMenuElement>> *)children
{
  if (self = [super init]) {
    _menuElementId = [menuElementId copy];
    _title = [title copy];
    _singleSelection = singleSelection;
    _children = [children copy];
  }
  return self;
}

@end
