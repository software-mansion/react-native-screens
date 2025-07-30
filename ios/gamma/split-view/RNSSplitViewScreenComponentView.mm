#import "RNSSplitViewScreenComponentView.h"
#import <React/RCTAssert.h>
#import <React/RCTSurfaceTouchHandler.h>
#import <rnscreens/RNSSplitViewScreenComponentDescriptor.h>
#import "RNSConversions.h"

#import "Swift-Bridging.h"

namespace react = facebook::react;

@implementation RNSSplitViewScreenComponentView {
  RNSSplitViewScreenComponentEventEmitter *_Nonnull _reactEventEmitter;
  RNSSplitViewScreenController *_Nullable _controller;
  RNSSplitViewScreenShadowStateProxy *_Nonnull _shadowStateProxy;
  RCTSurfaceTouchHandler *_Nullable _touchHandler;
}

- (RNSSplitViewScreenController *)controller
{
  RCTAssert(
      _controller != nil,
      @"[RNScreens] Attempt to access RNSSplitViewScreenController before RNSSplitViewScreenComponentView was initialized. (for: %@)",
      self);
  return _controller;
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
  [self setupController];

  _reactEventEmitter = [RNSSplitViewScreenComponentEventEmitter new];
  _shadowStateProxy = [RNSSplitViewScreenShadowStateProxy new];
}

- (void)setupController
{
  _controller = [[RNSSplitViewScreenController alloc] initWithSplitViewScreenComponentView:self];
  _controller.view = self;
}

- (void)didMoveToWindow
{
  // Starting from iOS 26, a new column type called 'inspector' was introduced.
  // This column can be displayed as a modal, independent of the React Native view hierarchy.
  // In contrast, prior to iOS 26, all SplitView columns were placed under RCTSurface,
  // meaning that touches were handler by RN handlers.
  if (@available(iOS 26.0, *)) {
    // If the current controller’s splitViewController is of type RNSSplitViewHostController,
    // we know that we're still inside the RN hierarchy,
    // so there's no need to enforce additional touch event support.
    if ([_controller isInSplitViewHostSubtree]) {
      return;
    }

    if (self.window != nil) {
      if (_touchHandler == nil) {
        _touchHandler = [RCTSurfaceTouchHandler new];
      }
      [_touchHandler attachToView:self];
    } else {
      [_touchHandler detachFromView:self];
    }
  }
}

- (void)resetProps
{
  static const auto defaultProps = std::make_shared<const react::RNSSplitViewScreenProps>();
  _props = defaultProps;

  _columnType = RNSSplitViewScreenColumnTypeColumn;
}

- (void)invalidate
{
  // Controller keeps the strong reference to the component via the `.view` property.
  // Therefore, we need to enforce a proper cleanup, breaking the retain cycle,
  // when we want to destroy the component.
  _controller = nil;
}

#pragma mark - ShadowTreeState

- (nonnull RNSSplitViewScreenShadowStateProxy *)shadowStateProxy
{
  RCTAssert(_shadowStateProxy != nil, @"[RNScreens] Attempt to access uninitialized _shadowStateProxy");
  return _shadowStateProxy;
}

#pragma mark - Events

- (nonnull RNSSplitViewScreenComponentEventEmitter *)reactEventEmitter
{
  RCTAssert(_reactEventEmitter != nil, @"[RNScreens] Attempt to access uninitialized _reactEventEmitter");
  return _reactEventEmitter;
}

#pragma mark - RCTViewComponentViewProtocol

+ (react::ComponentDescriptorProvider)componentDescriptorProvider
{
  return react::concreteComponentDescriptorProvider<react::RNSSplitViewScreenComponentDescriptor>();
}

+ (BOOL)shouldBeRecycled
{
  // There won't be tens of instances of this component usually & it's easier for now.
  // We could consider enabling it someday though.
  return NO;
}

- (void)updateState:(react::State::Shared const &)state oldState:(react::State::Shared const &)oldState
{
  [super updateState:state oldState:oldState];

  [_shadowStateProxy updateState:state oldState:oldState];
}

- (void)updateProps:(const facebook::react::Props::Shared &)props
           oldProps:(const facebook::react::Props::Shared &)oldProps
{
  const auto &oldComponentProps = *std::static_pointer_cast<const react::RNSSplitViewScreenProps>(_props);
  const auto &newComponentProps = *std::static_pointer_cast<const react::RNSSplitViewScreenProps>(props);

  if (oldComponentProps.columnType != newComponentProps.columnType) {
    _columnType = rnscreens::conversion::RNSSplitViewScreenColumnTypeFromScreenProp(newComponentProps.columnType);
  }

  [super updateProps:props oldProps:oldProps];
}

- (void)updateEventEmitter:(const facebook::react::EventEmitter::Shared &)eventEmitter
{
  [super updateEventEmitter:eventEmitter];
  [_reactEventEmitter
      updateEventEmitter:std::static_pointer_cast<const react::RNSSplitViewScreenEventEmitter>(eventEmitter)];
}

@end

Class<RCTComponentViewProtocol> RNSSplitViewScreenCls(void)
{
  return RNSSplitViewScreenComponentView.class;
}
