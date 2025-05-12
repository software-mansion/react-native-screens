#import "RNSBottomTabsHostComponentView.h"
#import <React/RCTConversions.h>
#import <React/RCTMountingTransactionObserving.h>
#import <react/renderer/components/rnscreens/ComponentDescriptors.h>
#import <react/renderer/components/rnscreens/EventEmitters.h>
#import <react/renderer/components/rnscreens/Props.h>
#import <react/renderer/components/rnscreens/RCTComponentViewHelpers.h>
#import "RNSBottomTabsScreenComponentView.h"
#import "RNSDefines.h"
#import "RNSTabBarController.h"

namespace react = facebook::react;

#pragma mark - View implementation

@interface RNSBottomTabsHostComponentView () <RCTMountingTransactionObserving>
@end

@implementation RNSBottomTabsHostComponentView {
  RNSTabBarController *_controller;

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
  static const auto defaultProps = std::make_shared<const react::RNSBottomTabsProps>();
  _props = defaultProps;
  _controller = [[RNSTabBarController alloc] init];
  _reactSubviews = [NSMutableArray new];
  _hasModifiedReactSubviewsInCurrentTransaction = NO;
  _needsTabBarAppearanceUpdate = NO;
}

- (nullable UITabBarAppearance *)makeTabBarAppearance
{
  UITabBarAppearance *newAppearance = [[UITabBarAppearance alloc] init];
  newAppearance.backgroundColor = _tabBarBackgroundColor;
  return newAppearance;
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
  NSMutableArray<UIViewController *> *tabControllers = [[NSMutableArray alloc] initWithCapacity:_reactSubviews.count];
  for (RNSBottomTabsScreenComponentView *childView in _reactSubviews) {
    [tabControllers addObject:childView.controller];
  }

  NSLog(@"updateContainer: tabControllers: %@", tabControllers);

  [_controller setViewControllers:tabControllers animated:NO];
  [[_controller tabBar] setItemPositioning:UITabBarItemPositioningCentered];
  NSLog(@"updateContainer: tabBarItems %@", [[_controller tabBar] items]);
  for (UITabBarItem *tabBarItem in [[_controller tabBar] items]) {
    tabBarItem.badgeValue = @"Hello!";
  }
}

- (void)markChildUpdated
{
  [self updateContainer];
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

  if (newComponentProps.tabBarBackgroundColor != oldComponentProps.tabBarBackgroundColor) {
    _needsTabBarAppearanceUpdate = YES;
    _tabBarBackgroundColor = RCTUIColorFromSharedColor(newComponentProps.tabBarBackgroundColor);
  }

  // Super call updates _props pointer. We should NOT update it before calling super.
  [super updateProps:props oldProps:oldProps];
}

- (void)finalizeUpdates:(RNComponentViewUpdateMask)updateMask
{
  if (_needsTabBarAppearanceUpdate) {
    _needsTabBarAppearanceUpdate = NO;
    [_controller applyTabBarAppearance:[self makeTabBarAppearance]];
  }
  [super finalizeUpdates:updateMask];
}

+ (react::ComponentDescriptorProvider)componentDescriptorProvider
{
  return react::concreteComponentDescriptorProvider<react::RNSBottomTabsComponentDescriptor>();
}

#pragma mark - RCTMountingTransactionObserving

- (void)mountingTransactionWillMount:(const facebook::react::MountingTransaction &)transaction
                withSurfaceTelemetry:(const facebook::react::SurfaceTelemetry &)surfaceTelemetry
{
  _hasModifiedReactSubviewsInCurrentTransaction = NO;
}

- (void)mountingTransactionDidMount:(const facebook::react::MountingTransaction &)transaction
               withSurfaceTelemetry:(const facebook::react::SurfaceTelemetry &)surfaceTelemetry
{
  if (_hasModifiedReactSubviewsInCurrentTransaction) {
    [self updateContainer];
  }
}

@end

#pragma mark - View class exposure

Class<RCTComponentViewProtocol> RNSBottomTabsCls(void)
{
  return RNSBottomTabsHostComponentView.class;
}
