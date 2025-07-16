#import "RNSTabsScreenViewController.h"
#import "RNSScrollViewFinder.h"
#import "RNSTabBarController.h"
#import "UIScrollView+RNScreens.h"

@implementation RNSTabsScreenViewController

- (nullable RNSTabBarController *)findTabBarController
{
  return static_cast<RNSTabBarController *_Nullable>(self.tabBarController);
}

- (nullable RNSBottomTabsScreenComponentView *)tabScreenComponentView
{
  return static_cast<RNSBottomTabsScreenComponentView *>(self.view);
}

- (void)tabScreenFocusHasChanged
{
  NSLog(
      @"TabScreen [%ld] changed focus: %d",
      self.tabScreenComponentView.tag,
      self.tabScreenComponentView.isSelectedScreen);

  // The focus of owned tab has been updated from react. We tell the parent controller that it should update the
  // container.
  [[self findTabBarController] setNeedsUpdateOfSelectedTab:true];
}

- (void)tabItemAppearanceHasChanged
{
  [[self findTabBarController] setNeedsUpdateOfTabBarAppearance:true];
}

- (void)viewWillAppear:(BOOL)animated
{
  [self.tabScreenComponentView.reactEventEmitter emitOnWillAppear];
}

- (void)viewDidAppear:(BOOL)animated
{
  [self.tabScreenComponentView.reactEventEmitter emitOnDidAppear];
}

- (void)viewWillDisappear:(BOOL)animated
{
  [self.tabScreenComponentView.reactEventEmitter emitOnWillDisappear];
}

- (void)viewDidDisappear:(BOOL)animated
{
  [self.tabScreenComponentView.reactEventEmitter emitOnDidDisappear];
}

- (void)didMoveToParentViewController:(UIViewController *)parent
{
  NSLog(@"TabScreen [%ld] ctrl moved to parent: %@", self.tabScreenComponentView.tag, parent);

  if (parent == nil) {
    return;
  }

  RCTAssert(
      [parent isKindOfClass:RNSTabBarController.class],
      @"[RNScreens] TabScreenViewController added to parent of unexpected type: %@",
      parent.class);

  RNSTabBarController *tabBarCtrl = [self findTabBarController];

  RCTAssert(
      tabBarCtrl != nil, @"[RNScreens] nullish tabBarCtrl after TabScreenViewController has been added to parent");

  [tabBarCtrl setNeedsUpdateOfTabBarAppearance:true];
  [tabBarCtrl updateTabBarAppearanceIfNeeded];
}

- (void)setTabsSpecialEffectsDelegate:(id<RNSBottomTabsSpecialEffectsSupporting>)delegate
{
  RCTAssert(
      delegate != nil,
      @"[RNScreens] can't set special effects delegate to nil. Use clearTabsSpecialEffectsDelegateIfNeeded instead.");
  _tabsSpecialEffectsDelegate = delegate;
}

- (void)clearTabsSpecialEffectsDelegateIfNeeded:(id<RNSBottomTabsSpecialEffectsSupporting>)delegate
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

@end
