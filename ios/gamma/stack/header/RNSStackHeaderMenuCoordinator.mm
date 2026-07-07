#import "RNSStackHeaderMenuCoordinator.h"
#import "RNSDefines.h"

#import <React/RCTAssert.h>

@implementation RNSStackHeaderMenuCoordinator

+ (void)applyMenu:(RNSStackHeaderMenuData *)data
             toBarButtonItem:(UIBarButtonItem *)item
    withHeaderEventsDelegate:(id<RNSStackHeaderEventsDelegate>)delegate
                stateTracker:(RNSStackHeaderMenuToggleStateTracker *)tracker
          menuToggleCallback:(nullable void (^)(void))onMenuToggle
{
#if !TARGET_OS_TV || __TV_OS_VERSION_MAX_ALLOWED >= 170000
  if (@available(tvOS 17.0, *)) {
    item.menu = [self buildMenuFromData:data
                  withHeaderEventsDelegate:delegate
                              stateTracker:tracker
                       singleSelectionRoot:nil
        initialSingleSelectionStateClaimed:NULL
                        menuToggleCallback:onMenuToggle];
  }
#endif // !TARGET_OS_TV || __TV_OS_VERSION_MAX_ALLOWED >= 170000
}

+ (UIMenu *)buildMenuFromData:(RNSStackHeaderMenuData *)data
              withHeaderEventsDelegate:(id<RNSStackHeaderEventsDelegate>)delegate
                          stateTracker:(RNSStackHeaderMenuToggleStateTracker *)tracker
                   singleSelectionRoot:(nullable RNSStackHeaderMenuData *)singleSelectionRoot
    initialSingleSelectionStateClaimed:(BOOL *)initialSingleSelectionStateClaimed
                    menuToggleCallback:(nullable void (^)(void))onMenuToggle
{
  // Resolve singleSelection root: first menu in hierarchy with singleSelection becomes the root.
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
                               withHeaderEventsDelegate:delegate
                                           stateTracker:tracker
                                             parentMenu:data
                                    singleSelectionRoot:resolvedRoot
                     initialSingleSelectionStateClaimed:initialSingleSelectionStateClaimed
                                     menuToggleCallback:onMenuToggle];
    if (element != nil) {
      [elements addObject:element];
    }
  }

  return [UIMenu menuWithTitle:data.title image:nil identifier:nil options:options children:elements];
}

+ (nullable UIMenuElement *)buildElementFromData:(id<RNSStackHeaderMenuElement>)element
                        withHeaderEventsDelegate:(id<RNSStackHeaderEventsDelegate>)delegate
                                    stateTracker:(RNSStackHeaderMenuToggleStateTracker *)tracker
                                      parentMenu:(RNSStackHeaderMenuData *)parentMenu
                             singleSelectionRoot:(nullable RNSStackHeaderMenuData *)singleSelectionRoot
              initialSingleSelectionStateClaimed:(BOOL *)initialSingleSelectionStateClaimed
                              menuToggleCallback:(nullable void (^)(void))onMenuToggle
{
  if ([element isKindOfClass:[RNSStackHeaderMenuData class]]) {
    return [self buildMenuFromData:(RNSStackHeaderMenuData *)element
                  withHeaderEventsDelegate:delegate
                              stateTracker:tracker
                       singleSelectionRoot:singleSelectionRoot
        initialSingleSelectionStateClaimed:initialSingleSelectionStateClaimed
                        menuToggleCallback:onMenuToggle];
  }

  if ([element isKindOfClass:[RNSStackHeaderMenuItemData class]]) {
    RNSStackHeaderMenuItemData *itemData = (RNSStackHeaderMenuItemData *)element;
    BOOL insideSingleSelection = singleSelectionRoot != nil;
    RNSMenuItemType effectiveItemType = [self resolveItemType:itemData.itemType
                                        insideSingleSelection:insideSingleSelection];

    RCTAssert(!(insideSingleSelection && effectiveItemType == RNSMenuItemTypeAction),
              @"[RNScreens] 'action' itemType is disallowed in singleSelection menus (id: %@)",
              itemData.menuElementId);

    if (effectiveItemType == RNSMenuItemTypeToggle) {
      if (insideSingleSelection && itemData.initialToggleState) {
        RCTAssert(
            !*initialSingleSelectionStateClaimed,
            @"[RNScreens] Multiple items with initialToggleState=YES in singleSelection menu hierarchy starting from \"%@\".",
            singleSelectionRoot.menuElementId);
        *initialSingleSelectionStateClaimed = YES;
      }
      return [self buildToggleFromData:itemData
                        withParentMenu:parentMenu
                   singleSelectionRoot:singleSelectionRoot
                    toggleStateTracker:tracker
                  headerEventsDelegate:delegate
                    menuToggleCallback:onMenuToggle];
    }

    // it effective type is not 'toggle', then it is a regular action button that triggers onPress instead
    return [self buildActionFromData:itemData withHeaderEventsDelegate:delegate];
  }

  return nil;
}

/**
 Builds item which can be toggled on / off.

 Toggle works differently with singleSelection and without it. Normally, each toggle is separate and changing one
 triggers selection change event on direct parent, but when singleSelection is set somewhere in the parent *chain*,
 only one toggle in the whole hierarchy can be turned on at any point in time, and the single selection root,
 which doesn't need to be a direct parent, is notified.

 We don't send press event for toggle by design.
 */
+ (nullable UIMenuElement *)buildToggleFromData:(RNSStackHeaderMenuItemData *)data
                                 withParentMenu:(RNSStackHeaderMenuData *)parentMenu
                            singleSelectionRoot:(nullable RNSStackHeaderMenuData *)singleSelectionRoot
                             toggleStateTracker:(RNSStackHeaderMenuToggleStateTracker *)tracker
                           headerEventsDelegate:(id<RNSStackHeaderEventsDelegate>)delegate
                             menuToggleCallback:(nullable void (^)(void))onMenuToggle
{
  BOOL isItemToggledOn = [tracker getToggleStateForItemWithId:data.menuElementId initialState:data.initialToggleState];
  BOOL insideSingleSelection = singleSelectionRoot != nil;

  NSString *eventMenuId = insideSingleSelection ? singleSelectionRoot.menuElementId : parentMenu.menuElementId;

  __weak id<RNSStackHeaderEventsDelegate> weakDelegate = delegate;

  UIAction *toggleAction = [UIAction
      actionWithTitle:data.title
                image:nil
           identifier:nil
              handler:^(__kindof UIAction *_Nonnull action) {
                NSArray<NSString *> *toggleItemsIds = insideSingleSelection
                    ? [RNSStackHeaderMenuCoordinator getAllToggleItemsIdsInSingleSelectionHierarchy:singleSelectionRoot]
                    : [RNSStackHeaderMenuCoordinator getToggleItemsIdsInMenu:parentMenu];
                if (insideSingleSelection) {
                  [tracker selectItemWithId:data.menuElementId fromIds:toggleItemsIds];
                } else {
                  [tracker toggleItemWithId:data.menuElementId];
                }

                NSMutableArray<NSString *> *selectedIds = [NSMutableArray new];
                for (NSString *itemId in toggleItemsIds) {
                  if ([tracker getToggleStateForItemWithId:itemId initialState:NO]) {
                    [selectedIds addObject:itemId];
                  }
                }

                // the state might be unchanged if user e.g. clicks on the same selected
                // radio
                if ([tracker toggleStateChanged]) {
                  [weakDelegate didChangeSelectionForMenu:eventMenuId selectedMenuItemIds:selectedIds];

                  [tracker setToggleStateChanged:NO];
                }

                if (onMenuToggle) {
                  onMenuToggle();
                }
              }];
  toggleAction.state = isItemToggledOn ? UIMenuElementStateOn : UIMenuElementStateOff;

  [self decorateActionKeepsMenuPresented:toggleAction withData:data];

  return toggleAction;
}

+ (nullable UIMenuElement *)buildActionFromData:(RNSStackHeaderMenuItemData *)data
                       withHeaderEventsDelegate:(id<RNSStackHeaderEventsDelegate>)delegate
{
  __weak id<RNSStackHeaderEventsDelegate> weakDelegate = delegate;

  UIAction *action = [UIAction actionWithTitle:data.title
                                         image:nil
                                    identifier:nil
                                       handler:^(__kindof UIAction *_Nonnull action) {
                                         [weakDelegate didPressMenuItem:data.menuElementId];
                                       }];

  [self decorateActionKeepsMenuPresented:action withData:data];

  return action;
}

#pragma mark - Helpers

+ (RNSMenuItemType)resolveItemType:(RNSMenuItemType)itemType insideSingleSelection:(BOOL)insideSingleSelection
{
  if (itemType == RNSMenuItemTypeAutomatic) {
    return insideSingleSelection ? RNSMenuItemTypeToggle : RNSMenuItemTypeAction;
  }
  return itemType;
}

+ (NSArray<NSString *> *)getToggleItemsIdsInMenu:(RNSStackHeaderMenuData *)menu
{
  NSMutableArray<NSString *> *ids = [NSMutableArray new];
  [self collectToggleItemsIdsFromMenu:menu intoArray:ids insideSingleSelection:NO];
  return ids;
}

+ (NSArray<NSString *> *)getAllToggleItemsIdsInSingleSelectionHierarchy:(RNSStackHeaderMenuData *)menu
{
  NSMutableArray<NSString *> *ids = [NSMutableArray new];
  [self collectToggleItemsIdsFromMenu:menu intoArray:ids insideSingleSelection:YES];
  return ids;
}

+ (void)collectToggleItemsIdsFromMenu:(RNSStackHeaderMenuData *)menu
                            intoArray:(NSMutableArray<NSString *> *)ids
                insideSingleSelection:(bool)insideSingleSelection
{
  for (id<RNSStackHeaderMenuElement> child in menu.children) {
    if ([child isKindOfClass:[RNSStackHeaderMenuItemData class]]) {
      RNSStackHeaderMenuItemData *item = (RNSStackHeaderMenuItemData *)child;
      RNSMenuItemType effectiveItemType = [self resolveItemType:item.itemType
                                          insideSingleSelection:insideSingleSelection];
      if (effectiveItemType == RNSMenuItemTypeToggle) {
        [ids addObject:item.menuElementId];
      }
    } else if (insideSingleSelection && [child isKindOfClass:[RNSStackHeaderMenuData class]]) {
      [self collectToggleItemsIdsFromMenu:(RNSStackHeaderMenuData *)child
                                intoArray:ids
                    insideSingleSelection:insideSingleSelection];
    }
  }
}

+ (void)decorateActionKeepsMenuPresented:(UIAction *)action withData:(RNSStackHeaderMenuItemData *)data
{
  if (data.keepsMenuPresented) {
#if RNS_IPHONE_OS_VERSION_AVAILABLE(16_0) || (TARGET_OS_TV && __TV_OS_VERSION_MAX_ALLOWED >= 160000)
    if (@available(iOS 16.0, tvOS 16.0, *)) {
      action.attributes |= UIMenuElementAttributesKeepsMenuPresented;
    }
#endif
  }
}

@end
