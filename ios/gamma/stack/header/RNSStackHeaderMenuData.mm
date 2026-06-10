#import "RNSStackHeaderMenuData.h"

@implementation RNSStackHeaderMenuItemData

@synthesize menuElementId = _menuElementId;

- (instancetype)initWithId:(NSString *)menuElementId title:(nullable NSString *)title
{
  if (self = [super init]) {
    _menuElementId = [menuElementId copy];
    _title = [title copy];
  }
  return self;
}

@end

@implementation RNSStackHeaderMenuData

@synthesize menuElementId = _menuElementId;

- (instancetype)initWithId:(NSString *)menuElementId
                     title:(nullable NSString *)title
                  children:(NSArray<id<RNSStackHeaderMenuElement>> *)children
{
  if (self = [super init]) {
    _menuElementId = [menuElementId copy];
    _title = [title copy];
    _children = [children copy];
  }
  return self;
}

@end
