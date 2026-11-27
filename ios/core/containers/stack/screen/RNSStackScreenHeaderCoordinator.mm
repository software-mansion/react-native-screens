#import "RNSStackScreenHeaderCoordinator.h"
#import "RNSAssert.h"
#import "RNSDefines.h"
#import "RNSLog.h"
#import "RNSStackHeaderContentFactory.h"
#import "RNSStackHeaderItemDataProviding.h"
#import "RNSStackHeaderItemSpacerDataProviding.h"
#import "RNSStackHeaderMenuCoordinator.h"
#import "RNSStackHeaderMenuFinder.h"
#import "RNSStackHeaderMenuToggleStateTracker.h"
#import "RNSStackNavigationBarCoordinator.h"
#import "RNSStackNavigationController.h"
#import "RNSStackScreenController.h"

#if RNS_IPHONE_OS_VERSION_AVAILABLE(27_0) && !TARGET_OS_TV && !TARGET_OS_VISION
API_AVAILABLE(ios(27.0))
static UIBarButtonItemVisibilityPriority RNSBarButtonItemVisibilityPriorityFromVisibilityPriority(
    RNSHeaderItemVisibilityPriority visibilityPriority);
#endif // RNS_IPHONE_OS_VERSION_AVAILABLE(27_0) && !TARGET_OS_TV && !TARGET_OS_VISION

/**
 What the coordinator built for a child of the header config.
 */
@interface RNSStackHeaderChildRecord : NSObject

// Set for the header items placed in the leading or the trailing area and for the spacers.
@property (nonatomic, strong, nullable) UIBarButtonItem *barButtonItem;
// Set for the header items that provide the title, subtitle or large subtitle view.
@property (nonatomic, strong, nullable) UIView *wrapperView;
@property (nonatomic) BOOL isFlexibleSpacer;

@end

@implementation RNSStackHeaderChildRecord
@end

// UIKit keeps moving the header items that were kept across an update for a while after the bar button items are
// set, without a layout callback on their wrappers, so the frames are reported once more after this delay. In logs of
// items growing, shrinking, added and removed the frames stopped changing 0.3 s after the items were set on iOS 26
// and 0.85 s on iOS 27, where they were within 0.2 pt of the final ones after 0.65 s; iOS 17 moves the items at once.
static const NSTimeInterval RNSItemFramesSettleDelay = 0.75;

@implementation RNSStackScreenHeaderCoordinator {
  __weak RNSStackScreenController *_Nullable _screenController;

#if !TARGET_OS_TV
  // Navigation item of the screen below, onto which the back button
  // configuration has been applied. Kept so that the configuration can be
  // cleared when the owning screen is popped from the stack.
  __weak UINavigationItem *_Nullable _backButtonConfigTargetItem;
#endif // !TARGET_OS_TV

  // Toggle state of the title menu. Header items own the trackers of their menus.
  RNSStackHeaderMenuToggleStateTracker *_Nonnull _titleMenuTracker;

  NSArray<UIBarButtonItem *> *_Nonnull _leadingBarButtonItems;
  NSArray<UIBarButtonItem *> *_Nonnull _trailingBarButtonItems;

  // Keyed by the child view, not by the item id: a child that is removed and added again in one transaction is a new
  // view and gets a new bar button item, even when it reuses the id, while a child that is only moved keeps its own.
  NSMapTable<id, RNSStackHeaderChildRecord *> *_Nonnull _recordsByChild;
  // Children whose properties changed since the last `updateItems`.
  NSHashTable<id> *_Nonnull _childrenNeedingUpdate;
  // Header items whose menu or menu representation changed since the last `updateItems`.
  NSHashTable<id> *_Nonnull _itemsNeedingMenuUpdate;

  // The delayed report of the item frames that is pending, if any. See `setNeedsItemFramesUpdate`.
  dispatch_block_t _Nullable _pendingItemFramesReport;
}

- (void)dealloc
{
  [self cancelPendingItemFramesReport];
}

- (instancetype)initWithScreenController:(RNSStackScreenController *)controller
{
  if (self = [super init]) {
    _screenController = controller;
    _titleMenuTracker = [RNSStackHeaderMenuToggleStateTracker new];
    _leadingBarButtonItems = @[];
    _trailingBarButtonItems = @[];
    _recordsByChild = [RNSStackScreenHeaderCoordinator makeRecordsByChild];
    _childrenNeedingUpdate = [RNSStackScreenHeaderCoordinator makeChildrenSet];
    _itemsNeedingMenuUpdate = [RNSStackScreenHeaderCoordinator makeChildrenSet];
  }
  return self;
}

+ (NSMapTable<id, RNSStackHeaderChildRecord *> *)makeRecordsByChild
{
  return [NSMapTable mapTableWithKeyOptions:NSPointerFunctionsWeakMemory | NSPointerFunctionsObjectPointerPersonality
                               valueOptions:NSPointerFunctionsStrongMemory];
}

+ (NSHashTable<id> *)makeChildrenSet
{
  return [NSHashTable hashTableWithOptions:NSPointerFunctionsWeakMemory | NSPointerFunctionsObjectPointerPersonality];
}

#pragma mark - Public

- (void)updateNavigationBarVisibilityAnimated:(BOOL)animated
{
  RNSStackNavigationController *navController = [self getNavigationController];
  if (navController == nil || navController.topViewController != _screenController) {
    return;
  }

  BOOL hidden = _configDataProvider == nil ? !_showsNavigationBarWithoutHeaderConfig : _configDataProvider.hidden;
  [navController.navigationBarCoordinator setHidden:hidden forNavigationController:navController animated:animated];
}

- (void)applyHeaderConfiguration
{
  if (_configDataProvider == nil) {
    return;
  }

  RNSStackScreenController *controller = [self requireScreenController];

  [self applyConfigPropertiesForController:controller];
  [self updateItems];

  [self applyTitleMenuForController:controller];
  [self updateNavigationBarVisibilityAnimated:YES];
#if !TARGET_OS_TV
  [self updateBackButtonMenuEnabled];
#endif // !TARGET_OS_TV
}

- (void)setNeedsUpdateForChild:(id)child
{
  if (child != nil) {
    [_childrenNeedingUpdate addObject:child];
  }
}

- (void)setNeedsMenuUpdateForItem:(id<RNSStackHeaderItemDataProviding>)item
{
  if (item != nil) {
    [_itemsNeedingMenuUpdate addObject:item];
  }
}

- (void)updateItems
{
  if (_configDataProvider == nil) {
    return;
  }

  RNSStackScreenController *controller = [self requireScreenController];
  UINavigationItem *navItem = controller.navigationItem;

  NSMapTable<id, RNSStackHeaderChildRecord *> *records = [RNSStackScreenHeaderCoordinator makeRecordsByChild];
  NSMutableArray<UIBarButtonItem *> *leadingBarButtonItems = [NSMutableArray new];
  NSMutableArray<UIBarButtonItem *> *trailingBarButtonItems = [NSMutableArray new];

  UIView *titleView = nil;
  UIView *subtitleView = nil;
  UIView *largeSubtitleView = nil;

  BOOL didChangeAnyItem = NO;

  for (UIView *child in _configDataProvider.children) {
    RNSStackHeaderChildRecord *record = [_recordsByChild objectForKey:child];
    if (record == nil) {
      record = [RNSStackHeaderChildRecord new];
    }
    [records setObject:record forKey:child];

    BOOL needsUpdate = [_childrenNeedingUpdate containsObject:child];

    if ([child conformsToProtocol:@protocol(RNSStackHeaderItemDataProviding)]) {
      id<RNSStackHeaderItemDataProviding> item = (id<RNSStackHeaderItemDataProviding>)child;

      switch (item.placement) {
        case RNSHeaderItemPlacementLeading:
        case RNSHeaderItemPlacementTrailing: {
          BOOL needsMenuUpdate = [_itemsNeedingMenuUpdate containsObject:child];
          didChangeAnyItem |= [self updateBarButtonItemInRecord:record
                                                        forItem:item
                                                    needsUpdate:needsUpdate
                                                needsMenuUpdate:needsMenuUpdate];
          [item.placement == RNSHeaderItemPlacementLeading ? leadingBarButtonItems : trailingBarButtonItems
              addObject:record.barButtonItem];
          break;
        }
        case RNSHeaderItemPlacementTitle:
          titleView = [self updateWrapperViewInRecord:record forItem:item];
          break;
        case RNSHeaderItemPlacementSubtitle:
          subtitleView = [self updateWrapperViewInRecord:record forItem:item];
          break;
        case RNSHeaderItemPlacementLargeSubtitle:
          largeSubtitleView = [self updateWrapperViewInRecord:record forItem:item];
          break;
      }
    } else if ([child conformsToProtocol:@protocol(RNSStackHeaderItemSpacerDataProviding)]) {
      id<RNSStackHeaderItemSpacerDataProviding> spacer = (id<RNSStackHeaderItemSpacerDataProviding>)child;
      didChangeAnyItem |= [self updateBarButtonItemInRecord:record forSpacer:spacer needsUpdate:needsUpdate];
      switch (spacer.placement) {
        case RNSHeaderItemSpacerPlacementLeading:
          [leadingBarButtonItems addObject:record.barButtonItem];
          break;
        case RNSHeaderItemSpacerPlacementTrailing:
          [trailingBarButtonItems addObject:record.barButtonItem];
          break;
      }
    }
  }

  // Records of the children that are gone are dropped here, together with their bar button items.
  _recordsByChild = records;
  [_childrenNeedingUpdate removeAllObjects];
  [_itemsNeedingMenuUpdate removeAllObjects];

#if !TARGET_OS_TV
  if (!navItem.leftItemsSupplementBackButton) {
    navItem.leftItemsSupplementBackButton = YES;
  }
#endif // !TARGET_OS_TV

  // The arrays are compared by the identity of the bar button items. Setting an array that did not change would make
  // UIKit lay the items out again for nothing.
  if (![_leadingBarButtonItems isEqualToArray:leadingBarButtonItems]) {
    _leadingBarButtonItems = [leadingBarButtonItems copy];
    [navItem setLeftBarButtonItems:_leadingBarButtonItems animated:YES];
    didChangeAnyItem = YES;
  }
  if (![_trailingBarButtonItems isEqualToArray:trailingBarButtonItems]) {
    _trailingBarButtonItems = [trailingBarButtonItems copy];
    [navItem setRightBarButtonItems:_trailingBarButtonItems animated:YES];
    didChangeAnyItem = YES;
  }

  if (navItem.titleView != titleView) {
    navItem.titleView = titleView;
  }

#if RNS_IPHONE_OS_VERSION_AVAILABLE(26_0)
  if (@available(iOS 26.0, *)) {
    if (navItem.subtitleView != subtitleView) {
      navItem.subtitleView = subtitleView;
    }
    if (navItem.largeSubtitleView != largeSubtitleView) {
      navItem.largeSubtitleView = largeSubtitleView;
    }
  }
#endif // RNS_IPHONE_OS_VERSION_AVAILABLE(26_0)

  if (didChangeAnyItem) {
    [self setNeedsItemFramesUpdate];
  }
}

- (void)applyConfigProperties
{
  if (_configDataProvider == nil) {
    return;
  }

  [self applyConfigPropertiesForController:[self requireScreenController]];
  [self updateNavigationBarVisibilityAnimated:YES];
#if !TARGET_OS_TV
  [self updateBackButtonMenuEnabled];
#endif // !TARGET_OS_TV
}

#if !TARGET_OS_TV
- (void)updateBackButtonMenuEnabled
{
  RNSStackNavigationController *navController = [self getNavigationController];
  if (navController == nil || navController.topViewController != _screenController) {
    return;
  }

  BOOL enabled = _configDataProvider == nil || _configDataProvider.backButtonMenuEnabled;
  [navController.navigationBarCoordinator setBackButtonMenuEnabled:enabled forNavigationController:navController];
}
#endif // !TARGET_OS_TV

- (void)reapplyTitleMenu
{
  if (_configDataProvider == nil) {
    return;
  }
  [self applyTitleMenuForController:[self requireScreenController]];
}

- (void)resetTitleMenuTracker
{
  _titleMenuTracker = [RNSStackHeaderMenuToggleStateTracker new];
}

- (void)setToggleState:(BOOL)state
      forMenuElementId:(NSString *)elementId
          inHeaderItem:(id<RNSStackHeaderItemDataProviding>)headerItem
              rootMenu:(RNSStackHeaderMenuData *)rootMenu
            parentMenu:(nullable RNSStackHeaderMenuData *)parentMenu
{
  if (headerItem == nil) {
    return;
  }

  [self setToggleState:state
      forMenuElementId:elementId
               tracker:headerItem.menuToggleStateTracker
              rootMenu:rootMenu
            parentMenu:parentMenu];
}

- (void)setTitleMenuToggleState:(BOOL)state
               forMenuElementId:(NSString *)elementId
                       rootMenu:(RNSStackHeaderMenuData *)rootMenu
                     parentMenu:(nullable RNSStackHeaderMenuData *)parentMenu
{
  [self setToggleState:state
      forMenuElementId:elementId
               tracker:_titleMenuTracker
              rootMenu:rootMenu
            parentMenu:parentMenu];
}

- (void)setToggleState:(BOOL)state
      forMenuElementId:(NSString *)elementId
               tracker:(RNSStackHeaderMenuToggleStateTracker *)tracker
              rootMenu:(RNSStackHeaderMenuData *)rootMenu
            parentMenu:(nullable RNSStackHeaderMenuData *)parentMenu
{
  if (_configDataProvider == nil || elementId == nil || rootMenu == nil) {
    return;
  }

  if ([tracker toggleStateEquals:state forItemWithId:elementId]) {
    return;
  }

  RNSStackHeaderMenuData *singleSelectionRoot = [RNSStackHeaderMenuFinder singleSelectionRootForElementWithId:elementId
                                                                                                       inMenu:rootMenu];

  NSString *eventMenuId = nil;
  NSArray<NSString *> *toggleIds = nil;

  if (singleSelectionRoot != nil) {
    if (!state) {
      // Setting false in singleSelection is ignored — one item must always be selected.
      return;
    }
    toggleIds = [RNSStackHeaderMenuCoordinator getAllToggleItemsIdsInSingleSelectionHierarchy:singleSelectionRoot];
    [tracker selectItemWithId:elementId fromIds:toggleIds];
    eventMenuId = singleSelectionRoot.menuElementId;
  } else {
    [tracker setToggleState:state forItemWithId:elementId];
    toggleIds = parentMenu != nil ? [RNSStackHeaderMenuCoordinator getToggleItemsIdsInMenu:parentMenu] : @[ elementId ];
    eventMenuId = parentMenu != nil ? parentMenu.menuElementId : nil;
  }

  if (eventMenuId != nil) {
    NSMutableArray<NSString *> *selectedIds = [NSMutableArray new];
    for (NSString *toggleId in toggleIds) {
      if ([tracker getToggleStateForItemWithId:toggleId initialState:NO]) {
        [selectedIds addObject:toggleId];
      }
    }
    [_eventsDelegate didChangeSelectionForMenu:eventMenuId selectedMenuItemIds:selectedIds];
  }
}

- (void)clearHeaderConfiguration
{
  _configDataProvider = nil;
  _frameChangeDelegate = nil;
  _eventsDelegate = nil;
  _imageLoader = nil;

  _leadingBarButtonItems = @[];
  _trailingBarButtonItems = @[];
  [_recordsByChild removeAllObjects];
  [_childrenNeedingUpdate removeAllObjects];
  [_itemsNeedingMenuUpdate removeAllObjects];
  [self cancelPendingItemFramesReport];
  _titleMenuTracker = [RNSStackHeaderMenuToggleStateTracker new];

  RNSStackScreenController *controller = [self requireScreenController];
  UINavigationItem *navItem = controller.navigationItem;

  navItem.title = nil;
  navItem.titleView = nil;
  navItem.standardAppearance = nil;
  navItem.scrollEdgeAppearance = nil;
  [navItem setLeftBarButtonItems:@[] animated:YES];
  [navItem setRightBarButtonItems:@[] animated:YES];

#if !TARGET_OS_TV
  if (@available(iOS 16.0, *)) {
    navItem.titleMenuProvider = nil;
  }
#endif // !TARGET_OS_TV

#if RNS_IPHONE_OS_VERSION_AVAILABLE(26_0)
  if (@available(iOS 26.0, *)) {
    navItem.subtitle = nil;
    navItem.largeTitle = nil;
    navItem.largeSubtitle = nil;
    navItem.subtitleView = nil;
    navItem.largeSubtitleView = nil;
  }
#endif // RNS_IPHONE_OS_VERSION_AVAILABLE(26_0)

#if RNS_IPHONE_OS_VERSION_AVAILABLE(27_0) && !TARGET_OS_VISION && !TARGET_OS_TV
  if (@available(iOS 27.0, *)) {
    navItem.navigationBarMinimization = [UIBarMinimization new];
  }
#endif // Check for iOS >= 27 && !TARGET_OS_VISION && !TARGET_OS_TV

#if !TARGET_OS_TV
  navItem.prompt = nil;
  navItem.largeTitleDisplayMode = UINavigationItemLargeTitleDisplayModeNever;

  [self clearAppliedBackButtonConfig];
#endif // !TARGET_OS_TV

  [self updateNavigationBarVisibilityAnimated:YES];
#if !TARGET_OS_TV
  [self updateBackButtonMenuEnabled];
#endif // !TARGET_OS_TV
}

- (void)reapplyMenuForItem:(nullable id<RNSStackHeaderItemDataProviding>)item
{
  if (_configDataProvider == nil || item == nil) {
    return;
  }

  UIBarButtonItem *barButtonItem = [_recordsByChild objectForKey:item].barButtonItem;
  if (barButtonItem == nil) {
    return;
  }

  [self applyMenuOfItem:item toBarButtonItem:barButtonItem];
}

#pragma mark - Private

- (RNSStackScreenController *)requireScreenController
{
  RNSAssert(_screenController != nil, @"[RNScreens] Screen Controller cannot be nil");
  return _screenController;
}

- (nullable RNSStackNavigationController *)getNavigationController
{
  RNSStackScreenController *screenController = [self requireScreenController];
  UINavigationController *navController = screenController.navigationController;
  if (navController == nil) {
    return nil;
  }

  RNSAssert([navController isKindOfClass:RNSStackNavigationController.class],
            @"[RNScreens] NavigationController should be instance of RNSStackNavigationController");
  return (RNSStackNavigationController *)navController;
}

- (void)applyConfigPropertiesForController:(RNSStackScreenController *)controller
{
  UINavigationItem *navItem = controller.navigationItem;

  navItem.title = _configDataProvider.title;
  navItem.standardAppearance = _configDataProvider.standardAppearance;
  navItem.scrollEdgeAppearance = _configDataProvider.scrollEdgeAppearance;

#if !TARGET_OS_TV
  NSString *prompt = _configDataProvider.prompt;
  if (navItem.prompt != prompt && ![navItem.prompt isEqualToString:prompt]) {
    navItem.prompt = prompt;
    // UIKit does not resize an already visible navigation bar when the prompt
    // of its navigation item changes - request layout explicitly.
    [controller.navigationController.view setNeedsLayout];
  }

  [self applyBackButtonConfigForController:controller];
#endif // !TARGET_OS_TV

#if RNS_IPHONE_OS_VERSION_AVAILABLE(26_0)
  if (@available(iOS 26.0, *)) {
    navItem.largeTitle = _configDataProvider.largeTitle;
    navItem.subtitle = _configDataProvider.subtitle;
    navItem.largeSubtitle = _configDataProvider.largeSubtitle;
  }
#endif // RNS_IPHONE_OS_VERSION_AVAILABLE(26_0)

#if RNS_IPHONE_OS_VERSION_AVAILABLE(27_0) && !TARGET_OS_VISION && !TARGET_OS_TV
  if (@available(iOS 27.0, *)) {
    UIBarMinimization *minimization = [UIBarMinimization new];
    minimization.minimizationBehavior = _configDataProvider.minimizationBehavior;
    minimization.restorationBehavior = _configDataProvider.restorationBehavior;
    minimization.safeAreaAdjustment = _configDataProvider.safeAreaAdjustment;
    navItem.navigationBarMinimization = minimization;
  }
#endif // Check for iOS >= 27 && !TARGET_OS_VISION && !TARGET_OS_TV

#if !TARGET_OS_TV
  navItem.largeTitleDisplayMode = _configDataProvider.largeTitleEnabled ? UINavigationItemLargeTitleDisplayModeAlways
                                                                        : UINavigationItemLargeTitleDisplayModeNever;
#endif // !TARGET_OS_TV
}

#if !TARGET_OS_TV
- (void)applyBackButtonConfigForController:(RNSStackScreenController *)controller
{
  NSArray<UIViewController *> *viewControllers = controller.navigationController.viewControllers;
  NSUInteger index = [viewControllers indexOfObject:controller];
  if (index == NSNotFound || index == 0) {
    return;
  }

  UINavigationItem *prevItem = viewControllers[index - 1].navigationItem;
  _backButtonConfigTargetItem = prevItem;
  prevItem.backButtonTitle = _configDataProvider.backButtonTitle;
  prevItem.backButtonDisplayMode = _configDataProvider.backButtonDisplayMode;
}
#endif // !TARGET_OS_TV

#if !TARGET_OS_TV
- (void)clearAppliedBackButtonConfig
{
  UINavigationItem *targetItem = _backButtonConfigTargetItem;
  _backButtonConfigTargetItem = nil;
  targetItem.backButtonTitle = nil;
  targetItem.backButtonDisplayMode = UINavigationItemBackButtonDisplayModeDefault;
}
#endif // !TARGET_OS_TV

- (void)applyTitleMenuForController:(RNSStackScreenController *)controller
{
#if !TARGET_OS_TV
  if (@available(iOS 16.0, *)) {
    RNSStackHeaderMenuData *titleMenuData = _configDataProvider.titleMenu;
    UINavigationItem *navItem = controller.navigationItem;

    if (titleMenuData == nil) {
      navItem.titleMenuProvider = nil;
      return;
    }

    RNSStackHeaderMenuToggleStateTracker *tracker = _titleMenuTracker;
    __weak auto weakSelf = self;
    __weak auto weakEventsDelegate = _eventsDelegate;
    __weak auto weakImageLoader = _imageLoader;

    navItem.titleMenuProvider = ^UIMenu *(NSArray<UIMenuElement *> *suggestedActions) {
      if (weakEventsDelegate == nil || weakImageLoader == nil) {
        return nil;
      }
      return [RNSStackHeaderMenuCoordinator buildUIMenuFromData:titleMenuData
                                       withHeaderEventsDelegate:weakEventsDelegate
                                                   stateTracker:tracker
                                                withImageLoader:weakImageLoader
                                        menuInvalidatedCallback:^{
                                          [weakSelf reapplyTitleMenu];
                                        }];
    };
  }
#endif // !TARGET_OS_TV
}

/**
 Makes sure that `record` holds a bar button item that matches `item`: builds one when there is none yet, updates the
 existing one when the item is marked, and leaves it alone otherwise. Returns whether anything was done.

 UIKit applies these properties to a bar button item that is already in the navigation bar, so they are changed in
 place: title, image, tint color, enabled, style, `primaryAction` (the `onPress` wiring), `customView` (an item
 switching between a label and a custom view), `hidesSharedBackground`, menu and menu representation. Checked on
 iOS 17.5, 26.5 and 27.3. See `needsNewBarButtonItemInsteadOf:forItem:` for the properties that need a new bar button
 item.
 */
- (BOOL)updateBarButtonItemInRecord:(RNSStackHeaderChildRecord *)record
                            forItem:(id<RNSStackHeaderItemDataProviding>)item
                        needsUpdate:(BOOL)needsUpdate
                    needsMenuUpdate:(BOOL)needsMenuUpdate
{
  UIBarButtonItem *barButtonItem = record.barButtonItem;
  if (barButtonItem != nil && !needsUpdate && !needsMenuUpdate) {
    return NO;
  }

  if (barButtonItem != nil && needsUpdate && [self needsNewBarButtonItemInsteadOf:barButtonItem forItem:item]) {
    barButtonItem = nil;
  }

  if (barButtonItem == nil) {
    barButtonItem = [RNSStackHeaderContentFactory barButtonItemForHeaderItem:item
                                                     withFrameChangeDelegate:_frameChangeDelegate
                                                    withHeaderEventsDelegate:_eventsDelegate
                                                             withImageLoader:_imageLoader
                                                          iconLoadedCallback:[self makeIconLoadedCallback]];
    record.barButtonItem = barButtonItem;
    [self applyCreationOnlyPropertiesOfItem:item toBarButtonItem:barButtonItem];
    [self applyItemPropertiesOfItem:item toBarButtonItem:barButtonItem];
    [self applyMenuOfItem:item toBarButtonItem:barButtonItem];
    return YES;
  }

  if (needsUpdate) {
    [RNSStackHeaderContentFactory updateBarButtonItem:barButtonItem
                                        forHeaderItem:item
                              withFrameChangeDelegate:_frameChangeDelegate
                             withHeaderEventsDelegate:_eventsDelegate
                                      withImageLoader:_imageLoader
                                   iconLoadedCallback:[self makeIconLoadedCallback]];
    [self applyItemPropertiesOfItem:item toBarButtonItem:barButtonItem];
  }

  if (needsMenuUpdate) {
    [self applyMenuOfItem:item toBarButtonItem:barButtonItem];
  }

  return YES;
}

/**
 An icon that is loaded asynchronously is set on the bar button item outside `updateItems`. It may differ in size from
 its placeholder, which moves the other items.
 */
- (void (^)(void))makeIconLoadedCallback
{
  __weak auto weakSelf = self;
  return ^{
    [weakSelf setNeedsItemFramesUpdate];
  };
}

- (BOOL)updateBarButtonItemInRecord:(RNSStackHeaderChildRecord *)record
                          forSpacer:(id<RNSStackHeaderItemSpacerDataProviding>)spacer
                        needsUpdate:(BOOL)needsUpdate
{
  if (record.barButtonItem != nil && !needsUpdate) {
    return NO;
  }

  // A change of the sizing is the only one that needs a new bar spacer item: whether the item is a fixed or a flexible
  // space is a system item kind, which UIKit lets us choose only when creating the item. The width of a fixed spacer
  // is changed in place.
  if (record.barButtonItem == nil || record.isFlexibleSpacer != spacer.isFlexible) {
    record.barButtonItem = [RNSStackHeaderContentFactory spacerForHeaderSpacerItem:spacer];
    record.isFlexibleSpacer = spacer.isFlexible;
  } else {
    [RNSStackHeaderContentFactory updateBarButtonItem:record.barButtonItem forHeaderSpacerItem:spacer];
  }

  return YES;
}

/**
 Returns the view to put in the title, subtitle or large subtitle area for `item`. The view wrapping the custom view
 is kept in `record` for as long as the item has a custom view.
 */
- (nullable UIView *)updateWrapperViewInRecord:(RNSStackHeaderChildRecord *)record
                                       forItem:(id<RNSStackHeaderItemDataProviding>)item
{
  UIView *customView = item.customView;
  if (customView == nil) {
    record.wrapperView = nil;
  } else if (record.wrapperView == nil || customView.superview != record.wrapperView) {
    record.wrapperView = [RNSStackHeaderContentFactory wrappedViewForHeaderItem:item
                                                            frameChangeDelegate:_frameChangeDelegate];
  }
  return record.wrapperView;
}

/**
 Whether a property changed that UIKit takes into account only for a bar button item that is new to the navigation
 bar.
 */
- (BOOL)needsNewBarButtonItemInsteadOf:(UIBarButtonItem *)barButtonItem
                               forItem:(id<RNSStackHeaderItemDataProviding>)item
{
#if RNS_IPHONE_OS_VERSION_AVAILABLE(26_0)
  if (@available(iOS 26.0, *)) {
    // The identifier matches the items of two screens during a transition. It could not be shown that UIKit follows
    // a change made on an item that is already in the bar: in a UIKit-only sample on iOS 26.5 the push transition
    // with an identifier set on a live item did not look different from the one with no identifier at all. The item
    // is therefore built again, as it was before the items started to be updated in place.
    if (barButtonItem.identifier != item.identifier && ![barButtonItem.identifier isEqualToString:item.identifier]) {
      return YES;
    }
  }
#endif // RNS_IPHONE_OS_VERSION_AVAILABLE(26_0)

#if RNS_IPHONE_OS_VERSION_AVAILABLE(27_0) && !TARGET_OS_TV && !TARGET_OS_VISION
  if (@available(iOS 27.0, *)) {
    // On iOS 27.3 a new priority does not change which items go to the overflow menu when it is set on an item that
    // is already in the bar. Laying out the navigation bar or setting the same bar button items again does not help
    // either; only a new bar button item is placed according to its priority.
    if (barButtonItem.visibilityPriority !=
        RNSBarButtonItemVisibilityPriorityFromVisibilityPriority(item.visibilityPriority)) {
      return YES;
    }
  }
#endif // RNS_IPHONE_OS_VERSION_AVAILABLE(27_0) && !TARGET_OS_TV && !TARGET_OS_VISION

#if RNS_IPHONE_OS_VERSION_AVAILABLE(27_0)
  if (@available(iOS 27.0, *)) {
    // It was not checked whether UIKit follows a change of the padding removal made on an item that is already in
    // the bar. The item is therefore built again, as it was before the items started to be updated in place.
    if (barButtonItem.paddingRemoved != item.paddingRemoved) {
      return YES;
    }
  }
#endif // RNS_IPHONE_OS_VERSION_AVAILABLE(27_0)

  return NO;
}

/**
 Applies the properties that are set only on a new bar button item. See `needsNewBarButtonItemInsteadOf:forItem:`.
 */
- (void)applyCreationOnlyPropertiesOfItem:(id<RNSStackHeaderItemDataProviding>)item
                          toBarButtonItem:(UIBarButtonItem *)barButtonItem
{
#if RNS_IPHONE_OS_VERSION_AVAILABLE(26_0)
  if (@available(iOS 26.0, *)) {
    barButtonItem.identifier = item.identifier;
  }
#endif // RNS_IPHONE_OS_VERSION_AVAILABLE(26_0)

// tvOS and visionOS are excluded on purpose: `visibilityPriority` exists there, but the only
// supported value is `standard`, which is already the default.
#if RNS_IPHONE_OS_VERSION_AVAILABLE(27_0) && !TARGET_OS_TV && !TARGET_OS_VISION
  if (@available(iOS 27.0, *)) {
    barButtonItem.visibilityPriority =
        RNSBarButtonItemVisibilityPriorityFromVisibilityPriority(item.visibilityPriority);
  }
#endif // RNS_IPHONE_OS_VERSION_AVAILABLE(27_0) && !TARGET_OS_TV && !TARGET_OS_VISION

#if RNS_IPHONE_OS_VERSION_AVAILABLE(27_0)
  if (@available(iOS 27.0, *)) {
    barButtonItem.paddingRemoved = item.paddingRemoved;
  }
#endif // RNS_IPHONE_OS_VERSION_AVAILABLE(27_0)
}

/**
 Applies the properties that are common to the label and the custom view bar button items and can be changed on
 an item that is already in the navigation bar.
 */
- (void)applyItemPropertiesOfItem:(id<RNSStackHeaderItemDataProviding>)item
                  toBarButtonItem:(UIBarButtonItem *)barButtonItem
{
#if RNS_IPHONE_OS_VERSION_AVAILABLE(26_0)
  if (@available(iOS 26.0, *)) {
    if (barButtonItem.hidesSharedBackground != item.hidesSharedBackground) {
      barButtonItem.hidesSharedBackground = item.hidesSharedBackground;
    }
  }
#endif // RNS_IPHONE_OS_VERSION_AVAILABLE(26_0)
}

/**
 Applies the menu and the menu representation of `item`; a missing one is cleared.
 */
- (void)applyMenuOfItem:(id<RNSStackHeaderItemDataProviding>)item toBarButtonItem:(UIBarButtonItem *)barButtonItem
{
  if (item.menu == nil) {
    if (barButtonItem.menu != nil) {
      barButtonItem.menu = nil;
    }
  } else {
    __weak auto weakSelf = self;
    __weak id<RNSStackHeaderItemDataProviding> weakItem = item;
    [RNSStackHeaderMenuCoordinator applyMenu:item.menu
                             toBarButtonItem:barButtonItem
                    withHeaderEventsDelegate:_eventsDelegate
                                stateTracker:item.menuToggleStateTracker
                             withImageLoader:_imageLoader
                     menuInvalidatedCallback:^{
                       [weakSelf reapplyMenuForItem:weakItem];
                     }];
  }

  [self applyMenuRepresentationOfItem:item toBarButtonItem:barButtonItem];
}

- (void)applyMenuRepresentationOfItem:(id<RNSStackHeaderItemDataProviding>)item
                      toBarButtonItem:(UIBarButtonItem *)barButtonItem
{
  __weak auto weakSelf = self;
  __weak id<RNSStackHeaderItemDataProviding> weakItem = item;
  [RNSStackHeaderMenuCoordinator applyMenuRepresentation:item.menuRepresentation
                                         toBarButtonItem:barButtonItem
                                withHeaderEventsDelegate:_eventsDelegate
                                            stateTracker:item.menuToggleStateTracker
                                         withImageLoader:_imageLoader
                                 menuInvalidatedCallback:^{
                                   [weakSelf reapplyMenuRepresentationForItem:weakItem];
                                 }];
}

- (void)reapplyMenuRepresentationForItem:(nullable id<RNSStackHeaderItemDataProviding>)item
{
  if (_configDataProvider == nil || item == nil) {
    return;
  }

  UIBarButtonItem *barButtonItem = [_recordsByChild objectForKey:item].barButtonItem;
  if (barButtonItem == nil) {
    return;
  }

  [self applyMenuRepresentationOfItem:item toBarButtonItem:barButtonItem];
}

#pragma mark - Item frames

/**
 Reports the frames of the items to the frame change delegate after the items changed.

 A custom view reports its frame when its own wrapper is laid out. That is not enough once the bar button items are
 kept across updates: UIKit moves an item that was left alone, when another one is added, removed or changes its
 size, by moving the views above the wrapper, so the wrapper is not laid out and nothing is reported. The frames are
 therefore reported on the next turn of the main queue, with the navigation bar laid out with the new items, and once
 more after `RNSItemFramesSettleDelay`. Until then the reported frame of a moved custom view may lag behind.

 A call made while a delayed report is pending puts that report off; there is at most one per header.
 */
- (void)setNeedsItemFramesUpdate
{
  [self cancelPendingItemFramesReport];

  __weak auto weakSelf = self;
  dispatch_async(dispatch_get_main_queue(), ^{
    [weakSelf reportItemFrames];
  });

  _pendingItemFramesReport = dispatch_block_create(static_cast<dispatch_block_flags_t>(0), ^{
    [weakSelf reportItemFrames];
  });
  dispatch_after(dispatch_time(DISPATCH_TIME_NOW, static_cast<int64_t>(RNSItemFramesSettleDelay * NSEC_PER_SEC)),
                 dispatch_get_main_queue(),
                 _pendingItemFramesReport);
}

- (void)cancelPendingItemFramesReport
{
  if (_pendingItemFramesReport != nil) {
    dispatch_block_cancel(_pendingItemFramesReport);
    _pendingItemFramesReport = nil;
  }
}

- (void)reportItemFrames
{
  RNSStackScreenController *controller = _screenController;
  UINavigationController *navController = controller.navigationController;
  UINavigationBar *navigationBar = navController.navigationBar;

  // The items of a screen that is covered or not in a window are not in the navigation bar. Their wrappers report
  // the frames when they get there.
  if (navController == nil || navController.topViewController != controller || navigationBar.window == nil) {
    return;
  }

  // Does nothing unless a layout is pending; the frames are read from the views. The delegate skips the frames that
  // did not change.
  [navigationBar layoutIfNeeded];
  [_frameChangeDelegate viewFrameDidChange:navigationBar];
}

@end

#if RNS_IPHONE_OS_VERSION_AVAILABLE(27_0) && !TARGET_OS_TV && !TARGET_OS_VISION
API_AVAILABLE(ios(27.0))
static UIBarButtonItemVisibilityPriority RNSBarButtonItemVisibilityPriorityFromVisibilityPriority(
    RNSHeaderItemVisibilityPriority visibilityPriority)
{
  switch (visibilityPriority) {
    case RNSHeaderItemVisibilityPriorityLow:
      return UIBarButtonItemVisibilityPriorityLow;
    case RNSHeaderItemVisibilityPriorityStandard:
      return UIBarButtonItemVisibilityPriorityStandard;
    case RNSHeaderItemVisibilityPriorityHigh:
      return UIBarButtonItemVisibilityPriorityHigh;
    default:
      RNSLogE(@"[RNScreens] Unsupported visibility priority");
      return UIBarButtonItemVisibilityPriorityStandard;
  }
}
#endif // RNS_IPHONE_OS_VERSION_AVAILABLE(27_0) && !TARGET_OS_TV && !TARGET_OS_VISION
