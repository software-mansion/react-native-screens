#import "RNSStackScreenController.h"
#import "RNSContainer.h"
#import "RNSContainerItemSupport.h"
#import "RNSLog.h"
#import "RNSStackNavigationBar.h"
#import "RNSStackScreenHeaderCoordinator.h"
#import "RNSViewFrameChangeDelegate.h"

@interface RNSStackScreenController () <UINavigationBarDelegate>
@end

@implementation RNSStackScreenController {
  RNSContainerItemSupport *_Nonnull _containerItemSupport;
  UINavigationItem *_Nullable _screenNavigationBarTopItem;
}

- (instancetype)init
{
  if (self = [super init]) {
    _headerCoordinator = [[RNSStackScreenHeaderCoordinator alloc] initWithScreenController:self];
    _containerItemSupport = [RNSContainerItemSupport new];
  }
  return self;
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
  return [_containerItemSupport findContentScrollViewWithCachedScrollView:[_configProvider cachedContentScrollView]
                                                            heuristicRoot:self.view];
}

#pragma mark - Screen navigation bar

- (void)setScreenNavigationBarEnabled:(BOOL)enabled
{
  if (_screenNavigationBarEnabled == enabled) {
    return;
  }
  _screenNavigationBarEnabled = enabled;

  if (enabled) {
    _screenNavigationBarTopItem = [UINavigationItem new];
    _screenNavigationBarBackItem = [UINavigationItem new];
    _screenNavigationBar = [RNSStackNavigationBar new];
    _screenNavigationBar.delegate = self;
#if !TARGET_OS_TV
    // Large title collapsing is driven by UINavigationController and is not available for a standalone bar.
    _screenNavigationBar.prefersLargeTitles = NO;
#endif // !TARGET_OS_TV
    [self.view addSubview:_screenNavigationBar];
    [self updateScreenNavigationBarItems];
  } else {
    [_screenNavigationBar removeFromSuperview];
    _screenNavigationBar.delegate = nil;
    _screenNavigationBar = nil;
    _screenNavigationBarTopItem = nil;
    _screenNavigationBarBackItem = nil;
  }

  [self updateScreenNavigationBarLayout];
}

- (UINavigationItem *)headerNavigationItem
{
  return _screenNavigationBarEnabled ? _screenNavigationBarTopItem : self.navigationItem;
}

- (void)setScreenNavigationBarHidden:(BOOL)hidden
{
  if (_screenNavigationBar == nil || _screenNavigationBar.hidden == hidden) {
    return;
  }
  _screenNavigationBar.hidden = hidden;
  [self updateScreenNavigationBarLayout];
}

- (void)updateScreenNavigationBarItems
{
  if (_screenNavigationBar == nil) {
    return;
  }

  NSArray<UIViewController *> *viewControllers = self.navigationController.viewControllers;
  NSUInteger index = [viewControllers indexOfObject:self];

  NSArray<UINavigationItem *> *items = nil;
  if (index != NSNotFound && index > 0) {
    UIViewController *previousController = viewControllers[index - 1];
    UINavigationItem *previousItem = [previousController isKindOfClass:RNSStackScreenController.class]
        ? static_cast<RNSStackScreenController *>(previousController).headerNavigationItem
        : previousController.navigationItem;
    _screenNavigationBarBackItem.title = previousItem.title;
    items = @[ _screenNavigationBarBackItem, _screenNavigationBarTopItem ];
  } else {
    items = @[ _screenNavigationBarTopItem ];
  }

  if (![_screenNavigationBar.items isEqualToArray:items]) {
    [_screenNavigationBar setItems:items animated:NO];
  }
}

- (void)updateScreenNavigationBarLayout
{
  if (!self.isViewLoaded) {
    return;
  }

  UIEdgeInsets additionalInsets = self.additionalSafeAreaInsets;

  if (_screenNavigationBar == nil || _screenNavigationBar.hidden) {
    if (additionalInsets.top != 0) {
      additionalInsets.top = 0;
      self.additionalSafeAreaInsets = additionalInsets;
    }
    return;
  }

  // Bar is placed right below the area covered by the parent's safe area (e.g. status bar).
  // The additional inset applied by this method is excluded to avoid a feedback loop.
  CGFloat topInset = self.view.safeAreaInsets.top - additionalInsets.top;
  CGFloat width = CGRectGetWidth(self.view.bounds);
  CGFloat height = [_screenNavigationBar sizeThatFits:CGSizeMake(width, CGFLOAT_MAX)].height;

  CGRect frame = CGRectMake(0, topInset, width, height);
  if (!CGRectEqualToRect(_screenNavigationBar.frame, frame)) {
    _screenNavigationBar.frame = frame;
  }

  // The bar is not a React-managed subview. Keeping it as the last subview keeps it on top
  // and keeps the indices of the React-managed subviews intact.
  if (self.view.subviews.lastObject != _screenNavigationBar) {
    [self.view bringSubviewToFront:_screenNavigationBar];
  }

  // Content of the screen is expected to respect the safe area, the same as with the shared bar.
  if (additionalInsets.top != height) {
    additionalInsets.top = height;
    self.additionalSafeAreaInsets = additionalInsets;
  }

  [self.headerCoordinator.frameChangeDelegate viewFrameDidChange:_screenNavigationBar];
}

#pragma mark - Layout

- (void)viewDidLayoutSubviews
{
  [super viewDidLayoutSubviews];
  [self updateScreenNavigationBarLayout];
}

- (void)viewSafeAreaInsetsDidChange
{
  [super viewSafeAreaInsetsDidChange];
  [self updateScreenNavigationBarLayout];
}

#pragma mark - UINavigationBarDelegate

- (UIBarPosition)positionForBar:(id<UIBarPositioning>)bar
{
  // Extends the bar's background below the status bar.
  return UIBarPositionTopAttached;
}

- (BOOL)navigationBar:(UINavigationBar *)navigationBar shouldPopItem:(UINavigationItem *)item
{
  // The back button of the screen navigation bar pops the screen itself, the same as the back button
  // of the shared navigation bar. The bar's own items are updated by the screen below appearing.
  UINavigationController *navigationController = self.navigationController;
  if (navigationController.topViewController == self && navigationController.viewControllers.count > 1) {
    [navigationController popViewControllerAnimated:YES];
  }
  return NO;
}

#pragma mark - Lifecycle Events

- (void)viewWillAppear:(BOOL)animated
{
  [super viewWillAppear:animated];
  [self updateScreenNavigationBarItems];
  [self.headerCoordinator updateNavigationBarVisibilityAnimated:animated];
#if !TARGET_OS_TV
  [self.headerCoordinator updateBackButtonMenuEnabled];
#endif // !TARGET_OS_TV
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
  RNSLogD(@"[RNScreens] Screen view with tag=%ld didMoveToParentViewController %@", (long)self.view.tag, parent);
  [super didMoveToParentViewController:parent];

  if (parent == nil) {
#if !TARGET_OS_TV
    // The pop transition has completed. Clear the back button config this
    // screen has applied onto the screen below. UIKit seems to serialize
    // navigation transitions (undocumented, internal, but seems to work on 18 and 26),
    // so this runs before a queued push applies its own config.
    [_headerCoordinator clearAppliedBackButtonConfig];
#endif // !TARGET_OS_TV

    [_delegate stackScreenControllerDidLeaveStack:self];
  }
}

@end
