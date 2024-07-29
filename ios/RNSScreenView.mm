#import <UIKit/UIKit.h>

#import "RNSScreenStack.h"
#import "RNSScreenStackHeaderConfig.h"
#import "RNSScreenView.h"
#import "RNSScreenWindowTraits.h"

#ifdef RCT_NEW_ARCH_ENABLED
#import <React/RCTConversions.h>
#import <React/RCTFabricComponentsPlugins.h>
#import <React/RCTRootComponentView.h>
#import <React/RCTSurfaceTouchHandler.h>
#import <react/renderer/components/rnscreens/EventEmitters.h>
#import <react/renderer/components/rnscreens/Props.h>
#import <react/renderer/components/rnscreens/RCTComponentViewHelpers.h>
#import <rnscreens/RNSScreenComponentDescriptor.h>
#import "RNSConvert.h"
#import "RNSHeaderHeightChangeEvent.h"
#import "RNSScreenViewEvent.h"
#else
#import <React/RCTTouchHandler.h>
#endif

#import <React/RCTUIManager.h>

#import "UIView+RNSUtility.h"

#ifdef RCT_NEW_ARCH_ENABLED
Class<RCTComponentViewProtocol> RNSScreenCls(void)
{
  return RNSScreenView.class;
}
#endif

@interface RNSScreenView ()
#ifdef RCT_NEW_ARCH_ENABLED
    <RCTRNSScreenViewProtocol, UIAdaptivePresentationControllerDelegate>
#else
    <UIAdaptivePresentationControllerDelegate, RCTInvalidating>
#endif
@end

@implementation RNSScreenView {
#ifdef RCT_NEW_ARCH_ENABLED
  RCTSurfaceTouchHandler *_touchHandler;
  react::RNSScreenShadowNode::ConcreteState::Shared _state;
  // on fabric, they are not available by default so we need them exposed here too
  NSMutableArray<UIView *> *_reactSubviews;
#else
  __weak RCTBridge *_bridge;
  RCTTouchHandler *_touchHandler;
  CGRect _reactFrame;
#endif
}

#ifdef RCT_NEW_ARCH_ENABLED
- (instancetype)initWithFrame:(CGRect)frame
{
  if (self = [super initWithFrame:frame]) {
    static const auto defaultProps = std::make_shared<const react::RNSScreenProps>();
    _props = defaultProps;
    _reactSubviews = [NSMutableArray new];
    [self initCommonProps];
  }
  return self;
}
#else
- (instancetype)initWithBridge:(RCTBridge *)bridge
{
  if (self = [super init]) {
    _bridge = bridge;
    [self initCommonProps];
  }

  return self;
}
#endif // RCT_NEW_ARCH_ENABLED

- (void)initCommonProps
{
  _controller = [[RNSScreen alloc] initWithView:self];
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
#if !TARGET_OS_TV
  _sheetExpandsWhenScrolledToEdge = YES;
#endif // !TARGET_OS_TV
}

- (UIViewController *)reactViewController
{
  return _controller;
}

#ifdef RCT_NEW_ARCH_ENABLED
- (NSArray<UIView *> *)reactSubviews
{
  return _reactSubviews;
}
#endif

- (void)updateBounds
{
#ifdef RCT_NEW_ARCH_ENABLED
  if (_state != nullptr) {
    RNSScreenStackHeaderConfig *config = [self findHeaderConfig];
    // in large title, ScrollView handles the offset of content so we cannot set it here also.
    CGFloat headerHeight =
        config.largeTitle ? 0 : [_controller calculateHeaderHeightIsModal:self.isPresentedAsNativeModal];
    auto newState =
        react::RNSScreenState{RCTSizeFromCGSize(self.bounds.size), RCTPointFromCGPoint(CGPointMake(0, headerHeight))};
    _state->updateState(std::move(newState));
    UINavigationController *navctr = _controller.navigationController;
    [navctr.view setNeedsLayout];
  }
#else
  [_bridge.uiManager setSize:self.bounds.size forView:self];
#endif
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
#ifdef RCT_NEW_ARCH_ENABLED
#else
    RCTLogError(
        @"Screen presentation updated from modal to push, this may likely result in a screen object leakage. If you need to change presentation style create a new screen object instead");
#endif // RCT_NEW_ARCH_ENABLED
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
    case RNSScreenStackAnimationSlideFromLeft:
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

// Nil will be provided when activityState is set as an animated value and we change
// it from JS to be a plain value (non animated).
// In case when nil is received, we want to ignore such value and not make
// any updates as the actual non-nil value will follow immediately.
- (void)setActivityStateOrNil:(NSNumber *)activityStateOrNil
{
  int activityState = [activityStateOrNil intValue];
  if (activityStateOrNil != nil && activityState != -1 && activityState != _activityState) {
    _activityState = activityState;
    [_reactSuperview markChildUpdated];
  }
}

#if !TARGET_OS_TV && !TARGET_OS_VISION
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

  // As the status bar could change its visibility, we need to calculate header
  // height for the correct value in `onHeaderHeightChange` event when navigation
  // bar is not visible.
  if (self.controller.navigationController.navigationBarHidden && !self.isModal) {
    [self.controller calculateAndNotifyHeaderHeightChangeIsModal:NO];
  }
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

- (void)notifyDismissedWithCount:(int)dismissCount
{
#ifdef RCT_NEW_ARCH_ENABLED
  // If screen is already unmounted then there will be no event emitter
  if (_eventEmitter != nullptr) {
    std::dynamic_pointer_cast<const react::RNSScreenEventEmitter>(_eventEmitter)
        ->onDismissed(react::RNSScreenEventEmitter::OnDismissed{.dismissCount = dismissCount});
  }
#else
  // TODO: hopefully problems connected to dismissed prop are only the case on paper
  _dismissed = YES;
  if (self.onDismissed) {
    dispatch_async(dispatch_get_main_queue(), ^{
      if (self.onDismissed) {
        self.onDismissed(@{@"dismissCount" : @(dismissCount)});
      }
    });
  }
#endif
}

- (void)notifyDismissCancelledWithDismissCount:(int)dismissCount
{
#ifdef RCT_NEW_ARCH_ENABLED
  // If screen is already unmounted then there will be no event emitter
  if (_eventEmitter != nullptr) {
    std::dynamic_pointer_cast<const react::RNSScreenEventEmitter>(_eventEmitter)
        ->onNativeDismissCancelled(
            react::RNSScreenEventEmitter::OnNativeDismissCancelled{.dismissCount = dismissCount});
  }
#else
  if (self.onNativeDismissCancelled) {
    self.onNativeDismissCancelled(@{@"dismissCount" : @(dismissCount)});
  }
#endif
}

- (void)notifyWillAppear
{
#ifdef RCT_NEW_ARCH_ENABLED
  // If screen is already unmounted then there will be no event emitter
  if (_eventEmitter != nullptr) {
    std::dynamic_pointer_cast<const react::RNSScreenEventEmitter>(_eventEmitter)
        ->onWillAppear(react::RNSScreenEventEmitter::OnWillAppear{});
  }
  [self updateLayoutMetrics:_newLayoutMetrics oldLayoutMetrics:_oldLayoutMetrics];
#else
  if (self.onWillAppear) {
    self.onWillAppear(nil);
  }
  // we do it here too because at this moment the `parentViewController` is already not nil,
  // so if the parent is not UINavCtr, the frame will be updated to the correct one.
  [self reactSetFrame:_reactFrame];
#endif
}

- (void)notifyWillDisappear
{
  if (_hideKeyboardOnSwipe) {
    [self endEditing:YES];
  }
#ifdef RCT_NEW_ARCH_ENABLED
  // If screen is already unmounted then there will be no event emitter
  if (_eventEmitter != nullptr) {
    std::dynamic_pointer_cast<const react::RNSScreenEventEmitter>(_eventEmitter)
        ->onWillDisappear(react::RNSScreenEventEmitter::OnWillDisappear{});
  }
#else
  if (self.onWillDisappear) {
    self.onWillDisappear(nil);
  }
#endif
}

- (void)notifyAppear
{
#ifdef RCT_NEW_ARCH_ENABLED
  // If screen is already unmounted then there will be no event emitter
  if (_eventEmitter != nullptr) {
    std::dynamic_pointer_cast<const react::RNSScreenEventEmitter>(_eventEmitter)
        ->onAppear(react::RNSScreenEventEmitter::OnAppear{});
  }
#else
  if (self.onAppear) {
    dispatch_async(dispatch_get_main_queue(), ^{
      if (self.onAppear) {
        self.onAppear(nil);
      }
    });
  }
#endif
}

- (void)notifyDisappear
{
#ifdef RCT_NEW_ARCH_ENABLED
  // If screen is already unmounted then there will be no event emitter
  if (_eventEmitter != nullptr) {
    std::dynamic_pointer_cast<const react::RNSScreenEventEmitter>(_eventEmitter)
        ->onDisappear(react::RNSScreenEventEmitter::OnDisappear{});
  }
#else
  if (self.onDisappear) {
    self.onDisappear(nil);
  }
#endif
}

- (void)notifyHeaderHeightChange:(double)headerHeight
{
#ifdef RCT_NEW_ARCH_ENABLED
  if (_eventEmitter != nullptr) {
    std::dynamic_pointer_cast<const facebook::react::RNSScreenEventEmitter>(_eventEmitter)
        ->onHeaderHeightChange(
            facebook::react::RNSScreenEventEmitter::OnHeaderHeightChange{.headerHeight = headerHeight});
  }

  RNSHeaderHeightChangeEvent *event =
      [[RNSHeaderHeightChangeEvent alloc] initWithEventName:@"onHeaderHeightChange"
                                                   reactTag:[NSNumber numberWithInt:self.tag]
                                               headerHeight:headerHeight];
  [[RCTBridge currentBridge].eventDispatcher notifyObserversOfEvent:event];
#else
  if (self.onHeaderHeightChange) {
    self.onHeaderHeightChange(@{
      @"headerHeight" : @(headerHeight),
    });
  }
#endif
}

- (void)notifyGestureCancel
{
#ifdef RCT_NEW_ARCH_ENABLED
  if (_eventEmitter != nullptr) {
    std::dynamic_pointer_cast<const react::RNSScreenEventEmitter>(_eventEmitter)
        ->onGestureCancel(react::RNSScreenEventEmitter::OnGestureCancel{});
  }
#else
  if (self.onGestureCancel) {
    self.onGestureCancel(nil);
  }
#endif
}

- (BOOL)isMountedUnderScreenOrReactRoot
{
#ifdef RCT_NEW_ARCH_ENABLED
#define RNS_EXPECTED_VIEW RCTRootComponentView
#else
#define RNS_EXPECTED_VIEW RCTRootView
#endif
  for (UIView *parent = self.superview; parent != nil; parent = parent.superview) {
    if ([parent isKindOfClass:[RNS_EXPECTED_VIEW class]] || [parent isKindOfClass:[RNSScreenView class]]) {
      return YES;
    }
  }
  return NO;
#undef RNS_EXPECTED_VIEW
}

- (void)didMoveToWindow
{
  // For RN touches to work we need to instantiate and connect RCTTouchHandler. This only applies
  // for screens that aren't mounted under RCTRootView e.g., modals that are mounted directly to
  // root application window.
  if (self.window != nil && ![self isMountedUnderScreenOrReactRoot]) {
    if (_touchHandler == nil) {
#ifdef RCT_NEW_ARCH_ENABLED
      _touchHandler = [RCTSurfaceTouchHandler new];
#else
      _touchHandler = [[RCTTouchHandler alloc] initWithBridge:_bridge];
#endif
    }
    [_touchHandler attachToView:self];
  } else {
    [_touchHandler detachFromView:self];
  }
}

- (nullable RNS_TOUCH_HANDLER_ARCH_TYPE *)touchHandler
{
  if (_touchHandler != nil) {
    return _touchHandler;
  }

  return [self rnscreens_findTouchHandlerInAncestorChain];
}

- (void)notifyFinishTransitioning
{
  [_controller notifyFinishTransitioning];
}

- (void)notifyTransitionProgress:(double)progress closing:(BOOL)closing goingForward:(BOOL)goingForward
{
#ifdef RCT_NEW_ARCH_ENABLED
  if (_eventEmitter != nullptr) {
    std::dynamic_pointer_cast<const react::RNSScreenEventEmitter>(_eventEmitter)
        ->onTransitionProgress(react::RNSScreenEventEmitter::OnTransitionProgress{
            .progress = progress, .closing = closing ? 1 : 0, .goingForward = goingForward ? 1 : 0});
  }
  RNSScreenViewEvent *event = [[RNSScreenViewEvent alloc] initWithEventName:@"onTransitionProgress"
                                                                   reactTag:[NSNumber numberWithInt:self.tag]
                                                                   progress:progress
                                                                    closing:closing
                                                               goingForward:goingForward];
  [[RCTBridge currentBridge].eventDispatcher notifyObserversOfEvent:event];
#else
  if (self.onTransitionProgress) {
    self.onTransitionProgress(@{
      @"progress" : @(progress),
      @"closing" : @(closing ? 1 : 0),
      @"goingForward" : @(goingForward ? 1 : 0),
    });
  }
#endif
}

#if defined(__IPHONE_OS_VERSION_MAX_ALLOWED) && defined(__IPHONE_13_0) && \
    __IPHONE_OS_VERSION_MAX_ALLOWED >= __IPHONE_13_0
- (void)presentationControllerDidAttemptToDismiss:(UIPresentationController *)presentationController
{
  [self notifyGestureCancel];
}
#endif

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
#ifdef RCT_NEW_ARCH_ENABLED
  [_touchHandler setEnabled:NO];
  [_touchHandler setEnabled:YES];
#else
  [_touchHandler cancel];
#endif
  [_touchHandler reset];
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

- (nullable RNSScreenStackHeaderConfig *)findHeaderConfig
{
  // Fast path
  if ([self.reactSubviews.lastObject isKindOfClass:RNSScreenStackHeaderConfig.class]) {
    return (RNSScreenStackHeaderConfig *)self.reactSubviews.lastObject;
  }

  for (UIView *view in self.reactSubviews) {
    if ([view isKindOfClass:RNSScreenStackHeaderConfig.class]) {
      return (RNSScreenStackHeaderConfig *)view;
    }
  }

  return nil;
}

- (BOOL)isModal
{
  return self.stackPresentation != RNSScreenStackPresentationPush;
}

- (BOOL)isPresentedAsNativeModal
{
  return self.controller.parentViewController == nil && self.controller.presentingViewController != nil;
}

- (BOOL)isFullscreenModal
{
  switch (self.controller.modalPresentationStyle) {
    case UIModalPresentationFullScreen:
    case UIModalPresentationCurrentContext:
    case UIModalPresentationOverCurrentContext:
      return YES;
    default:
      return NO;
  }
}

- (BOOL)isTransparentModal
{
  return self.controller.modalPresentationStyle == UIModalPresentationOverFullScreen ||
      self.controller.modalPresentationStyle == UIModalPresentationOverCurrentContext;
}

#if !TARGET_OS_TV && !TARGET_OS_VISION
/**
 * Updates settings for sheet presentation controller.
 * Note that this method should not be called inside `stackPresentation` setter, because on Paper we don't have
 * guarantee that values of all related props had been updated earlier.
 */
- (void)updatePresentationStyle
{
#if defined(__IPHONE_OS_VERSION_MAX_ALLOWED) && defined(__IPHONE_15_0) && \
    __IPHONE_OS_VERSION_MAX_ALLOWED >= __IPHONE_15_0
  if (@available(iOS 15.0, *)) {
    UISheetPresentationController *sheet = _controller.sheetPresentationController;
    if (_stackPresentation == RNSScreenStackPresentationFormSheet && sheet != nil) {
      sheet.prefersScrollingExpandsWhenScrolledToEdge = _sheetExpandsWhenScrolledToEdge;
      sheet.prefersGrabberVisible = _sheetGrabberVisible;
      sheet.preferredCornerRadius =
          _sheetCornerRadius < 0 ? UISheetPresentationControllerAutomaticDimension : _sheetCornerRadius;

      if (_sheetLargestUndimmedDetent == RNSScreenDetentTypeMedium) {
        sheet.largestUndimmedDetentIdentifier = UISheetPresentationControllerDetentIdentifierMedium;
      } else if (_sheetLargestUndimmedDetent == RNSScreenDetentTypeLarge) {
        sheet.largestUndimmedDetentIdentifier = UISheetPresentationControllerDetentIdentifierLarge;
      } else if (_sheetLargestUndimmedDetent == RNSScreenDetentTypeAll) {
        sheet.largestUndimmedDetentIdentifier = nil;
      } else {
        RCTLogError(@"Unhandled value of sheetLargestUndimmedDetent passed");
      }

      if (_sheetAllowedDetents == RNSScreenDetentTypeMedium) {
        sheet.detents = @[ UISheetPresentationControllerDetent.mediumDetent ];
        if (sheet.selectedDetentIdentifier != UISheetPresentationControllerDetentIdentifierMedium) {
          [sheet animateChanges:^{
            sheet.selectedDetentIdentifier = UISheetPresentationControllerDetentIdentifierMedium;
          }];
        }
      } else if (_sheetAllowedDetents == RNSScreenDetentTypeLarge) {
        sheet.detents = @[ UISheetPresentationControllerDetent.largeDetent ];
        if (sheet.selectedDetentIdentifier != UISheetPresentationControllerDetentIdentifierLarge) {
          [sheet animateChanges:^{
            sheet.selectedDetentIdentifier = UISheetPresentationControllerDetentIdentifierLarge;
          }];
        }
      } else if (_sheetAllowedDetents == RNSScreenDetentTypeAll) {
        sheet.detents =
            @[ UISheetPresentationControllerDetent.mediumDetent, UISheetPresentationControllerDetent.largeDetent ];
      } else {
        RCTLogError(@"Unhandled value of sheetAllowedDetents passed");
      }
    }
  }
#endif // Check for max allowed iOS version
}
#endif // !TARGET_OS_TV

#pragma mark - Fabric specific
#ifdef RCT_NEW_ARCH_ENABLED

- (BOOL)hasHeaderConfig
{
  return _config != nil;
}

#pragma mark Mounting operations

- (void)mountChildComponentView:(UIView<RCTComponentViewProtocol> *)childComponentView index:(NSInteger)index
{
  if ([childComponentView isKindOfClass:[RNSScreenStackHeaderConfig class]]) {
    _config = (RNSScreenStackHeaderConfig *)childComponentView;
    _config.screenView = self;
  }
  [_reactSubviews insertObject:childComponentView atIndex:index];
  [super mountChildComponentView:childComponentView index:index];
}

- (void)unmountChildComponentView:(UIView<RCTComponentViewProtocol> *)childComponentView index:(NSInteger)index
{
  if ([childComponentView isKindOfClass:[RNSScreenStackHeaderConfig class]]) {
    _config = nil;
  }
  [_reactSubviews removeObject:childComponentView];
  [super unmountChildComponentView:childComponentView index:index];
}

#pragma mark Descriptor

+ (react::ComponentDescriptorProvider)componentDescriptorProvider
{
  return react::concreteComponentDescriptorProvider<react::RNSScreenComponentDescriptor>();
}

#pragma mark View Recycling

+ (BOOL)shouldBeRecycled
{
  return NO;
}

#pragma mark - RCTComponentViewProtocol

- (void)updateProps:(react::Props::Shared const &)props oldProps:(react::Props::Shared const &)oldProps
{
  const auto &oldScreenProps = *std::static_pointer_cast<const react::RNSScreenProps>(_props);
  const auto &newScreenProps = *std::static_pointer_cast<const react::RNSScreenProps>(props);

  [self setFullScreenSwipeEnabled:newScreenProps.fullScreenSwipeEnabled];

  [self setGestureEnabled:newScreenProps.gestureEnabled];

  [self setTransitionDuration:[NSNumber numberWithInt:newScreenProps.transitionDuration]];

  [self setHideKeyboardOnSwipe:newScreenProps.hideKeyboardOnSwipe];

  [self setCustomAnimationOnSwipe:newScreenProps.customAnimationOnSwipe];

  [self
      setGestureResponseDistance:[RNSConvert
                                     gestureResponseDistanceDictFromCppStruct:newScreenProps.gestureResponseDistance]];

  [self setPreventNativeDismiss:newScreenProps.preventNativeDismiss];

  [self setActivityStateOrNil:[NSNumber numberWithFloat:newScreenProps.activityState]];

  [self setSwipeDirection:[RNSConvert RNSScreenSwipeDirectionFromCppEquivalent:newScreenProps.swipeDirection]];

#if !TARGET_OS_TV
  if (newScreenProps.statusBarHidden != oldScreenProps.statusBarHidden) {
    [self setStatusBarHidden:newScreenProps.statusBarHidden];
  }

  if (newScreenProps.statusBarStyle != oldScreenProps.statusBarStyle) {
    [self setStatusBarStyle:[RCTConvert
                                RNSStatusBarStyle:RCTNSStringFromStringNilIfEmpty(newScreenProps.statusBarStyle)]];
  }

  if (newScreenProps.statusBarAnimation != oldScreenProps.statusBarAnimation) {
    [self setStatusBarAnimation:[RCTConvert UIStatusBarAnimation:RCTNSStringFromStringNilIfEmpty(
                                                                     newScreenProps.statusBarAnimation)]];
  }

  if (newScreenProps.screenOrientation != oldScreenProps.screenOrientation) {
    [self setScreenOrientation:[RCTConvert UIInterfaceOrientationMask:RCTNSStringFromStringNilIfEmpty(
                                                                          newScreenProps.screenOrientation)]];
  }

  if (newScreenProps.homeIndicatorHidden != oldScreenProps.homeIndicatorHidden) {
    [self setHomeIndicatorHidden:newScreenProps.homeIndicatorHidden];
  }

  [self setSheetGrabberVisible:newScreenProps.sheetGrabberVisible];
  [self setSheetCornerRadius:newScreenProps.sheetCornerRadius];
  [self setSheetExpandsWhenScrolledToEdge:newScreenProps.sheetExpandsWhenScrolledToEdge];

  if (newScreenProps.sheetAllowedDetents != oldScreenProps.sheetAllowedDetents) {
    [self setSheetAllowedDetents:[RNSConvert RNSScreenDetentTypeFromAllowedDetents:newScreenProps.sheetAllowedDetents]];
  }

  if (newScreenProps.sheetLargestUndimmedDetent != oldScreenProps.sheetLargestUndimmedDetent) {
    [self setSheetLargestUndimmedDetent:
              [RNSConvert RNSScreenDetentTypeFromLargestUndimmedDetent:newScreenProps.sheetLargestUndimmedDetent]];
  }
#endif // !TARGET_OS_TV

  if (newScreenProps.stackPresentation != oldScreenProps.stackPresentation) {
    [self
        setStackPresentation:[RNSConvert RNSScreenStackPresentationFromCppEquivalent:newScreenProps.stackPresentation]];
  }

  if (newScreenProps.stackAnimation != oldScreenProps.stackAnimation) {
    [self setStackAnimation:[RNSConvert RNSScreenStackAnimationFromCppEquivalent:newScreenProps.stackAnimation]];
  }

  if (newScreenProps.replaceAnimation != oldScreenProps.replaceAnimation) {
    [self setReplaceAnimation:[RNSConvert RNSScreenReplaceAnimationFromCppEquivalent:newScreenProps.replaceAnimation]];
  }

  [super updateProps:props oldProps:oldProps];
}

- (void)updateState:(react::State::Shared const &)state oldState:(react::State::Shared const &)oldState
{
  _state = std::static_pointer_cast<const react::RNSScreenShadowNode::ConcreteState>(state);
}

- (void)updateLayoutMetrics:(const react::LayoutMetrics &)layoutMetrics
           oldLayoutMetrics:(const react::LayoutMetrics &)oldLayoutMetrics
{
  _newLayoutMetrics = layoutMetrics;
  _oldLayoutMetrics = oldLayoutMetrics;
  UIViewController *parentVC = self.reactViewController.parentViewController;
  if (parentVC != nil && ![parentVC isKindOfClass:[RNSNavigationController class]]) {
    [super updateLayoutMetrics:layoutMetrics oldLayoutMetrics:oldLayoutMetrics];
  }
  // when screen is mounted under RNSNavigationController it's size is controller
  // by the navigation controller itself. That is, it is set to fill space of
  // the controller. In that case we ignore react layout system from managing
  // the screen dimensions and we wait for the screen VC to update and then we
  // pass the dimensions to ui view manager to take into account when laying out
  // subviews
  // Explanation taken from `reactSetFrame`, which is old arch equivalent of this code.
}

- (void)finalizeUpdates:(RNComponentViewUpdateMask)updateMask
{
  [super finalizeUpdates:updateMask];
#if !TARGET_OS_TV && !TARGET_OS_VISION
  [self updatePresentationStyle];
#endif // !TARGET_OS_TV
}

#pragma mark - Paper specific
#else

- (void)didSetProps:(NSArray<NSString *> *)changedProps
{
  [super didSetProps:changedProps];
#if !TARGET_OS_TV && !TARGET_OS_VISION
  [self updatePresentationStyle];
#endif // !TARGET_OS_TV
}

- (void)setPointerEvents:(RCTPointerEvents)pointerEvents
{
  // pointer events settings are managed by the parent screen container, we ignore
  // any attempt of setting that via React props
}

- (void)reactSetFrame:(CGRect)frame
{
  _reactFrame = frame;
  UIViewController *parentVC = self.reactViewController.parentViewController;
  if (parentVC != nil && ![parentVC isKindOfClass:[RNSNavigationController class]]) {
    [super reactSetFrame:frame];
  }
  // when screen is mounted under RNSNavigationController it's size is controller
  // by the navigation controller itself. That is, it is set to fill space of
  // the controller. In that case we ignore react layout system from managing
  // the screen dimensions and we wait for the screen VC to update and then we
  // pass the dimensions to ui view manager to take into account when laying out
  // subviews
}

- (void)invalidate
{
  _controller = nil;
}
#endif

@end
