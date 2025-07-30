#import "RNSBottomTabsScreenComponentView.h"
#import "NSString+RNSUtility.h"
#import "RNSConversions.h"
#import "RNSDefines.h"
#import "RNSScrollViewHelper.h"
#import "RNSTabBarController.h"

#if RCT_NEW_ARCH_ENABLED
#import <React/RCTConversions.h>
#import <React/RCTImageSource.h>
#import <react/renderer/components/rnscreens/ComponentDescriptors.h>
#import <react/renderer/components/rnscreens/EventEmitters.h>
#import <react/renderer/components/rnscreens/Props.h>
#import <react/renderer/components/rnscreens/RCTComponentViewHelpers.h>
#endif // RCT_NEW_ARCH_ENABLED

#if RCT_NEW_ARCH_ENABLED
namespace react = facebook::react;
#endif // RCT_NEW_ARCH_ENABLED

#pragma mark - View implementation

@implementation RNSBottomTabsScreenComponentView {
  RNSTabsScreenViewController *_controller;
  RNSBottomTabsHostComponentView *__weak _Nullable _reactSuperview;

  RNSBottomTabsScreenEventEmitter *_Nonnull _reactEventEmitter;

  // We need this information to warn users about dynamic changes to behavior being currently unsupported.
  BOOL _isOverrideScrollViewContentInsetAdjustmentBehaviorSet;
#if !RCT_NEW_ARCH_ENABLED
  BOOL _tabItemNeedsAppearanceUpdate;
#endif // !RCT_NEW_ARCH_ENABLED
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
#if RCT_NEW_ARCH_ENABLED
  static const auto defaultProps = std::make_shared<const react::RNSBottomTabsScreenProps>();
  _props = defaultProps;
#endif // RCT_NEW_ARCH_ENABLED

  _controller = [RNSTabsScreenViewController new];
  _controller.view = self;

  _reactSuperview = nil;
  _reactEventEmitter = [RNSBottomTabsScreenEventEmitter new];

#if !RCT_NEW_ARCH_ENABLED
  _tabItemNeedsAppearanceUpdate = NO;
#endif

  // This is a temporary workaround to avoid UIScrollEdgeEffect glitch
  // when changing tabs when ScrollView is present.
  // TODO: don't hardcode color here
  self.backgroundColor = [UIColor whiteColor];

  [self resetProps];
}

- (void)resetProps
{
  _isSelectedScreen = NO;
  _badgeValue = nil;
  _title = nil;
  _tabBarBlurEffect = RNSBlurEffectStyleSystemDefault;
  _tabBarBackgroundColor = nil;

  _tabBarItemTitleFontFamily = nil;
  _tabBarItemTitleFontSize = nil;
  _tabBarItemTitleFontWeight = nil;
  _tabBarItemTitleFontStyle = nil;
  _tabBarItemTitleFontColor = nil;
  _tabBarItemTitlePositionAdjustment = UIOffsetMake(0.0, 0.0);

  _tabBarItemIconColor = nil;

  _tabBarItemBadgeBackgroundColor = nil;

  _shouldUseRepeatedTabSelectionPopToRootSpecialEffect = YES;
  _shouldUseRepeatedTabSelectionScrollToTopSpecialEffect = YES;

  _overrideScrollViewContentInsetAdjustmentBehavior = YES;
  _isOverrideScrollViewContentInsetAdjustmentBehaviorSet = NO;

  _iconType = RNSBottomTabsIconTypeSfSymbol;

  _iconImageSource = nil;
  _iconSfSymbolName = nil;

  _selectedIconImageSource = nil;
  _selectedIconSfSymbolName = nil;
}

- (void)invalidate
{
  // Controller keeps the strong reference to the component via the `.view` property.
  // Therefore, we need to enforce a proper cleanup, breaking the retain cycle,
  // when we want to destroy the component.
  _controller = nil;
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

#if RCT_NEW_ARCH_ENABLED
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
    _tabBarBlurEffect = rnscreens::conversion::RNSBlurEffectStyleFromRNSBottomTabsScreenTabBarBlurEffect(
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

  if (newComponentProps.iconType != oldComponentProps.iconType) {
    _iconType = rnscreens::conversion::RNSBottomTabsIconTypeFromIcon(newComponentProps.iconType);
    tabItemNeedsAppearanceUpdate = YES;
  }

  if (newComponentProps.iconImageSource != oldComponentProps.iconImageSource) {
    _iconImageSource =
        rnscreens::conversion::RCTImageSourceFromImageSourceAndIconType(&newComponentProps.iconImageSource, _iconType);
    tabItemNeedsAppearanceUpdate = YES;
  }

  if (newComponentProps.iconSfSymbolName != oldComponentProps.iconSfSymbolName) {
    _iconSfSymbolName = RCTNSStringFromStringNilIfEmpty(newComponentProps.iconSfSymbolName);
    tabItemNeedsAppearanceUpdate = YES;
  }

  if (newComponentProps.selectedIconImageSource != oldComponentProps.selectedIconImageSource) {
    _selectedIconImageSource = rnscreens::conversion::RCTImageSourceFromImageSourceAndIconType(
        &newComponentProps.selectedIconImageSource, _iconType);
    tabItemNeedsAppearanceUpdate = YES;
  }

  if (newComponentProps.selectedIconSfSymbolName != oldComponentProps.selectedIconSfSymbolName) {
    _selectedIconSfSymbolName = RCTNSStringFromStringNilIfEmpty(newComponentProps.selectedIconSfSymbolName);
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

#else

#pragma mark - LEGACY RCTComponent protocol

- (void)didSetProps:(NSArray<NSString *> *)changedProps
{
  [super didSetProps:changedProps];

  // This flag is set to YES when overrideScrollViewContentInsetAdjustmentBehavior prop
  // is assigned for the first time. This allows us to identify any subsequent changes to this prop,
  // enabling us to warn users that dynamic changes are not supported.
  // On Paper, setter for the prop may not be called (when it is undefined in JS).
  // Therefore we set the flag in didSetProps to make sure to handle this case as well.
  // didSetProps will always be called because tabKey prop is required.
  _isOverrideScrollViewContentInsetAdjustmentBehaviorSet = YES;

  if (_tabItemNeedsAppearanceUpdate) {
    [_controller tabItemAppearanceHasChanged];
    _tabItemNeedsAppearanceUpdate = NO;
  }
}

#pragma mark - LEGACY prop setters

- (void)setIsSelectedScreen:(BOOL)isSelectedScreen
{
  if (_isSelectedScreen != isSelectedScreen) {
    _isSelectedScreen = isSelectedScreen;
    [_controller tabScreenFocusHasChanged];
  }
}

- (void)setTabKey:(NSString *)tabKey
{
  RCTAssert([NSString rnscreens_isBlankOrNull:tabKey] == NO, @"[RNScreens] tabKey must not be empty");
  _tabKey = tabKey;
}

- (void)setTitle:(NSString *)title
{
  _title = title;
  _controller.title = title;
}

- (void)setBadgeValue:(NSString *)badgeValue
{
  _badgeValue = [NSString rnscreens_stringOrNilIfBlank:badgeValue];
  _controller.tabBarItem.badgeValue = _badgeValue;
}

- (void)setTabBarBackgroundColor:(UIColor *)tabBarBackgroundColor
{
  _tabBarBackgroundColor = tabBarBackgroundColor;
  _tabItemNeedsAppearanceUpdate = YES;
}

- (void)setTabBarBlurEffect:(RNSBlurEffectStyle)tabBarBlurEffect
{
  _tabBarBlurEffect = tabBarBlurEffect;
  _tabItemNeedsAppearanceUpdate = YES;
}

- (void)setTabBarItemTitleFontFamily:(NSString *)tabBarItemTitleFontFamily
{
  _tabBarItemTitleFontFamily = [NSString rnscreens_stringOrNilIfEmpty:tabBarItemTitleFontFamily];
  _tabItemNeedsAppearanceUpdate = YES;
}

- (void)setTabBarItemTitleFontSize:(NSNumber *)tabBarItemTitleFontSize
{
  _tabBarItemTitleFontSize = tabBarItemTitleFontSize;
  _tabItemNeedsAppearanceUpdate = YES;
}

- (void)setTabBarItemTitleFontWeight:(NSString *)tabBarItemTitleFontWeight
{
  _tabBarItemTitleFontWeight = [NSString rnscreens_stringOrNilIfEmpty:tabBarItemTitleFontWeight];
  _tabItemNeedsAppearanceUpdate = YES;
}

- (void)setTabBarItemTitleFontStyle:(NSString *)tabBarItemTitleFontStyle
{
  _tabBarItemTitleFontStyle = [NSString rnscreens_stringOrNilIfEmpty:tabBarItemTitleFontStyle];
  _tabItemNeedsAppearanceUpdate = YES;
}

- (void)setTabBarItemTitleFontColor:(UIColor *)tabBarItemTitleFontColor
{
  _tabBarItemTitleFontColor = tabBarItemTitleFontColor;
  _tabItemNeedsAppearanceUpdate = YES;
}

- (void)setTabBarItemIconColor:(UIColor *)tabBarItemIconColor
{
  _tabBarItemIconColor = tabBarItemIconColor;
  _tabItemNeedsAppearanceUpdate = YES;
}

- (void)setTabBarItemTitlePositionAdjustment:(UIOffset)tabBarItemTitlePositionAdjustment
{
  _tabBarItemTitlePositionAdjustment = tabBarItemTitlePositionAdjustment;
  _tabItemNeedsAppearanceUpdate = YES;
}

- (void)setIconType:(RNSBottomTabsIconType)iconType
{
  _iconType = iconType;
  _tabItemNeedsAppearanceUpdate = YES;
}

- (void)setIconImageSource:(RCTImageSource *)iconImageSource
{
  _iconImageSource = iconImageSource;
  _tabItemNeedsAppearanceUpdate = YES;
}

- (void)setIconSfSymbolName:(NSString *)iconSfSymbolName
{
  _iconSfSymbolName = [NSString rnscreens_stringOrNilIfEmpty:iconSfSymbolName];
  _tabItemNeedsAppearanceUpdate = YES;
}

- (void)setSelectedIconImageSource:(RCTImageSource *)selectedIconImageSource
{
  _selectedIconImageSource = selectedIconImageSource;
  _tabItemNeedsAppearanceUpdate = YES;
}

- (void)setSelectedIconSfSymbolName:(NSString *)selectedIconSfSymbolName
{
  _selectedIconSfSymbolName = [NSString rnscreens_stringOrNilIfEmpty:selectedIconSfSymbolName];
  _tabItemNeedsAppearanceUpdate = YES;
}

- (void)setOverrideScrollViewContentInsetAdjustmentBehavior:(BOOL)overrideScrollViewContentInsetAdjustmentBehavior
{
  _overrideScrollViewContentInsetAdjustmentBehavior = overrideScrollViewContentInsetAdjustmentBehavior;

  if (_isOverrideScrollViewContentInsetAdjustmentBehaviorSet) {
    RCTLogWarn(
        @"[RNScreens] changing overrideScrollViewContentInsetAdjustmentBehavior dynamically is currently unsupported");
  }

  // _isOverrideScrollViewContentInsetAdjustmentBehaviorSet flag is set in didSetProps to handle a case
  // when the prop is undefined in JS and default value is used instead of calling this setter.
}

- (void)setOnWillAppear:(RCTDirectEventBlock)onWillAppear
{
  [self.reactEventEmitter setOnWillAppear:onWillAppear];
}

- (void)setOnWillDisappear:(RCTDirectEventBlock)onWillDisappear
{
  [self.reactEventEmitter setOnWillDisappear:onWillDisappear];
}

- (void)setOnDidAppear:(RCTDirectEventBlock)onDidAppear
{
  [self.reactEventEmitter setOnDidAppear:onDidAppear];
}

- (void)setOnDidDisappear:(RCTDirectEventBlock)onDidDisappear
{
  [self.reactEventEmitter setOnDidDisappear:onDidDisappear];
}

#define RNS_FAILING_EVENT_GETTER(eventName)                                           \
  -(RCTDirectEventBlock)eventName                                                     \
  {                                                                                   \
    RCTAssert(NO, @"[RNScreens] Events should be emitted through reactEventEmitter"); \
    return nil;                                                                       \
  }

RNS_FAILING_EVENT_GETTER(onWillAppear);
RNS_FAILING_EVENT_GETTER(onDidAppear);
RNS_FAILING_EVENT_GETTER(onWillDisappear);
RNS_FAILING_EVENT_GETTER(onDidDisappear);

#undef RNS_FAILING_EVENT_GETTER

#endif // RCT_NEW_ARCH_ENABLED

@end

#if RCT_NEW_ARCH_ENABLED
#pragma mark - View class exposure

Class<RCTComponentViewProtocol> RNSBottomTabsScreen(void)
{
  return RNSBottomTabsScreenComponentView.class;
}
#endif // RCT_NEW_ARCH_ENABLED
