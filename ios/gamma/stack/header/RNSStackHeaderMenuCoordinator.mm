#import "RNSStackHeaderMenuCoordinator.h"

#import <React/RCTAssert.h>

@implementation RNSStackHeaderMenuCoordinator

+ (void)applyMenu:(RNSStackHeaderMenuData *)data
           toBarButtonItem:(UIBarButtonItem *)item
    withMenuEventsDelegate:(id<RNSStackHeaderMenuEventsDelegate>)delegate
              stateTracker:(RNSStackHeaderMenuToggleStateTracker *)tracker
{
#if !TARGET_OS_TV || __TV_OS_VERSION_MAX_ALLOWED >= 170000
  if (@available(tvOS 17.0, *)) {
    item.menu = [self buildMenuFromData:data
                    withMenuEventsDelegate:delegate
                              stateTracker:tracker
                       singleSelectionRoot:nil
        initialSingleSelectionStateClaimed:NULL];
  }
#endif // !TARGET_OS_TV || __TV_OS_VERSION_MAX_ALLOWED >= 170000
}

+ (UIMenu *)buildMenuFromData:(RNSStackHeaderMenuData *)data
                withMenuEventsDelegate:(id<RNSStackHeaderMenuEventsDelegate>)delegate
                          stateTracker:(RNSStackHeaderMenuToggleStateTracker *)tracker
                   singleSelectionRoot:(nullable RNSStackHeaderMenuData *)singleSelectionRoot
    initialSingleSelectionStateClaimed:(BOOL *)initialSingleSelectionStateClaimed
{
  // Resolve singleSelection root: first menu in hierarchy with singleSelection becomes the root.
  // Once inside a singleSelection hierarchy, all descendants inherit it.
  // Only the root is set the singleSelection option - less things to check if sth goes wrong
  // and it shouldn't change the behavior
  // There can be at most one element with initialToggleState and we're checking that with
  // initialSingleSelectionStateClaimed
  UIMenuOptions options = 0;
  RNSStackHeaderMenuData *resolvedRoot = singleSelectionRoot;
  BOOL newInitialSingleSelectionStateClaimed = NO;
  if (resolvedRoot == nil && data.singleSelection) {
    options |= UIMenuOptionsSingleSelection;
    resolvedRoot = data;
    initialSingleSelectionStateClaimed = &newInitialSingleSelectionStateClaimed;
  }

  NSMutableArray<UIMenuElement *> *elements = [NSMutableArray arrayWithCapacity:data.children.count];
  for (id<RNSStackHeaderMenuElement> child in data.children) {
    UIMenuElement *element = [self buildElementFromData:child
                                 withMenuEventsDelegate:delegate
                                           stateTracker:tracker
                                             parentMenu:data
                                    singleSelectionRoot:resolvedRoot
                     initialSingleSelectionStateClaimed:initialSingleSelectionStateClaimed];
    if (element != nil) {
      [elements addObject:element];
    }
  }

  return [UIMenu menuWithTitle:data.title image:nil identifier:nil options:options children:elements];
}

+ (nullable UIMenuElement *)buildElementFromData:(id<RNSStackHeaderMenuElement>)element
                          withMenuEventsDelegate:(id<RNSStackHeaderMenuEventsDelegate>)delegate
                                    stateTracker:(RNSStackHeaderMenuToggleStateTracker *)tracker
                                      parentMenu:(RNSStackHeaderMenuData *)parentMenu
                             singleSelectionRoot:(nullable RNSStackHeaderMenuData *)singleSelectionRoot
              initialSingleSelectionStateClaimed:(BOOL *)initialSingleSelectionStateClaimed
{
  if ([element isKindOfClass:[RNSStackHeaderMenuData class]]) {
    return [self buildMenuFromData:(RNSStackHeaderMenuData *)element
                    withMenuEventsDelegate:delegate
                              stateTracker:tracker
                       singleSelectionRoot:singleSelectionRoot
        initialSingleSelectionStateClaimed:initialSingleSelectionStateClaimed];
  }

  if ([element isKindOfClass:[RNSStackHeaderMenuItemData class]]) {
    RNSStackHeaderMenuItemData *itemData = (RNSStackHeaderMenuItemData *)element;
    BOOL insideSingleSelection = singleSelectionRoot != nil;
    RNSMenuItemType effectiveType = [self resolveItemType:itemData.itemType
                                    insideSingleSelection:insideSingleSelection];

    RCTAssert(!(insideSingleSelection && effectiveType == RNSMenuItemTypeAction),
              @"[RNScreens] 'action' itemType is disallowed in singleSelection menus (menuElementId: %@)",
              itemData.menuElementId);

    __weak id<RNSStackHeaderMenuEventsDelegate> weakDelegate = delegate;

    // toggle works differently with singleSelection and without it
    // normally, each toggle is separate and changing one triggers selection change event on direct parent
    // but when singleSelection is set somewhere in the parent *chain*, only one toggle in the whole hierarchy
    // can be turned on at any point in time, and the single selection root is notified, which doesn't need
    // to be a direct parent
    // we don't send press event for toggle by design
    if (effectiveType == RNSMenuItemTypeToggle) {
      if (insideSingleSelection && itemData.initialToggleState) {
        RCTAssert(
            !*initialSingleSelectionStateClaimed,
            @"[RNScreens] Multiple items with initialToggleState=YES in singleSelection menu hierarchy starting from \"%@\".",
            singleSelectionRoot.menuElementId);
        *initialSingleSelectionStateClaimed = YES;
      }
      BOOL isOn = [tracker getToggleStateForItemWithId:itemData.menuElementId initialState:itemData.initialToggleState];

      NSArray<NSString *> *toggleItemsIds = insideSingleSelection
          ? [self getAllToggleItemsIdsInHierarchy:singleSelectionRoot]
          : [self getToggleItemsIdsInMenu:parentMenu];

      NSString *eventMenuId = insideSingleSelection ? singleSelectionRoot.menuElementId : parentMenu.menuElementId;

      UIAction *toggleAction =
          [UIAction actionWithTitle:itemData.title
                              image:nil
                         identifier:nil
                            handler:^(__kindof UIAction *_Nonnull action) {
                              if (insideSingleSelection) {
                                [tracker selectItemWithId:itemData.menuElementId fromIds:toggleItemsIds];
                              } else {
                                [tracker toggleItemWithId:itemData.menuElementId];
                              }

                              NSMutableArray<NSString *> *selectedIds = [NSMutableArray new];
                              for (NSString *itemId in toggleItemsIds) {
                                if ([tracker getToggleStateForItemWithId:itemId initialState:NO]) {
                                  [selectedIds addObject:itemId];
                                }
                              }

                              // the state might be unchanged if user e.g. clicks on the same selected radio
                              if ([tracker toggleStateChanged]) {
                                [weakDelegate didChangeSelectionForMenu:eventMenuId selectedMenuElementIds:selectedIds];
                                [tracker setToggleStateChanged:NO];
                              }
                            }];
      toggleAction.state = isOn ? UIMenuElementStateOn : UIMenuElementStateOff;

      return toggleAction;
    }

    // it effective type is not 'toggle', then it is a regular action button that triggers onPress instead
    return [UIAction actionWithTitle:itemData.title
                               image:nil
                          identifier:nil
                             handler:^(__kindof UIAction *_Nonnull action) {
                               [weakDelegate didPressMenuItem:itemData.menuElementId];
                             }];
  }

  return nil;
}

#pragma mark - Helpers

+ (RNSMenuItemType)resolveItemType:(RNSMenuItemType)itemType insideSingleSelection:(BOOL)insideSingleSelection
{
  if (itemType == RNSMenuItemTypeInherit) {
    return insideSingleSelection ? RNSMenuItemTypeToggle : RNSMenuItemTypeAction;
  }
  return itemType;
}

+ (NSArray<NSString *> *)getToggleItemsIdsInMenu:(RNSStackHeaderMenuData *)menu
{
  NSMutableArray<NSString *> *ids = [NSMutableArray new];
  for (id<RNSStackHeaderMenuElement> child in menu.children) {
    if ([child isKindOfClass:[RNSStackHeaderMenuItemData class]]) {
      RNSStackHeaderMenuItemData *item = (RNSStackHeaderMenuItemData *)child;
      RNSMenuItemType effective = [self resolveItemType:item.itemType insideSingleSelection:menu.singleSelection];
      if (effective == RNSMenuItemTypeToggle) {
        [ids addObject:item.menuElementId];
      }
    }
  }
  return ids;
}

+ (NSArray<NSString *> *)getAllToggleItemsIdsInHierarchy:(RNSStackHeaderMenuData *)menu
{
  NSMutableArray<NSString *> *ids = [NSMutableArray new];
  [self collectToggleItemsIdsFromMenu:menu intoArray:ids insideSingleSelection:menu.singleSelection];
  return ids;
}

+ (void)collectToggleItemsIdsFromMenu:(RNSStackHeaderMenuData *)menu
                            intoArray:(NSMutableArray<NSString *> *)ids
                insideSingleSelection:(bool)insideSingleSelection
{
  for (id<RNSStackHeaderMenuElement> child in menu.children) {
    if ([child isKindOfClass:[RNSStackHeaderMenuItemData class]]) {
      RNSStackHeaderMenuItemData *item = (RNSStackHeaderMenuItemData *)child;
      RNSMenuItemType effective = [self resolveItemType:item.itemType insideSingleSelection:insideSingleSelection];
      if (effective == RNSMenuItemTypeToggle) {
        [ids addObject:item.menuElementId];
      }
    } else if ([child isKindOfClass:[RNSStackHeaderMenuData class]]) {
      [self collectToggleItemsIdsFromMenu:(RNSStackHeaderMenuData *)child
                                intoArray:ids
                    insideSingleSelection:insideSingleSelection];
    }
  }
}

@end
