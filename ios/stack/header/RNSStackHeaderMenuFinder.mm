#import "RNSStackHeaderMenuFinder.h"

#pragma mark - RNSStackHeaderMenuElementSearchResult

@implementation RNSStackHeaderMenuElementSearchResult

- (instancetype)initWithElement:(id<RNSStackHeaderMenuElement>)element
                     parentMenu:(nullable RNSStackHeaderMenuData *)parentMenu
{
  if (self = [super init]) {
    _element = element;
    _parentMenu = parentMenu;
  }
  return self;
}

@end

#pragma mark - RNSMenuElementLocator

@implementation RNSMenuElementLocator

- (instancetype)initWithSearchResult:(RNSStackHeaderMenuElementSearchResult *)searchResult
                            position:(RNSMenuElementPosition)position
                          headerItem:(nullable id<RNSStackHeaderItemDataProviding>)headerItem
                            rootMenu:(nullable RNSStackHeaderMenuData *)rootMenu
                       trackerItemId:(nullable NSString *)trackerItemId
{
  if (self = [super init]) {
    _searchResult = searchResult;
    _position = position;
    _headerItem = headerItem;
    _rootMenu = rootMenu;
    _trackerItemId = [trackerItemId copy];
  }
  return self;
}

@end

#pragma mark - RNSStackHeaderMenuFinder

@implementation RNSStackHeaderMenuFinder

+ (nullable RNSMenuElementLocator *)findMenuElementWithId:(NSString *)elementId
                                            inHeaderItems:(NSArray<id<RNSStackHeaderItemDataProviding>> *)items
                                                titleMenu:(nullable RNSStackHeaderMenuData *)titleMenu
{
  for (id<RNSStackHeaderItemDataProviding> item in items) {
    if (item.menu == nil || item.itemId == nil) {
      continue;
    }
    RNSStackHeaderMenuElementSearchResult *result = [self findElementWithId:elementId inMenu:item.menu];
    if (result != nil) {
      return [[RNSMenuElementLocator alloc] initWithSearchResult:result
                                                        position:RNSMenuElementPositionItem
                                                      headerItem:item
                                                        rootMenu:item.menu
                                                   trackerItemId:item.itemId];
    }
  }

  if (titleMenu != nil) {
    RNSStackHeaderMenuElementSearchResult *result = [self findElementWithId:elementId inMenu:titleMenu];
    if (result != nil) {
      return [[RNSMenuElementLocator alloc] initWithSearchResult:result
                                                        position:RNSMenuElementPositionTitle
                                                      headerItem:nil
                                                        rootMenu:titleMenu
                                                   trackerItemId:RNSTitleMenuTrackerItemId];
    }
  }

  // TODO: search overflow menu (RNSMenuElementPositionOverflow)
  return nil;
}

+ (nullable RNSStackHeaderMenuElementSearchResult *)findElementWithId:(NSString *)elementId
                                                               inMenu:(RNSStackHeaderMenuData *)menu
{
  if ([menu.menuElementId isEqualToString:elementId]) {
    return [[RNSStackHeaderMenuElementSearchResult alloc] initWithElement:menu parentMenu:nil];
  }

  for (id<RNSStackHeaderMenuElement> child in menu.children) {
    if ([child.menuElementId isEqualToString:elementId]) {
      return [[RNSStackHeaderMenuElementSearchResult alloc] initWithElement:child parentMenu:menu];
    }

    if ([child isKindOfClass:[RNSStackHeaderMenuData class]]) {
      RNSStackHeaderMenuElementSearchResult *result = [self findElementWithId:elementId
                                                                       inMenu:(RNSStackHeaderMenuData *)child];
      if (result != nil) {
        return result;
      }
    }
  }

  return nil;
}

+ (nullable RNSStackHeaderMenuData *)singleSelectionRootForElementWithId:(NSString *)elementId
                                                                  inMenu:(RNSStackHeaderMenuData *)menu
{
  RNSStackHeaderMenuData *root = nil;
  if ([self searchForElementWithId:elementId
                              inMenu:menu
          currentSingleSelectionRoot:menu.singleSelection ? menu : nil
                           foundRoot:&root]) {
    return root;
  }
  return nil;
}

+ (BOOL)searchForElementWithId:(NSString *)elementId
                        inMenu:(RNSStackHeaderMenuData *)menu
    currentSingleSelectionRoot:(nullable RNSStackHeaderMenuData *)currentRoot
                     foundRoot:(RNSStackHeaderMenuData *_Nullable *_Nonnull)outRoot
{
  RNSStackHeaderMenuData *resolvedRoot = currentRoot;
  if (resolvedRoot == nil && menu.singleSelection) {
    resolvedRoot = menu;
  }

  for (id<RNSStackHeaderMenuElement> child in menu.children) {
    if ([child.menuElementId isEqualToString:elementId]) {
      *outRoot = resolvedRoot;
      return YES;
    }
    if ([child isKindOfClass:[RNSStackHeaderMenuData class]]) {
      if ([self searchForElementWithId:elementId
                                  inMenu:(RNSStackHeaderMenuData *)child
              currentSingleSelectionRoot:resolvedRoot
                               foundRoot:outRoot]) {
        return YES;
      }
    }
  }
  return NO;
}

@end
