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

- (nullable UIView<RNSTabsScreenDataProviding> *)tabScreenView
{
  return static_cast<UIView<RNSTabsScreenDataProviding> *>(self.view);
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
  [_delegate tabsScreenViewControllerWillAppear:self];
}

- (void)viewDidAppear:(BOOL)animated
{
  [super viewDidAppear:animated];
  [_delegate tabsScreenViewControllerDidAppear:self];
}

- (void)viewWillDisappear:(BOOL)animated
{
  [super viewWillDisappear:animated];
  [_delegate tabsScreenViewControllerWillDisappear:self];
}

- (void)viewDidDisappear:(BOOL)animated
{
  [super viewDidDisappear:animated];
  [_delegate tabsScreenViewControllerDidDisappear:self];
}

- (void)didMoveToParentViewController:(UIViewController *)parent
{
  RNSLogD(@"TabScreen [%ld] ctrl moved to parent: %@", self.tabScreenView.tag, parent);

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
  } else if (self.tabScreenView.shouldUseRepeatedTabSelectionScrollToTopSpecialEffect) {
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
  return [_containerItemSupport findContentScrollViewWithCachedScrollView:[self.tabScreenView cachedContentScrollView]
                                                            heuristicRoot:self.tabScreenView];
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

  return self.tabScreenView.orientation;
}

#endif // !TARGET_OS_TV

@end

@implementation RNSTabsScreenViewController (TabsScreenPropsForwarding)

- (nullable NSString *)getScreenKeyOrNull
{
  return self.tabScreenView.screenKey;
}

- (BOOL)isPreventNativeSelectionEnabled
{
  return self.tabScreenView.preventNativeSelection;
}

@end
