#import <UIKit/UIKit.h>

#import "RNSScreen.h"
#import "RNSScreenContainer.h"
#import "RNSScreenStack.h"
#import "RNSScreenStackHeaderConfig.h"
#import "RNSScreenWindowTraits.h"

// Imported only to make project build before RNSScreenView is merged
// with RNSScreenComponentView
#import "RNSScreenController.h"

#import <React/RCTShadowView.h>
#import <React/RCTTouchHandler.h>
#import <React/RCTUIManager.h>

@interface RNSScreenView () <UIAdaptivePresentationControllerDelegate, RCTInvalidating>
@end

@implementation RNSScreenView {
  __weak RCTBridge *_bridge;
  RNSScreenController *_controller;
  RCTTouchHandler *_touchHandler;
  CGRect _reactFrame;
}

- (instancetype)initWithBridge:(RCTBridge *)bridge
{
  if (self = [super init]) {
    _bridge = bridge;
    _controller = [[RNSScreenController alloc] initWithView:self];
    _stackPresentation = RNSScreenStackPresentationPush;
    _stackAnimation = RNSScreenStackAnimationDefault;
    _gestureEnabled = YES;
    _replaceAnimation = RNSScreenReplaceAnimationPop;
    _dismissed = NO;
    _hasStatusBarStyleSet = NO;
    _hasStatusBarAnimationSet = NO;
    _hasStatusBarHiddenSet = NO;
    _hasOrientationSet = NO;
    _hasHomeIndicatorHiddenSet = NO;
  }

  return self;
}

- (void)reactSetFrame:(CGRect)frame
{
  _reactFrame = frame;
  UIViewController *parentVC = self.reactViewController.parentViewController;
  if (parentVC != nil && ![parentVC isKindOfClass:[RNScreensNavigationController class]]) {
    [super reactSetFrame:frame];
  }
  // when screen is mounted under RNScreensNavigationController it's size is controller
  // by the navigation controller itself. That is, it is set to fill space of
  // the controller. In that case we ignore react layout system from managing
  // the screen dimensions and we wait for the screen VC to update and then we
  // pass the dimensions to ui view manager to take into account when laying out
  // subviews
}

- (UIViewController *)reactViewController
{
  return _controller;
}

- (void)updateBounds
{
  [_bridge.uiManager setSize:self.bounds.size forView:self];
}

// Nil will be provided when activityState is set as an animated value and we change
// it from JS to be a plain value (non animated).
// In case when nil is received, we want to ignore such value and not make
// any updates as the actual non-nil value will follow immediately.
- (void)setActivityStateOrNil:(NSNumber *)activityStateOrNil
{
  int activityState = [activityStateOrNil intValue];
  if (activityStateOrNil != nil && activityState != _activityState) {
    _activityState = activityState;
    [_reactSuperview markChildUpdated];
  }
}

- (void)setPointerEvents:(RCTPointerEvents)pointerEvents
{
  // pointer events settings are managed by the parent screen container, we ignore
  // any attempt of setting that via React props
}

- (void)setStackPresentation:(RNSScreenStackPresentation)stackPresentation
{
  switch (stackPresentation) {
    case RNSScreenStackPresentationModal:
#if defined(__IPHONE_OS_VERSION_MAX_ALLOWED) && defined(__IPHONE_13_0) && \
    __IPHONE_OS_VERSION_MAX_ALLOWED >= __IPHONE_13_0
      if (@available(iOS 13.0, tvOS 13.0, *)) {
        _controller.modalPresentationStyle = UIModalPresentationAutomatic;
      } else {
        _controller.modalPresentationStyle = UIModalPresentationFullScreen;
      }
#else
      _controller.modalPresentationStyle = UIModalPresentationFullScreen;
#endif
      break;
    case RNSScreenStackPresentationFullScreenModal:
      _controller.modalPresentationStyle = UIModalPresentationFullScreen;
      break;
#if !TARGET_OS_TV
    case RNSScreenStackPresentationFormSheet:
      _controller.modalPresentationStyle = UIModalPresentationFormSheet;
      break;
#endif
    case RNSScreenStackPresentationTransparentModal:
      _controller.modalPresentationStyle = UIModalPresentationOverFullScreen;
      break;
    case RNSScreenStackPresentationContainedModal:
      _controller.modalPresentationStyle = UIModalPresentationCurrentContext;
      break;
    case RNSScreenStackPresentationContainedTransparentModal:
      _controller.modalPresentationStyle = UIModalPresentationOverCurrentContext;
      break;
    case RNSScreenStackPresentationPush:
      // ignored, we only need to keep in mind not to set presentation delegate
      break;
  }
  // There is a bug in UIKit which causes retain loop when presentationController is accessed for a
  // controller that is not going to be presented modally. We therefore need to avoid setting the
  // delegate for screens presented using push. This also means that when controller is updated from
  // modal to push type, this may cause memory leak, we warn about that as well.
  if (stackPresentation != RNSScreenStackPresentationPush) {
    // `modalPresentationStyle` must be set before accessing `presentationController`
    // otherwise a default controller will be created and cannot be changed after.
    // Documented here:
    // https://developer.apple.com/documentation/uikit/uiviewcontroller/1621426-presentationcontroller?language=objc
    _controller.presentationController.delegate = self;
  } else if (_stackPresentation != RNSScreenStackPresentationPush) {
    RCTLogError(
        @"Screen presentation updated from modal to push, this may likely result in a screen object leakage. If you need to change presentation style create a new screen object instead");
  }
  _stackPresentation = stackPresentation;
}

- (void)setStackAnimation:(RNSScreenStackAnimation)stackAnimation
{
  _stackAnimation = stackAnimation;

  switch (stackAnimation) {
    case RNSScreenStackAnimationFade:
      _controller.modalTransitionStyle = UIModalTransitionStyleCrossDissolve;
      break;
#if !TARGET_OS_TV
    case RNSScreenStackAnimationFlip:
      _controller.modalTransitionStyle = UIModalTransitionStyleFlipHorizontal;
      break;
#endif
    case RNSScreenStackAnimationNone:
    case RNSScreenStackAnimationDefault:
    case RNSScreenStackAnimationSimplePush:
    case RNSScreenStackAnimationSlideFromBottom:
    case RNSScreenStackAnimationFadeFromBottom:
      // Default
      break;
  }
}

- (void)setGestureEnabled:(BOOL)gestureEnabled
{
#if defined(__IPHONE_OS_VERSION_MAX_ALLOWED) && defined(__IPHONE_13_0) && \
    __IPHONE_OS_VERSION_MAX_ALLOWED >= __IPHONE_13_0
  if (@available(iOS 13.0, tvOS 13.0, *)) {
    _controller.modalInPresentation = !gestureEnabled;
  }
#endif

  _gestureEnabled = gestureEnabled;
}

- (void)setReplaceAnimation:(RNSScreenReplaceAnimation)replaceAnimation
{
  _replaceAnimation = replaceAnimation;
}

#if !TARGET_OS_TV
- (void)setStatusBarStyle:(RNSStatusBarStyle)statusBarStyle
{
  _hasStatusBarStyleSet = YES;
  _statusBarStyle = statusBarStyle;
  [RNSScreenWindowTraits assertViewControllerBasedStatusBarAppearenceSet];
  [RNSScreenWindowTraits updateStatusBarAppearance];
}

- (void)setStatusBarAnimation:(UIStatusBarAnimation)statusBarAnimation
{
  _hasStatusBarAnimationSet = YES;
  _statusBarAnimation = statusBarAnimation;
  [RNSScreenWindowTraits assertViewControllerBasedStatusBarAppearenceSet];
}

- (void)setStatusBarHidden:(BOOL)statusBarHidden
{
  _hasStatusBarHiddenSet = YES;
  _statusBarHidden = statusBarHidden;
  [RNSScreenWindowTraits assertViewControllerBasedStatusBarAppearenceSet];
  [RNSScreenWindowTraits updateStatusBarAppearance];
}

- (void)setScreenOrientation:(UIInterfaceOrientationMask)screenOrientation
{
  _hasOrientationSet = YES;
  _screenOrientation = screenOrientation;
  [RNSScreenWindowTraits enforceDesiredDeviceOrientation];
}

- (void)setHomeIndicatorHidden:(BOOL)homeIndicatorHidden
{
  _hasHomeIndicatorHiddenSet = YES;
  _homeIndicatorHidden = homeIndicatorHidden;
  [RNSScreenWindowTraits updateHomeIndicatorAutoHidden];
}
#endif

- (UIView *)reactSuperview
{
  return _reactSuperview;
}

- (void)addSubview:(UIView *)view
{
  if (![view isKindOfClass:[RNSScreenStackHeaderConfig class]]) {
    [super addSubview:view];
  } else {
    ((RNSScreenStackHeaderConfig *)view).screenView = self;
  }
}

- (void)notifyFinishTransitioning
{
  [_controller notifyFinishTransitioning];
}

- (void)notifyDismissedWithCount:(int)dismissCount
{
  _dismissed = YES;
  if (self.onDismissed) {
    dispatch_async(dispatch_get_main_queue(), ^{
      if (self.onDismissed) {
        self.onDismissed(@{@"dismissCount" : @(dismissCount)});
      }
    });
  }
}

- (void)notifyWillAppear
{
  if (self.onWillAppear) {
    self.onWillAppear(nil);
  }
  // we do it here too because at this moment the `parentViewController` is already not nil,
  // so if the parent is not UINavCtr, the frame will be updated to the correct one.
  [self reactSetFrame:_reactFrame];
}

- (void)notifyWillDisappear
{
  if (self.onWillDisappear) {
    self.onWillDisappear(nil);
  }
}

- (void)notifyAppear
{
  if (self.onAppear) {
    dispatch_async(dispatch_get_main_queue(), ^{
      if (self.onAppear) {
        self.onAppear(nil);
      }
    });
  }
}

- (void)notifyDisappear
{
  if (self.onDisappear) {
    self.onDisappear(nil);
  }
}

- (void)notifyDismissCancelledWithDismissCount:(int)dismissCount
{
  if (self.onNativeDismissCancelled) {
    self.onNativeDismissCancelled(@{@"dismissCount" : @(dismissCount)});
  }
}

- (void)notifyTransitionProgress:(double)progress closing:(BOOL)closing goingForward:(BOOL)goingForward
{
  if (self.onTransitionProgress) {
    self.onTransitionProgress(@{
      @"progress" : @(progress),
      @"closing" : @(closing ? 1 : 0),
      @"goingForward" : @(goingForward ? 1 : 0),
    });
  }
}

- (BOOL)isMountedUnderScreenOrReactRoot
{
  for (UIView *parent = self.superview; parent != nil; parent = parent.superview) {
    if ([parent isKindOfClass:[RCTRootView class]] || [parent isKindOfClass:[RNSScreenView class]]) {
      return YES;
    }
  }
  return NO;
}

- (void)didMoveToWindow
{
  // For RN touches to work we need to instantiate and connect RCTTouchHandler. This only applies
  // for screens that aren't mounted under RCTRootView e.g., modals that are mounted directly to
  // root application window.
  if (self.window != nil && ![self isMountedUnderScreenOrReactRoot]) {
    if (_touchHandler == nil) {
      _touchHandler = [[RCTTouchHandler alloc] initWithBridge:_bridge];
    }
    [_touchHandler attachToView:self];
  } else {
    [_touchHandler detachFromView:self];
  }
}

- (void)presentationControllerWillDismiss:(UIPresentationController *)presentationController
{
  // We need to call both "cancel" and "reset" here because RN's gesture recognizer
  // does not handle the scenario when it gets cancelled by other top
  // level gesture recognizer. In this case by the modal dismiss gesture.
  // Because of that, at the moment when this method gets called the React's
  // gesture recognizer is already in FAILED state but cancel events never gets
  // send to JS. Calling "reset" forces RCTTouchHanler to dispatch cancel event.
  // To test this behavior one need to open a dismissable modal and start
  // pulling down starting at some touchable item. Without "reset" the touchable
  // will never go back from highlighted state even when the modal start sliding
  // down.
  [_touchHandler cancel];
  [_touchHandler reset];
}

- (RCTTouchHandler *)touchHandler
{
  if (_touchHandler != nil) {
    return _touchHandler;
  }
  UIView *parent = [self superview];
  while (parent != nil && ![parent respondsToSelector:@selector(touchHandler)])
    parent = parent.superview;
  if (parent != nil) {
    return [parent performSelector:@selector(touchHandler)];
  }
  return nil;
}

- (BOOL)presentationControllerShouldDismiss:(UIPresentationController *)presentationController
{
  if (_preventNativeDismiss) {
    [self notifyDismissCancelledWithDismissCount:1];
    return NO;
  }
  return _gestureEnabled;
}

- (void)presentationControllerDidDismiss:(UIPresentationController *)presentationController
{
  if ([_reactSuperview respondsToSelector:@selector(presentationControllerDidDismiss:)]) {
    [_reactSuperview performSelector:@selector(presentationControllerDidDismiss:) withObject:presentationController];
  }
}

- (void)invalidate
{
  _controller = nil;
}

@end

@implementation RNSScreenManager

RCT_EXPORT_MODULE()

// we want to handle the case when activityState is nil
RCT_REMAP_VIEW_PROPERTY(activityState, activityStateOrNil, NSNumber)
RCT_EXPORT_VIEW_PROPERTY(customAnimationOnSwipe, BOOL);
RCT_EXPORT_VIEW_PROPERTY(fullScreenSwipeEnabled, BOOL);
RCT_EXPORT_VIEW_PROPERTY(gestureEnabled, BOOL)
RCT_EXPORT_VIEW_PROPERTY(gestureResponseDistance, NSDictionary)
RCT_EXPORT_VIEW_PROPERTY(preventNativeDismiss, BOOL)
RCT_EXPORT_VIEW_PROPERTY(replaceAnimation, RNSScreenReplaceAnimation)
RCT_EXPORT_VIEW_PROPERTY(stackPresentation, RNSScreenStackPresentation)
RCT_EXPORT_VIEW_PROPERTY(stackAnimation, RNSScreenStackAnimation)
RCT_EXPORT_VIEW_PROPERTY(swipeDirection, RNSScreenSwipeDirection)
RCT_EXPORT_VIEW_PROPERTY(transitionDuration, NSNumber)

RCT_EXPORT_VIEW_PROPERTY(onAppear, RCTDirectEventBlock);
RCT_EXPORT_VIEW_PROPERTY(onDisappear, RCTDirectEventBlock);
RCT_EXPORT_VIEW_PROPERTY(onDismissed, RCTDirectEventBlock);
RCT_EXPORT_VIEW_PROPERTY(onNativeDismissCancelled, RCTDirectEventBlock);
RCT_EXPORT_VIEW_PROPERTY(onTransitionProgress, RCTDirectEventBlock);
RCT_EXPORT_VIEW_PROPERTY(onWillAppear, RCTDirectEventBlock);
RCT_EXPORT_VIEW_PROPERTY(onWillDisappear, RCTDirectEventBlock);

#if !TARGET_OS_TV
RCT_EXPORT_VIEW_PROPERTY(screenOrientation, UIInterfaceOrientationMask)
RCT_EXPORT_VIEW_PROPERTY(statusBarAnimation, UIStatusBarAnimation)
RCT_EXPORT_VIEW_PROPERTY(statusBarHidden, BOOL)
RCT_EXPORT_VIEW_PROPERTY(statusBarStyle, RNSStatusBarStyle)
RCT_EXPORT_VIEW_PROPERTY(homeIndicatorHidden, BOOL)
#endif

- (UIView *)view
{
  return [[RNSScreenView alloc] initWithBridge:self.bridge];
}

@end

@implementation RCTConvert (RNSScreenContoller)

RCT_ENUM_CONVERTER(
    RNSScreenStackPresentation,
    (@{
      @"push" : @(RNSScreenStackPresentationPush),
      @"modal" : @(RNSScreenStackPresentationModal),
      @"fullScreenModal" : @(RNSScreenStackPresentationFullScreenModal),
      @"formSheet" : @(RNSScreenStackPresentationFormSheet),
      @"containedModal" : @(RNSScreenStackPresentationContainedModal),
      @"transparentModal" : @(RNSScreenStackPresentationTransparentModal),
      @"containedTransparentModal" : @(RNSScreenStackPresentationContainedTransparentModal)
    }),
    RNSScreenStackPresentationPush,
    integerValue)

RCT_ENUM_CONVERTER(
    RNSScreenStackAnimation,
    (@{
      @"default" : @(RNSScreenStackAnimationDefault),
      @"none" : @(RNSScreenStackAnimationNone),
      @"fade" : @(RNSScreenStackAnimationFade),
      @"fade_from_bottom" : @(RNSScreenStackAnimationFadeFromBottom),
      @"flip" : @(RNSScreenStackAnimationFlip),
      @"simple_push" : @(RNSScreenStackAnimationSimplePush),
      @"slide_from_bottom" : @(RNSScreenStackAnimationSlideFromBottom),
      @"slide_from_right" : @(RNSScreenStackAnimationDefault),
      @"slide_from_left" : @(RNSScreenStackAnimationDefault),
    }),
    RNSScreenStackAnimationDefault,
    integerValue)

RCT_ENUM_CONVERTER(
    RNSScreenReplaceAnimation,
    (@{
      @"push" : @(RNSScreenReplaceAnimationPush),
      @"pop" : @(RNSScreenReplaceAnimationPop),
    }),
    RNSScreenReplaceAnimationPop,
    integerValue)

RCT_ENUM_CONVERTER(
    RNSScreenSwipeDirection,
    (@{
      @"vertical" : @(RNSScreenSwipeDirectionVertical),
      @"horizontal" : @(RNSScreenSwipeDirectionHorizontal),
    }),
    RNSScreenSwipeDirectionHorizontal,
    integerValue)

#if !TARGET_OS_TV
RCT_ENUM_CONVERTER(
    RNSStatusBarStyle,
    (@{
      @"auto" : @(RNSStatusBarStyleAuto),
      @"inverted" : @(RNSStatusBarStyleInverted),
      @"light" : @(RNSStatusBarStyleLight),
      @"dark" : @(RNSStatusBarStyleDark),
    }),
    RNSStatusBarStyleAuto,
    integerValue)

+ (UIInterfaceOrientationMask)UIInterfaceOrientationMask:(id)json
{
  json = [self NSString:json];
  if ([json isEqualToString:@"default"]) {
    return UIInterfaceOrientationMaskAllButUpsideDown;
  } else if ([json isEqualToString:@"all"]) {
    return UIInterfaceOrientationMaskAll;
  } else if ([json isEqualToString:@"portrait"]) {
    return UIInterfaceOrientationMaskPortrait | UIInterfaceOrientationMaskPortraitUpsideDown;
  } else if ([json isEqualToString:@"portrait_up"]) {
    return UIInterfaceOrientationMaskPortrait;
  } else if ([json isEqualToString:@"portrait_down"]) {
    return UIInterfaceOrientationMaskPortraitUpsideDown;
  } else if ([json isEqualToString:@"landscape"]) {
    return UIInterfaceOrientationMaskLandscape;
  } else if ([json isEqualToString:@"landscape_left"]) {
    return UIInterfaceOrientationMaskLandscapeLeft;
  } else if ([json isEqualToString:@"landscape_right"]) {
    return UIInterfaceOrientationMaskLandscapeRight;
  }
  return UIInterfaceOrientationMaskAllButUpsideDown;
}
#endif

@end
