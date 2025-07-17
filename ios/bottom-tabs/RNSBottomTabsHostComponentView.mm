#import "RNSBottomTabsHostComponentView.h"

#if RCT_NEW_ARCH_ENABLED
#import <React/RCTConversions.h>
#import <React/RCTImageLoader.h>
#import <React/RCTMountingTransactionObserving.h>
#import <react/renderer/components/rnscreens/ComponentDescriptors.h>
#import <react/renderer/components/rnscreens/EventEmitters.h>
#import <react/renderer/components/rnscreens/Props.h>
#import <react/renderer/components/rnscreens/RCTComponentViewHelpers.h>
#import <rnscreens/RNSBottomTabsComponentDescriptor.h>
#import "RNSBottomTabsHostComponentView+RNSImageLoader.h"
#endif // RCT_NEW_ARCH_ENABLED

#import "RNSBottomTabsScreenComponentView.h"
#import "RNSConversions.h"
#import "RNSConvert.h"
#import "RNSDefines.h"
#import "RNSTabBarController.h"
#import "RNSTabBarControllerDelegate.h"

namespace react = facebook::react;

#pragma mark - View implementation

@interface RNSBottomTabsHostComponentView ()
#if RCT_NEW_ARCH_ENABLED
    <RCTMountingTransactionObserving>
#endif // RCT_NEW_ARCH_ENABLED
@end

@implementation RNSBottomTabsHostComponentView {
  RNSTabBarController *_controller;
  RNSTabBarControllerDelegate *_controllerDelegate;

  RNSBottomTabsHostEventEmitter *_Nonnull _reactEventEmitter;

  RCTImageLoader *_Nullable _imageLoader;

  // RCTViewComponentView does not expose this field, therefore we maintain
  // it on our side.
  NSMutableArray<RNSBottomTabsScreenComponentView *> *_reactSubviews;
  BOOL _hasModifiedReactSubviewsInCurrentTransaction;
  BOOL _needsTabBarAppearanceUpdate;
}

- (instancetype)initWithFrame:(CGRect)frame
{
  if (self = [super initWithFrame:frame]) {
    [self initState];
  }
  return self;
}

#if !RCT_NEW_ARCH_ENABLED
- (instancetype)initWithFrame:(CGRect)frame reactImageLoader:(RCTImageLoader *)imageLoader
{
  if (self = [self initWithFrame:frame]) {
    _imageLoader = imageLoader;
  }
  return self;
}
#endif // !RCT_NEW_ARCH_ENABLED

- (void)initState
{
  [self resetProps];

  _controller = [[RNSTabBarController alloc] initWithTabsHostComponentView:self];
  _controllerDelegate = [RNSTabBarControllerDelegate new];
  _controller.delegate = _controllerDelegate;

  _reactSubviews = [NSMutableArray new];
  _reactEventEmitter = [RNSBottomTabsHostEventEmitter new];

  _hasModifiedReactSubviewsInCurrentTransaction = NO;
  _needsTabBarAppearanceUpdate = NO;
}

- (void)resetProps
{
#if RCT_NEW_ARCH_ENABLED
  static const auto defaultProps = std::make_shared<const react::RNSBottomTabsProps>();
  _props = defaultProps;
#endif
  _tabBarBlurEffect = nil;
  _tabBarBackgroundColor = nil;
  _tabBarTintColor = nil;

  _tabBarItemTitleFontFamily = nil;
  _tabBarItemTitleFontSize = nil;
  _tabBarItemTitleFontWeight = nil;
  _tabBarItemTitleFontStyle = nil;
  _tabBarItemTitleFontColor = nil;
  _tabBarItemTitlePositionAdjustment = UIOffsetMake(0.0, 0.0);

  _tabBarItemIconColor = nil;

  _tabBarItemBadgeBackgroundColor = nil;
}

#pragma mark - UIView methods

- (void)didMoveToWindow
{
  [self reactAddControllerToClosestParent:_controller];

#if !RCT_NEW_ARCH_ENABLED
  // This is required on legacy architecture to prevent a bug with doubled size of UIViewControllerWrapperView.
  _controller.view.frame = self.bounds;
#endif // !RCT_NEW_ARCH_ENABLED
}

- (void)reactAddControllerToClosestParent:(UIViewController *)controller
{
  if (!controller.parentViewController) {
    UIView *parentView = (UIView *)self.reactSuperview;
    while (parentView) {
      if (parentView.reactViewController) {
        [parentView.reactViewController addChildViewController:controller];
        [self addSubview:controller.view];
        [controller didMoveToParentViewController:parentView.reactViewController];
        break;
      }
      parentView = (UIView *)parentView.reactSuperview;
    }
    return;
  }
}

#pragma mark - RNSScreenContainerDelegate

- (void)updateContainer
{
  NSMutableArray<RNSTabsScreenViewController *> *tabControllers =
      [[NSMutableArray alloc] initWithCapacity:_reactSubviews.count];
  for (RNSBottomTabsScreenComponentView *childView in _reactSubviews) {
    [tabControllers addObject:childView.controller];
  }

  NSLog(@"updateContainer: tabControllers: %@", tabControllers);

  [_controller childViewControllersHaveChangedTo:tabControllers];
}

- (void)markChildUpdated
{
  [self updateContainer];
}

#pragma mark - React events

- (nonnull RNSBottomTabsHostEventEmitter *)reactEventEmitter
{
  RCTAssert(_reactEventEmitter != nil, @"[RNScreens] Attempt to access uninitialized _reactEventEmitter");
  return _reactEventEmitter;
}

- (BOOL)emitOnNativeFocusChangeRequestSelectedTabScreen:(RNSBottomTabsScreenComponentView *)tabScreen
{
  return [_reactEventEmitter emitOnNativeFocusChange:OnNativeFocusChangePayload{.tabKey = tabScreen.tabKey}];
}

#pragma mark - RCTViewComponentViewProtocol
#if RCT_NEW_ARCH_ENABLED

- (void)mountChildComponentView:(UIView<RCTComponentViewProtocol> *)childComponentView index:(NSInteger)index
{
  RCTAssert(
      [childComponentView isKindOfClass:RNSBottomTabsScreenComponentView.class],
      @"BottomTabsView only accepts children of type BottomTabScreen. Attempted to mount %@",
      childComponentView);

  auto *childScreen = static_cast<RNSBottomTabsScreenComponentView *>(childComponentView);
  childScreen.reactSuperview = self;

  [_reactSubviews insertObject:childScreen atIndex:index];
  _hasModifiedReactSubviewsInCurrentTransaction = YES;
}

- (void)unmountChildComponentView:(UIView<RCTComponentViewProtocol> *)childComponentView index:(NSInteger)index
{
  RCTAssert(
      [childComponentView isKindOfClass:RNSBottomTabsScreenComponentView.class],
      @"BottomTabsView only accepts children of type BottomTabScreen. Attempted to unmount %@",
      childComponentView);

  auto *childScreen = static_cast<RNSBottomTabsScreenComponentView *>(childComponentView);
  childScreen.reactSuperview = nil;

  [_reactSubviews removeObject:childScreen];
  _hasModifiedReactSubviewsInCurrentTransaction = YES;
}

- (void)updateProps:(const facebook::react::Props::Shared &)props
           oldProps:(const facebook::react::Props::Shared &)oldProps
{
  const auto &oldComponentProps = *std::static_pointer_cast<const react::RNSBottomTabsProps>(_props);
  const auto &newComponentProps = *std::static_pointer_cast<const react::RNSBottomTabsProps>(props);

  if (newComponentProps.controlNavigationStateInJS != oldComponentProps.controlNavigationStateInJS) {
    _experimental_controlNavigationStateInJS = newComponentProps.controlNavigationStateInJS;
  }

  if (newComponentProps.tabBarBackgroundColor != oldComponentProps.tabBarBackgroundColor) {
    _needsTabBarAppearanceUpdate = YES;
    _tabBarBackgroundColor = RCTUIColorFromSharedColor(newComponentProps.tabBarBackgroundColor);
  }

  if (newComponentProps.tabBarBlurEffect != oldComponentProps.tabBarBlurEffect) {
    _needsTabBarAppearanceUpdate = YES;
    _tabBarBlurEffect =
        rnscreens::conversion::RNSUIBlurEffectFromRNSBottomTabsTabBarBlurEffect(newComponentProps.tabBarBlurEffect);
  }

  if (newComponentProps.tabBarTintColor != oldComponentProps.tabBarTintColor) {
    _needsTabBarAppearanceUpdate = YES;
    _tabBarTintColor = RCTUIColorFromSharedColor(newComponentProps.tabBarTintColor);
  }

  if (newComponentProps.tabBarItemTitleFontFamily != oldComponentProps.tabBarItemTitleFontFamily) {
    _tabBarItemTitleFontFamily = RCTNSStringFromStringNilIfEmpty(newComponentProps.tabBarItemTitleFontFamily);
    _needsTabBarAppearanceUpdate = YES;
  }

  if (newComponentProps.tabBarItemTitleFontSize != oldComponentProps.tabBarItemTitleFontSize) {
    _tabBarItemTitleFontSize = [NSNumber numberWithFloat:newComponentProps.tabBarItemTitleFontSize];
    _needsTabBarAppearanceUpdate = YES;
  }

  if (newComponentProps.tabBarItemTitleFontWeight != oldComponentProps.tabBarItemTitleFontWeight) {
    _tabBarItemTitleFontWeight = RCTNSStringFromStringNilIfEmpty(newComponentProps.tabBarItemTitleFontWeight);
    _needsTabBarAppearanceUpdate = YES;
  }

  if (newComponentProps.tabBarItemTitleFontStyle != oldComponentProps.tabBarItemTitleFontStyle) {
    _tabBarItemTitleFontStyle = RCTNSStringFromStringNilIfEmpty(newComponentProps.tabBarItemTitleFontStyle);
    _needsTabBarAppearanceUpdate = YES;
  }

  if (newComponentProps.tabBarItemTitleFontColor != oldComponentProps.tabBarItemTitleFontColor) {
    _tabBarItemTitleFontColor = RCTUIColorFromSharedColor(newComponentProps.tabBarItemTitleFontColor);
    _needsTabBarAppearanceUpdate = YES;
  }

  if (newComponentProps.tabBarItemIconColor != oldComponentProps.tabBarItemIconColor) {
    _tabBarItemIconColor = RCTUIColorFromSharedColor(newComponentProps.tabBarItemIconColor);
    _needsTabBarAppearanceUpdate = YES;
  }

  if (newComponentProps.tabBarItemBadgeBackgroundColor != oldComponentProps.tabBarItemBadgeBackgroundColor) {
    _tabBarItemBadgeBackgroundColor = RCTUIColorFromSharedColor(newComponentProps.tabBarItemBadgeBackgroundColor);
    _needsTabBarAppearanceUpdate = YES;
  }

  if (newComponentProps.tabBarItemTitlePositionAdjustment.horizontal !=
          oldComponentProps.tabBarItemTitlePositionAdjustment.horizontal ||
      newComponentProps.tabBarItemTitlePositionAdjustment.vertical !=
          oldComponentProps.tabBarItemTitlePositionAdjustment.vertical) {
    _tabBarItemTitlePositionAdjustment = rnscreens::conversion::RNSBottomTabsTabBarItemTitlePositionAdjustmentStruct(
        newComponentProps.tabBarItemTitlePositionAdjustment);
    _needsTabBarAppearanceUpdate = YES;
  }

  // Super call updates _props pointer. We should NOT update it before calling super.
  [super updateProps:props oldProps:oldProps];
}

- (void)updateState:(const facebook::react::State::Shared &)state
           oldState:(const facebook::react::State::Shared &)oldState
{
  react::RNSBottomTabsShadowNode::ConcreteState::Shared receivedState =
      std::static_pointer_cast<const react::RNSBottomTabsShadowNode::ConcreteState>(state);
  
  _imageLoader = [self retrieveImageLoaderFromState:receivedState];
}

- (void)updateEventEmitter:(const facebook::react::EventEmitter::Shared &)eventEmitter
{
  [super updateEventEmitter:eventEmitter];

  const auto &castedEventEmitter = std::static_pointer_cast<const react::RNSBottomTabsEventEmitter>(eventEmitter);
  [_reactEventEmitter updateEventEmitter:castedEventEmitter];
}

- (void)finalizeUpdates:(RNComponentViewUpdateMask)updateMask
{
  if (_needsTabBarAppearanceUpdate) {
    _needsTabBarAppearanceUpdate = NO;
    [_controller setNeedsUpdateOfTabBarAppearance:true];
  }
  [super finalizeUpdates:updateMask];
}

+ (react::ComponentDescriptorProvider)componentDescriptorProvider
{
  return react::concreteComponentDescriptorProvider<react::RNSBottomTabsComponentDescriptor>();
}

+ (BOOL)shouldBeRecycled
{
  // There won't be tens of instances of this component usually & it's easier for now.
  // We could consider enabling it someday though.
  return NO;
}

#pragma mark - RCTMountingTransactionObserving

- (void)mountingTransactionWillMount:(const facebook::react::MountingTransaction &)transaction
                withSurfaceTelemetry:(const facebook::react::SurfaceTelemetry &)surfaceTelemetry
{
  _hasModifiedReactSubviewsInCurrentTransaction = NO;
  [_controller reactMountingTransactionWillMount];
}

- (void)mountingTransactionDidMount:(const facebook::react::MountingTransaction &)transaction
               withSurfaceTelemetry:(const facebook::react::SurfaceTelemetry &)surfaceTelemetry
{
  if (_hasModifiedReactSubviewsInCurrentTransaction) {
    [self updateContainer];
  }
  [_controller reactMountingTransactionDidMount];
}

#else
#pragma mark - LEGACY architecture implementation

#pragma mark - LEGACY RCTComponent protocol

RNS_IGNORE_SUPER_CALL_BEGIN
- (void)insertReactSubview:(UIView *)subview atIndex:(NSInteger)index
{
  RCTAssert(
      [subview isKindOfClass:RNSBottomTabsScreenComponentView.class],
      @"BottomTabsView only accepts children of type BottomTabScreen. Attempted to mount %@",
      subview);

  auto *childScreen = static_cast<RNSBottomTabsScreenComponentView *>(subview);
  childScreen.reactSuperview = self;

  [_reactSubviews insertObject:childScreen atIndex:index];
}

- (void)removeReactSubview:(UIView *)subview
{
  RCTAssert(
      [subview isKindOfClass:RNSBottomTabsScreenComponentView.class],
      @"BottomTabsView only accepts children of type BottomTabScreen. Attempted to unmount %@",
      subview);

  auto *childScreen = static_cast<RNSBottomTabsScreenComponentView *>(subview);
  childScreen.reactSuperview = nil;

  [_reactSubviews removeObject:childScreen];
}
RNS_IGNORE_SUPER_CALL_END

- (void)didUpdateReactSubviews
{
  [super didUpdateReactSubviews];
  _hasModifiedReactSubviewsInCurrentTransaction = YES;
  [self invalidateFlagsOnControllerIfNeeded];
}

- (void)didSetProps:(NSArray<NSString *> *)changedProps
{
  [super didSetProps:changedProps];
  _needsTabBarAppearanceUpdate = YES;
  [self invalidateFlagsOnControllerIfNeeded];
}

#pragma mark - LEGACY update methods

- (void)invalidateFlagsOnControllerIfNeeded
{
  if (_needsTabBarAppearanceUpdate) {
    _needsTabBarAppearanceUpdate = NO;
    [_controller setNeedsUpdateOfTabBarAppearance:true];
  }

  if (_hasModifiedReactSubviewsInCurrentTransaction) {
    _hasModifiedReactSubviewsInCurrentTransaction = NO;
    [self updateContainer];
  }
}

- (void)invalidateTabBarAppearance
{
  _needsTabBarAppearanceUpdate = YES;
  [self invalidateFlagsOnControllerIfNeeded];
}

#pragma mark - LEGACY prop setters

// Paper will call property setters

- (void)setTabBarBackgroundColor:(UIColor *_Nullable)tabBarBackgroundColor
{
  _tabBarBackgroundColor = tabBarBackgroundColor;
  [self invalidateTabBarAppearance];
}

- (void)setTabBarBlurEffect:(UIBlurEffect *_Nullable)tabBarBlurEffect
{
  _tabBarBlurEffect = tabBarBlurEffect;
  [self invalidateTabBarAppearance];
}

- (void)setTabBarTintColor:(UIColor *_Nullable)tabBarTintColor
{
  _tabBarTintColor = tabBarTintColor;
  [self invalidateTabBarAppearance];
}

- (void)setTabBarItemTitleFontFamily:(NSString *_Nullable)tabBarItemTitleFontFamily
{
  _tabBarItemTitleFontFamily = tabBarItemTitleFontFamily;
  [self invalidateTabBarAppearance];
}

- (void)setTabBarItemTitleFontSize:(NSNumber *_Nullable)tabBarItemTitleFontSize
{
  _tabBarItemTitleFontSize = tabBarItemTitleFontSize;
  [self invalidateTabBarAppearance];
}

- (void)setTabBarItemTitleFontWeight:(NSString *_Nullable)tabBarItemTitleFontWeight
{
  _tabBarItemTitleFontWeight = tabBarItemTitleFontWeight;
  [self invalidateTabBarAppearance];
}

- (void)setTabBarItemTitleFontStyle:(NSString *_Nullable)tabBarItemTitleFontStyle
{
  _tabBarItemTitleFontStyle = tabBarItemTitleFontStyle;
  [self invalidateTabBarAppearance];
}

- (void)setTabBarItemTitleFontColor:(UIColor *_Nullable)tabBarItemTitleFontColor
{
  _tabBarItemTitleFontColor = tabBarItemTitleFontColor;
  [self invalidateTabBarAppearance];
}

- (void)setTabBarItemIconColor:(UIColor *_Nullable)tabBarItemIconColor
{
  _tabBarItemIconColor = tabBarItemIconColor;
  [self invalidateTabBarAppearance];
}

- (void)setTabBarItemBadgeBackgroundColor:(UIColor *_Nullable)tabBarItemBadgeBackgroundColor
{
  _tabBarItemBadgeBackgroundColor = tabBarItemBadgeBackgroundColor;
  [self invalidateTabBarAppearance];
}

- (void)setTabBarItemTitlePositionAdjustment:(UIOffset)tabBarItemTitlePositionAdjustment
{
  _tabBarItemTitlePositionAdjustment = tabBarItemTitlePositionAdjustment;
  [self invalidateTabBarAppearance];
}

- (void)setOnNativeFocusChange:(RCTDirectEventBlock)onNativeFocusChange
{
  [self.reactEventEmitter setOnNativeFocusChange:onNativeFocusChange];
}

#endif // RCT_NEW_ARCH_ENABLED

#pragma mark - React Image Loader

- (nullable RCTImageLoader *)reactImageLoader
{
  return _imageLoader;
}

@end

#if RCT_NEW_ARCH_ENABLED
#pragma mark - View class exposure

Class<RCTComponentViewProtocol> RNSBottomTabsCls(void)
{
  return RNSBottomTabsHostComponentView.class;
}
#endif // RCT_NEW_ARCH_ENABLED
