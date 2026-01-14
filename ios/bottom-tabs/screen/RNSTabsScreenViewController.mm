#import "RNSTabsScreenViewController.h"
#import "RNSLog.h"
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
  RNSLog(
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

- (void)tabScreenOrientationHasChanged
{
  [[self findTabBarController] setNeedsOrientationUpdate:true];
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
  RNSLog(@"TabScreen [%ld] ctrl moved to parent: %@", self.tabScreenComponentView.tag, parent);

  if (parent == nil) {
    return;
  }

  // Can be UINavigationController in case of MoreNavigationController
  RCTAssert(
      [parent isKindOfClass:RNSTabBarController.class] || [parent isKindOfClass:UINavigationController.class],
      @"[RNScreens] TabScreenViewController added to parent of unexpected type: %@",
      parent.class);

  if ([parent isKindOfClass:UINavigationController.class]) {
    // Hide the navigation bar for the more controller
    [(UINavigationController *)parent setNavigationBarHidden:YES animated:YES];
  }

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
