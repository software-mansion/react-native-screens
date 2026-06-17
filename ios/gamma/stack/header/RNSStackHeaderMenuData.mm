#import "RNSStackHeaderMenuData.h"

@implementation RNSStackHeaderMenuItemData

- (instancetype)initWithTitle:(nullable NSString *)title
{
  if (self = [super init]) {
    _title = [title copy];
  }
  return self;
}

@end

@implementation RNSStackHeaderMenuData

- (instancetype)initWithTitle:(nullable NSString *)title children:(NSArray<id<RNSStackHeaderMenuElement>> *)children
{
  if (self = [super init]) {
    _title = [title copy];
    _children = [children copy];
  }
  return self;
}

@end
