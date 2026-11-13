#import "RNSSplitScreenComponentView.h"
#import <React/RCTAssert.h>
#import <React/RCTSurfaceTouchHandler.h>
#import <react/renderer/components/rnscreens/RNSSplitScreenComponentDescriptor.h>
#import "RNSConversions-SplitView.h"
#import "RNSNavigationItemCustomizing.h"
#import "RNSSafeAreaViewNotifications.h"
#import "RNSSplitNavigationController.h"
#import "RNSSplitScreenComponentEventEmitter.h"
#import "RNSSplitScreenController.h"
#import "RNSSplitScreenShadowStateProxy.h"
#import "RNSStackHostComponentView.h"

namespace react = facebook::react;

@interface RNSSplitScreenComponentView () <RNSSplitScreenControllerDelegate>
@end

@implementation RNSSplitScreenComponentView {
  RNSSplitScreenComponentEventEmitter *_Nonnull _reactEventEmitter;
  RNSSplitScreenController *_Nullable _controller;
  RNSSplitScreenShadowStateProxy *_Nonnull _shadowStateProxy;
  RCTSurfaceTouchHandler *_Nullable _touchHandler;
  NSMutableSet<UIView *> *_viewsForFrameCorrection;
  RNSStackHostComponentView *_Nullable _stackHost;
}

- (RNSSplitScreenController *)controller
{
  RCTAssert(
      _controller != nil,
      @"[RNScreens] Attempt to access RNSSplitScreenController before RNSSplitScreenComponentView was initialized. (for: %@)",
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

  _reactEventEmitter = [RNSSplitScreenComponentEventEmitter new];
  _shadowStateProxy = [RNSSplitScreenShadowStateProxy new];

  _viewsForFrameCorrection = [NSMutableSet set];
}

- (void)setupController
{
  _controller = [RNSSplitScreenController new];
  _controller.view = self;
  _controller.delegate = self;
}

- (void)didMoveToWindow
{
  // Starting from iOS 26, a new column type called 'inspector' was introduced.
  // This column can be displayed as a modal, independent of the React Native view hierarchy.
  // In contrast, prior to iOS 26, all SplitView columns were placed under RCTSurface,
  // meaning that touches were handler by RN handlers.
  if (@available(iOS 26.0, *)) {
    // If the current controller’s splitViewController is of type RNSSplitHostController,
    // we know that we're still inside the RN hierarchy,
    // so there's no need to enforce additional touch event support.
    if ([_controller isInSplitHostSubtree]) {
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
  static const auto defaultProps = std::make_shared<const react::RNSSplitScreenProps>();
  _props = defaultProps;

  _columnType = RNSSplitScreenColumnTypeColumn;
}

- (void)registerForFrameCorrection:(UIView *)view
{
  [_viewsForFrameCorrection addObject:view];
}

- (void)unregisterFromFrameCorrection:(UIView *)view
{
  [_viewsForFrameCorrection removeObject:view];
}

#pragma mark - Stack host

- (BOOL)isStackHostOfColumn:(UIView<RCTComponentViewProtocol> *)childComponentView
{
  // The stack host is an only child of the column.
  BOOL hasOtherChildren = _stackHost != nil || self.subviews.count > 0;
  if (hasOtherChildren || ![childComponentView isKindOfClass:RNSStackHostComponentView.class]) {
    return NO;
  }
  return static_cast<RNSStackHostComponentView *>(childComponentView).usesExternalNavigationController;
}

- (void)setStackHost:(nullable RNSStackHostComponentView *)stackHost
{
  // The previous host stops using the navigation controller of the column.
  _stackHost.externalNavigationController = nil;
  _stackHost = stackHost;
  _controller.hostsStack = stackHost != nil;
}

#pragma mark - Layout

/**
 * This override **should be considered as a workaround** for which I made some assumptions:
 * 1. All parents of views with associated `UINavigationController` should have the same width as the SplitView column
 * 2. I'm greedily aligning all native components which are extending `UINavigationController` - is covers both old and
 * new stack implementations, however, it will have an impact on any other native component which will be extending
 * from the same class.
 */
- (void)layoutSubviews
{
  [super layoutSubviews];
}

#pragma mark - RNSSplitScreenControllerDelegate

- (void)splitScreenController:(RNSSplitScreenController *)controller didChangeColumnFrame:(CGRect)frame
{
  [_shadowStateProxy updateShadowStateWithFrame:frame];
}

- (void)splitScreenControllerWillAppear:(RNSSplitScreenController *)controller
{
  [_reactEventEmitter emitOnWillAppear];
}

- (void)splitScreenControllerDidAppear:(RNSSplitScreenController *)controller
{
  [_reactEventEmitter emitOnDidAppear];
}

- (void)splitScreenControllerWillDisappear:(RNSSplitScreenController *)controller
{
  [_reactEventEmitter emitOnWillDisappear];
}

- (void)splitScreenControllerDidDisappear:(RNSSplitScreenController *)controller
{
  [_reactEventEmitter emitOnDidDisappear];
}

- (void)splitScreenController:(RNSSplitScreenController *)controller
    didCreateNavigationControllerForStack:(RNSSplitNavigationController *)navigationController
{
  _stackHost.externalNavigationController = navigationController;
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

+ (react::ComponentDescriptorProvider)componentDescriptorProvider
{
  return react::concreteComponentDescriptorProvider<react::RNSSplitScreenComponentDescriptor>();
}

+ (BOOL)shouldBeRecycled
{
  // There won't be tens of instances of this component usually & it's easier for now.
  // We could consider enabling it someday though.
  return NO;
}

- (void)mountChildComponentView:(UIView<RCTComponentViewProtocol> *)childComponentView index:(NSInteger)index
{
  if ([self isStackHostOfColumn:childComponentView]) {
    [self setStackHost:static_cast<RNSStackHostComponentView *>(childComponentView)];
    return;
  }

  RCTAssert(_stackHost == nil, @"[RNScreens] Stack.Host that navigates a Split.Column has to be its only child");

  [super mountChildComponentView:childComponentView index:index];

  if ([childComponentView conformsToProtocol:@protocol(RNSNavigationItemCustomizing)]) {
    [(id<RNSNavigationItemCustomizing>)childComponentView configureNavigationItem:_controller.navigationItem];
  }
}

- (void)unmountChildComponentView:(UIView<RCTComponentViewProtocol> *)childComponentView index:(NSInteger)index
{
  if (childComponentView == _stackHost) {
    [self setStackHost:nil];
    return;
  }

  [super unmountChildComponentView:childComponentView index:index];
}

- (void)updateState:(react::State::Shared const &)state oldState:(react::State::Shared const &)oldState
{
  [super updateState:state oldState:oldState];

  [_shadowStateProxy updateState:state oldState:oldState];
}

- (void)updateProps:(const facebook::react::Props::Shared &)props
           oldProps:(const facebook::react::Props::Shared &)oldProps
{
  const auto &oldComponentProps = *std::static_pointer_cast<const react::RNSSplitScreenProps>(_props);
  const auto &newComponentProps = *std::static_pointer_cast<const react::RNSSplitScreenProps>(props);

  if (oldComponentProps.columnType != newComponentProps.columnType) {
    _columnType = rnscreens::conversion::RNSSplitScreenColumnTypeFromScreenProp(newComponentProps.columnType);
  }

  [super updateProps:props oldProps:oldProps];
}

- (void)updateEventEmitter:(const facebook::react::EventEmitter::Shared &)eventEmitter
{
  [super updateEventEmitter:eventEmitter];
  [_reactEventEmitter
      updateEventEmitter:std::static_pointer_cast<const react::RNSSplitScreenEventEmitter>(eventEmitter)];
}

- (void)invalidate
{
  // Controller keeps the strong reference to the component via the `.view` property.
  // Therefore, we need to enforce a proper cleanup, breaking the retain cycle,
  // when we want to destroy the component.
  [_controller releaseColumnNavigationController];
  _controller = nil;
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

Class<RCTComponentViewProtocol> RNSSplitScreenCls(void)
{
  return RNSSplitScreenComponentView.class;
}
