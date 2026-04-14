#import "RNSSplitScreenComponentView.h"
#import <React/RCTAssert.h>
#import <React/RCTConversions.h>
#import <React/RCTSurfaceTouchHandler.h>
#import <react/renderer/components/rnscreens/ComponentDescriptors.h>
#import <react/renderer/components/rnscreens/EventEmitters.h>
#import <react/renderer/components/rnscreens/Props.h>
#import "RNSConversions.h"
#import "RNSSafeAreaViewNotifications.h"
#import "RNSSplitNavigatorComponentView.h"
#import "RNSSplitHeaderConfigComponentView.h"

#import "Swift-Bridging.h"

namespace react = facebook::react;

@implementation RNSSplitScreenComponentView {
  RNSSplitScreenComponentEventEmitter *_Nonnull _reactEventEmitter;
  RNSSplitScreenController *_Nullable _controller;
  RCTSurfaceTouchHandler *_Nullable _touchHandler;
}

- (RNSSplitScreenController *)controller
{
  RCTAssert(
      _controller != nil,
      @"[RNScreens] Attempt to access RNSSplitScreenController before RNSSplitScreenComponentView was initialized. (for: %@)",
      self);
  return _controller;
}

- (void)didMoveToWindow
{
  // Starting from iOS 26, a new column type called 'inspector' was introduced.
  // This column can be displayed as a modal, independent of the React Native view hierarchy.
  // In contrast, prior to iOS 26, all SplitView columns were placed under RCTSurface,
  // meaning that touches were handled by RN handlers.
  if (@available(iOS 26.0, *)) {
    // If the current controller is inside a RNSSplitHostController subtree (via navigation hierarchy),
    // touches are handled by RN handlers and no additional support is needed.
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

// MARK: - RNSBaseScreenComponentView abstract overrides

- (void)resetProps
{
  static const auto defaultProps = std::make_shared<const react::RNSSplitScreenProps>();
  _props = defaultProps;

  _activityMode = RNSSplitScreenActivityModeDetached;
  [self updateScreenKey:nil];
  _preventNativeDismiss = NO;
}

- (void)setupController
{
  _controller = [[RNSSplitScreenController alloc] initWithSplitScreenComponentView:self];
  _controller.view = self;
  _reactEventEmitter = [RNSSplitScreenComponentEventEmitter new];
}

- (void)notifyParentOfActivityModeChange
{
  [self.splitNavigator screenChangedActivityMode:self];
}

- (BOOL)isAttached
{
  return _activityMode == RNSSplitScreenActivityModeAttached;
}

- (UIViewController *)screenViewController
{
  return _controller;
}

#pragma mark - Events

- (nonnull RNSSplitScreenComponentEventEmitter *)reactEventEmitter
{
  RCTAssert(_reactEventEmitter != nil, @"[RNScreens] Attempt to access uninitialized _reactEventEmitter");
  return _reactEventEmitter;
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

- (void)safeAreaInsetsDidChange
{
  [super safeAreaInsetsDidChange];
  [self dispatchSafeAreaDidChangeNotification];
}

#pragma mark - Header

- (nullable RNSSplitHeaderConfigComponentView *)findHeaderConfig
{
  for (UIView *subview in self.subviews) {
    if ([subview isKindOfClass:RNSSplitHeaderConfigComponentView.class]) {
      return (RNSSplitHeaderConfigComponentView *)subview;
    }
  }
  return nil;
}

#pragma mark - RCTComponentViewProtocol

+ (react::ComponentDescriptorProvider)componentDescriptorProvider
{
  return react::concreteComponentDescriptorProvider<react::RNSSplitScreenComponentDescriptor>();
}

- (void)updateProps:(const facebook::react::Props::Shared &)props
           oldProps:(const facebook::react::Props::Shared &)oldProps
{
  const auto &oldComponentProps = *std::static_pointer_cast<const react::RNSSplitScreenProps>(_props);
  const auto &newComponentProps = *std::static_pointer_cast<const react::RNSSplitScreenProps>(props);

  if (oldComponentProps.activityMode != newComponentProps.activityMode) {
    _activityMode = rnscreens::conversion::RNSSplitScreenActivityModeFromScreenProp(newComponentProps.activityMode);
    [self markActivityModeChanged];
  }

  if (oldComponentProps.screenKey != newComponentProps.screenKey) {
    [self updateScreenKey:RCTNSStringFromStringNilIfEmpty(newComponentProps.screenKey)];
  }

  if (oldComponentProps.preventNativeDismiss != newComponentProps.preventNativeDismiss) {
    _preventNativeDismiss = newComponentProps.preventNativeDismiss;
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
  _controller = nil;
}

@end

Class<RCTComponentViewProtocol> RNSSplitScreenCls(void)
{
  return RNSSplitScreenComponentView.class;
}
