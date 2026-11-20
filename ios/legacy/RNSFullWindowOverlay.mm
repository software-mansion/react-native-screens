#import <UIKit/UIKit.h>

#import "RNSDefines.h"
#import "RNSFullWindowOverlay.h"

#import <React/RCTConversions.h>
#import <React/RCTFabricComponentsPlugins.h>
#import <React/RCTSurfaceTouchHandler.h>
#import <react/renderer/components/rnscreens/ComponentDescriptors.h>
#import <react/renderer/components/rnscreens/Props.h>
#import <react/renderer/components/rnscreens/RCTComponentViewHelpers.h>
#import <react/renderer/components/rnscreens/legacy/RNSFullWindowOverlayComponentDescriptor.h>

@implementation RNSFullWindowOverlayContainer

- (instancetype)initWithFrame:(CGRect)frame accessibilityViewIsModal:(BOOL)accessibilityViewIsModal
{
  if (self = [super initWithFrame:frame]) {
    self.accessibilityViewIsModal = accessibilityViewIsModal;
  }
  return self;
}

- (BOOL)pointInside:(CGPoint)point withEvent:(UIEvent *)event
{
  for (UIView *view in [self subviews]) {
    if (view.userInteractionEnabled && [view pointInside:[self convertPoint:point toView:view] withEvent:event]) {
      return YES;
    }
  }
  return NO;
}

- (UIView *)hitTest:(CGPoint)point withEvent:(UIEvent *)event
{
  BOOL canReceiveTouchEvents = ([self isUserInteractionEnabled] && ![self isHidden]);
  if (!canReceiveTouchEvents) {
    return nil;
  }

  // `hitSubview` is the topmost subview which was hit. The hit point can
  // be outside the bounds of `view` (e.g., if -clipsToBounds is NO).
  UIView *hitSubview = nil;
  BOOL isPointInside = [self pointInside:point withEvent:event];
  if (![self clipsToBounds] || isPointInside) {
    // Take z-index into account when calculating the touch target.
    NSArray<UIView *> *sortedSubviews = [self reactZIndexSortedSubviews];

    // The default behaviour of UIKit is that if a view does not contain a point,
    // then no subviews will be returned from hit testing, even if they contain
    // the hit point. By doing hit testing directly on the subviews, we bypass
    // the strict containment policy (i.e., UIKit guarantees that every ancestor
    // of the hit view will return YES from -pointInside:withEvent:). See:
    //  - https://developer.apple.com/library/ios/qa/qa2013/qa1812.html
    for (UIView *subview in [sortedSubviews reverseObjectEnumerator]) {
      CGPoint convertedPoint = [subview convertPoint:point fromView:self];
      hitSubview = [subview hitTest:convertedPoint withEvent:event];
      if (hitSubview != nil) {
        break;
      }
    }
  }

  // `event` is nil when UIKit's gesture recognizers (in `-[UIGestureRecognizer _shouldBegin]`) or React Native's
  // pointer handler (on touch moves and hovers) hit-test the overlay. Those calls must not toggle the recognizer
  // below, which may be in the middle of recognizing; `nil.type` would also read as `UIEventTypeTouches`.
  if (hitSubview != nil && event != nil && event.type == UIEventTypeTouches) {
    [self excludePlatformGlassFlexFromTouch];
  }
  return hitSubview;
}

#pragma mark - Liquid Glass press

// https://github.com/software-mansion/react-native-screens/issues/5209
//
// Observed on iOS 27.0 (not on iOS 26.5): UIKit plays the Liquid Glass press of bar button items from a pan gesture
// recognizer attached to the UIWindow (named `com.apple.UIKit._UIFlexInteraction.Pan`, with a
// `UIPlatformGlassFlexInteraction` delegate). A touch is handed to the recognizers of its hit-test view and of all of
// that view's ancestors, so a touch on the overlay, whose container is a subview of the window, reaches that
// recognizer too. The recognizer then presses the glass item lying under the finger, e.g. a bar button covered by the
// overlay, although the touch belongs to the overlay.
//
// When a touch hits the overlay, we disable that recognizer and re-enable it from the main queue. In our observations
// UIKit collects the recognizers of a touch in the same event dispatch that hit-tests it, and the main queue block
// can't run before that dispatch returns, so the recognizer doesn't take part in the touch. Disabling it also cancels
// a press it is tracking for another finger at that moment, which we accept.
//
// Glass inside the overlay, e.g. a glass `UIButton`, is pressed by another window recognizer (with a
// `_UIFlexInteraction` delegate), which we leave alone.
//
// The name and delegate filter is what limits this to the affected runtimes: on iOS 26.5, tvOS and visionOS no window
// recognizer matches, and the loop does nothing. If UIKit renames either of them, the fix silently stops working.
- (void)excludePlatformGlassFlexFromTouch
{
  if (@available(iOS 26.0, *)) {
    NSMutableArray<UIGestureRecognizer *> *disabledRecognizers = [NSMutableArray new];
    for (UIGestureRecognizer *recognizer in self.window.gestureRecognizers) {
      if (recognizer.enabled && [recognizer.name hasPrefix:@"com.apple.UIKit._UIFlexInteraction"] &&
          [NSStringFromClass([recognizer.delegate class]) containsString:@"UIPlatformGlassFlexInteraction"]) {
        recognizer.enabled = NO;
        [disabledRecognizers addObject:recognizer];
      }
    }

    if (disabledRecognizers.count > 0) {
      dispatch_async(dispatch_get_main_queue(), ^{
        for (UIGestureRecognizer *recognizer in disabledRecognizers) {
          recognizer.enabled = YES;
        }
      });
    }
  }
}

@end

@implementation RNSFullWindowOverlay {
  RNSFullWindowOverlayContainer *_container;
  CGRect _reactFrame;
  RCTSurfaceTouchHandler *_touchHandler;
}

- (instancetype)init
{
  if (self = [super init]) {
    static const auto defaultProps = std::make_shared<const react::RNSFullWindowOverlayProps>();
    _props = defaultProps;
    [self initCommonProps];
  }
  return self;
}

- (void)initCommonProps
{
  // Default value used by container.
  _accessibilityContainerViewIsModal = YES;
  _reactFrame = CGRectNull;
  _container = self.container;
}

- (void)dealloc
{
  [[NSNotificationCenter defaultCenter] removeObserver:self];
}

- (void)setAccessibilityContainerViewIsModal:(BOOL)accessibilityContainerViewIsModal
{
  _accessibilityContainerViewIsModal = accessibilityContainerViewIsModal;
  self.container.accessibilityViewIsModal = accessibilityContainerViewIsModal;
}

- (void)addSubview:(UIView *)view
{
  [_container addSubview:view];
}

- (RNSFullWindowOverlayContainer *)container
{
  if (_container == nil) {
    _container = [[RNSFullWindowOverlayContainer alloc] initWithFrame:_reactFrame
                                             accessibilityViewIsModal:_accessibilityContainerViewIsModal];
  }

  return _container;
}

- (void)didMoveToSuperview
{
  if (self.superview == nil) {
    if (_container != nil) {
      [_container removeFromSuperview];
      [_touchHandler detachFromView:_container];
    }
  } else {
    if (_container != nil) {
      UIAccessibilityPostNotification(UIAccessibilityLayoutChangedNotification, _container);
    }
    if (_touchHandler == nil) {
      _touchHandler = [RCTSurfaceTouchHandler new];
    }
    [_touchHandler attachToView:_container];

    // Called here in case the attempt to show the container failed
    // in `didMoveToWindow`, as it happens e.g. in case where a `fullScreenModal`
    // is in presntation. This assumes that this method is called after
    // `didMoveToWindow`.
    [self maybeShow];
  }
}

- (void)didMoveToWindow
{
  // Detaching FullWindowOverlay is handled by `didMoveToSuperview`
  if (self.window != nil) {
    [self maybeShow];
  }
}

- (void)maybeShow
{
  UIWindow *window = [self window];

  if (window == nil) {
    // This fallback might return wrong window in case of multi-window
    // apps e.g. on iPad.
    window = RCTKeyWindow();
  }

  if (![[window subviews] containsObject:_container]) {
    [window addSubview:_container];
  }
}

#pragma mark - Fabric Specific

+ (react::ComponentDescriptorProvider)componentDescriptorProvider
{
  return react::concreteComponentDescriptorProvider<react::RNSFullWindowOverlayComponentDescriptor>();
}

- (void)prepareForRecycle
{
  [_container removeFromSuperview];
  // Due to view recycling we don't really want to set _container = nil
  // as it won't be instantiated when the component appears for the second time.
  // We could consider nulling in here & using container (lazy getter) everywhere else.
  // _container = nil;
  [super prepareForRecycle];
}

- (void)mountChildComponentView:(UIView<RCTComponentViewProtocol> *)childComponentView index:(NSInteger)index
{
  [self addSubview:childComponentView];
}

- (void)unmountChildComponentView:(UIView<RCTComponentViewProtocol> *)childComponentView index:(NSInteger)index
{
  [childComponentView removeFromSuperview];
}

// We do not set frame for ouselves, but rather for the container.
RNS_IGNORE_SUPER_CALL_BEGIN
- (void)updateLayoutMetrics:(react::LayoutMetrics const &)layoutMetrics
           oldLayoutMetrics:(react::LayoutMetrics const &)oldLayoutMetrics
{
  CGRect frame = RCTCGRectFromRect(layoutMetrics.frame);

  // Due to view flattening there are situations
  // when we receive frames with origin different from (0, 0).
  // We account for this frame manipulation in shadow node by setting
  // RootNodeKind trait for the shadow node making state consistent
  // between Host & Shadow Tree
  frame.origin = CGPointZero;

  _reactFrame = frame;
  [_container setFrame:frame];
}
RNS_IGNORE_SUPER_CALL_END

- (void)updateProps:(const facebook::react::Props::Shared &)props
           oldProps:(const facebook::react::Props::Shared &)oldProps
{
  const auto &oldComponentProps = *std::static_pointer_cast<const react::RNSFullWindowOverlayProps>(_props);
  const auto &newComponentProps = *std::static_pointer_cast<const react::RNSFullWindowOverlayProps>(props);

  if (newComponentProps.accessibilityContainerViewIsModal != oldComponentProps.accessibilityContainerViewIsModal) {
    [self setAccessibilityContainerViewIsModal:newComponentProps.accessibilityContainerViewIsModal];
  }

  [super updateProps:props oldProps:oldProps];
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

Class<RCTComponentViewProtocol> RNSFullWindowOverlayCls(void)
{
  return RNSFullWindowOverlay.class;
}

@implementation RNSFullWindowOverlayManager

@end
