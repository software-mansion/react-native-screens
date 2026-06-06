#import "RNSTabsScreenViewController.h"
#import "RNSBarButtonItem.h"
#import "RNSDefines.h"
#import "RNSLog.h"
#import "RNSScrollViewFinder.h"
#import "RNSTabBarController.h"
#import "UIScrollView+RNScreens.h"

@implementation RNSTabsScreenViewController {
  __weak UIViewController *_searchToolbarItemsOwner;
  NSArray<UIBarButtonItem *> *_searchToolbarItemsOwnerBaseItems;
  BOOL _searchToolbarItemsOwnerHadHiddenToolbar;
}

- (nullable RNSTabBarController *)findTabBarController
{
  return static_cast<RNSTabBarController *_Nullable>(self.tabBarController);
}

- (nullable RNSTabsScreenComponentView *)tabScreenComponentView
{
  return static_cast<RNSTabsScreenComponentView *>(self.view);
}

- (void)tabItemAppearanceHasChanged
{
  [[self findTabBarController] setNeedsUpdateOfTabBarAppearance:true];
}

- (void)tabScreenOrientationHasChanged
{
  [[self findTabBarController] setNeedsOrientationUpdate:true];
}

- (void)clearSearchToolbarItems
{
#if RNS_IPHONE_OS_VERSION_AVAILABLE(26_0) && !TARGET_OS_TV
  if (@available(iOS 26.0, *)) {
    if (_searchToolbarItemsOwner != nil) {
      [_searchToolbarItemsOwner setToolbarItems:_searchToolbarItemsOwnerBaseItems animated:YES];
      [_searchToolbarItemsOwner.navigationController setToolbarHidden:_searchToolbarItemsOwnerHadHiddenToolbar
                                                              animated:YES];
      _searchToolbarItemsOwner = nil;
      _searchToolbarItemsOwnerBaseItems = nil;
      _searchToolbarItemsOwnerHadHiddenToolbar = NO;
    }
  }
#endif // RNS_IPHONE_OS_VERSION_AVAILABLE(26_0) && !TARGET_OS_TV
}

- (void)updateSearchToolbarItemsWithImageLoader:(nullable RCTImageLoader *)imageLoader
{
#if RNS_IPHONE_OS_VERSION_AVAILABLE(26_0) && !TARGET_OS_TV
  if (@available(iOS 26.0, *)) {
    RNSTabsScreenComponentView *screenView = self.tabScreenComponentView;
    UIViewController *toolbarOwner = [self activeSearchToolbarViewController];
    UINavigationItem *navigationItem = toolbarOwner.navigationItem;
    UIBarButtonItem *searchBarItem = navigationItem.searchBarPlacementBarButtonItem;

    if (screenView.systemItem != RNSTabsScreenSystemItemSearch || screenView.searchToolbarItems.count == 0 ||
        navigationItem.searchController == nil || !navigationItem.searchBarPlacementAllowsToolbarIntegration ||
        searchBarItem == nil) {
      [self clearSearchToolbarItems];
      return;
    }

    NSArray<UIBarButtonItem *> *baseItems = nil;
    if (_searchToolbarItemsOwner == toolbarOwner) {
      baseItems = _searchToolbarItemsOwnerBaseItems ?: @[];
    } else {
      [self clearSearchToolbarItems];
      _searchToolbarItemsOwner = toolbarOwner;
      _searchToolbarItemsOwnerBaseItems = toolbarOwner.toolbarItems ?: @[];
      _searchToolbarItemsOwnerHadHiddenToolbar = toolbarOwner.navigationController.toolbarHidden;
      baseItems = _searchToolbarItemsOwnerBaseItems;
    }

    NSMutableArray<UIBarButtonItem *> *items = [NSMutableArray arrayWithArray:baseItems ?: @[]];
    [items addObject:searchBarItem];
    [items addObjectsFromArray:[self toolbarButtonItemsFromConfigs:screenView.searchToolbarItems
                                                       imageLoader:imageLoader]];
    [toolbarOwner setToolbarItems:items animated:YES];
    [toolbarOwner.navigationController setToolbarHidden:NO animated:YES];
  }
#else
  [self clearSearchToolbarItems];
#endif // RNS_IPHONE_OS_VERSION_AVAILABLE(26_0) && !TARGET_OS_TV
}

#if RNS_IPHONE_OS_VERSION_AVAILABLE(26_0) && !TARGET_OS_TV
- (UIViewController *)activeSearchToolbarViewController API_AVAILABLE(ios(26.0))
{
  UIViewController *controller = self;
  while (true) {
    if ([controller isKindOfClass:UINavigationController.class]) {
      UINavigationController *navigationController = static_cast<UINavigationController *>(controller);
      UIViewController *visibleViewController =
          navigationController.visibleViewController ?: navigationController.topViewController;
      if (visibleViewController == nil || visibleViewController == controller) {
        return controller;
      }
      controller = visibleViewController;
      continue;
    }

    UIViewController *childViewController = controller.childViewControllers.lastObject;
    if (childViewController == nil) {
      return controller;
    }
    controller = childViewController;
  }
}

- (NSArray<UIBarButtonItem *> *)toolbarButtonItemsFromConfigs:(NSArray<NSDictionary<NSString *, id> *> *)dicts
                                                  imageLoader:(nullable RCTImageLoader *)imageLoader
    API_AVAILABLE(ios(26.0))
{
  NSMutableArray<UIBarButtonItem *> *items = [NSMutableArray arrayWithCapacity:dicts.count];
  __weak RNSTabsScreenViewController *weakSelf = self;
  for (NSDictionary<NSString *, id> *dict in dicts) {
    if (dict[@"buttonId"] == nil) {
      continue;
    }

    RNSBarButtonItem *item = [[RNSBarButtonItem alloc]
        initWithConfig:dict
                action:^(NSString *buttonId) {
                  [weakSelf.tabScreenComponentView.reactEventEmitter emitOnPressToolbarItem:buttonId];
                }
            menuAction:nil
           imageLoader:imageLoader];
    [items addObject:item];
  }
  return items;
}
#endif // RNS_IPHONE_OS_VERSION_AVAILABLE(26_0) && !TARGET_OS_TV

- (void)viewWillAppear:(BOOL)animated
{
  [super viewWillAppear:animated];
  [self.tabScreenComponentView.reactEventEmitter emitOnWillAppear];
}

- (void)viewDidAppear:(BOOL)animated
{
  [super viewDidAppear:animated];
  [self.tabScreenComponentView.reactEventEmitter emitOnDidAppear];
  RNSTabBarController *tabBarController = [self findTabBarController];
  tabBarController.needsUpdateOfSearchToolbarItems = true;
  [tabBarController updateSearchToolbarItemsIfNeeded];
}

- (void)viewWillDisappear:(BOOL)animated
{
  [super viewWillDisappear:animated];
  [self.tabScreenComponentView.reactEventEmitter emitOnWillDisappear];
}

- (void)viewDidDisappear:(BOOL)animated
{
  [super viewDidDisappear:animated];
  [self.tabScreenComponentView.reactEventEmitter emitOnDidDisappear];
}

- (void)didMoveToParentViewController:(UIViewController *)parent
{
  RNSLog(@"TabScreen [%ld] ctrl moved to parent: %@", self.tabScreenComponentView.tag, parent);

  if (parent == nil) {
    return;
  }

  // Can be UINavigationController in case of MoreNavigationController
  RCTAssert([parent isKindOfClass:RNSTabBarController.class] || [parent isKindOfClass:UINavigationController.class],
            @"[RNScreens] TabScreenViewController added to parent of unexpected type: %@",
            parent.class);

  if ([parent isKindOfClass:UINavigationController.class]) {
    // Hide the navigation bar for the more controller
    [(UINavigationController *)parent setNavigationBarHidden:YES animated:YES];
  }

  RNSTabBarController *tabBarCtrl = [self findTabBarController];

  RCTAssert(tabBarCtrl != nil,
            @"[RNScreens] nullish tabBarCtrl after TabScreenViewController has been added to parent");

  [tabBarCtrl setNeedsUpdateOfTabBarAppearance:true];
  [tabBarCtrl updateTabBarAppearanceIfNeeded];
}

- (void)setTabsSpecialEffectsDelegate:(id<RNSTabsSpecialEffectsSupporting>)delegate
{
  RCTAssert(
      delegate != nil,
      @"[RNScreens] can't set special effects delegate to nil. Use clearTabsSpecialEffectsDelegateIfNeeded instead.");
  _tabsSpecialEffectsDelegate = delegate;
}

- (void)clearTabsSpecialEffectsDelegateIfNeeded:(id<RNSTabsSpecialEffectsSupporting>)delegate
{
  if (_tabsSpecialEffectsDelegate == delegate) {
    _tabsSpecialEffectsDelegate = nil;
  }
}

- (bool)tabScreenSelectedRepeatedly
{
  if ([self tabsSpecialEffectsDelegate] != nil) {
    return [[self tabsSpecialEffectsDelegate] onRepeatedTabSelectionOfTabScreenController:self];
  } else if (self.tabScreenComponentView.shouldUseRepeatedTabSelectionScrollToTopSpecialEffect) {
    UIScrollView *scrollView =
        [RNSScrollViewFinder findScrollViewInFirstDescendantChainFrom:[self tabScreenComponentView]];
    return [scrollView rnscreens_scrollToTop];
  }

  return false;
}

#if !TARGET_OS_TV

- (RNSOrientation)evaluateOrientation
{
  if ([self.childViewControllers.lastObject respondsToSelector:@selector(evaluateOrientation)]) {
    id<RNSOrientationProviding> child = static_cast<id<RNSOrientationProviding>>(self.childViewControllers.lastObject);
    RNSOrientation childOrientation = [child evaluateOrientation];

    if (childOrientation != RNSOrientationInherit) {
      return childOrientation;
    }
  }

  return self.tabScreenComponentView.orientation;
}

#endif // !TARGET_OS_TV

@end

@implementation RNSTabsScreenViewController (TabsScreenPropsForwarding)

- (nullable NSString *)getScreenKeyOrNull
{
  return self.tabScreenComponentView.screenKey;
}

- (BOOL)isPreventNativeSelectionEnabled
{
  return self.tabScreenComponentView.preventNativeSelection;
}

@end
