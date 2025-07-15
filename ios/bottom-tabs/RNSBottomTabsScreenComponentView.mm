#import "RNSBottomTabsScreenComponentView.h"
#import "RNSConversions.h"
#import "RNSDefines.h"
#import "RNSTabBarController.h"
#import "RNSScrollViewHelper.h"

#import <React/RCTConversions.h>
#import <react/renderer/components/rnscreens/ComponentDescriptors.h>
#import <react/renderer/components/rnscreens/EventEmitters.h>
#import <react/renderer/components/rnscreens/Props.h>
#import <react/renderer/components/rnscreens/RCTComponentViewHelpers.h>

namespace react = facebook::react;

#pragma mark - View implementation

@implementation RNSBottomTabsScreenComponentView {
  RNSTabsScreenViewController *_controller;
  RNSBottomTabsHostComponentView *__weak _Nullable _reactSuperview;

  RNSBottomTabsScreenEventEmitter *_Nonnull _reactEventEmitter;
  
  // We need this information to warn users about dynamic changes to behavior being currently unsupported.
  BOOL _isOverrideScrollViewContentInsetAdjustmentBehaviorSet;
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
  static const auto defaultProps = std::make_shared<const react::RNSBottomTabsScreenProps>();
  _props = defaultProps;

  _controller = [RNSTabsScreenViewController new];
  _controller.view = self;

  _reactSuperview = nil;
  _reactEventEmitter = [RNSBottomTabsScreenEventEmitter new];

  [self resetProps];
}

- (void)resetProps
{
  _isSelectedScreen = NO;
  _badgeValue = nil;
  _title = nil;
  _tabBarBlurEffect = nil;
  _tabBarBackgroundColor = nil;

  _tabBarItemTitleFontFamily = nil;
  _tabBarItemTitleFontSize = nil;
  _tabBarItemTitleFontWeight = nil;
  _tabBarItemTitleFontStyle = nil;
  _tabBarItemTitleFontColor = nil;
  _tabBarItemTitlePositionAdjustment = UIOffset(0.0, 0.0);

  _tabBarItemIconColor = nil;

  _tabBarItemBadgeBackgroundColor = nil;

  _shouldUseRepeatedTabSelectionPopToRootSpecialEffect = YES;
  _shouldUseRepeatedTabSelectionScrollToTopSpecialEffect = YES;

  _overrideScrollViewContentInsetAdjustmentBehavior = YES;
  _isOverrideScrollViewContentInsetAdjustmentBehaviorSet = NO;
}

RNS_IGNORE_SUPER_CALL_BEGIN
- (nullable RNSBottomTabsHostComponentView *)reactSuperview
{
  return _reactSuperview;
}
RNS_IGNORE_SUPER_CALL_END

#pragma mark - Events

- (nonnull RNSBottomTabsScreenEventEmitter *)reactEventEmitter
{
  RCTAssert(_reactEventEmitter != nil, @"[RNScreens] Attempt to access uninitialized _reactEventEmitter");
  return _reactEventEmitter;
}

- (nullable RNSTabBarController *)findTabBarController
{
  return static_cast<RNSTabBarController *>(_controller.tabBarController);
}

#pragma mark - RCTViewComponentViewProtocol

- (void)updateProps:(const facebook::react::Props::Shared &)props
           oldProps:(const facebook::react::Props::Shared &)oldProps
{
  const auto &oldComponentProps = *std::static_pointer_cast<const react::RNSBottomTabsScreenProps>(_props);
  const auto &newComponentProps = *std::static_pointer_cast<const react::RNSBottomTabsScreenProps>(props);

  bool tabItemNeedsAppearanceUpdate{false};

  if (newComponentProps.title != oldComponentProps.title) {
    _title = RCTNSStringFromStringNilIfEmpty(newComponentProps.title);
    _controller.title = _title;
  }

  if (newComponentProps.tabKey != oldComponentProps.tabKey) {
    RCTAssert(!newComponentProps.tabKey.empty(), @"[RNScreens] tabKey must not be empty!");
    _tabKey = RCTNSStringFromString(newComponentProps.tabKey);
  }

  if (newComponentProps.isFocused != oldComponentProps.isFocused) {
    _isSelectedScreen = newComponentProps.isFocused;
    [_controller tabScreenFocusHasChanged];
  }

  if (newComponentProps.badgeValue != oldComponentProps.badgeValue) {
    _badgeValue = RCTNSStringFromStringNilIfEmpty(newComponentProps.badgeValue);
    _controller.tabBarItem.badgeValue = _badgeValue;
  }

  if (newComponentProps.tabBarItemBadgeBackgroundColor != oldComponentProps.tabBarItemBadgeBackgroundColor) {
    _tabBarItemBadgeBackgroundColor = RCTUIColorFromSharedColor(newComponentProps.tabBarItemBadgeBackgroundColor);
    // Note that this will prevent default color from being set.
    // TODO: support default color by setting nil here.
    NSLog(@"TabsScreen [%ld] update badgeColor to %@", self.tag, _tabBarItemBadgeBackgroundColor);
    tabItemNeedsAppearanceUpdate = YES;
  }

  if (newComponentProps.tabBarBackgroundColor != oldComponentProps.tabBarBackgroundColor) {
    _tabBarBackgroundColor = RCTUIColorFromSharedColor(newComponentProps.tabBarBackgroundColor);
    tabItemNeedsAppearanceUpdate = YES;
  }

  if (newComponentProps.tabBarBlurEffect != oldComponentProps.tabBarBlurEffect) {
    _tabBarBlurEffect = rnscreens::conversion::RNSUIBlurEffectFromRNSBottomTabsScreenTabBarBlurEffect(
        newComponentProps.tabBarBlurEffect);
    tabItemNeedsAppearanceUpdate = YES;
  }

  if (newComponentProps.tabBarItemTitleFontFamily != oldComponentProps.tabBarItemTitleFontFamily) {
    _tabBarItemTitleFontFamily = RCTNSStringFromStringNilIfEmpty(newComponentProps.tabBarItemTitleFontFamily);
    tabItemNeedsAppearanceUpdate = YES;
  }

  if (newComponentProps.tabBarItemTitleFontSize != oldComponentProps.tabBarItemTitleFontSize) {
    _tabBarItemTitleFontSize = [NSNumber numberWithFloat:newComponentProps.tabBarItemTitleFontSize];
    tabItemNeedsAppearanceUpdate = YES;
  }

  if (newComponentProps.tabBarItemTitleFontWeight != oldComponentProps.tabBarItemTitleFontWeight) {
    _tabBarItemTitleFontWeight = RCTNSStringFromStringNilIfEmpty(newComponentProps.tabBarItemTitleFontWeight);
    tabItemNeedsAppearanceUpdate = YES;
  }

  if (newComponentProps.tabBarItemTitleFontStyle != oldComponentProps.tabBarItemTitleFontStyle) {
    _tabBarItemTitleFontStyle = RCTNSStringFromStringNilIfEmpty(newComponentProps.tabBarItemTitleFontStyle);
    tabItemNeedsAppearanceUpdate = YES;
  }

  if (newComponentProps.tabBarItemTitleFontColor != oldComponentProps.tabBarItemTitleFontColor) {
    _tabBarItemTitleFontColor = RCTUIColorFromSharedColor(newComponentProps.tabBarItemTitleFontColor);
    tabItemNeedsAppearanceUpdate = YES;
  }

  if (newComponentProps.tabBarItemTitlePositionAdjustment.horizontal !=
          oldComponentProps.tabBarItemTitlePositionAdjustment.horizontal ||
      newComponentProps.tabBarItemTitlePositionAdjustment.vertical !=
          oldComponentProps.tabBarItemTitlePositionAdjustment.vertical) {
    _tabBarItemTitlePositionAdjustment =
        rnscreens::conversion::RNSBottomTabsScreenTabBarItemTitlePositionAdjustmentStruct(
            newComponentProps.tabBarItemTitlePositionAdjustment);
    tabItemNeedsAppearanceUpdate = YES;
  }

  if (newComponentProps.tabBarItemIconColor != oldComponentProps.tabBarItemIconColor) {
    _tabBarItemIconColor = RCTUIColorFromSharedColor(newComponentProps.tabBarItemIconColor);
    tabItemNeedsAppearanceUpdate = YES;
  }

  if (newComponentProps.iconSFSymbolName != oldComponentProps.iconSFSymbolName) {
    _iconSFSymbolName = RCTNSStringFromStringNilIfEmpty(newComponentProps.iconSFSymbolName);
    tabItemNeedsAppearanceUpdate = YES;
  }

  if (newComponentProps.selectedIconSFSymbolName != oldComponentProps.selectedIconSFSymbolName) {
    _selectedIconSFSymbolName = RCTNSStringFromStringNilIfEmpty(newComponentProps.selectedIconSFSymbolName);
    tabItemNeedsAppearanceUpdate = YES;
  }

  if (newComponentProps.specialEffects.repeatedTabSelection.popToRoot
      != oldComponentProps.specialEffects.repeatedTabSelection.popToRoot) {
    _shouldUseRepeatedTabSelectionPopToRootSpecialEffect = newComponentProps.specialEffects.repeatedTabSelection.popToRoot;
  }

  if (newComponentProps.specialEffects.repeatedTabSelection.scrollToTop
      != oldComponentProps.specialEffects.repeatedTabSelection.scrollToTop) {
    _shouldUseRepeatedTabSelectionScrollToTopSpecialEffect = newComponentProps.specialEffects.repeatedTabSelection.scrollToTop;
  }

  if (newComponentProps.overrideScrollViewContentInsetAdjustmentBehavior
      != oldComponentProps.overrideScrollViewContentInsetAdjustmentBehavior) {
    _overrideScrollViewContentInsetAdjustmentBehavior = newComponentProps.overrideScrollViewContentInsetAdjustmentBehavior;
    
    if (_isOverrideScrollViewContentInsetAdjustmentBehaviorSet) {
      RCTLogWarn(@"[RNScreens] changing overrideScrollViewContentInsetAdjustmentBehavior dynamically is currently unsupported");
    }
  }
  
  // This flag is set to YES when overrideScrollViewContentInsetAdjustmentBehavior prop
  // is assigned for the first time. This allows us to identify any subsequent changes to this prop,
  // enabling us to warn users that dynamic changes are not supported.
  _isOverrideScrollViewContentInsetAdjustmentBehaviorSet = YES;

  if (tabItemNeedsAppearanceUpdate) {
    [_controller tabItemAppearanceHasChanged];
  }

  [super updateProps:props oldProps:oldProps];
}

- (void)updateLayoutMetrics:(const facebook::react::LayoutMetrics &)layoutMetrics
           oldLayoutMetrics:(const facebook::react::LayoutMetrics &)oldLayoutMetrics
{
  NSLog(
      @"TabScreen [%ld] updateLayoutMetrics: %@", self.tag, NSStringFromCGRect(RCTCGRectFromRect(layoutMetrics.frame)));
  [super updateLayoutMetrics:layoutMetrics oldLayoutMetrics:oldLayoutMetrics];
}

- (void)updateEventEmitter:(const facebook::react::EventEmitter::Shared &)eventEmitter
{
  [super updateEventEmitter:eventEmitter];
  [_reactEventEmitter
      updateEventEmitter:std::static_pointer_cast<const react::RNSBottomTabsScreenEventEmitter>(eventEmitter)];
}

- (void)mountChildComponentView:(UIView<RCTComponentViewProtocol> *)childComponentView index:(NSInteger)index
{
  NSLog(@"TabScreen [%ld] mount [%ld] at %ld", self.tag, childComponentView.tag, index);
  [super mountChildComponentView:childComponentView index:index];
}

- (void)unmountChildComponentView:(UIView<RCTComponentViewProtocol> *)childComponentView index:(NSInteger)index
{
  NSLog(@"TabScreen [%ld] unmount [%ld] from %ld", self.tag, childComponentView.tag, index);
  [super unmountChildComponentView:childComponentView index:index];
}

+ (react::ComponentDescriptorProvider)componentDescriptorProvider
{
  return react::concreteComponentDescriptorProvider<react::RNSBottomTabsScreenComponentDescriptor>();
}

+ (BOOL)shouldBeRecycled
{
  // There won't be tens of instances of this component usually & it's easier for now.
  // We could consider enabling it someday though.
  return NO;
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

@end

#pragma mark - View class exposure

Class<RCTComponentViewProtocol> RNSBottomTabsScreen(void)
{
  return RNSBottomTabsScreenComponentView.class;
}
