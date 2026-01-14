#import <UIKit/UIKit.h>

#import "RNSModalScreen.h"
#import "RNSScreen.h"
#import "RNSScreenContainer.h"
#import "RNSScreenContentWrapper.h"
#import "RNSScreenWindowTraits.h"

#ifdef RCT_NEW_ARCH_ENABLED
#import <React/RCTConversions.h>
#import <React/RCTFabricComponentsPlugins.h>
#import <React/RCTRootComponentView.h>
#import <React/RCTScrollViewComponentView.h>
#import <React/RCTSurfaceTouchHandler.h>
#import <cxxreact/ReactNativeVersion.h>
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

#import "RNSConversions.h"
#import "RNSSafeAreaViewComponentView.h"
#import "RNSSafeAreaViewNotifications.h"
#import "RNSScreenFooter.h"
#import "RNSScreenStack.h"
#import "RNSScreenStackHeaderConfig.h"
#import "RNSScrollViewFinder.h"
#import "RNSScrollViewHelper.h"
#import "RNSTabBarController.h"

#import "RNSDefines.h"
#import "UIView+RNSUtility.h"

#ifdef RCT_NEW_ARCH_ENABLED
namespace react = facebook::react;
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
  __weak RNS_REACT_SCROLL_VIEW_COMPONENT *_sheetsScrollView;

  /// Up-to-date only when sheet is in `fitToContents` mode.
  CGFloat _sheetContentHeight;
  ContentWrapperBox _contentWrapperBox;
  bool _sheetHasInitialDetentSet;
  BOOL _shouldUpdateScrollEdgeEffects;
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
    _snapshotAfterUpdates = NO;
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
  _fullScreenSwipeEnabled = RNSOptionalBooleanUndefined;
  _fullScreenSwipeShadowEnabled = YES;
  _shouldUpdateScrollEdgeEffects = NO;
#if !TARGET_OS_TV
  _sheetExpandsWhenScrolledToEdge = YES;
#endif // !TARGET_OS_TV
  _sheetsScrollView = nil;
  _sheetContentHeight = 0.0;
#ifdef RCT_NEW_ARCH_ENABLED
  _markedForUnmountInCurrentTransaction = NO;
#endif // RCT_NEW_ARCH_ENABLED
}

+ (RNSViewInteractionManager *)viewInteractionManagerInstance
{
  static RNSViewInteractionManager *manager = nil;
  static dispatch_once_t onceToken;
  dispatch_once(&onceToken, ^{
    manager = [[RNSViewInteractionManager alloc] init];
  });

  return manager;
}

- (BOOL)getFullScreenSwipeShadowEnabled
{
  if (@available(iOS 26, *)) {
    // fullScreenSwipeShadow is tied to RNSPanGestureRecognizer, which, on iOS 26, is used only for custom animations,
    // and replaced with native interactiveContentPopGestureRecognizer for everything else.
    // We want them to look similar and native-like, so it should default to `YES`.
    return YES;
  }

  return _fullScreenSwipeShadowEnabled;
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

    // * in large title, ScrollView handles the offset of content so we cannot set it here also
    // * TODO: Why is it assumed in comment above, that large title uses scrollview here? What if only SafeAreaView is
    // used?
    // * When config.translucent == true, we currently use `edgesForExtendedLayout` and the screen is laid out under the
    // navigation bar, therefore there is no need to set content offset in shadow tree.
    // * When this view is the modal root controller (presented in separate view hierarchy) it does not have navigation
    // bar! We send non-zero size to JS, for some reason. TODO: this needs to be investigated.
    const CGFloat effectiveContentOffsetY = config.largeTitle || config.translucent || self.isPresentedAsNativeModal
        ? 0
        : [_controller calculateHeaderHeightIsModal:self.isPresentedAsNativeModal];

    auto newState = react::RNSScreenState{RCTSizeFromCGSize(self.bounds.size), {0, effectiveContentOffsetY}};

    _state->updateState(
        std::move(newState)
#if REACT_NATIVE_VERSION_MINOR >= 82
            ,
        _synchronousShadowStateUpdatesEnabled ? facebook::react::EventQueue::UpdateMode::unstable_Immediate
                                              : facebook::react::EventQueue::UpdateMode::Asynchronous
#endif
    );

    // TODO: Requesting layout on every layout is wrong. We should look for a way to get rid of this.
    UINavigationController *navctr = _controller.navigationController;
    [navctr.view setNeedsLayout];
  }
#else
  [_bridge.uiManager setSize:self.bounds.size forView:self];
#endif // RCT_NEW_ARCH_ENABLED

  if (_stackPresentation == RNSScreenStackPresentationFormSheet) {
    // In case of formSheet stack presentation, to mitigate view flickering
    // (see PR with description of this problem: https://github.com/software-mansion/react-native-screens/pull/1870)
    // we do not set `bottom: 0` in JS for wrapper of the screen content, causing React to not set
    // strict frame every time the sheet size is updated by the code above. This approach leads however to
    // situation where (if present) scrollview does not know its view port size resulting in buggy behaviour.
    // That's exactly the issue we are handling below. We look for a scroll view down the view hierarchy (only going
    // through first subviews, as the OS does something similar e.g. when looking for scrollview for large header
    // interaction) and we set its frame to the sheet size. **This is not perfect**, as the content might jump when
    // items are added/removed to/from the scroll view, but it's the best we got rn. See
    // https://github.com/software-mansion/react-native-screens/pull/1852

    // TODO: Consider adding a prop to control whether we want to look for a scroll view here.
    // It might be necessary in case someone doesn't want its scroll view to span over whole
    // height of the sheet.
    [self applyFrameCorrectionForDescendantScrollView];
  }
}

- (void)applyFrameCorrectionForDescendantScrollView
{
  RNS_REACT_SCROLL_VIEW_COMPONENT *scrollView = [self tryFindDescendantScrollView];
  if (_sheetsScrollView != scrollView) {
    [_sheetsScrollView removeObserver:self forKeyPath:@"bounds" context:nil];
    _sheetsScrollView = scrollView;

    // We pass 0 as options, as we are not interested in receiving updated bounds value,
    // we are going to overwrite it anyway.
    [scrollView addObserver:self forKeyPath:@"bounds" options:0 context:nil];
  }
  if (scrollView != nil) {
    [self correctScrollViewFrame:scrollView withHeader:nil];
  }
}

- (void)correctScrollViewFrame:(nonnull RNS_REACT_SCROLL_VIEW_COMPONENT *)scrollViewComponent
                    withHeader:(nullable UIView *)headerView
{
  RNSScreenContentWrapper *_Nullable contentWrapper = _contentWrapperBox.contentWrapper;
  if (contentWrapper != nil && [contentWrapper coerceChildScrollViewComponentSizeToSize:self.frame.size]) {
    return;
  }

  // Fallback: legacy behavior
  [scrollViewComponent setFrame:self.frame];
}

- (void)observeValueForKeyPath:(NSString *)keyPath
                      ofObject:(id)object
                        change:(NSDictionary<NSKeyValueChangeKey, id> *)change
                       context:(void *)context
{
  UIView *scrollView = (UIView *)object;

  if (![scrollView isKindOfClass:RNS_REACT_SCROLL_VIEW_COMPONENT.class]) {
    return;
  }

  RNSScreenContentWrapper *_Nullable contentWrapper = _contentWrapperBox.contentWrapper;
  if (contentWrapper != nil && [contentWrapper coerceChildScrollViewComponentSizeToSize:self.frame.size]) {
    return;
  }

  // Fallback: legacy behavior
  if (!CGRectEqualToRect(scrollView.frame, self.frame)) {
    [scrollView setFrame:self.frame];
  }
}

- (void)setStackPresentation:(RNSScreenStackPresentation)stackPresentation
{
  switch (stackPresentation) {
    case RNSScreenStackPresentationModal:
      _controller.modalPresentationStyle = UIModalPresentationAutomatic;
#if RNS_IPHONE_OS_VERSION_AVAILABLE(17_0) && !TARGET_OS_TV
      if (@available(iOS 18.0, *)) {
        UISheetPresentationController *sheetController = _controller.sheetPresentationController;
        if (sheetController != nil) {
          sheetController.prefersPageSizing = true;
        } else {
          RCTLogError(
              @"[RNScreens] sheetPresentationController is null when attempting to set prefersPageSizing for modal");
        }
      }
#endif // RNS_IPHONE_OS_VERSION_AVAILABLE(17_0) && !TARGET_OS_TV
      break;

    case RNSScreenStackPresentationPageSheet:
#if !TARGET_OS_TV
      _controller.modalPresentationStyle = UIModalPresentationPageSheet;
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
  _controller.modalInPresentation = !gestureEnabled;

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

- (void)setBottomScrollEdgeEffect:(RNSScrollEdgeEffect)bottomScrollEdgeEffect
{
  _shouldUpdateScrollEdgeEffects = YES;
  _bottomScrollEdgeEffect = bottomScrollEdgeEffect;
}

- (void)setLeftScrollEdgeEffect:(RNSScrollEdgeEffect)leftScrollEdgeEffect
{
  _shouldUpdateScrollEdgeEffects = YES;
  _leftScrollEdgeEffect = leftScrollEdgeEffect;
}

- (void)setRightScrollEdgeEffect:(RNSScrollEdgeEffect)rightScrollEdgeEffect
{
  _shouldUpdateScrollEdgeEffects = YES;
  _rightScrollEdgeEffect = rightScrollEdgeEffect;
}

- (void)setTopScrollEdgeEffect:(RNSScrollEdgeEffect)topScrollEdgeEffect
{
  _shouldUpdateScrollEdgeEffects = YES;
  _topScrollEdgeEffect = topScrollEdgeEffect;
}

- (BOOL)isFullScreenSwipeEffectivelyEnabled
{
  switch (_fullScreenSwipeEnabled) {
    case RNSOptionalBooleanTrue:
      return YES;
    case RNSOptionalBooleanFalse:
      return NO;
    case RNSOptionalBooleanUndefined:
      if (@available(iOS 26, *)) {
        return YES;
      }
      return NO;
  }
}

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
  // We want to update and animate allowedDetents for FormSheet only if there was a change
  // in frame's height but sometimes we receive a frame with the same dimensions mutliple times.
  // In order to prevent visual glitches, we compare new value to the old one and update
  // only if there was a change in height.
  if (self.stackPresentation != RNSScreenStackPresentationFormSheet || _sheetContentHeight == reactFrame.size.height) {
    return;
  }

#if !TARGET_OS_TV && !TARGET_OS_VISION && RNS_IPHONE_OS_VERSION_AVAILABLE(16_0)
  if (@available(iOS 16.0, *)) {
    UISheetPresentationController *sheetController = _controller.sheetPresentationController;
    if (sheetController == nil) {
      RCTLogError(@"[RNScreens] sheetPresentationController is null when attempting to set allowed detents");
      return;
    }

    if (_sheetAllowedDetents.count > 0 && _sheetAllowedDetents[0].intValue == SHEET_FIT_TO_CONTENTS) {
      _sheetContentHeight = reactFrame.size.height;
      auto detents = [self detentsFromMaxHeights:@[ [NSNumber numberWithFloat:reactFrame.size.height +
                                                              _contentWrapperBox.contentHeightErrata] ]];
      [self setAllowedDetentsForSheet:sheetController to:detents animate:YES];
    }
  }
#endif // Check for iOS >= 16 && !TARGET_OS_TV && !TARGET_OS_VISION
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
    int index = static_cast<int>(newDetentIndex);
    std::dynamic_pointer_cast<const react::RNSScreenEventEmitter>(_eventEmitter)
        ->onSheetDetentChanged(
            react::RNSScreenEventEmitter::OnSheetDetentChanged{
                .index = index, .isStable = static_cast<bool>(isStable)});
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
                                                   reactTag:[NSNumber numberWithInteger:self.tag]
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
        ->onTransitionProgress(
            react::RNSScreenEventEmitter::OnTransitionProgress{
                .progress = progress, .closing = closing ? 1 : 0, .goingForward = goingForward ? 1 : 0});
  }
  RNSScreenViewEvent *event = [[RNSScreenViewEvent alloc] initWithEventName:@"onTransitionProgress"
                                                                   reactTag:[NSNumber numberWithInteger:self.tag]
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

- (void)willMoveToWindow:(UIWindow *)newWindow
{
  if (@available(iOS 26, *)) {
    // In iOS 26, as soon as another screen appears in transition, it is interactable
    // To avoid glitches resulting from clicking buttons mid transition, we temporarily disable all interactions
    // Disabling interactions for parent navigation controller won't be enough in case of nested stack
    // Furthermore, a stack put inside a modal will exist in an entirely different hierarchy

    // Use RNSViewInteractionManager util to find a suitable subtree to disable interations on,
    // starting from reactSuperview, because on Paper, self is not attached yet.
    [RNSScreenView.viewInteractionManagerInstance disableInteractionsForSubtreeWith:self.reactSuperview];
  }
}

- (void)presentationControllerWillDismiss:(UIPresentationController *)presentationController
{
  if (@available(iOS 26, *)) {
    // Disable interactions to disallow multiple modals dismissed at once; see willMoveToWindow
    [RNSScreenView.viewInteractionManagerInstance disableInteractionsForSubtreeWith:self.reactSuperview];
  }

#if !RCT_NEW_ARCH_ENABLED
  // On Paper, we need to call both "cancel" and "reset" here because RN's gesture
  // recognizer does not handle the scenario when it gets cancelled by other top
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
#endif // !RCT_NEW_ARCH_ENABLED
}

- (BOOL)presentationControllerShouldDismiss:(UIPresentationController *)presentationController
{
  if (_preventNativeDismiss) {
    return NO;
  }
  return _gestureEnabled;
}

- (void)presentationControllerDidAttemptToDismiss:(UIPresentationController *)presentationController
{
  if (@available(iOS 26, *)) {
    // Reenable interactions; see presentationControllerWillDismiss
    [RNSScreenView.viewInteractionManagerInstance enableInteractionsForLastSubtree];
  }

  // NOTE(kkafar): We should consider depracating the use of gesture cancel here & align
  // with usePreventRemove API of react-navigation v7.
  [self notifyGestureCancel];
  if (_preventNativeDismiss) {
    [self notifyDismissCancelledWithDismissCount:1];
  }
}

- (void)presentationControllerDidDismiss:(UIPresentationController *)presentationController
{
  if (@available(iOS 26, *)) {
    // Reenable interactions; see presentationControllerWillDismiss
    // Dismissed screen doesn't hold a reference to window, but presentingViewController.view does
    [RNSScreenView.viewInteractionManagerInstance enableInteractionsForLastSubtree];
  }

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
- (nullable RNS_REACT_SCROLL_VIEW_COMPONENT *)tryFindDescendantScrollView
{
  // Step 1: Query registered content wrapper for the scrollview.
  RNSScreenContentWrapper *contentWrapper = _contentWrapperBox.contentWrapper;

  if (RNS_REACT_SCROLL_VIEW_COMPONENT *_Nullable scrollViewComponent =
          [contentWrapper childRCTScrollViewComponentAndContentContainer].scrollViewComponent;
      scrollViewComponent != nil) {
    return scrollViewComponent;
  }

  // Fallback 1: Search through first-subview-path
  UIView *firstSubview = self;
  while (firstSubview.subviews.count > 0) {
    firstSubview = firstSubview.subviews[0];
    if ([firstSubview isKindOfClass:RNS_REACT_SCROLL_VIEW_COMPONENT.class]) {
      return static_cast<RNS_REACT_SCROLL_VIEW_COMPONENT *>(firstSubview);
    }
  }

#if RNS_IPHONE_OS_VERSION_AVAILABLE(26_0)
  // Fallback 2: Search through RNSSafeAreaViewComponentView subviews (iOS 26+ workaround with modified hierarchy)
  if (@available(iOS 26.0, *)) {
    UIView *maybeSafeAreaView = contentWrapper.subviews.firstObject;
    if ([maybeSafeAreaView isKindOfClass:RNSSafeAreaViewComponentView.class]) {
      for (UIView *subview in maybeSafeAreaView.subviews) {
        if ([subview isKindOfClass:RNS_REACT_SCROLL_VIEW_COMPONENT.class]) {
          return static_cast<RNS_REACT_SCROLL_VIEW_COMPONENT *>(subview);
        }
      }
    }
  }
#endif // RNS_IPHONE_OS_VERSION_AVAILABLE(26_0)

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

- (void)invalidateImpl
{
  _controller = nil;
  [_sheetsScrollView removeObserver:self forKeyPath:@"bounds" context:nil];
}

#ifndef RCT_NEW_ARCH_ENABLED
- (void)invalidate
{
  [self invalidateImpl];
}
#endif

#if !TARGET_OS_TV && !TARGET_OS_VISION

- (void)setPropertyForSheet:(UISheetPresentationController *)sheet withBlock:(void (^)(void))block animate:(BOOL)animate
{
  if (animate) {
    [sheet animateChanges:block];
  } else {
    block();
  }
}

- (void)setAllowedDetentsForSheet:(UISheetPresentationController *)sheet
                               to:(NSArray<UISheetPresentationControllerDetent *> *)detents
                          animate:(BOOL)animate
{
  [self setPropertyForSheet:sheet
                  withBlock:^{
                    sheet.detents = detents;
                  }
                    animate:animate];
}

- (void)setSelectedDetentForSheet:(UISheetPresentationController *)sheet
                               to:(UISheetPresentationControllerDetentIdentifier)detent
                          animate:(BOOL)animate
{
  if (sheet.selectedDetentIdentifier != detent) {
    [self setPropertyForSheet:sheet
                    withBlock:^{
                      sheet.selectedDetentIdentifier = detent;
                    }
                      animate:animate];
  }
}

- (void)setCornerRadiusForSheet:(UISheetPresentationController *)sheet to:(CGFloat)radius animate:(BOOL)animate
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

- (void)setGrabberVisibleForSheet:(UISheetPresentationController *)sheet to:(BOOL)visible animate:(BOOL)animate
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
                                 animate:(BOOL)animate
{
  if (sheet.largestUndimmedDetentIdentifier != detent) {
    [self setPropertyForSheet:sheet
                    withBlock:^{
                      sheet.largestUndimmedDetentIdentifier = detent;
                    }
                      animate:animate];
  }
}

- (NSInteger)detentIndexFromDetentIdentifier:(UISheetPresentationControllerDetentIdentifier)identifier
{
  // We first check if we are running on iOS 16+ as the API is different
#if RNS_IPHONE_OS_VERSION_AVAILABLE(16_0)
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
    (UISheetPresentationController *)sheetPresentationController
{
  UISheetPresentationControllerDetentIdentifier ident = sheetPresentationController.selectedDetentIdentifier;
  [self notifySheetDetentChangeToIndex:[self detentIndexFromDetentIdentifier:ident] isStable:YES];
}

/**
 * Updates settings for sheet presentation controller.
 * Note that this method should not be called inside `stackPresentation` setter, because on Paper we don't have
 * guarantee that values of all related props had been updated earlier. It should be invoked from `didSetProps`.
 * On Fabric we run it from `finalizeUpdates` if props have changed.
 */
- (void)updateFormSheetPresentationStyle
{
  if (_stackPresentation != RNSScreenStackPresentationFormSheet) {
    return;
  }

  int firstDimmedDetentIndex = static_cast<int>(_sheetAllowedDetents.count);

  // Whether we use system (iOS 15) detents or custom (iOS 16+).
  // Custom detents are in use if we are on iOS 16+ and we have at least single detent
  // defined in the detents array. In any other case we do use system defined detents.
  bool systemDetentsInUse = false;

  UISheetPresentationController *sheet = _controller.sheetPresentationController;
  if (sheet == nil) {
    return;
  }
  sheet.delegate = self;
#if RNS_IPHONE_OS_VERSION_AVAILABLE(16_0)
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
        [self setAllowedDetentsForSheet:sheet to:[self detentsFromMaxHeightFractions:_sheetAllowedDetents] animate:NO];
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

  // Handle initial detent on the first update.
  if (!_sheetHasInitialDetentSet) {
    if (_sheetInitialDetent > 0 && _sheetInitialDetent < _sheetAllowedDetents.count) {
#if RNS_IPHONE_OS_VERSION_AVAILABLE(16_0)
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
    _sheetHasInitialDetentSet = true;
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
        [self setLargestUndimmedDetentForSheet:sheet to:UISheetPresentationControllerDetentIdentifierLarge animate:YES];
      }
    } else {
      // We're on iOS 16+ & have custom detents.
      [self setLargestUndimmedDetentForSheet:sheet to:[NSNumber numberWithInt:ludIndex].stringValue animate:YES];
    }
  } else {
    RCTLogError(@"[RNScreens] Value of sheetLargestUndimmedDetent prop must be >= -1");
  }

#ifdef RCT_NEW_ARCH_ENABLED
  // We trigger update from content wrapper, because on Fabric we update props after the children are mounted & laid
  // out.
  [self->_contentWrapperBox.contentWrapper triggerDelegateUpdate];
#endif // RCT_NEW_ARCH_ENABLED
}

#if RNS_IPHONE_OS_VERSION_AVAILABLE(16_0)

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
    UISheetPresentationControllerDetentIdentifier ident = [[NSNumber numberWithUnsignedInteger:index] stringValue];
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

#pragma mark - RNSScrollViewBehaviorOverriding

- (BOOL)shouldOverrideScrollViewContentInsetAdjustmentBehavior
{
  // RNSScreenView does not have a property to control this behavior.
  // It looks for parent that conforms to RNSScrollViewBehaviorOverriding to determine
  // if it should override ScrollView's behavior.

  // As this method is called when RNSScreen willMoveToParentViewController
  // and view does not have superView yet, we need to use reactSuperViews.
  UIView *parent = [self reactSuperview];

  while (parent != nil) {
    if ([parent respondsToSelector:@selector(shouldOverrideScrollViewContentInsetAdjustmentBehavior)]) {
      id<RNSScrollViewBehaviorOverriding> overrideProvider = static_cast<id<RNSScrollViewBehaviorOverriding>>(parent);
      return [overrideProvider shouldOverrideScrollViewContentInsetAdjustmentBehavior];
    }
    parent = [parent reactSuperview];
  }

  return NO;
}

- (void)overrideScrollViewBehaviorInFirstDescendantChainIfNeeded
{
  if ([self shouldOverrideScrollViewContentInsetAdjustmentBehavior]) {
    [RNSScrollViewHelper overrideScrollViewBehaviorInFirstDescendantChainFrom:self];
  }
}

- (void)updateContentScrollViewEdgeEffectsIfExists
{
  [RNSScrollEdgeEffectApplicator applyToScrollView:[RNSScrollViewFinder findScrollViewInFirstDescendantChainFrom:self]
                                      withProvider:self];
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

  _fullScreenSwipeEnabled =
      [RNSConvert RNSOptionalBooleanFromRNSFullScreenSwipeEnabledCppEquivalent:newScreenProps.fullScreenSwipeEnabled];

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

  [self setSynchronousShadowStateUpdatesEnabled:newScreenProps.synchronousShadowStateUpdatesEnabled];

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

  if (newScreenProps.screenId != oldScreenProps.screenId) {
    [self setScreenId:RCTNSStringFromStringNilIfEmpty(newScreenProps.screenId)];
  }

  if (newScreenProps.bottomScrollEdgeEffect != oldScreenProps.bottomScrollEdgeEffect) {
    [self setBottomScrollEdgeEffect:[RNSConvert RNSScrollEdgeEffectFromScreenBottomScrollEdgeEffectCppEquivalent:
                                                    newScreenProps.bottomScrollEdgeEffect]];
  }

  if (newScreenProps.leftScrollEdgeEffect != oldScreenProps.leftScrollEdgeEffect) {
    [self setLeftScrollEdgeEffect:[RNSConvert RNSScrollEdgeEffectFromScreenLeftScrollEdgeEffectCppEquivalent:
                                                  newScreenProps.leftScrollEdgeEffect]];
  }

  if (newScreenProps.rightScrollEdgeEffect != oldScreenProps.rightScrollEdgeEffect) {
    [self setRightScrollEdgeEffect:[RNSConvert RNSScrollEdgeEffectFromScreenRightScrollEdgeEffectCppEquivalent:
                                                   newScreenProps.rightScrollEdgeEffect]];
  }

  if (newScreenProps.topScrollEdgeEffect != oldScreenProps.topScrollEdgeEffect) {
    [self setTopScrollEdgeEffect:[RNSConvert RNSScrollEdgeEffectFromScreenTopScrollEdgeEffectCppEquivalent:
                                                 newScreenProps.topScrollEdgeEffect]];
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
  if (_shouldUpdateScrollEdgeEffects) {
    [self updateContentScrollViewEdgeEffectsIfExists];
    _shouldUpdateScrollEdgeEffects = NO;
  }

#if !TARGET_OS_TV && !TARGET_OS_VISION
  if (updateMask & RNComponentViewUpdateMaskProps) {
    [self updateFormSheetPresentationStyle];
  }
#endif // !TARGET_OS_TV && !TARGET_OS_VISION
}

#pragma mark - Paper specific
#else

// On Fabric the setter is not needed, because value invariant (empty string to nil translation)
// is upheld in `- [updateProps:oldProps:]`
- (void)setScreenId:(NSString *)screenId
{
  if (screenId != nil && screenId.length == 0) {
    _screenId = nil;
  } else {
    _screenId = screenId;
  }
}

- (void)didSetProps:(NSArray<NSString *> *)changedProps
{
  [super didSetProps:changedProps];

  if (_shouldUpdateScrollEdgeEffects) {
    // see finalizeUpdates() for Fabric
    [self updateContentScrollViewEdgeEffectsIfExists];
    _shouldUpdateScrollEdgeEffects = NO;
  }

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

#pragma mark - RNSScreen

@implementation RNSScreen {
  __weak id _previousFirstResponder;
  CGRect _lastViewFrame;
  RNSScreenView *_initialView;
  UIView *_fakeView;
  CADisplayLink *_animationTimer;
  CGFloat _currentAlpha;
  BOOL _closing;
  BOOL _goingForward;
  int _dismissCount;
  BOOL _isSwiping;
  BOOL _shouldNotify;
}

#pragma mark - Common

- (instancetype)initWithView:(UIView *)view
{
  if (self = [super init]) {
    self.view = view;
    _fakeView = [UIView new];
    _shouldNotify = YES;
#ifdef RCT_NEW_ARCH_ENABLED
    _initialView = (RNSScreenView *)view;
#endif
  }
  return self;
}

// TODO: Find out why this is executed when screen is going out
- (void)viewWillAppear:(BOOL)animated
{
  [super viewWillAppear:animated];
  if (!_isSwiping) {
    [self.screenView notifyWillAppear];
    if (self.transitionCoordinator.isInteractive) {
      // we started dismissing with swipe gesture
      _isSwiping = YES;
    }
  } else {
    // this event is also triggered if we cancelled the swipe.
    // The _isSwiping is still true, but we don't want to notify then
    _shouldNotify = NO;
  }

  [self hideHeaderIfNecessary];
  // as per documentation of these methods
  _goingForward = [self isBeingPresented] || [self isMovingToParentViewController];

  [RNSScreenWindowTraits updateWindowTraits];
  if (_shouldNotify) {
    _closing = NO;
    [self notifyTransitionProgress:0.0 closing:_closing goingForward:_goingForward];
    [self setupProgressNotification];
  }
}

- (void)viewWillDisappear:(BOOL)animated
{
  [super viewWillDisappear:animated];
  // self.navigationController might be null when we are dismissing a modal
  if (!self.transitionCoordinator.isInteractive && self.navigationController != nil) {
    // user might have long pressed ios 14 back button item,
    // so he can go back more than one screen and we need to dismiss more screens in JS stack then.
    // We check it by calculating the difference between the index of currently displayed screen
    // and the index of the target screen, which is the view of topViewController at this point.
    // If the value is lower than 1, it means we are dismissing a modal, or navigating forward, or going back with JS.
    int selfIndex = [self getIndexOfView:self.screenView];
    int targetIndex = [self getIndexOfView:self.navigationController.topViewController.view];
    _dismissCount = selfIndex - targetIndex > 0 ? selfIndex - targetIndex : 1;
  } else {
    _dismissCount = 1;
  }

  // same flow as in viewWillAppear
  if (!_isSwiping) {
    [self.screenView notifyWillDisappear];
    if (self.transitionCoordinator.isInteractive) {
      _isSwiping = YES;
    }
  } else {
    _shouldNotify = NO;
  }

  // as per documentation of these methods
  _goingForward = !([self isBeingDismissed] || [self isMovingFromParentViewController]);

  if (_shouldNotify) {
    _closing = YES;
    [self notifyTransitionProgress:0.0 closing:_closing goingForward:_goingForward];
    [self setupProgressNotification];
  }
}

- (void)viewDidAppear:(BOOL)animated
{
  if (@available(iOS 26, *)) {
    // Reenable interactions, see willMoveToWindow
    [RNSScreenView.viewInteractionManagerInstance enableInteractionsForLastSubtree];
  }
  [super viewDidAppear:animated];
  if (!_isSwiping || _shouldNotify) {
    // we are going forward or dismissing without swipe
    // or successfully swiped back
    [self.screenView notifyAppear];
    [self notifyTransitionProgress:1.0 closing:NO goingForward:_goingForward];
  } else {
    [self.screenView notifyGestureCancel];
  }

  _isSwiping = NO;
  _shouldNotify = YES;
}

- (void)viewDidDisappear:(BOOL)animated
{
  [super viewDidDisappear:animated];
  if (self.parentViewController == nil && self.presentingViewController == nil) {
    if (self.screenView.preventNativeDismiss) {
      // if we want to prevent the native dismiss, we do not send dismissal event,
      // but instead call `updateContainer`, which restores the JS navigation stack
      [self.screenView.reactSuperview updateContainer];
      [self.screenView notifyDismissCancelledWithDismissCount:_dismissCount];
    } else {
      // screen dismissed, send event
      [self.screenView notifyDismissedWithCount:_dismissCount];
    }
  }
  // same flow as in viewDidAppear
  if (!_isSwiping || _shouldNotify) {
    [self.screenView notifyDisappear];
    [self notifyTransitionProgress:1.0 closing:YES goingForward:_goingForward];
  }

  _isSwiping = NO;
  _shouldNotify = YES;

  if (@available(iOS 26, *)) {
    // Reenable interactions, see willMoveToWindow
    [RNSScreenView.viewInteractionManagerInstance enableInteractionsForLastSubtree];
  }
}

- (void)viewDidLayoutSubviews
{
  [super viewDidLayoutSubviews];

  // The below code makes the screen view adapt dimensions provided by the system. We take these
  // into account only when the view is mounted under RNSNavigationController in which case system
  // provides additional padding to account for possible header, and in the case when screen is
  // shown as a native modal, as the final dimensions of the modal on iOS 12+ are shorter than the
  // screen size
  BOOL isDisplayedWithinUINavController = [self.parentViewController isKindOfClass:[RNSNavigationController class]];
  BOOL isTabScreen = [self.parentViewController isKindOfClass:RNSTabBarController.class];

  // Calculate header height on modal open
  if (self.screenView.isPresentedAsNativeModal) {
    [self calculateAndNotifyHeaderHeightChangeIsModal:YES];
  }

  if (isDisplayedWithinUINavController || isTabScreen || self.screenView.isPresentedAsNativeModal) {
#ifdef RCT_NEW_ARCH_ENABLED
    [self.screenView updateBounds];
#else
    if (!CGRectEqualToRect(_lastViewFrame, self.screenView.frame)) {
      _lastViewFrame = self.screenView.frame;
      [((RNSScreenView *)self.viewIfLoaded) updateBounds];
    }
#endif
  }
}

- (BOOL)isModalWithHeader
{
  return self.screenView.isModal && self.childViewControllers.count == 1 &&
      [self.childViewControllers[0] isKindOfClass:UINavigationController.class];
}

// Checks whether this screen has any child view controllers of type RNSNavigationController.
// Useful for checking if this screen has nested stack or is displayed at the top.
- (BOOL)hasNestedStack
{
  for (UIViewController *vc in self.childViewControllers) {
    if ([vc isKindOfClass:[RNSNavigationController class]]) {
      return YES;
    }
  }

  return NO;
}

- (CGSize)getStatusBarHeightIsModal:(BOOL)isModal
{
#if !TARGET_OS_TV && !TARGET_OS_VISION
  CGSize fallbackStatusBarSize = [[UIApplication sharedApplication] statusBarFrame].size;

  CGSize primaryStatusBarSize = self.view.window.windowScene.statusBarManager.statusBarFrame.size;
  if (primaryStatusBarSize.height == 0 || primaryStatusBarSize.width == 0) {
    return fallbackStatusBarSize;
  }

  return primaryStatusBarSize;

#else
  // TVOS does not have status bar.
  return CGSizeMake(0, 0);
#endif // !TARGET_OS_TV
}

- (UINavigationController *)getVisibleNavigationControllerIsModal:(BOOL)isModal
{
  UINavigationController *navctr = self.navigationController;

  if (isModal) {
    // In case where screen is a modal, we want to calculate childViewController's
    // navigation bar height instead of the navigation controller from RNSScreen.
    if (self.isModalWithHeader) {
      navctr = self.childViewControllers[0];
    } else {
      // If the modal does not meet requirements (there's no RNSNavigationController which means that probably it
      // doesn't have header or there are more than one RNSNavigationController which is invalid) we don't want to
      // return anything.
      return nil;
    }
  }

  return navctr;
}

- (CGFloat)calculateHeaderHeightIsModal:(BOOL)isModal
{
  UINavigationController *navctr = [self getVisibleNavigationControllerIsModal:isModal];

  // If there's no navigation controller for the modal (or the navigation bar is hidden), we simply don't want to
  // return header height, as modal possibly does not have header when navigation controller is nil,
  // and we don't want to count status bar if navigation bar is hidden (inset could be negative).
  if (navctr == nil || navctr.isNavigationBarHidden) {
    return 0;
  }

  CGFloat navbarHeight = navctr.navigationBar.frame.size.height;
#if !TARGET_OS_TV
  CGFloat navbarInset = navctr.navigationBar.frame.origin.y;
#else
  // On TVOS there's no inset of navigation bar.
  CGFloat navbarInset = 0;
#endif // !TARGET_OS_TV

  return navbarHeight + navbarInset;
}

- (void)calculateAndNotifyHeaderHeightChangeIsModal:(BOOL)isModal
{
  CGFloat totalHeight = [self calculateHeaderHeightIsModal:isModal];
  [self.screenView notifyHeaderHeightChange:totalHeight];
}

- (void)notifyFinishTransitioning
{
  [_previousFirstResponder becomeFirstResponder];
  _previousFirstResponder = nil;
  // the correct Screen for appearance is set after the transition, same for orientation.
  [RNSScreenWindowTraits updateWindowTraits];
}

- (void)willMoveToParentViewController:(UIViewController *)parent
{
  [super willMoveToParentViewController:parent];
  if (parent == nil) {
    id responder = [self findFirstResponder:self.screenView];
    if (responder != nil) {
      _previousFirstResponder = responder;
    }
  } else {
    [self.screenView overrideScrollViewBehaviorInFirstDescendantChainIfNeeded];
    [self.screenView updateContentScrollViewEdgeEffectsIfExists];
  }
}

- (id)findFirstResponder:(UIView *)parent
{
  if (parent.isFirstResponder) {
    return parent;
  }
  for (UIView *subView in parent.subviews) {
    id responder = [self findFirstResponder:subView];
    if (responder != nil) {
      return responder;
    }
  }
  return nil;
}

#pragma mark - transition progress related methods

- (void)setupProgressNotification
{
  if (self.transitionCoordinator != nil) {
    if (!self.transitionCoordinator.isAnimated) {
      // If the transition is not animated, there is no point to set up animation
      // and completion callbacks. This helps prevent issues with dismissed modals having
      // "artifical animation duration" instead of being removed instantly.
      // See: https://github.com/software-mansion/react-native-screens/pull/3189/
      return;
    }

    _fakeView.alpha = 0.0;

    auto animation = ^(id<UIViewControllerTransitionCoordinatorContext> _Nonnull context) {
      [[context containerView] addSubview:self->_fakeView];
      self->_fakeView.alpha = 1.0;
      self->_animationTimer = [CADisplayLink displayLinkWithTarget:self selector:@selector(handleAnimation)];
      [self->_animationTimer addToRunLoop:[NSRunLoop currentRunLoop] forMode:NSDefaultRunLoopMode];
    };

    [self.transitionCoordinator
        animateAlongsideTransition:animation
                        completion:^(id<UIViewControllerTransitionCoordinatorContext> _Nonnull context) {
                          [self->_animationTimer setPaused:YES];
                          [self->_animationTimer invalidate];
                          [self->_fakeView removeFromSuperview];
                        }];
  }
}

- (void)handleAnimation
{
  if ([[_fakeView layer] presentationLayer] != nil) {
    CGFloat fakeViewAlpha = _fakeView.layer.presentationLayer.opacity;
    if (_currentAlpha != fakeViewAlpha) {
      _currentAlpha = fmax(0.0, fmin(1.0, fakeViewAlpha));
      [self notifyTransitionProgress:_currentAlpha closing:_closing goingForward:_goingForward];
    }
  }
}

- (void)notifyTransitionProgress:(double)progress closing:(BOOL)closing goingForward:(BOOL)goingForward
{
  if ([self.view isKindOfClass:[RNSScreenView class]]) {
    // if the view is already snapshot, there is not sense in sending progress since on JS side
    // the component is already not present
    [(RNSScreenView *)self.view notifyTransitionProgress:progress closing:closing goingForward:goingForward];
  }
}

#if !TARGET_OS_TV
// if the returned vc is a child, it means that it can provide config;
// if the returned vc is self, it means that there is no child for config and self has config to provide,
// so we return self which results in asking self for preferredStatusBarStyle/Animation etc.;
// if the returned vc is nil, it means none of children could provide config and self does not have config either,
// so if it was asked by parent, it will fallback to parent's option, or use default option if it is the top Screen
- (UIViewController *)findChildVCForConfigAndTrait:(RNSWindowTrait)trait includingModals:(BOOL)includingModals
{
  UIViewController *lastViewController = [[self childViewControllers] lastObject];
  if ([self.presentedViewController isKindOfClass:[RNSScreen class]]) {
    lastViewController = self.presentedViewController;

    if (!includingModals) {
      return nil;
    }

    // we don't want to allow controlling of status bar appearance when we present non-fullScreen modal
    // and it is not possible if `modalPresentationCapturesStatusBarAppearance` is not set to YES, so even
    // if we went into a modal here and ask it, it wouldn't take any effect. For fullScreen modals, the system
    // asks them by itself, so we can stop traversing here.
    // for screen orientation, we need to start the search again from that modal
    UIViewController *modalOrChild = [(RNSScreen *)lastViewController findChildVCForConfigAndTrait:trait
                                                                                   includingModals:includingModals];
    if (modalOrChild != nil) {
      return modalOrChild;
    }

    // if searched VC was not found, we don't want to search for configs of child VCs any longer,
    // and we don't want to rely on lastViewController.
    // That's because the modal did not find a child VC that has an orientation set,
    // and it doesn't itself have an orientation set. Hence, we fallback to the standard behavior.
    // Please keep in mind that this behavior might be wrong and could lead to undiscovered bugs.
    // For more information, see https://github.com/software-mansion/react-native-screens/pull/2008.
  }

  UIViewController *selfOrNil = [self hasTraitSet:trait] ? self : nil;
  if (lastViewController == nil) {
    return selfOrNil;
  } else {
    if ([lastViewController conformsToProtocol:@protocol(RNSViewControllerDelegate)]) {
      // If there is a child (should be VC of ScreenContainer or ScreenStack), that has a child that could provide the
      // trait, we recursively go into its findChildVCForConfig, and if one of the children has the trait set, we return
      // it, otherwise we return self if this VC has config, and nil if it doesn't we use
      // `childViewControllerForStatusBarStyle` for all options since the behavior is the same for all of them
      UIViewController *childScreen = [lastViewController childViewControllerForStatusBarStyle];
      if ([childScreen isKindOfClass:[RNSScreen class]]) {
        return [(RNSScreen *)childScreen findChildVCForConfigAndTrait:trait includingModals:includingModals]
            ?: selfOrNil;
      } else {
        return selfOrNil;
      }
    } else {
      // child vc is not from this library, so we don't ask it
      return selfOrNil;
    }
  }
}

- (BOOL)hasTraitSet:(RNSWindowTrait)trait
{
  switch (trait) {
    case RNSWindowTraitStyle: {
      return self.screenView.hasStatusBarStyleSet;
    }
    case RNSWindowTraitAnimation: {
      return self.screenView.hasStatusBarAnimationSet;
    }
    case RNSWindowTraitHidden: {
      return self.screenView.hasStatusBarHiddenSet;
    }
    case RNSWindowTraitOrientation: {
      return self.screenView.hasOrientationSet;
    }
    case RNSWindowTraitHomeIndicatorHidden: {
      return self.screenView.hasHomeIndicatorHiddenSet;
    }
    default: {
      RCTLogError(@"Unknown trait passed: %d", (int)trait);
    }
  }
  return NO;
}

- (UIViewController *)childViewControllerForStatusBarHidden
{
  UIViewController *vc = [self findChildVCForConfigAndTrait:RNSWindowTraitHidden includingModals:NO];
  return vc == self ? nil : vc;
}

- (BOOL)prefersStatusBarHidden
{
  return self.screenView.statusBarHidden;
}

- (UIViewController *)childViewControllerForStatusBarStyle
{
  UIViewController *vc = [self findChildVCForConfigAndTrait:RNSWindowTraitStyle includingModals:NO];
  return vc == self ? nil : vc;
}

- (UIStatusBarStyle)preferredStatusBarStyle
{
  return [RNSScreenWindowTraits statusBarStyleForRNSStatusBarStyle:self.screenView.statusBarStyle];
}

- (UIStatusBarAnimation)preferredStatusBarUpdateAnimation
{
  UIViewController *vc = [self findChildVCForConfigAndTrait:RNSWindowTraitAnimation includingModals:NO];

  if ([vc isKindOfClass:[RNSScreen class]]) {
    return ((RNSScreen *)vc).screenView.statusBarAnimation;
  }
  return UIStatusBarAnimationFade;
}

- (UIInterfaceOrientationMask)supportedInterfaceOrientations
{
  UIViewController *vc = [self findChildVCForConfigAndTrait:RNSWindowTraitOrientation includingModals:YES];

  if ([vc isKindOfClass:[RNSScreen class]]) {
    return ((RNSScreen *)vc).screenView.screenOrientation;
  }
  return UIInterfaceOrientationMaskAllButUpsideDown;
}

- (UIViewController *)childViewControllerForHomeIndicatorAutoHidden
{
  UIViewController *vc = [self findChildVCForConfigAndTrait:RNSWindowTraitHomeIndicatorHidden includingModals:YES];
  return vc == self ? nil : vc;
}

- (BOOL)prefersHomeIndicatorAutoHidden
{
  return self.screenView.homeIndicatorHidden;
}
- (int)getParentChildrenCount
{
  return (int)[[self.screenView.reactSuperview reactSubviews] count];
}
#endif

- (int)getIndexOfView:(UIView *)view
{
  return (int)[[self.screenView.reactSuperview reactSubviews] indexOfObject:view];
}

// since on Fabric the view of controller can be a snapshot of type `UIView`,
// when we want to check props of ScreenView, we need to get them from _initialView
- (RNSScreenView *)screenView
{
#ifdef RCT_NEW_ARCH_ENABLED
  return _initialView;
#else
  return (RNSScreenView *)self.view;
#endif
}

- (void)hideHeaderIfNecessary
{
#if !TARGET_OS_TV
  // On iOS >=13, there is a bug when user transitions from screen with active search bar to screen without header
  // In that case default iOS header will be shown. To fix this we hide header when the screens that appears has header
  // hidden and search bar was active on previous screen. We need to do it asynchronously, because default header is
  // added after viewWillAppear.
  NSUInteger currentIndex = [self.navigationController.viewControllers indexOfObject:self];

  // we need to check whether reactSubviews array is empty, because on Fabric child nodes are unmounted first ->
  // reactSubviews array may be empty
  RNSScreenStackHeaderConfig *config = [self.screenView findHeaderConfig];
  if (currentIndex > 0 && config != nil) {
    UINavigationItem *prevNavigationItem =
        [self.navigationController.viewControllers objectAtIndex:currentIndex - 1].navigationItem;
    BOOL wasSearchBarActive = prevNavigationItem.searchController.active;

#ifdef RCT_NEW_ARCH_ENABLED
    BOOL shouldHideHeader = !config.show;
#else
    BOOL shouldHideHeader = config.hide;
#endif

    if (wasSearchBarActive && shouldHideHeader) {
      dispatch_time_t popTime = dispatch_time(DISPATCH_TIME_NOW, 0);
      dispatch_after(popTime, dispatch_get_main_queue(), ^(void) {
        [self.navigationController setNavigationBarHidden:YES animated:NO];
      });
    }
  }
#endif
}

- (void)presentViewController:(UIViewController *)viewControllerToPresent
                     animated:(BOOL)flag
                   completion:(void (^)())completion
{
  // In order to handle presenting modals other than react-native-screens modals (e.g. react-native's Modal),
  // we need to delay presenting it if we're in an ongoing transition. This might be necessary
  // when we use an animation to cancel back button dismiss and try to present a modal at the same time.
  // For more details see: https://github.com/software-mansion/react-native-screens/pull/2976.
  if (self.parentViewController == nil) {
    UIViewController *controller = self.screenView.reactSuperview.reactViewController;

    if (controller.transitionCoordinator != nil) {
      [controller.transitionCoordinator
          animateAlongsideTransition:^(id<UIViewControllerTransitionCoordinatorContext> _Nonnull context) {
            // do nothing here, we only want to be notified when transition is complete
          }
          completion:^(id<UIViewControllerTransitionCoordinatorContext> _Nonnull context) {
            [super presentViewController:viewControllerToPresent animated:flag completion:completion];
          }];
      return;
    }
  }

  [super presentViewController:viewControllerToPresent animated:flag completion:completion];
}

#pragma mark - RNSOrientationProviding

#if !TARGET_OS_TV

- (RNSOrientation)evaluateOrientation
{
  if ([self.childViewControllers.lastObject respondsToSelector:@selector(evaluateOrientation)]) {
    id<RNSOrientationProviding> child = static_cast<id<RNSOrientationProviding>>(self.childViewControllers.lastObject);
    RNSOrientation childOrientation = [child evaluateOrientation];

    if (childOrientation != RNSOrientationInherit) {
      return childOrientation;
    }
  }

  return rnscreens::conversion::RNSOrientationFromUIInterfaceOrientationMask([self supportedInterfaceOrientations]);
}

#endif // !TARGET_OS_TV

#ifdef RCT_NEW_ARCH_ENABLED
#pragma mark - Fabric specific

- (void)setViewToSnapshot
{
  UIView *superView = self.view.superview;
  // if we dismissed the view natively, it will already be detached from view hierarchy
  if (self.view.window != nil) {
    auto afterUpdates = self.screenView.snapshotAfterUpdates;
    UIView *snapshot = [self.view snapshotViewAfterScreenUpdates:afterUpdates];
    snapshot.frame = self.view.frame;
    [self.view removeFromSuperview];
    self.view = snapshot;
    [superView addSubview:snapshot];
  }
}

#endif // RCT_NEW_ARCH_ENABLED

@end

@implementation RNSScreenManager

RCT_EXPORT_MODULE()

// we want to handle the case when activityState is nil
RCT_REMAP_VIEW_PROPERTY(activityState, activityStateOrNil, NSNumber)
RCT_EXPORT_VIEW_PROPERTY(customAnimationOnSwipe, BOOL);
RCT_EXPORT_VIEW_PROPERTY(fullScreenSwipeEnabled, RNSOptionalBoolean);
RCT_EXPORT_VIEW_PROPERTY(fullScreenSwipeShadowEnabled, BOOL);
RCT_EXPORT_VIEW_PROPERTY(gestureEnabled, BOOL)
RCT_EXPORT_VIEW_PROPERTY(gestureResponseDistance, NSDictionary)
RCT_EXPORT_VIEW_PROPERTY(hideKeyboardOnSwipe, BOOL)
RCT_EXPORT_VIEW_PROPERTY(preventNativeDismiss, BOOL)
RCT_EXPORT_VIEW_PROPERTY(replaceAnimation, RNSScreenReplaceAnimation)
RCT_EXPORT_VIEW_PROPERTY(stackPresentation, RNSScreenStackPresentation)
RCT_EXPORT_VIEW_PROPERTY(stackAnimation, RNSScreenStackAnimation)
RCT_EXPORT_VIEW_PROPERTY(swipeDirection, RNSScreenSwipeDirection)
RCT_EXPORT_VIEW_PROPERTY(transitionDuration, NSNumber)
RCT_EXPORT_VIEW_PROPERTY(screenId, NSString);
RCT_EXPORT_VIEW_PROPERTY(bottomScrollEdgeEffect, RNSScrollEdgeEffect);
RCT_EXPORT_VIEW_PROPERTY(leftScrollEdgeEffect, RNSScrollEdgeEffect);
RCT_EXPORT_VIEW_PROPERTY(rightScrollEdgeEffect, RNSScrollEdgeEffect);
RCT_EXPORT_VIEW_PROPERTY(topScrollEdgeEffect, RNSScrollEdgeEffect);

RCT_EXPORT_VIEW_PROPERTY(onAppear, RCTDirectEventBlock);
RCT_EXPORT_VIEW_PROPERTY(onDisappear, RCTDirectEventBlock);
RCT_EXPORT_VIEW_PROPERTY(onHeaderHeightChange, RCTDirectEventBlock);
RCT_EXPORT_VIEW_PROPERTY(onDismissed, RCTDirectEventBlock);
RCT_EXPORT_VIEW_PROPERTY(onNativeDismissCancelled, RCTDirectEventBlock);
RCT_EXPORT_VIEW_PROPERTY(onTransitionProgress, RCTDirectEventBlock);
RCT_EXPORT_VIEW_PROPERTY(onWillAppear, RCTDirectEventBlock);
RCT_EXPORT_VIEW_PROPERTY(onWillDisappear, RCTDirectEventBlock);
RCT_EXPORT_VIEW_PROPERTY(onGestureCancel, RCTDirectEventBlock);
RCT_EXPORT_VIEW_PROPERTY(onSheetDetentChanged, RCTDirectEventBlock);

#if !TARGET_OS_TV
RCT_EXPORT_VIEW_PROPERTY(screenOrientation, UIInterfaceOrientationMask)
RCT_EXPORT_VIEW_PROPERTY(statusBarAnimation, UIStatusBarAnimation)
RCT_EXPORT_VIEW_PROPERTY(statusBarHidden, BOOL)
RCT_EXPORT_VIEW_PROPERTY(statusBarStyle, RNSStatusBarStyle)
RCT_EXPORT_VIEW_PROPERTY(homeIndicatorHidden, BOOL)

RCT_EXPORT_VIEW_PROPERTY(sheetAllowedDetents, NSArray<NSNumber *> *);
RCT_EXPORT_VIEW_PROPERTY(sheetLargestUndimmedDetent, NSNumber *);
RCT_EXPORT_VIEW_PROPERTY(sheetGrabberVisible, BOOL);
RCT_EXPORT_VIEW_PROPERTY(sheetCornerRadius, CGFloat);
RCT_EXPORT_VIEW_PROPERTY(sheetInitialDetent, NSInteger);
RCT_EXPORT_VIEW_PROPERTY(sheetExpandsWhenScrolledToEdge, BOOL);
#endif

#if !TARGET_OS_TV && !TARGET_OS_VISION
// See:
// 1. https://github.com/software-mansion/react-native-screens/pull/1543
// 2. https://github.com/software-mansion/react-native-screens/pull/1596
// This class is instatiated from React Native's internals during application startup
- (instancetype)init
{
  if (self = [super init]) {
    dispatch_async(dispatch_get_main_queue(), ^{
      [[UIDevice currentDevice] beginGeneratingDeviceOrientationNotifications];
    });
  }
  return self;
}

- (void)dealloc
{
  dispatch_sync(dispatch_get_main_queue(), ^{
    [[UIDevice currentDevice] endGeneratingDeviceOrientationNotifications];
  });
}
#endif // !TARGET_OS_TV

#ifdef RCT_NEW_ARCH_ENABLED
#else
- (UIView *)view
{
  return [[RNSScreenView alloc] initWithBridge:self.bridge];
}
#endif

+ (BOOL)requiresMainQueueSetup
{
  // Returning NO here despite the fact some initialization in -init method dispatches tasks
  // on main queue, because the comments in RN source code states that modules which return YES
  // here will be constructed ahead-of-time -- and this is not required in our case.
  return NO;
}

@end

@implementation RCTConvert (RNSScreen)

RCT_ENUM_CONVERTER(
    RNSScreenStackPresentation,
    (@{
      @"push" : @(RNSScreenStackPresentationPush),
      @"modal" : @(RNSScreenStackPresentationModal),
      @"fullScreenModal" : @(RNSScreenStackPresentationFullScreenModal),
      @"formSheet" : @(RNSScreenStackPresentationFormSheet),
      @"pageSheet" : @(RNSScreenStackPresentationPageSheet),
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
      @"slide_from_left" : @(RNSScreenStackAnimationSlideFromLeft),
      @"ios_from_right" : @(RNSScreenStackAnimationDefault),
      @"ios_from_left" : @(RNSScreenStackAnimationSlideFromLeft),
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
    UIStatusBarAnimation,
    (@{
      @"none" : @(UIStatusBarAnimationNone),
      @"fade" : @(UIStatusBarAnimationFade),
      @"slide" : @(UIStatusBarAnimationSlide)
    }),
    UIStatusBarAnimationNone,
    integerValue)

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

RCT_ENUM_CONVERTER(
    RNSScreenDetentType,
    (@{
      @"large" : @(RNSScreenDetentTypeLarge),
      @"medium" : @(RNSScreenDetentTypeMedium),
      @"all" : @(RNSScreenDetentTypeAll),
    }),
    RNSScreenDetentTypeAll,
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
