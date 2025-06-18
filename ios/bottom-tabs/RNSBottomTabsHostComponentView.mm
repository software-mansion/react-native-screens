#import "RNSBottomTabsHostComponentView.h"
#import <React/RCTConversions.h>
#import <React/RCTMountingTransactionObserving.h>
#import <react/renderer/components/rnscreens/ComponentDescriptors.h>
#import <react/renderer/components/rnscreens/EventEmitters.h>
#import <react/renderer/components/rnscreens/Props.h>
#import <react/renderer/components/rnscreens/RCTComponentViewHelpers.h>
#import "RNSBottomTabsScreenComponentView.h"
#import "RNSConversions.h"
#import "RNSConvert.h"
#import "RNSDefines.h"
#import "RNSTabBarController.h"
#import "RNSTabBarControllerDelegate.h"

namespace react = facebook::react;

#pragma mark - View implementation

@interface RNSBottomTabsHostComponentView () <RCTMountingTransactionObserving>
@end

@implementation RNSBottomTabsHostComponentView {
  RNSTabBarController *_controller;
  RNSTabBarControllerDelegate *_controllerDelegate;

  RNSBottomTabsHostEventEmitter *_Nonnull _reactEventEmitter;

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
  static const auto defaultProps = std::make_shared<const react::RNSBottomTabsProps>();
  _props = defaultProps;
  _tabBarBlurEffect = nil;
  _tabBarBackgroundColor = nil;
  _tabBarItemTitleFontSize = nil;
  _tabBarItemBadgeBackgroundColor = nil;
}

#pragma mark - UIView methods

- (void)didMoveToWindow
{
  [self reactAddControllerToClosestParent:_controller];
}

- (void)reactAddControllerToClosestParent:(UIViewController *)controller
{
  if (!controller.parentViewController) {
    UIView *parentView = (UIView *)self.reactSuperview;
    while (parentView) {
      if (parentView.reactViewController) {
        [parentView.reactViewController addChildViewController:controller];
        [self addSubview:controller.view];
#if !TARGET_OS_TV
#endif
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

  if (newComponentProps.tabBarItemTitleFontSize != oldComponentProps.tabBarItemTitleFontSize) {
    _tabBarItemTitleFontSize = [NSNumber numberWithFloat:newComponentProps.tabBarItemTitleFontSize];
    _needsTabBarAppearanceUpdate = YES;
  }
  
  if (newComponentProps.tabBarItemBadgeBackgroundColor != oldComponentProps.tabBarItemBadgeBackgroundColor) {
    _tabBarItemBadgeBackgroundColor = RCTUIColorFromSharedColor(newComponentProps.tabBarItemBadgeBackgroundColor);
    _needsTabBarAppearanceUpdate = YES;
  }

  // Super call updates _props pointer. We should NOT update it before calling super.
  [super updateProps:props oldProps:oldProps];
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

@end

#pragma mark - View class exposure

Class<RCTComponentViewProtocol> RNSBottomTabsCls(void)
{
  return RNSBottomTabsHostComponentView.class;
}
