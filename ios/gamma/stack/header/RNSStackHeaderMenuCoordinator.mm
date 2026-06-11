#import "RNSStackHeaderMenuCoordinator.h"

@implementation RNSStackHeaderMenuCoordinator

+ (void)applyMenu:(nonnull RNSStackHeaderMenuData *)data toBarButtonItem:(nonnull UIBarButtonItem *)item
{
#if !TARGET_OS_TV || __TV_OS_VERSION_MAX_ALLOWED >= 170000
  if (@available(tvOS 17.0, *)) {
    item.menu = [self buildMenuFromData:data];
  }
#endif // !TARGET_OS_TV || __TV_OS_VERSION_MAX_ALLOWED >= 170000
}

+ (UIMenu *)buildMenuFromData:(RNSStackHeaderMenuData *)data
{
  NSMutableArray<UIMenuElement *> *elements = [NSMutableArray arrayWithCapacity:data.children.count];
  for (id<RNSStackHeaderMenuElement> child in data.children) {
    UIMenuElement *element = [self buildElementFromData:child];
    if (element != nil) {
      [elements addObject:element];
    }
  }

  return [UIMenu menuWithTitle:data.title ?: @"" children:elements];
}

+ (nullable UIMenuElement *)buildElementFromData:(id<RNSStackHeaderMenuElement>)element
{
  if ([element isKindOfClass:[RNSStackHeaderMenuData class]]) {
    return [self buildMenuFromData:(RNSStackHeaderMenuData *)element];
  }

  if ([element isKindOfClass:[RNSStackHeaderMenuItemData class]]) {
    RNSStackHeaderMenuItemData *itemData = (RNSStackHeaderMenuItemData *)element;
    return [UIAction actionWithTitle:itemData.title ?: @""
                               image:nil
                          identifier:nil
                             handler:^(__kindof UIAction *_Nonnull action){
                                 // noop
                             }];
  }

  return nil;
}

@end
