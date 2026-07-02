#import "RNSTabsScreenComponentView.h"
#import "NSString+RNSUtility.h"
#import "RNSConversions.h"
#import "RNSDefines.h"
#import "RNSLog.h"
#import "RNSSafeAreaViewNotifications.h"
#import "RNSScrollViewFinder.h"
#import "RNSScrollViewHelper.h"
#import "RNSTabBarAppearanceCoordinator.h"
#import "RNSTabBarController.h"

#import <React/RCTConversions.h>
#import <React/RCTImageSource.h>
#import <react/renderer/components/rnscreens/ComponentDescriptors.h>
#import <react/renderer/components/rnscreens/EventEmitters.h>
#import <react/renderer/components/rnscreens/Props.h>
#import <react/renderer/components/rnscreens/RCTComponentViewHelpers.h>

#if RNS_GAMMA_ENABLED
#import "RNSScrollViewMarkerComponentView.h"
#import "RNSScrollViewSeeking.h"
#endif

namespace react = facebook::react;

#pragma mark - View implementation

#if RNS_GAMMA_ENABLED
@interface RNSTabsScreenComponentView () <RNSScrollViewSeeking>
@end
#endif

@implementation RNSTabsScreenComponentView {
  RNSTabsScreenViewController *_controller;
  RNSTabsHostComponentView *__weak _Nullable _reactSuperview;

  RNSTabsScreenEventEmitter *_Nonnull _reactEventEmitter;

  // Content scroll view registered by a descendant `RNSScrollViewMarkerComponentView`. Queried by
  // the owning `RNSTabsScreenViewController` (as `RNSContainerItem`) when resolving the content
  // scroll view for special effects.
  __weak UIScrollView *_Nullable _contentScrollView;

  // We need this information to warn users about dynamic changes to behavior being currently unsupported.
  BOOL _isOverrideScrollViewContentInsetAdjustmentBehaviorSet;
  // Tracks that the first child was mounted before props were set.
  // The pending override will be applied once updateProps runs.
  BOOL _needsScrollViewBehaviorOverride;
}

- (instancetype)initWithFrame:(CGRect)frame
{
  if (self = [super initWithFrame:frame]) {
    [self initState];
  }
  return self;
}

- (void)initState
{
  static const auto defaultProps = std::make_shared<const react::RNSTabsScreenIOSProps>();
  _props = defaultProps;

  _controller = [RNSTabsScreenViewController new];
  _controller.view = self;

  _reactSuperview = nil;
  _reactEventEmitter = [RNSTabsScreenEventEmitter new];

  [self resetProps];
}

- (void)resetProps
{
  _badgeValue = nil;
  _title = nil;
  _isTitleUndefined = YES;
  _orientation = RNSOrientationInherit;

  _standardAppearance = [UITabBarAppearance new];
  _scrollEdgeAppearance = nil;

  _shouldUseRepeatedTabSelectionPopToRootSpecialEffect = YES;
  _shouldUseRepeatedTabSelectionScrollToTopSpecialEffect = YES;

  _overrideScrollViewContentInsetAdjustmentBehavior = YES;
  _isOverrideScrollViewContentInsetAdjustmentBehaviorSet = NO;

  _iconType = RNSTabsIconTypeSfSymbol;

  _iconImageSource = nil;
  _iconResourceName = nil;

  _selectedIconImageSource = nil;
  _selectedIconResourceName = nil;

  _systemItem = RNSTabsScreenSystemItemNone;

  _userInterfaceStyle = UIUserInterfaceStyleUnspecified;
}

RNS_IGNORE_SUPER_CALL_BEGIN
- (nullable RNSTabsHostComponentView *)reactSuperview
{
  return _reactSuperview;
}
RNS_IGNORE_SUPER_CALL_END

- (void)invalidateImpl
{
  // We want to run after container updates are performed (transitions etc.)
  __weak auto weakSelf = self;

  dispatch_async(dispatch_get_main_queue(), ^{
    auto strongSelf = weakSelf;
    if (strongSelf) {
      strongSelf->_controller = nil;
    }
  });
}

#pragma mark RNSScrollViewSeeking

#if RNS_GAMMA_ENABLED
- (void)registerDescendantScrollView:(UIScrollView *)scrollView fromMarker:(RNSScrollViewMarkerComponentView *)marker
{
  // Native iOS-26 scroll-edge behavior (status-bar tap scroll-to-top, scroll edge appearance).
  [_controller setContentScrollView:scrollView forEdge:NSDirectionalRectEdgeAll];
  // Cache used by the container-nesting content-scroll-view resolution.
  _contentScrollView = scrollView;
}
#endif // RNS_GAMMA_ENABLED

- (nullable UIScrollView *)cachedContentScrollView
{
  return _contentScrollView;
}

#pragma mark - Events

- (nonnull RNSTabsScreenEventEmitter *)reactEventEmitter
{
  RCTAssert(_reactEventEmitter != nil, @"[RNScreens] Attempt to access uninitialized _reactEventEmitter");
  return _reactEventEmitter;
}

- (nullable RNSTabBarController *)findTabBarController
{
  return static_cast<RNSTabBarController *>(_controller.tabBarController);
}

#pragma mark - RNSScrollViewBehaviorOverriding

- (BOOL)shouldOverrideScrollViewContentInsetAdjustmentBehavior
{
  return self.overrideScrollViewContentInsetAdjustmentBehavior;
}

- (void)overrideScrollViewBehaviorInFirstDescendantChainIfNeeded
{
  if ([self shouldOverrideScrollViewContentInsetAdjustmentBehavior]) {
    [RNSScrollViewHelper overrideScrollViewBehaviorInFirstDescendantChainFrom:self];
  }
}

#pragma mark - Prop update utils

- (void)createTabBarItem
{
  UITabBarItem *tabBarItem = nil;
  if (_systemItem != RNSTabsScreenSystemItemNone) {
    UITabBarSystemItem systemItem = rnscreens::conversion::RNSTabsScreenSystemItemToUITabBarSystemItem(_systemItem);
    tabBarItem = [[UITabBarItem alloc] initWithTabBarSystemItem:systemItem tag:0];
  } else {
    tabBarItem = [[UITabBarItem alloc] init];
  }

  _controller.tabBarItem = tabBarItem;
}

- (void)updateTabBarItem
{
  UITabBarItem *tabBarItem = _controller.tabBarItem;

  NSString *evaluatedTitle = _title;
  if (_title == nil && _systemItem != RNSTabsScreenSystemItemNone) {
    // Restore default system item title
    UITabBarSystemItem systemItem = rnscreens::conversion::RNSTabsScreenSystemItemToUITabBarSystemItem(_systemItem);
    evaluatedTitle = [[UITabBarItem alloc] initWithTabBarSystemItem:systemItem tag:0].title;
  }

  [self updateTabBarItemTitle:evaluatedTitle];

  if (![tabBarItem.badgeValue isEqualToString:_badgeValue]) {
    tabBarItem.badgeValue = _badgeValue;
  }
}

- (void)updateTabBarItemTitle:(NSString *)newTitle
{
  // Setting _controller.title updates also _controller.tabBarItem.title but only if there
  // is a change to _controller.title. After creating new tabBarItem, _controller.title
  // remains the same but _controller.tabBarItem.title is nil. For consistency, we always
  // update both.
  if (![_controller.tabBarItem.title isEqualToString:newTitle] || ![_controller.title isEqualToString:newTitle]) {
    _controller.title = newTitle;
    _controller.tabBarItem.title = newTitle;
  }
}

#pragma mark - RNSSafeAreaProviding

- (UIEdgeInsets)providerSafeAreaInsets
{
  return self.safeAreaInsets;
}

- (void)dispatchSafeAreaDidChangeNotification
{
  [NSNotificationCenter.defaultCenter postNotificationName:RNSSafeAreaDidChange object:self userInfo:nil];
}

#pragma mark - RNSSafeAreaProviding related methods

// TODO: register for UIKeyboard notifications

- (void)safeAreaInsetsDidChange
{
  [super safeAreaInsetsDidChange];
  [self dispatchSafeAreaDidChangeNotification];
}

#pragma mark - RCTComponentViewProtocol

- (void)updateProps:(const facebook::react::Props::Shared &)props
           oldProps:(const facebook::react::Props::Shared &)oldProps
{
  const auto &oldComponentProps = *std::static_pointer_cast<const react::RNSTabsScreenIOSProps>(_props);
  const auto &newComponentProps = *std::static_pointer_cast<const react::RNSTabsScreenIOSProps>(props);

  bool tabItemNeedsAppearanceUpdate{false};
  bool tabScreenOrientationNeedsUpdate{false};
  bool tabBarItemNeedsRecreation{false};
  bool tabBarItemNeedsUpdate{false};

  if (newComponentProps.title != oldComponentProps.title ||
      newComponentProps.isTitleUndefined != oldComponentProps.isTitleUndefined) {
    _isTitleUndefined = newComponentProps.isTitleUndefined;

    if (_isTitleUndefined) {
      _title = nil;
    } else {
      _title = RCTNSStringFromString(newComponentProps.title);
    }

    tabBarItemNeedsUpdate = YES;
  }

  if (newComponentProps.orientation != oldComponentProps.orientation) {
    _orientation = rnscreens::conversion::RNSOrientationFromRNSTabsScreenOrientation(newComponentProps.orientation);
    tabScreenOrientationNeedsUpdate = YES;
  }

  if (newComponentProps.screenKey != oldComponentProps.screenKey) {
    RCTAssert(!newComponentProps.screenKey.empty(), @"[RNScreens] screenKey must not be empty!");
    _screenKey = RCTNSStringFromString(newComponentProps.screenKey);
  }

  if (newComponentProps.badgeValue != oldComponentProps.badgeValue) {
    _badgeValue = RCTNSStringFromStringNilIfEmpty(newComponentProps.badgeValue);
    tabBarItemNeedsUpdate = YES;
  }

  if (newComponentProps.tabBarItemTestID != oldComponentProps.tabBarItemTestID) {
    _tabItemTestID = RCTNSStringFromStringNilIfEmpty(newComponentProps.tabBarItemTestID);
    _tabBarItemNeedsA11yUpdate = YES;
  }

  if (newComponentProps.tabBarItemAccessibilityLabel != oldComponentProps.tabBarItemAccessibilityLabel) {
    _tabItemAccessibilityLabel = RCTNSStringFromStringNilIfEmpty(newComponentProps.tabBarItemAccessibilityLabel);
    _tabBarItemNeedsA11yUpdate = YES;
  }

  if (newComponentProps.standardAppearance != oldComponentProps.standardAppearance) {
    _standardAppearance = [UITabBarAppearance new];
    [RNSTabBarAppearanceCoordinator configureTabBarAppearance:_standardAppearance
                                          fromAppearanceProps:rnscreens::conversion::RNSConvertFollyDynamicToId(
                                                                  newComponentProps.standardAppearance)];
    tabItemNeedsAppearanceUpdate = YES;
  }

  if (newComponentProps.scrollEdgeAppearance != oldComponentProps.scrollEdgeAppearance) {
    if (newComponentProps.scrollEdgeAppearance.type() == folly::dynamic::OBJECT) {
      _scrollEdgeAppearance = [UITabBarAppearance new];
      [RNSTabBarAppearanceCoordinator configureTabBarAppearance:_scrollEdgeAppearance
                                            fromAppearanceProps:rnscreens::conversion::RNSConvertFollyDynamicToId(
                                                                    newComponentProps.scrollEdgeAppearance)];
    } else {
      _scrollEdgeAppearance = nil;
    }
    tabItemNeedsAppearanceUpdate = YES;
  }

  if (newComponentProps.iconType != oldComponentProps.iconType) {
    _iconType = rnscreens::conversion::RNSTabsIconTypeFromIcon(newComponentProps.iconType);
    tabItemNeedsAppearanceUpdate = YES;
  }

  if (newComponentProps.iconImageSource != oldComponentProps.iconImageSource) {
    _iconImageSource =
        rnscreens::conversion::RCTImageSourceFromImageSourceAndIconType(&newComponentProps.iconImageSource, _iconType);
    tabItemNeedsAppearanceUpdate = YES;
  }

  if (newComponentProps.iconResourceName != oldComponentProps.iconResourceName) {
    _iconResourceName = RCTNSStringFromStringNilIfEmpty(newComponentProps.iconResourceName);
    tabItemNeedsAppearanceUpdate = YES;
  }

  if (newComponentProps.selectedIconImageSource != oldComponentProps.selectedIconImageSource) {
    _selectedIconImageSource = rnscreens::conversion::RCTImageSourceFromImageSourceAndIconType(
        &newComponentProps.selectedIconImageSource, _iconType);
    tabItemNeedsAppearanceUpdate = YES;
  }

  if (newComponentProps.selectedIconResourceName != oldComponentProps.selectedIconResourceName) {
    _selectedIconResourceName = RCTNSStringFromStringNilIfEmpty(newComponentProps.selectedIconResourceName);
    tabItemNeedsAppearanceUpdate = YES;
  }

  if (newComponentProps.specialEffects.repeatedTabSelection.popToRoot !=
      oldComponentProps.specialEffects.repeatedTabSelection.popToRoot) {
    _shouldUseRepeatedTabSelectionPopToRootSpecialEffect =
        newComponentProps.specialEffects.repeatedTabSelection.popToRoot;
  }

  if (newComponentProps.specialEffects.repeatedTabSelection.scrollToTop !=
      oldComponentProps.specialEffects.repeatedTabSelection.scrollToTop) {
    _shouldUseRepeatedTabSelectionScrollToTopSpecialEffect =
        newComponentProps.specialEffects.repeatedTabSelection.scrollToTop;
  }

  if (newComponentProps.preventNativeSelection != oldComponentProps.preventNativeSelection) {
    _preventNativeSelection = newComponentProps.preventNativeSelection;
  }

  if (newComponentProps.overrideScrollViewContentInsetAdjustmentBehavior !=
      oldComponentProps.overrideScrollViewContentInsetAdjustmentBehavior) {
    _overrideScrollViewContentInsetAdjustmentBehavior =
        newComponentProps.overrideScrollViewContentInsetAdjustmentBehavior;

    if (_isOverrideScrollViewContentInsetAdjustmentBehaviorSet) {
      RCTLogWarn(
          @"[RNScreens] changing overrideScrollViewContentInsetAdjustmentBehavior dynamically is currently unsupported");
    }
  }

  // This flag is set to YES when overrideScrollViewContentInsetAdjustmentBehavior prop
  // is assigned for the first time. This allows us to identify any subsequent changes to this prop,
  // enabling us to warn users that dynamic changes are not supported.
  _isOverrideScrollViewContentInsetAdjustmentBehaviorSet = YES;

  // Apply deferred scroll view override if a child was mounted before props arrived
  if (_needsScrollViewBehaviorOverride) {
    [self overrideScrollViewBehaviorInFirstDescendantChainIfNeeded];
    _needsScrollViewBehaviorOverride = NO;
  }

  if (newComponentProps.systemItem != oldComponentProps.systemItem) {
    _systemItem =
        rnscreens::conversion::RNSTabsScreenSystemItemFromReactRNSTabsScreenSystemItem(newComponentProps.systemItem);
    tabBarItemNeedsRecreation = YES;
  }

  if (newComponentProps.userInterfaceStyle != oldComponentProps.userInterfaceStyle) {
    _userInterfaceStyle =
        rnscreens::conversion::UIUserInterfaceStyleFromTabsScreenCppEquivalent(newComponentProps.userInterfaceStyle);
  }

  if (tabBarItemNeedsRecreation) {
    [self createTabBarItem];
    tabBarItemNeedsUpdate = YES;
    _tabBarItemNeedsA11yUpdate = YES;
  }

  if (tabBarItemNeedsUpdate) {
    [self updateTabBarItem];

    // Force appearance update to make sure correct image for tab bar item is used
    tabItemNeedsAppearanceUpdate = YES;
  }

  if (tabItemNeedsAppearanceUpdate) {
    [_controller tabItemAppearanceHasChanged];
  }

  if (tabScreenOrientationNeedsUpdate) {
    [_controller tabScreenOrientationHasChanged];
  }

  [super updateProps:props oldProps:oldProps];
}

- (void)updateLayoutMetrics:(const facebook::react::LayoutMetrics &)layoutMetrics
           oldLayoutMetrics:(const facebook::react::LayoutMetrics &)oldLayoutMetrics
{
  RNSLog(
      @"TabScreen [%ld] updateLayoutMetrics: %@", self.tag, NSStringFromCGRect(RCTCGRectFromRect(layoutMetrics.frame)));
  [super updateLayoutMetrics:layoutMetrics oldLayoutMetrics:oldLayoutMetrics];
}

- (void)updateEventEmitter:(const facebook::react::EventEmitter::Shared &)eventEmitter
{
  [super updateEventEmitter:eventEmitter];
  [_reactEventEmitter
      updateEventEmitter:std::static_pointer_cast<const react::RNSTabsScreenIOSEventEmitter>(eventEmitter)];
}

- (void)mountChildComponentView:(UIView<RCTComponentViewProtocol> *)childComponentView index:(NSInteger)index
{
  RNSLog(@"TabScreen [%ld] mount [%ld] at %ld", self.tag, childComponentView.tag, index);
  [super mountChildComponentView:childComponentView index:index];

  // overrideScrollViewBehavior uses first descendant chain from screen to find ScrollView,
  // that's why we're only interested in child mounted at index 0.
  if (index == 0) {
    // Before the props are set (first render) defer acting to after
    // we receive props, as user might have decided to disable this feature.
    if (_isOverrideScrollViewContentInsetAdjustmentBehaviorSet) {
      [self overrideScrollViewBehaviorInFirstDescendantChainIfNeeded];
    } else {
      _needsScrollViewBehaviorOverride = YES;
    }
  }
}

- (void)unmountChildComponentView:(UIView<RCTComponentViewProtocol> *)childComponentView index:(NSInteger)index
{
  RNSLog(@"TabScreen [%ld] unmount [%ld] from %ld", self.tag, childComponentView.tag, index);
  [super unmountChildComponentView:childComponentView index:index];
}

+ (react::ComponentDescriptorProvider)componentDescriptorProvider
{
  return react::concreteComponentDescriptorProvider<react::RNSTabsScreenIOSComponentDescriptor>();
}

+ (BOOL)shouldBeRecycled
{
  // There won't be tens of instances of this component usually & it's easier for now.
  // We could consider enabling it someday though.
  return NO;
}

- (void)invalidate
{
  [self invalidateImpl];
}

#pragma mark - Dynamic frameworks support

// Needed because of this: https://github.com/facebook/react-native/pull/37274
#ifdef RCT_DYNAMIC_FRAMEWORKS
+ (void)load
{
  [super load];
}
#endif // RCT_DYNAMIC_FRAMEWORKS

@end

#pragma mark - View class exposure

Class<RCTComponentViewProtocol> RNSTabsScreen(void)
{
  return RNSTabsScreenComponentView.class;
}
