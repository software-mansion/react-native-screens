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

#import "Swift-Bridging.h"

namespace react = facebook::react;

// Helper: parse a CSS hex color string (#RRGGBB or #RRGGBBAA) to UIColor.
static UIColor *_Nullable RNSUIColorFromHexString(NSString *_Nullable hexString)
{
  if (hexString.length == 0) {
    return nil;
  }

  NSString *hex = [hexString stringByReplacingOccurrencesOfString:@"#" withString:@""];
  if (hex.length != 6 && hex.length != 8) {
    return nil;
  }

  unsigned long long rgbValue = 0;
  NSScanner *scanner = [NSScanner scannerWithString:hex];
  if (![scanner scanHexLongLong:&rgbValue]) {
    return nil;
  }

  if (hex.length == 6) {
    return [UIColor colorWithRed:((rgbValue & 0xFF0000) >> 16) / 255.0
                           green:((rgbValue & 0x00FF00) >> 8) / 255.0
                            blue:(rgbValue & 0x0000FF) / 255.0
                           alpha:1.0];
  } else {
    return [UIColor colorWithRed:((rgbValue & 0xFF000000) >> 24) / 255.0
                           green:((rgbValue & 0x00FF00) >> 8) / 255.0
                            blue:(rgbValue & 0x0000FF) / 255.0
                           alpha:((rgbValue & 0xFF00) >> 8) / 255.0];
  }
}

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
  _title = nil;
  _headerBackgroundColor = nil;
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

  if (oldComponentProps.title != newComponentProps.title) {
    _title = RCTNSStringFromStringNilIfEmpty(newComponentProps.title);
    _controller.title = _title;
  }

  if (oldComponentProps.headerBackgroundColor != newComponentProps.headerBackgroundColor) {
    NSString *colorString = RCTNSStringFromStringNilIfEmpty(newComponentProps.headerBackgroundColor);
    _headerBackgroundColor = RNSUIColorFromHexString(colorString);
    _controller.headerBackgroundColor = _headerBackgroundColor;
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
