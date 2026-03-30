#import "RNSSplitNavigatorComponentView.h"
#import <React/RCTAssert.h>
#import <rnscreens/RNSSplitNavigatorComponentDescriptor.h>
#import "RNSConversions.h"
#import "RNSSplitScreenComponentView.h"

#import "Swift-Bridging.h"

namespace react = facebook::react;

@implementation RNSSplitNavigatorComponentView {
  RNSSplitNavigatorController *_Nullable _controller;
  RNSSplitNavigatorShadowStateProxy *_Nonnull _shadowStateProxy;
}

- (RNSSplitNavigatorController *)controller
{
  RCTAssert(
      _controller != nil,
      @"[RNScreens] Attempt to access RNSSplitNavigatorController before RNSSplitNavigatorComponentView was initialized. (for: %@)",
      self);
  return _controller;
}

- (instancetype)initWithFrame:(CGRect)frame
{
  if (self = [super initWithFrame:frame]) {
    [self resetProps];

    _controller = [[RNSSplitNavigatorController alloc] initWithNavigatorComponentView:self];
    // NOTE: Do NOT set _controller.view = self here.
    // RNSSplitNavigatorController is a UINavigationController — replacing its view would destroy
    // UIKit's internal nav bar + content container hierarchy.
    // The controller is embedded into the UISplitViewController columns via
    // setViewController(_:for:) called by RNSSplitHostController.updateChildViewControllers().

    _shadowStateProxy = [RNSSplitNavigatorShadowStateProxy new];
  }

  return self;
}

- (void)resetProps
{
  static const auto defaultProps = std::make_shared<const react::RNSSplitNavigatorProps>();
  _props = defaultProps;

  _columnType = RNSSplitNavigatorColumnTypeSecondary;
}

// MARK: - RNSBaseNavigatorComponentView abstract override

- (nonnull RNSBaseNavigatorController *)navigatorController
{
  RCTAssert(_controller != nil, @"[RNScreens] Attempt to access RNSSplitNavigatorController before initialization. (for: %@)", self);
  return _controller;
}

#pragma mark - ShadowTreeState

- (nonnull RNSSplitNavigatorShadowStateProxy *)shadowStateProxy
{
  RCTAssert(_shadowStateProxy != nil, @"[RNScreens] Attempt to access uninitialized _shadowStateProxy");
  return _shadowStateProxy;
}

#pragma mark - RNSReactBaseView overrides

- (nonnull NSMutableArray<RNSSplitScreenComponentView *> *)reactSubviews
{
  return (NSMutableArray<RNSSplitScreenComponentView *> *)[super reactSubviews];
}

#pragma mark - RCTComponentViewProtocol

+ (react::ComponentDescriptorProvider)componentDescriptorProvider
{
  return react::concreteComponentDescriptorProvider<react::RNSSplitNavigatorComponentDescriptor>();
}

+ (BOOL)shouldBeRecycled
{
  return NO;
}

- (void)mountChildComponentView:(UIView<RCTComponentViewProtocol> *)childComponentView index:(NSInteger)index
{
  RCTAssert(
      [childComponentView isKindOfClass:RNSSplitScreenComponentView.class],
      @"[RNScreens] Attempt to mount child of unsupported type: %@, expected %@",
      childComponentView.class,
      RNSSplitScreenComponentView.class);

  auto *childScreen = static_cast<RNSSplitScreenComponentView *>(childComponentView);
  childScreen.splitNavigator = self;
  [[self reactSubviews] insertObject:childScreen atIndex:index];
  [self markSubviewsModifiedInCurrentTransaction];
}

- (void)unmountChildComponentView:(UIView<RCTComponentViewProtocol> *)childComponentView index:(NSInteger)index
{
  RCTAssert(
      [childComponentView isKindOfClass:RNSSplitScreenComponentView.class],
      @"[RNScreens] Attempt to unmount child of unsupported type: %@, expected %@",
      childComponentView.class,
      RNSSplitScreenComponentView.class);

  auto *childScreen = static_cast<RNSSplitScreenComponentView *>(childComponentView);
  childScreen.splitNavigator = nil;
  [[self reactSubviews] removeObject:childScreen];
  [self markSubviewsModifiedInCurrentTransaction];
}

- (void)updateState:(react::State::Shared const &)state oldState:(react::State::Shared const &)oldState
{
  [super updateState:state oldState:oldState];
  [_shadowStateProxy updateState:state oldState:oldState];
}

- (void)updateProps:(const facebook::react::Props::Shared &)props
           oldProps:(const facebook::react::Props::Shared &)oldProps
{
  const auto &oldComponentProps = *std::static_pointer_cast<const react::RNSSplitNavigatorProps>(_props);
  const auto &newComponentProps = *std::static_pointer_cast<const react::RNSSplitNavigatorProps>(props);

  if (oldComponentProps.columnType != newComponentProps.columnType) {
    _columnType = rnscreens::conversion::RNSSplitNavigatorColumnTypeFromNavigatorProp(newComponentProps.columnType);
  }

  [super updateProps:props oldProps:oldProps];
}

- (void)invalidate
{
  _controller = nil;
}

@end

Class<RCTComponentViewProtocol> RNSSplitNavigatorCls(void)
{
  return RNSSplitNavigatorComponentView.class;
}
