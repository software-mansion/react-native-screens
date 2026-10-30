#import "RNSTabsScreenViewController.h"
#import "RNSAssert.h"
#import "RNSContainer.h"
#import "RNSContainerItemSupport.h"
#import "RNSDefines.h"
#import "RNSLog.h"
#import "RNSTabBarController.h"
#import "UIScrollView+RNScreens.h"

@implementation RNSTabsScreenViewController {
  RNSContainerItemSupport *_Nonnull _containerItemSupport;
}

- (instancetype)init
{
  if (self = [super init]) {
    _containerItemSupport = [RNSContainerItemSupport new];
  }
  return self;
}

- (nullable RNSTabBarController *)findTabBarController
{
  return static_cast<RNSTabBarController *_Nullable>(self.tabBarController);
}

- (nullable UIView<RNSTabsContainerItemConfigProviding> *)configProvider
{
  return static_cast<UIView<RNSTabsContainerItemConfigProviding> *>(self.view);
}

- (void)tabItemAppearanceHasChanged
{
  [[self findTabBarController] setNeedsUpdateOfTabBarAppearance:true];
}

- (void)tabScreenOrientationHasChanged
{
  [[self findTabBarController] setNeedsOrientationUpdate:true];
}

- (void)viewWillAppear:(BOOL)animated
{
  [super viewWillAppear:animated];
  [_delegate viewControllerViewWillAppear:self];
}

- (void)viewDidAppear:(BOOL)animated
{
  [super viewDidAppear:animated];
  [_delegate viewControllerViewDidAppear:self];
}

- (void)viewWillDisappear:(BOOL)animated
{
  [super viewWillDisappear:animated];
  [_delegate viewControllerViewWillDisappear:self];
}

- (void)viewDidDisappear:(BOOL)animated
{
  [super viewDidDisappear:animated];
  [_delegate viewControllerViewDidDisappear:self];
}

- (void)didMoveToParentViewController:(UIViewController *)parent
{
  RNSLogD(@"TabScreen [%ld] ctrl moved to parent: %@", self.configProvider.tag, parent);

  if (parent == nil) {
    return;
  }

  // Can be UINavigationController in case of MoreNavigationController
  RNSAssert([parent isKindOfClass:RNSTabBarController.class] || [parent isKindOfClass:UINavigationController.class],
            @"[RNScreens] TabScreenViewController added to parent of unexpected type: %@",
            parent.class);

  if ([parent isKindOfClass:UINavigationController.class]) {
    // Hide the navigation bar for the more controller
    [(UINavigationController *)parent setNavigationBarHidden:YES animated:YES];
  }

  RNSTabBarController *tabBarCtrl = [self findTabBarController];

  RNSAssert(tabBarCtrl != nil,
            @"[RNScreens] nullish tabBarCtrl after TabScreenViewController has been added to parent");

  [tabBarCtrl setNeedsUpdateOfTabBarAppearance:true];
  [tabBarCtrl updateTabBarAppearanceIfNeeded];
}

- (void)setTabsSpecialEffectsDelegate:(id<RNSTabsSpecialEffectsSupporting>)delegate
{
  RNSAssert(
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
  } else if (self.configProvider.shouldUseRepeatedTabSelectionScrollToTopSpecialEffect) {
    return [[self findContentScrollView] rnscreens_scrollToTop];
  }

  return false;
}

#pragma mark - RNSContainerItem

- (void)registerNestedContainer:(id<RNSContainer>)container
{
  [_containerItemSupport registerNestedContainer:container];
}

- (void)unregisterNestedContainer:(id<RNSContainer>)container
{
  [_containerItemSupport unregisterNestedContainer:container];
}

- (nullable id<RNSContainer>)resolveNestedContainer
{
  return [_containerItemSupport resolveNestedContainer];
}

- (nullable UIScrollView *)findContentScrollView
{
  return [_containerItemSupport findContentScrollViewWithCachedScrollView:[self.configProvider cachedContentScrollView]
                                                            heuristicRoot:self.configProvider];
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

  return self.configProvider.orientation;
}

#endif // !TARGET_OS_TV

@end

@implementation RNSTabsScreenViewController (TabsScreenPropsForwarding)

- (nullable NSString *)getScreenKeyOrNull
{
  return self.configProvider.screenKey;
}

- (BOOL)isPreventNativeSelectionEnabled
{
  return self.configProvider.preventNativeSelection;
}

@end
