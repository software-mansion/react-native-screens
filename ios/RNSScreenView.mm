#import <UIKit/UIKit.h>

#import "RNSScreen.h"
#import "RNSScreenContainer.h"
#import "RNSScreenContentWrapper.h"
#import "RNSScreenView.h"
#import "RNSScreenWindowTraits.h"

#ifdef RCT_NEW_ARCH_ENABLED
#import <React/RCTConversions.h>
#import <React/RCTFabricComponentsPlugins.h>
#import <React/RCTRootComponentView.h>
#import <React/RCTScrollViewComponentView.h>
#import <React/RCTSurfaceTouchHandler.h>
#import <react/renderer/components/rnscreens/EventEmitters.h>
#import <react/renderer/components/rnscreens/Props.h>
#import <react/renderer/components/rnscreens/RCTComponentViewHelpers.h>
#import <rnscreens/RNSScreenComponentDescriptor.h>
#import "RNSConvert.h"
#import "RNSHeaderHeightChangeEvent.h"
#import "RNSScreenViewEvent.h"
#else
#import <React/RCTScrollView.h>
#import <React/RCTTouchHandler.h>
#endif // RCT_NEW_ARCH_ENABLED

#import <React/RCTShadowView.h>
#import <React/RCTUIManager.h>
#import <React/RCTUIManagerUtils.h>

#import "RNSScreenFooter.h"
#import "RNSScreenStackHeaderConfig.h"
#import "RNSScreenStackView.h"

#import "RNSDefines.h"
#import "UIView+RNSUtility.h"

#ifdef RCT_NEW_ARCH_ENABLED
namespace react = facebook::react;
#define ReactScrollViewBase RCTScrollViewComponentView
#else
#define ReactScrollViewBase RCTScrollView
#endif // RCT_NEW_ARCH_ENABLED

constexpr NSInteger SHEET_FIT_TO_CONTENTS = -1;
constexpr NSInteger SHEET_LARGEST_UNDIMMED_DETENT_NONE = -1;

struct ContentWrapperBox {
  __weak RNSScreenContentWrapper *contentWrapper{nil};
  float contentHeightErrata{0.f};
};

@interface RNSScreenView () <
    UIAdaptivePresentationControllerDelegate,
#if !TARGET_OS_TV
    UISheetPresentationControllerDelegate,
#endif
#ifdef RCT_NEW_ARCH_ENABLED
    RCTRNSScreenViewProtocol,
    CAAnimationDelegate>
#else
    RCTInvalidating>
#endif

@end

@implementation RNSScreenView {
  __weak ReactScrollViewBase *_sheetsScrollView;
  BOOL _didSetSheetAllowedDetentsOnController;
  ContentWrapperBox _contentWrapperBox;
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

// Needed because of this: https://github.com/facebook/react-native/pull/37274
+ (void)load
{
  [super load];
}

- (instancetype)initWithFrame:(CGRect)frame
{
  if (self = [super initWithFrame:frame]) {
    static const auto defaultProps = std::make_shared<const react::RNSScreenProps>();
    _props = defaultProps;
    _reactSubviews = [NSMutableArray new];
    _contentWrapperBox = {};
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
  _activityState = RNSActivityStateUndefined;
  _fullScreenSwipeShadowEnabled = YES;
#if !TARGET_OS_TV
  _sheetExpandsWhenScrolledToEdge = YES;
#endif // !TARGET_OS_TV
  _sheetsScrollView = nil;
  _didSetSheetAllowedDetentsOnController = NO;
#ifdef RCT_NEW_ARCH_ENABLED
  _markedForUnmountInCurrentTransaction = NO;
#endif // RCT_NEW_ARCH_ENABLED
}

- (UIViewController *)reactViewController
{
  return _controller;
}

#ifdef RCT_NEW_ARCH_ENABLED
RNS_IGNORE_SUPER_CALL_BEGIN
- (NSArray<UIView *> *)reactSubviews
{
  return _reactSubviews;
}
RNS_IGNORE_SUPER_CALL_END
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
#endif // RCT_NEW_ARCH_ENABLED

  if (_stackPresentation != RNSScreenStackPresentationFormSheet) {
    return;
  }

  // In case of formSheet stack presentation, to mitigate view flickering
  // (see PR with description of this problem: https://github.com/software-mansion/react-native-screens/pull/1870)
  // we do not set `bottom: 0` in JS for wrapper of the screen content, causing React to not set
  // strict frame every time the sheet size is updated by the code above. This approach leads however to
  // situation where (if present) scrollview does not know its view port size resulting in buggy behaviour.
  // That's exactly the issue we are handling below. We look for a scroll view down the view hierarchy (only going
  // through first subviews, as the OS does something similar e.g. when looking for scrollview for large header
  // interaction) and we set its frame to the sheet size. **This is not perfect**, as the content might jump when items
  // are added/removed to/from the scroll view, but it's the best we got rn. See
  // https://github.com/software-mansion/react-native-screens/pull/1852

  // TODO: Consider adding a prop to control whether we want to look for a scroll view here.
  // It might be necessary in case someone doesn't want its scroll view to span over whole
  // height of the sheet.
  ReactScrollViewBase *scrollView = [self findDirectLineDescendantReactScrollView];
  if (_sheetsScrollView != scrollView) {
    [_sheetsScrollView removeObserver:self forKeyPath:@"bounds" context:nil];
    _sheetsScrollView = scrollView;

    // We pass 0 as options, as we are not interested in receiving updated bounds value,
    // we are going to overwrite it anyway.
    [scrollView addObserver:self forKeyPath:@"bounds" options:0 context:nil];
  }
  if (scrollView != nil) {
    [scrollView setFrame:self.frame];
  }
}

- (void)observeValueForKeyPath:(NSString *)keyPath
                      ofObject:(id)object
                        change:(NSDictionary<NSKeyValueChangeKey, id> *)change
                       context:(void *)context
{
  UIView *scrollview = (UIView *)object;
  if (!CGRectEqualToRect(scrollview.frame, self.frame)) {
    [scrollview setFrame:self.frame];
  }
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
    [self maybeAssertActivityStateProgressionOldValue:_activityState newValue:activityState];
    _activityState = activityState;
    [_reactSuperview markChildUpdated];
  }
}

- (void)maybeAssertActivityStateProgressionOldValue:(int)oldValue newValue:(int)newValue
{
  if (self.isNativeStackScreen && newValue < oldValue) {
    RCTLogError(@"[RNScreens] activityState can only progress in NativeStack");
  }
}

/// Note that this method works only after the screen is actually mounted under a screen stack view.
- (BOOL)isNativeStackScreen
{
  return [_reactSuperview isKindOfClass:RNSScreenStackView.class];
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

RNS_IGNORE_SUPER_CALL_BEGIN
- (UIView *)reactSuperview
{
  return _reactSuperview;
}
RNS_IGNORE_SUPER_CALL_END

- (BOOL)registerContentWrapper:(RNSScreenContentWrapper *)contentWrapper contentHeightErrata:(float)errata;
{
  if (self.stackPresentation != RNSScreenStackPresentationFormSheet) {
    return NO;
  }
  _contentWrapperBox = {.contentWrapper = contentWrapper, .contentHeightErrata = errata};
  contentWrapper.delegate = self;
  [contentWrapper triggerDelegateUpdate];
  return YES;
}

/// This is RNSScreenContentWrapperDelegate method, where we do get notified when React did update frame of our child.
- (void)contentWrapper:(RNSScreenContentWrapper *)contentWrapper receivedReactFrame:(CGRect)reactFrame
{
  if (self.stackPresentation != RNSScreenStackPresentationFormSheet || _didSetSheetAllowedDetentsOnController == YES) {
    return;
  }

  _didSetSheetAllowedDetentsOnController = YES;

#if !TARGET_OS_TV && !TARGET_OS_VISION && defined(__IPHONE_OS_VERSION_MAX_ALLOWED) && defined(__IPHONE_16_0) && \
    __IPHONE_OS_VERSION_MAX_ALLOWED >= __IPHONE_16_0
  if (@available(iOS 16.0, *)) {
    UISheetPresentationController *sheetController = _controller.sheetPresentationController;
    if (sheetController == nil) {
      RCTLogError(@"[RNScreens] sheetPresentationController is null when attempting to set allowed detents");
      return;
    }

    if (_sheetAllowedDetents.count > 0 && _sheetAllowedDetents[0].intValue == SHEET_FIT_TO_CONTENTS) {
      auto detents = [self detentsFromMaxHeights:@[ [NSNumber numberWithFloat:reactFrame.size.height +
                                                              _contentWrapperBox.contentHeightErrata] ]];
      [self setAllowedDetentsForSheet:sheetController to:detents animate:YES];
    }
  }
#endif // Check for iOS >= 16 && !TARGET_OS_TV
}

- (void)addSubview:(UIView *)view
{
  /// This system method is called on Paper only. Fabric uses `-[insertSubview:atIndex:]`.
  if ([view isKindOfClass:RNSScreenContentWrapper.class] &&
      self.stackPresentation == RNSScreenStackPresentationFormSheet) {
    auto contentWrapper = (RNSScreenContentWrapper *)view;
    _contentWrapperBox.contentWrapper = contentWrapper;
    contentWrapper.delegate = self;
  }

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

- (void)notifySheetDetentChangeToIndex:(NSInteger)newDetentIndex isStable:(BOOL)isStable
{
#ifdef RCT_NEW_ARCH_ENABLED
  if (_eventEmitter != nullptr) {
    int index = newDetentIndex;
    std::dynamic_pointer_cast<const react::RNSScreenEventEmitter>(_eventEmitter)
        ->onSheetDetentChanged(
            react::RNSScreenEventEmitter::OnSheetDetentChanged{.index = index, .isStable = isStable});
  }
#else
  if (self.onSheetDetentChanged) {
    self.onSheetDetentChanged(@{
      @"index" : @(newDetentIndex),
      @"isStable" : @(YES),
    });
  }
#endif
}

- (void)notifyHeaderHeightChange:(double)headerHeight
{
#ifdef RCT_NEW_ARCH_ENABLED
  if (_eventEmitter != nullptr) {
    std::dynamic_pointer_cast<const react::RNSScreenEventEmitter>(_eventEmitter)
        ->onHeaderHeightChange(react::RNSScreenEventEmitter::OnHeaderHeightChange{.headerHeight = headerHeight});
  }

  RNSHeaderHeightChangeEvent *event =
      [[RNSHeaderHeightChangeEvent alloc] initWithEventName:@"onHeaderHeightChange"
                                                   reactTag:[NSNumber numberWithInt:self.tag]
                                               headerHeight:headerHeight];
  [self postNotificationForEventDispatcherObserversWithEvent:event];
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
  [self postNotificationForEventDispatcherObserversWithEvent:event];
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
    return NO;
  }
  return _gestureEnabled;
}

#if defined(__IPHONE_OS_VERSION_MAX_ALLOWED) && defined(__IPHONE_13_0) && \
    __IPHONE_OS_VERSION_MAX_ALLOWED >= __IPHONE_13_0
- (void)presentationControllerDidAttemptToDismiss:(UIPresentationController *)presentationController
{
  // NOTE(kkafar): We should consider depracating the use of gesture cancel here & align
  // with usePreventRemove API of react-navigation v7.
  [self notifyGestureCancel];
  if (_preventNativeDismiss) {
    [self notifyDismissCancelledWithDismissCount:1];
  }
}
#endif

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

/// Looks for RCTScrollView in direct line - goes through the subviews at index 0 down the view hierarchy.
- (nullable ReactScrollViewBase *)findDirectLineDescendantReactScrollView
{
  UIView *firstSubview = self;
  while (firstSubview.subviews.count > 0) {
    firstSubview = firstSubview.subviews[0];
    if ([firstSubview isKindOfClass:ReactScrollViewBase.class]) {
      return (ReactScrollViewBase *)firstSubview;
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

- (void)invalidate
{
  _controller = nil;
  [_sheetsScrollView removeObserver:self forKeyPath:@"bounds" context:nil];
}

#if !TARGET_OS_TV && !TARGET_OS_VISION

- (void)setPropertyForSheet:(UISheetPresentationController *)sheet
                  withBlock:(void (^)(void))block
                    animate:(BOOL)animate API_AVAILABLE(ios(15.0))
{
  if (animate) {
    [sheet animateChanges:block];
  } else {
    block();
  }
}

- (void)setAllowedDetentsForSheet:(UISheetPresentationController *)sheet
                               to:(NSArray<UISheetPresentationControllerDetent *> *)detents
                          animate:(BOOL)animate API_AVAILABLE(ios(15.0))
{
  [self setPropertyForSheet:sheet
                  withBlock:^{
                    sheet.detents = detents;
                  }
                    animate:animate];
}

- (void)setSelectedDetentForSheet:(UISheetPresentationController *)sheet
                               to:(UISheetPresentationControllerDetentIdentifier)detent
                          animate:(BOOL)animate API_AVAILABLE(ios(15.0))
{
  if (sheet.selectedDetentIdentifier != detent) {
    [self setPropertyForSheet:sheet
                    withBlock:^{
                      sheet.selectedDetentIdentifier = detent;
                    }
                      animate:animate];
  }
}

- (void)setCornerRadiusForSheet:(UISheetPresentationController *)sheet
                             to:(CGFloat)radius
                        animate:(BOOL)animate API_AVAILABLE(ios(15.0))
{
  if (sheet.preferredCornerRadius != radius) {
    [self setPropertyForSheet:sheet
                    withBlock:^{
                      sheet.preferredCornerRadius =
                          radius < 0 ? UISheetPresentationControllerAutomaticDimension : radius;
                    }
                      animate:animate];
  }
}

- (void)setGrabberVisibleForSheet:(UISheetPresentationController *)sheet
                               to:(BOOL)visible
                          animate:(BOOL)animate API_AVAILABLE(ios(15.0))
{
  if (sheet.prefersGrabberVisible != visible) {
    [self setPropertyForSheet:sheet
                    withBlock:^{
                      sheet.prefersGrabberVisible = visible;
                    }
                      animate:animate];
  }
}

- (void)setLargestUndimmedDetentForSheet:(UISheetPresentationController *)sheet
                                      to:(UISheetPresentationControllerDetentIdentifier)detent
                                 animate:(BOOL)animate API_AVAILABLE(ios(15.0))
{
  if (sheet.largestUndimmedDetentIdentifier != detent) {
    [self setPropertyForSheet:sheet
                    withBlock:^{
                      sheet.largestUndimmedDetentIdentifier = detent;
                    }
                      animate:animate];
  }
}

#if defined(__IPHONE_OS_VERSION_MAX_ALLOWED) && defined(__IPHONE_15_0) && \
    __IPHONE_OS_VERSION_MAX_ALLOWED >= __IPHONE_15_0
- (NSInteger)detentIndexFromDetentIdentifier:(UISheetPresentationControllerDetentIdentifier)identifier
    API_AVAILABLE(ios(15.0))
{
  // We first check if we are running on iOS 16+ as the API is different
#if defined(__IPHONE_OS_VERSION_MAX_ALLOWED) && defined(__IPHONE_16_0) && \
    __IPHONE_OS_VERSION_MAX_ALLOWED >= __IPHONE_16_0
  if (_sheetAllowedDetents.count > 0) {
    // We should be running on custom detents in this case, thus identifier should be a stringified number.
    return identifier.integerValue;
  } else
#endif // iOS 16 check
  {
    // We're using system defined identifiers.
    if (_sheetAllowedDetents.count >= 2 || _sheetAllowedDetents.count == 0) {
      if (identifier == UISheetPresentationControllerDetentIdentifierMedium) {
        return 0;
      } else if (identifier == UISheetPresentationControllerDetentIdentifierLarge) {
        return 1;
      } else {
        RCTLogError(@"[RNScreens] Unexpected detent identifier %@", identifier);
      }
    } else {
      // There is only single option.
      return 0;
    }
  }
  return 0;
}

- (void)sheetPresentationControllerDidChangeSelectedDetentIdentifier:
    (UISheetPresentationController *)sheetPresentationController API_AVAILABLE(ios(15.0))
{
  UISheetPresentationControllerDetentIdentifier ident = sheetPresentationController.selectedDetentIdentifier;
  [self notifySheetDetentChangeToIndex:[self detentIndexFromDetentIdentifier:ident] isStable:YES];
}
#endif // iOS 15 check

/**
 * Updates settings for sheet presentation controller.
 * Note that this method should not be called inside `stackPresentation` setter, because on Paper we don't have
 * guarantee that values of all related props had been updated earlier. It should be invoked from `didSetProps`.
 * On Fabric we have control over prop-setting process but it might be reasonable to run it from `finalizeUpdates`.
 */
- (void)updateFormSheetPresentationStyle
{
  if (_stackPresentation != RNSScreenStackPresentationFormSheet) {
    return;
  }

#if defined(__IPHONE_OS_VERSION_MAX_ALLOWED) && defined(__IPHONE_15_0) && \
    __IPHONE_OS_VERSION_MAX_ALLOWED >= __IPHONE_15_0
  int firstDimmedDetentIndex = _sheetAllowedDetents.count;

  // Whether we use system (iOS 15) detents or custom (iOS 16+).
  // Custom detents are in use if we are on iOS 16+ and we have at least single detent
  // defined in the detents array. In any other case we do use system defined detents.
  bool systemDetentsInUse = false;

  if (@available(iOS 15.0, *)) {
    UISheetPresentationController *sheet = _controller.sheetPresentationController;
    if (sheet == nil) {
      return;
    }
    sheet.delegate = self;
#if defined(__IPHONE_OS_VERSION_MAX_ALLOWED) && defined(__IPHONE_16_0) && \
    __IPHONE_OS_VERSION_MAX_ALLOWED >= __IPHONE_16_0
    if (@available(iOS 16.0, *)) {
      if (_sheetAllowedDetents.count > 0) {
        if (_sheetAllowedDetents.count == 1 && [_sheetAllowedDetents[0] integerValue] == SHEET_FIT_TO_CONTENTS) {
          // This is `fitToContents` case, where sheet should be just high to display its contents.
          // Paper: we do not set anything here, we will set once React computed layout of our React's children, namely
          // RNSScreenContentWrapper, which in case of formSheet presentation style does have exactly the same frame as
          // actual content. The update will be triggered once our child is mounted and laid out by React.
          // Fabric: no nested stack: in this very moment our children are already mounted & laid out. In the very end
          // of this method, after all other configuration is applied we trigger content wrapper to send us update on
          // its frame. Fabric: nested stack: we wait until nested content wrapper registers itself with this view and
          // then update the dimensions.
        } else {
          [self setAllowedDetentsForSheet:sheet
                                       to:[self detentsFromMaxHeightFractions:_sheetAllowedDetents]
                                  animate:NO];
        }
      }
    } else
#endif // Check for iOS >= 16
    {
      systemDetentsInUse = true;
      if (_sheetAllowedDetents.count == 0) {
        [self setAllowedDetentsForSheet:sheet
                                     to:@[
                                       UISheetPresentationControllerDetent.mediumDetent,
                                       UISheetPresentationControllerDetent.largeDetent
                                     ]
                                animate:YES];
      } else if (_sheetAllowedDetents.count >= 2) {
        float firstDetentFraction = _sheetAllowedDetents[0].floatValue;
        float secondDetentFraction = _sheetAllowedDetents[1].floatValue;
        firstDimmedDetentIndex = 2;

        if (firstDetentFraction < secondDetentFraction) {
          [self setAllowedDetentsForSheet:sheet
                                       to:@[
                                         UISheetPresentationControllerDetent.mediumDetent,
                                         UISheetPresentationControllerDetent.largeDetent
                                       ]
                                  animate:YES];
        } else {
          RCTLogError(@"[RNScreens] The values in sheetAllowedDetents array must be sorted");
        }
      } else {
        float firstDetentFraction = _sheetAllowedDetents[0].floatValue;
        if (firstDetentFraction == SHEET_FIT_TO_CONTENTS) {
          RCTLogError(@"[RNScreens] Unsupported on iOS versions below 16");
        } else if (firstDetentFraction < 1.0) {
          [self setAllowedDetentsForSheet:sheet to:@[ UISheetPresentationControllerDetent.mediumDetent ] animate:YES];
          [self setSelectedDetentForSheet:sheet to:UISheetPresentationControllerDetentIdentifierMedium animate:YES];
        } else {
          [self setAllowedDetentsForSheet:sheet to:@[ UISheetPresentationControllerDetent.largeDetent ] animate:YES];
          [self setSelectedDetentForSheet:sheet to:UISheetPresentationControllerDetentIdentifierLarge animate:YES];
        }
      }
    }

    if (_sheetInitialDetent > 0 && _sheetInitialDetent < _sheetAllowedDetents.count) {
#if defined(__IPHONE_OS_VERSION_MAX_ALLOWED) && defined(__IPHONE_16_0) && \
    __IPHONE_OS_VERSION_MAX_ALLOWED >= __IPHONE_16_0
      if (@available(iOS 16.0, *)) {
        UISheetPresentationControllerDetent *detent = sheet.detents[_sheetInitialDetent];
        [self setSelectedDetentForSheet:sheet to:detent.identifier animate:YES];
      } else
#endif // Check for iOS >= 16
      {
        if (_sheetInitialDetent < 2) {
          [self setSelectedDetentForSheet:sheet to:UISheetPresentationControllerDetentIdentifierLarge animate:YES];
        } else {
          RCTLogError(
              @"[RNScreens] sheetInitialDetent out of bounds, on iOS versions below 16 sheetAllowedDetents is ignored in favor of an array of two system-defined detents");
        }
      }
    } else if (_sheetInitialDetent != 0) {
      RCTLogError(@"[RNScreens] sheetInitialDetent out of bounds for sheetAllowedDetents array");
    }

    sheet.prefersScrollingExpandsWhenScrolledToEdge = _sheetExpandsWhenScrolledToEdge;
    [self setGrabberVisibleForSheet:sheet to:_sheetGrabberVisible animate:YES];
    [self setCornerRadiusForSheet:sheet to:_sheetCornerRadius animate:YES];

    // lud - largest undimmed detent
    // First we try to take value from the prop or default.
    int ludIndex = _sheetLargestUndimmedDetent != nil ? _sheetLargestUndimmedDetent.intValue : -1;
    // Rationalize the value in case the user set something that did not make sense.
    ludIndex = ludIndex >= firstDimmedDetentIndex ? firstDimmedDetentIndex - 1 : ludIndex;
    if (ludIndex == SHEET_LARGEST_UNDIMMED_DETENT_NONE) {
      [self setLargestUndimmedDetentForSheet:sheet to:nil animate:YES];
    } else if (ludIndex >= 0) {
      if (systemDetentsInUse) {
        // We're on iOS 15 or do not have custom detents specified by the user.
        if (firstDimmedDetentIndex == 0 || (firstDimmedDetentIndex == 1 && _sheetAllowedDetents[0].floatValue < 1.0)) {
          // There are no detents specified or there is exactly one & it is less than 1.0 we default to medium.
          [self setLargestUndimmedDetentForSheet:sheet
                                              to:UISheetPresentationControllerDetentIdentifierMedium
                                         animate:YES];
        } else {
          [self setLargestUndimmedDetentForSheet:sheet
                                              to:UISheetPresentationControllerDetentIdentifierLarge
                                         animate:YES];
        }
      } else {
        // We're on iOS 16+ & have custom detents.
        [self setLargestUndimmedDetentForSheet:sheet to:[NSNumber numberWithInt:ludIndex].stringValue animate:YES];
      }
    } else {
      RCTLogError(@"[RNScreens] Value of sheetLargestUndimmedDetent prop must be >= -1");
    }
  }

#ifdef RCT_NEW_ARCH_ENABLED
  // We trigger update from content wrapper, because on Fabric we update props after the children are mounted & laid
  // out.
  [self->_contentWrapperBox.contentWrapper triggerDelegateUpdate];
#endif // RCT_NEW_ARCH_ENABLED
#endif // Check for iOS >= 15
}

#if defined(__IPHONE_OS_VERSION_MAX_ALLOWED) && defined(__IPHONE_16_0) && \
    __IPHONE_OS_VERSION_MAX_ALLOWED >= __IPHONE_16_0

/**
 * Creates array of detent objects based on provided `values` & `resolver`. Since we need to name the detents to be able
 * to later refer to them, this method names the detents by stringifying their indices, e.g. detent on index 2 will be
 * named "2".
 */
- (NSArray<UISheetPresentationControllerDetent *> *)
    detentsFromValues:(NSArray<NSNumber *> *)values
         withResolver:(CGFloat (^)(id<UISheetPresentationControllerDetentResolutionContext>, NSNumber *))resolver
    API_AVAILABLE(ios(16.0))
{
  NSMutableArray<UISheetPresentationControllerDetent *> *customDetents =
      [NSMutableArray arrayWithCapacity:values.count];
  [values enumerateObjectsUsingBlock:^(NSNumber *value, NSUInteger index, BOOL *stop) {
    UISheetPresentationControllerDetentIdentifier ident = [[NSNumber numberWithInt:index] stringValue];
    [customDetents addObject:[UISheetPresentationControllerDetent
                                 customDetentWithIdentifier:ident
                                                   resolver:^CGFloat(
                                                       id<UISheetPresentationControllerDetentResolutionContext> ctx) {
                                                     return resolver(ctx, value);
                                                   }]];
  }];
  return customDetents;
}

- (NSArray<UISheetPresentationControllerDetent *> *)detentsFromMaxHeightFractions:(NSArray<NSNumber *> *)fractions
    API_AVAILABLE(ios(16.0))
{
  return [self
      detentsFromValues:fractions
           withResolver:^CGFloat(id<UISheetPresentationControllerDetentResolutionContext> ctx, NSNumber *fraction) {
             return MIN(ctx.maximumDetentValue, ctx.maximumDetentValue * fraction.floatValue);
           }];
}

- (NSArray<UISheetPresentationControllerDetent *> *)detentsFromMaxHeights:(NSArray<NSNumber *> *)maxHeights
    API_AVAILABLE(ios(16.0))
{
  return
      [self detentsFromValues:maxHeights
                 withResolver:^CGFloat(id<UISheetPresentationControllerDetentResolutionContext> ctx, NSNumber *height) {
                   return MIN(ctx.maximumDetentValue, height.floatValue);
                 }];
}

#endif // Check for iOS >= 16

#endif // !TARGET_OS_TV && !TARGET_OS_VISION

#pragma mark - Fabric specific
#ifdef RCT_NEW_ARCH_ENABLED

- (void)postNotificationForEventDispatcherObserversWithEvent:(NSObject<RCTEvent> *)event
{
  NSDictionary *userInfo = [NSDictionary dictionaryWithObjectsAndKeys:event, @"event", nil];
  [[NSNotificationCenter defaultCenter] postNotificationName:@"RCTNotifyEventDispatcherObserversOfEvent_DEPRECATED"
                                                      object:nil
                                                    userInfo:userInfo];
}

- (BOOL)hasHeaderConfig
{
  return _config != nil;
}

- (void)willBeUnmountedInUpcomingTransaction
{
  _markedForUnmountInCurrentTransaction = YES;
}

+ (react::ComponentDescriptorProvider)componentDescriptorProvider
{
  return react::concreteComponentDescriptorProvider<react::RNSScreenComponentDescriptor>();
}

+ (BOOL)shouldBeRecycled
{
  return NO;
}

- (void)mountChildComponentView:(UIView<RCTComponentViewProtocol> *)childComponentView index:(NSInteger)index
{
  if ([childComponentView isKindOfClass:RNSScreenContentWrapper.class]) {
    auto contentWrapper = (RNSScreenContentWrapper *)childComponentView;
    contentWrapper.delegate = self;
    _contentWrapperBox.contentWrapper = contentWrapper;
  } else if ([childComponentView isKindOfClass:RNSScreenStackHeaderConfig.class]) {
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
  if ([childComponentView isKindOfClass:[RNSScreenContentWrapper class]]) {
    _contentWrapperBox.contentWrapper.delegate = nil;
    _contentWrapperBox.contentWrapper = nil;
  }
  [_reactSubviews removeObject:childComponentView];
  [super unmountChildComponentView:childComponentView index:index];
}

#pragma mark - RCTComponentViewProtocol

- (void)updateProps:(react::Props::Shared const &)props oldProps:(react::Props::Shared const &)oldProps
{
  const auto &oldScreenProps = *std::static_pointer_cast<const react::RNSScreenProps>(_props);
  const auto &newScreenProps = *std::static_pointer_cast<const react::RNSScreenProps>(props);

  [self setFullScreenSwipeEnabled:newScreenProps.fullScreenSwipeEnabled];

  [self setFullScreenSwipeShadowEnabled:newScreenProps.fullScreenSwipeShadowEnabled];

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
    [self setSheetAllowedDetents:[RNSConvert detentFractionsArrayFromVector:newScreenProps.sheetAllowedDetents]];
  }

  if (newScreenProps.sheetInitialDetent != oldScreenProps.sheetInitialDetent) {
    [self setSheetInitialDetent:newScreenProps.sheetInitialDetent];
  }

  if (newScreenProps.sheetLargestUndimmedDetent != oldScreenProps.sheetLargestUndimmedDetent) {
    [self setSheetLargestUndimmedDetent:[NSNumber numberWithInt:newScreenProps.sheetLargestUndimmedDetent]];
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
  if (parentVC == nil || ![parentVC isKindOfClass:[RNSNavigationController class]]) {
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
  [self updateFormSheetPresentationStyle];
#endif // !TARGET_OS_TV
}

#pragma mark - Paper specific
#else

- (void)didSetProps:(NSArray<NSString *> *)changedProps
{
  [super didSetProps:changedProps];
#if !TARGET_OS_TV && !TARGET_OS_VISION
  if (self.stackPresentation == RNSScreenStackPresentationFormSheet) {
    [self updateFormSheetPresentationStyle];
  }
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

#endif

@end

#ifdef RCT_NEW_ARCH_ENABLED
Class<RCTComponentViewProtocol> RNSScreenCls(void)
{
  return RNSScreenView.class;
}
#endif

// So that the define-macro is not leaked out of this file.
// This one is defined in very top of the file depending on RN architecture.
#undef ReactScrollViewBase
