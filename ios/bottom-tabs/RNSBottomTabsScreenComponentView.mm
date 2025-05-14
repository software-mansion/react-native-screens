#import "RNSBottomTabsScreenComponentView.h"
#import "RNSTabBarController.h"

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
  [self resetProps];
}

- (void)resetProps
{
  _isFocused = NO;
  _badgeValue = nil;
}

- (nullable RNSBottomTabsHostComponentView *)reactSuperview
{
  return _reactSuperview;
}

#pragma mark - Events

- (std::shared_ptr<const facebook::react::RNSBottomTabsScreenEventEmitter>)reactEventEmitter
{
  return std::dynamic_pointer_cast<const facebook::react::RNSBottomTabsScreenEventEmitter>(_eventEmitter);
}

- (bool)emitOnWillAppear
{
  if (const auto eventEmitter = self.reactEventEmitter; eventEmitter != nullptr) {
    eventEmitter->onWillAppear({});
    return true;
  }
  return false;
}

- (bool)emitOnDidAppear
{
  if (const auto eventEmitter = self.reactEventEmitter; eventEmitter != nullptr) {
    eventEmitter->onDidAppear({});
    return true;
  }
  return false;
}

- (bool)emitOnWillDisappear
{
  if (const auto eventEmitter = self.reactEventEmitter; eventEmitter != nullptr) {
    eventEmitter->onWillDisappear({});
    return true;
  }
  return false;
}

- (bool)emitOnDidDisappear
{
  if (const auto eventEmitter = self.reactEventEmitter; eventEmitter != nullptr) {
    eventEmitter->onDidDisappear({});
    return true;
  }
  return false;
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

  if (newComponentProps.isFocused != oldComponentProps.isFocused) {
    _isFocused = newComponentProps.isFocused;
    [_controller tabScreenFocusHasChanged];
  }

  if (newComponentProps.badgeValue != oldComponentProps.badgeValue) {
    _badgeValue = RCTNSStringFromStringNilIfEmpty(newComponentProps.badgeValue);
    _controller.tabBarItem.badgeValue = _badgeValue;
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

@end

#pragma mark - View class exposure

Class<RCTComponentViewProtocol> RNSBottomTabsScreen(void)
{
  return RNSBottomTabsScreenComponentView.class;
}
