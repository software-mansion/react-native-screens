#import "RNSStackHeaderMenuCoordinator.h"

@implementation RNSStackHeaderMenuCoordinator

+ (void)applyMenu:(RNSStackHeaderMenuData *)data
           toBarButtonItem:(UIBarButtonItem *)item
    withMenuEventsDelegate:(id<RNSStackHeaderMenuEventsDelegate>)delegate
{
#if !TARGET_OS_TV || __TV_OS_VERSION_MAX_ALLOWED >= 170000
  if (@available(tvOS 17.0, *)) {
    item.menu = [self buildMenuFromData:data withMenuEventsDelegate:delegate];
  }
#endif // !TARGET_OS_TV || __TV_OS_VERSION_MAX_ALLOWED >= 170000
}

+ (UIMenu *)buildMenuFromData:(RNSStackHeaderMenuData *)data
       withMenuEventsDelegate:(id<RNSStackHeaderMenuEventsDelegate>)delegate
{
  NSMutableArray<UIMenuElement *> *elements = [NSMutableArray arrayWithCapacity:data.children.count];
  for (id<RNSStackHeaderMenuElement> child in data.children) {
    UIMenuElement *element = [self buildElementFromData:child withMenuEventsDelegate:delegate];
    if (element != nil) {
      [elements addObject:element];
    }
  }

  return [UIMenu menuWithTitle:data.title ?: @"" children:elements];
}

+ (nullable UIMenuElement *)buildElementFromData:(id<RNSStackHeaderMenuElement>)element
                          withMenuEventsDelegate:(id<RNSStackHeaderMenuEventsDelegate>)delegate
{
  if ([element isKindOfClass:[RNSStackHeaderMenuData class]]) {
    return [self buildMenuFromData:(RNSStackHeaderMenuData *)element withMenuEventsDelegate:delegate];
  }

  if ([element isKindOfClass:[RNSStackHeaderMenuItemData class]]) {
    RNSStackHeaderMenuItemData *itemData = (RNSStackHeaderMenuItemData *)element;
    __weak id<RNSStackHeaderMenuEventsDelegate> weakDelegate = delegate;
    return [UIAction actionWithTitle:itemData.title ?: @""
                               image:nil
                          identifier:nil
                             handler:^(__kindof UIAction *_Nonnull action) {
                               [weakDelegate didPressMenuElement:itemData.menuElementId];
                             }];
  }

  return nil;
}

@end
