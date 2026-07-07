#import "RNSStackScreenHeaderCoordinator.h"
#import "RCTAssert.h"
#import "RNSDefines.h"
#import "RNSLog.h"
#import "RNSStackHeaderContentFactory.h"
#import "RNSStackHeaderItemDataProviding.h"
#import "RNSStackHeaderItemSpacerDataProviding.h"
#import "RNSStackHeaderMenuCoordinator.h"
#import "RNSStackHeaderMenuTrackerRegistry.h"
#import "RNSStackNavigationBarCoordinator.h"
#import "RNSStackNavigationController.h"
#import "RNSStackScreenController.h"

@implementation RNSStackScreenHeaderCoordinator {
  __weak RNSStackScreenController *_Nullable _screenController;

  RNSStackHeaderMenuTrackerRegistry *_Nonnull _trackerRegistry;

  NSMutableArray<UIBarButtonItem *> *_Nonnull _leadingBarButtonItems;
  NSMutableArray<UIBarButtonItem *> *_Nonnull _trailingBarButtonItems;
  NSMutableDictionary<NSString *, UIBarButtonItem *> *_Nonnull _barButtonItemsByItemId;
}

- (instancetype)initWithScreenController:(RNSStackScreenController *)controller
{
  if (self = [super init]) {
    _screenController = controller;
    _trackerRegistry = [RNSStackHeaderMenuTrackerRegistry new];
    _leadingBarButtonItems = [NSMutableArray new];
    _trailingBarButtonItems = [NSMutableArray new];
    _barButtonItemsByItemId = [NSMutableDictionary new];
  }
  return self;
}

#pragma mark - Public

- (void)rebuild
{
  if (_configDataProvider == nil) {
    return;
  }

  RNSStackScreenController *controller = [self requireScreenController];

  [_leadingBarButtonItems removeAllObjects];
  [_trailingBarButtonItems removeAllObjects];
  [_barButtonItemsByItemId removeAllObjects];
  [_trackerRegistry clear];

  UIView *titleView = nil;
  UIView *subtitleView = nil;
  UIView *largeSubtitleView = nil;

  for (UIView *child in _configDataProvider.children) {
    if ([child conformsToProtocol:@protocol(RNSStackHeaderItemDataProviding)]) {
      id<RNSStackHeaderItemDataProviding> item = (id<RNSStackHeaderItemDataProviding>)child;

      switch (item.placement) {
        case RNSHeaderItemPlacementLeading:
          [_leadingBarButtonItems addObject:[self buildBarButtonItemForItem:item]];
          break;
        case RNSHeaderItemPlacementTrailing:
          [_trailingBarButtonItems addObject:[self buildBarButtonItemForItem:item]];
          break;
        case RNSHeaderItemPlacementTitle:
          if (item.customView != nil) {
            titleView = [RNSStackHeaderContentFactory wrappedViewForHeaderItem:item
                                                           frameChangeDelegate:_frameChangeDelegate];
          }
          break;
        case RNSHeaderItemPlacementSubtitle:
          if (item.customView != nil) {
            subtitleView = [RNSStackHeaderContentFactory wrappedViewForHeaderItem:item
                                                              frameChangeDelegate:_frameChangeDelegate];
          }
          break;
        case RNSHeaderItemPlacementLargeSubtitle:
          if (item.customView != nil) {
            largeSubtitleView = [RNSStackHeaderContentFactory wrappedViewForHeaderItem:item
                                                                   frameChangeDelegate:_frameChangeDelegate];
          }
          break;
      }
    } else if ([child conformsToProtocol:@protocol(RNSStackHeaderItemSpacerDataProviding)]) {
      id<RNSStackHeaderItemSpacerDataProviding> spacer = (id<RNSStackHeaderItemSpacerDataProviding>)child;
      UIBarButtonItem *bbi = [RNSStackHeaderContentFactory spacerForHeaderSpacerItem:spacer];
      switch (spacer.placement) {
        case RNSHeaderItemSpacerPlacementLeading:
          [_leadingBarButtonItems addObject:bbi];
          break;
        case RNSHeaderItemSpacerPlacementTrailing:
          [_trailingBarButtonItems addObject:bbi];
          break;
      }
    }
  }

  [self applyConfigPropertiesForController:controller];
  [self applyItemsWithTitleView:titleView
                   subtitleView:subtitleView
              largeSubtitleView:largeSubtitleView
                  forController:controller];

  [self applyNavigationBarProperties];
}

- (void)applyConfigProperties
{
  if (_configDataProvider == nil) {
    return;
  }

  [self applyConfigPropertiesForController:[self requireScreenController]];
  [self applyNavigationBarProperties];
}

/**
 Rebuilds an existing item: sets all props and applies the menu config.
 */
- (void)rebuildItemWithId:(NSString *)itemId
{
  if (_configDataProvider == nil || itemId == nil) {
    return;
  }

  UIBarButtonItem *oldBarButtonItem = _barButtonItemsByItemId[itemId];

  id<RNSStackHeaderItemDataProviding> targetItem = [self findItemWithId:itemId];
  if (targetItem == nil) {
    return;
  }

  RNSStackScreenController *controller = [self requireScreenController];

  switch (targetItem.placement) {
    case RNSHeaderItemPlacementLeading: {
      UIBarButtonItem *newBarButtonItem = [self buildBarButtonItemForItem:targetItem];

      if (oldBarButtonItem != nil) {
        NSUInteger index = [_leadingBarButtonItems indexOfObject:oldBarButtonItem];
        if (index != NSNotFound) {
          _leadingBarButtonItems[index] = newBarButtonItem;
        } else {
          RNSLog(@"[RNScreens] Item %@ not found for rebuild.", oldBarButtonItem);
        }
      }

      [controller.navigationItem setLeftBarButtonItems:[_leadingBarButtonItems copy] animated:YES];
      break;
    }
    case RNSHeaderItemPlacementTrailing: {
      UIBarButtonItem *newBarButtonItem = [self buildBarButtonItemForItem:targetItem];

      if (oldBarButtonItem != nil) {
        NSUInteger index = [_trailingBarButtonItems indexOfObject:oldBarButtonItem];
        if (index != NSNotFound) {
          _trailingBarButtonItems[index] = newBarButtonItem;
        } else {
          RNSLog(@"[RNScreens] Item %@ not found for rebuild.", oldBarButtonItem);
        }
      }

      [controller.navigationItem setRightBarButtonItems:[_trailingBarButtonItems copy] animated:YES];
      break;
    }
    case RNSHeaderItemPlacementTitle:
      controller.navigationItem.titleView = targetItem.customView != nil
          ? [RNSStackHeaderContentFactory wrappedViewForHeaderItem:targetItem frameChangeDelegate:_frameChangeDelegate]
          : nil;
      break;
    case RNSHeaderItemPlacementSubtitle:
#if RNS_IPHONE_OS_VERSION_AVAILABLE(26_0)
      if (@available(iOS 26.0, *)) {
        controller.navigationItem.subtitleView = targetItem.customView != nil
            ? [RNSStackHeaderContentFactory wrappedViewForHeaderItem:targetItem
                                                 frameChangeDelegate:_frameChangeDelegate]
            : nil;
      }
#endif // RNS_IPHONE_OS_VERSION_AVAILABLE(26_0)
      break;
    case RNSHeaderItemPlacementLargeSubtitle:
#if RNS_IPHONE_OS_VERSION_AVAILABLE(26_0)
      if (@available(iOS 26.0, *)) {
        controller.navigationItem.largeSubtitleView = targetItem.customView != nil
            ? [RNSStackHeaderContentFactory wrappedViewForHeaderItem:targetItem
                                                 frameChangeDelegate:_frameChangeDelegate]
            : nil;
      }
#endif // RNS_IPHONE_OS_VERSION_AVAILABLE(26_0)
      break;
  }
}

- (void)resetTrackerForItemWithId:(NSString *)itemId
{
  if (itemId != nil) {
    [_trackerRegistry resetTrackerForItemId:itemId];
  }
}

- (void)clearHeaderConfiguration
{
  _configDataProvider = nil;
  _frameChangeDelegate = nil;
  _eventsDelegate = nil;

  [_leadingBarButtonItems removeAllObjects];
  [_trailingBarButtonItems removeAllObjects];
  [_barButtonItemsByItemId removeAllObjects];
  [_trackerRegistry clear];

  RNSStackScreenController *controller = [self requireScreenController];
  UINavigationItem *navItem = controller.navigationItem;

  navItem.title = nil;
  navItem.titleView = nil;
  [navItem setLeftBarButtonItems:@[] animated:YES];
  [navItem setRightBarButtonItems:@[] animated:YES];

#if RNS_IPHONE_OS_VERSION_AVAILABLE(26_0)
  if (@available(iOS 26.0, *)) {
    navItem.subtitle = nil;
    navItem.largeTitle = nil;
    navItem.largeSubtitle = nil;
    navItem.subtitleView = nil;
    navItem.largeSubtitleView = nil;
  }
#endif // RNS_IPHONE_OS_VERSION_AVAILABLE(26_0)

#if !TARGET_OS_TV
  navItem.largeTitleDisplayMode = UINavigationItemLargeTitleDisplayModeNever;
#endif // !TARGET_OS_TV

  RNSStackNavigationController *navController = [self getNavigationController];
  if (navController != nil) {
    [navController.navigationBarCoordinator setHidden:NO forNavigationController:navController animated:YES];
  }
}

/**
 Finds an existing barButtonItem and its corresponding config, then applies it again.
 If the config is missing, it clears the menu.
 */
- (void)reapplyMenuForItemWithId:(NSString *)itemId
{
  if (_configDataProvider == nil || itemId == nil) {
    return;
  }

  UIBarButtonItem *barButtonItem = _barButtonItemsByItemId[itemId];
  if (barButtonItem == nil) {
    return;
  }

  id<RNSStackHeaderItemDataProviding> item = [self findItemWithId:itemId];
  if (item == nil) {
    return;
  }

  if (item.menu == nil) {
    barButtonItem.menu = nil;
    return;
  }

  RNSStackHeaderMenuToggleStateTracker *tracker = [_trackerRegistry trackerForItemId:itemId];
  __weak auto weakSelf = self;
  [RNSStackHeaderMenuCoordinator applyMenu:item.menu
                           toBarButtonItem:barButtonItem
                  withHeaderEventsDelegate:_eventsDelegate
                              stateTracker:tracker
                        menuToggleCallback:^{
                          [weakSelf reapplyMenuForItemWithId:itemId];
                        }];
}

- (nullable id<RNSStackHeaderItemDataProviding>)findItemWithId:(NSString *)itemId
{
  for (UIView *child in _configDataProvider.children) {
    if ([child conformsToProtocol:@protocol(RNSStackHeaderItemDataProviding)]) {
      id<RNSStackHeaderItemDataProviding> item = (id<RNSStackHeaderItemDataProviding>)child;
      if ([item.itemId isEqualToString:itemId]) {
        return item;
      }
    }
  }
  return nil;
}

#pragma mark - Private

- (RNSStackScreenController *)requireScreenController
{
  RCTAssert(_screenController != nil, @"[RNScreens] Screen Controller cannot be nil");
  return _screenController;
}

- (nullable RNSStackNavigationController *)getNavigationController
{
  RNSStackScreenController *screenController = [self requireScreenController];
  UINavigationController *navController = screenController.navigationController;
  if (navController == nil) {
    return nil;
  }

  RCTAssert([navController isKindOfClass:RNSStackNavigationController.class],
            @"[RNScreens] NavigationController should be instance of RNSStackNavigationController");
  return (RNSStackNavigationController *)navController;
}

- (void)applyNavigationBarProperties
{
  RNSStackNavigationController *navController = [self getNavigationController];
  if (navController != nil) {
    [navController.navigationBarCoordinator setHidden:_configDataProvider.hidden
                              forNavigationController:navController
                                             animated:YES];
  }
}

- (void)applyConfigPropertiesForController:(RNSStackScreenController *)controller
{
  UINavigationItem *navItem = controller.navigationItem;

  navItem.title = _configDataProvider.title;

#if RNS_IPHONE_OS_VERSION_AVAILABLE(26_0)
  if (@available(iOS 26.0, *)) {
    navItem.largeTitle = _configDataProvider.largeTitle;
    navItem.subtitle = _configDataProvider.subtitle;
    navItem.largeSubtitle = _configDataProvider.largeSubtitle;
  }
#endif // RNS_IPHONE_OS_VERSION_AVAILABLE(26_0)

#if !TARGET_OS_TV
  navItem.largeTitleDisplayMode = _configDataProvider.largeTitleEnabled ? UINavigationItemLargeTitleDisplayModeAlways
                                                                        : UINavigationItemLargeTitleDisplayModeNever;
#endif // !TARGET_OS_TV
}

- (void)applyItemsWithTitleView:(nullable UIView *)titleView
                   subtitleView:(nullable UIView *)subtitleView
              largeSubtitleView:(nullable UIView *)largeSubtitleView
                  forController:(RNSStackScreenController *)controller
{
  UINavigationItem *navItem = controller.navigationItem;

#if !TARGET_OS_TV
  navItem.leftItemsSupplementBackButton = YES;
#endif // !TARGET_OS_TV

  [navItem setLeftBarButtonItems:[_leadingBarButtonItems copy] animated:YES];
  [navItem setRightBarButtonItems:[_trailingBarButtonItems copy] animated:YES];

  navItem.titleView = titleView;

#if RNS_IPHONE_OS_VERSION_AVAILABLE(26_0)
  if (@available(iOS 26.0, *)) {
    navItem.subtitleView = subtitleView;
    navItem.largeSubtitleView = largeSubtitleView;
  }
#endif // RNS_IPHONE_OS_VERSION_AVAILABLE(26_0)
}

- (UIBarButtonItem *)buildBarButtonItemForItem:(id<RNSStackHeaderItemDataProviding>)item
{
  UIBarButtonItem *barButtonItem = [RNSStackHeaderContentFactory barButtonItemForHeaderItem:item
                                                                    withFrameChangeDelegate:_frameChangeDelegate
                                                                   withHeaderEventsDelegate:_eventsDelegate];

  if (item.menu != nil && item.itemId != nil) {
    RNSStackHeaderMenuToggleStateTracker *tracker = [_trackerRegistry trackerForItemId:item.itemId];
    __weak auto weakSelf = self;
    NSString *capturedItemId = item.itemId;
    [RNSStackHeaderMenuCoordinator applyMenu:item.menu
                             toBarButtonItem:barButtonItem
                    withHeaderEventsDelegate:_eventsDelegate
                                stateTracker:tracker
                          menuToggleCallback:^{
                            [weakSelf reapplyMenuForItemWithId:capturedItemId];
                          }];
  }

  if (item.itemId != nil) {
    _barButtonItemsByItemId[item.itemId] = barButtonItem;
  }

  return barButtonItem;
}

@end
