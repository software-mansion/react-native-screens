#import "RNSSplitScreenComponentView.h"
#import <React/RCTAssert.h>
#import <React/RCTConversions.h>
#import <React/RCTSurfaceTouchHandler.h>
#import <react/renderer/components/rnscreens/RNSSplitScreenComponentDescriptor.h>
#import "RNSConversions.h"
#import "RNSHeaderConfigComponentView.h"
#import "RNSHeaderCoordinator.h"
#import "RNSSafeAreaViewNotifications.h"
#import "RNSSplitHostComponentView.h"
#import "RNSSplitScreenComponentEventEmitter.h"
#import "RNSSplitScreenController.h"
#import "RNSSplitScreenShadowStateProxy.h"

namespace react = facebook::react;

@interface RNSSplitScreenComponentView () <RNSSplitScreenControllerDelegate>
@end

@implementation RNSSplitScreenComponentView {
  RNSSplitScreenComponentEventEmitter *_Nonnull _reactEventEmitter;
  RNSSplitScreenController *_Nullable _controller;
  RNSSplitScreenShadowStateProxy *_Nonnull _shadowStateProxy;
  RCTSurfaceTouchHandler *_Nullable _touchHandler;
  NSMutableSet<UIView *> *_viewsForFrameCorrection;
  BOOL _hasUpdatedActivityMode;
  BOOL _isInvalidated;
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
  _hasUpdatedActivityMode = NO;
}

- (void)setupController
{
  _controller = [[RNSSplitScreenController alloc] initWithSplitScreenComponentView:self];
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
  _column = -1;
  _activityMode = RNSStackScreenActivityModeAttached;
  _screenKey = nil;
}

- (void)registerForFrameCorrection:(UIView *)view
{
  [_viewsForFrameCorrection addObject:view];
}

- (void)unregisterFromFrameCorrection:(UIView *)view
{
  [_viewsForFrameCorrection removeObject:view];
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

- (void)splitScreenController:(RNSSplitScreenController *)controller didDismissNatively:(BOOL)isNativeDismiss
{
  [_reactEventEmitter emitOnDismissWithNativeDismiss:isNativeDismiss];
  if (_isInvalidated) {
    _controller = nil;
  }
}

#pragma mark - RNSStackScreenProviding

- (nullable RNSHeaderCoordinator *)headerCoordinator
{
  return _controller.headerCoordinator;
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
  if ([childComponentView isKindOfClass:RNSHeaderConfigComponentView.class]) {
    _headerConfig = (RNSHeaderConfigComponentView *)childComponentView;
    _headerConfig.headerCoordinator = _controller.headerCoordinator;
    _controller.headerCoordinator.configDataProvider = _headerConfig;
    _controller.headerCoordinator.frameChangeDelegate = _headerConfig;
    _controller.headerCoordinator.eventsDelegate = _headerConfig;
    _controller.headerCoordinator.imageLoader = _headerConfig;
  }
  [super mountChildComponentView:childComponentView index:index];
}

- (void)unmountChildComponentView:(UIView<RCTComponentViewProtocol> *)childComponentView index:(NSInteger)index
{
  if ([childComponentView isKindOfClass:RNSHeaderConfigComponentView.class]) {
    [_controller.headerCoordinator clearHeaderConfiguration];
    _headerConfig.headerCoordinator = nil;
    _headerConfig = nil;
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

  if (oldComponentProps.column != newComponentProps.column) {
    _column = newComponentProps.column;
  }

  if (oldComponentProps.screenKey != newComponentProps.screenKey) {
    _screenKey = RCTNSStringFromStringNilIfEmpty(newComponentProps.screenKey);
  }

  if (oldComponentProps.activityMode != newComponentProps.activityMode) {
    _activityMode =
        rnscreens::conversion::RNSStackScreenActivityModeFromSplitScreenProp(newComponentProps.activityMode);
    _hasUpdatedActivityMode = YES;
  }

  [super updateProps:props oldProps:oldProps];
}

- (void)finalizeUpdates:(RNComponentViewUpdateMask)updateMask
{
  if (_hasUpdatedActivityMode) {
    _hasUpdatedActivityMode = NO;
    [self.splitHost splitScreenDidChangeActivityMode:self];
  }

  [super finalizeUpdates:updateMask];
}

- (void)updateEventEmitter:(const facebook::react::EventEmitter::Shared &)eventEmitter
{
  [super updateEventEmitter:eventEmitter];
  [_reactEventEmitter
      updateEventEmitter:std::static_pointer_cast<const react::RNSSplitScreenEventEmitter>(eventEmitter)];
}

- (void)invalidate
{
  // Keep the controller available until a pending pop completes, including after a split transition.
  // A controller that never attached can release its component reference after this transaction.
  _isInvalidated = YES;
  __weak auto weakSelf = self;
  dispatch_async(dispatch_get_main_queue(), ^{
    auto strongSelf = weakSelf;
    if (strongSelf && strongSelf->_controller.parentViewController == nil) {
      strongSelf->_controller = nil;
    }
  });
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
