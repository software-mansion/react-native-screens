#import "RNSScreenComponentView.h"
#import "RNSConvert.h"
#import "RNSScreenStackHeaderConfigComponentView.h"
#import "RNSScreenWindowTraits.h"

#import <React/RCTConversions.h>

#import <react/renderer/components/rnscreens/EventEmitters.h>
#import <react/renderer/components/rnscreens/Props.h>
#import <react/renderer/components/rnscreens/RCTComponentViewHelpers.h>
#import <rnscreens/RNSScreenComponentDescriptor.h>

#import "RCTFabricComponentsPlugins.h"

#import <React/RCTRootComponentView.h>
#import <React/RCTSurfaceTouchHandler.h>

@interface RNSScreenComponentView () <RCTRNSScreenViewProtocol, UIAdaptivePresentationControllerDelegate>
@end

@implementation RNSScreenComponentView {
  RNSScreenController *_controller;
  facebook::react::RNSScreenShadowNode::ConcreteState::Shared _state;
  RCTSurfaceTouchHandler *_touchHandler;
}

- (instancetype)initWithFrame:(CGRect)frame
{
  if (self = [super initWithFrame:frame]) {
    static const auto defaultProps = std::make_shared<const facebook::react::RNSScreenProps>();
    _props = defaultProps;
    _controller = [[RNSScreenController alloc] initWithView:self];
    // TODO: use default props (?)
    _stackAnimation = RNSScreenStackAnimationDefault;
    _stackPresentation = RNSScreenStackPresentationPush;
    _hasStatusBarHiddenSet = NO;
    _hasStatusBarStyleSet = NO;
    _gestureEnabled = YES;
    _hasStatusBarAnimationSet = NO;
    _hasOrientationSet = NO;
    _hasHomeIndicatorHiddenSet = NO;
  }

  return self;
}

- (void)mountChildComponentView:(UIView<RCTComponentViewProtocol> *)childComponentView index:(NSInteger)index
{
  [super mountChildComponentView:childComponentView index:index];
  if ([childComponentView isKindOfClass:[RNSScreenStackHeaderConfigComponentView class]]) {
    _config = childComponentView;
    ((RNSScreenStackHeaderConfigComponentView *)childComponentView).screenView = self;
  }
}

- (void)unmountChildComponentView:(UIView<RCTComponentViewProtocol> *)childComponentView index:(NSInteger)index
{
  if ([childComponentView isKindOfClass:[RNSScreenStackHeaderConfigComponentView class]]) {
    _config = nil;
  }
  [super unmountChildComponentView:childComponentView index:index];
}

- (void)updateBounds
{
  if (_state != nullptr) {
    auto newState = facebook::react::RNSScreenState{RCTSizeFromCGSize(self.bounds.size)};
    _state->updateState(std::move(newState));
    UINavigationController *navctr = _controller.navigationController;
    [navctr.view setNeedsLayout];
  }
}

- (UIView *)reactSuperview
{
  return _reactSuperview;
}

- (UIViewController *)reactViewController
{
  return _controller;
}

- (void)notifyWillAppear
{
  // If screen is already unmounted then there will be no event emitter
  // it will be cleaned in prepareForRecycle
  if (_eventEmitter != nullptr) {
    std::dynamic_pointer_cast<const facebook::react::RNSScreenEventEmitter>(_eventEmitter)
        ->onWillAppear(facebook::react::RNSScreenEventEmitter::OnWillAppear{});
  }
}

- (void)notifyWillDisappear
{
  // If screen is already unmounted then there will be no event emitter
  // it will be cleaned in prepareForRecycle
  if (_eventEmitter != nullptr) {
    std::dynamic_pointer_cast<const facebook::react::RNSScreenEventEmitter>(_eventEmitter)
        ->onWillDisappear(facebook::react::RNSScreenEventEmitter::OnWillDisappear{});
  }
}

- (void)notifyAppear
{
  // If screen is already unmounted then there will be no event emitter
  // it will be cleaned in prepareForRecycle
  if (_eventEmitter != nullptr) {
    std::dynamic_pointer_cast<const facebook::react::RNSScreenEventEmitter>(_eventEmitter)
        ->onAppear(facebook::react::RNSScreenEventEmitter::OnAppear{});
  }
}

- (void)notifyDismissedWithCount:(int)dismissCount
{
  // If screen is already unmounted then there will be no event emitter
  // it will be cleaned in prepareForRecycle
  if (_eventEmitter != nullptr) {
    std::dynamic_pointer_cast<const facebook::react::RNSScreenEventEmitter>(_eventEmitter)
        ->onDismissed(facebook::react::RNSScreenEventEmitter::OnDismissed{dismissCount : dismissCount});
  }
}

- (void)notifyDisappear
{
  // If screen is already unmounted then there will be no event emitter
  // it will be cleaned in prepareForRecycle
  if (_eventEmitter != nullptr) {
    std::dynamic_pointer_cast<const facebook::react::RNSScreenEventEmitter>(_eventEmitter)
        ->onDisappear(facebook::react::RNSScreenEventEmitter::OnDisappear{});
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

#if !TARGET_OS_TV
- (void)setStatusBarHidden:(BOOL)statusBarHidden
{
  _statusBarHidden = statusBarHidden;
  _hasStatusBarHiddenSet = YES;
  [RNSScreenWindowTraits assertViewControllerBasedStatusBarAppearenceSet];
  [RNSScreenWindowTraits updateStatusBarAppearance];
}

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

- (BOOL)isMountedUnderScreenOrReactRoot
{
  for (UIView *parent = self.superview; parent != nil; parent = parent.superview) {
    if ([parent isKindOfClass:[RCTRootComponentView class]] || [parent isKindOfClass:[RNSScreenComponentView class]]) {
      return YES;
    }
  }
  return NO;
}

- (void)didMoveToWindow
{
  if (self.window != nil && ![self isMountedUnderScreenOrReactRoot]) {
    if (_touchHandler == nil) {
      _touchHandler = [RCTSurfaceTouchHandler new];
    }
    [_touchHandler attachToView:self];
  } else {
    [_touchHandler detachFromView:self];
  }
}

- (RCTSurfaceTouchHandler *)touchHandler
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

#pragma mark - RCTComponentViewProtocol

- (void)prepareForRecycle
{
  [super prepareForRecycle];
  // TODO: Make sure that there is no edge case when this should be uncommented
  // _controller=nil;
  _state.reset();
}

+ (facebook::react::ComponentDescriptorProvider)componentDescriptorProvider
{
  return facebook::react::concreteComponentDescriptorProvider<facebook::react::RNSScreenComponentDescriptor>();
}

- (void)updateProps:(facebook::react::Props::Shared const &)props
           oldProps:(facebook::react::Props::Shared const &)oldProps
{
  const auto &oldScreenProps = *std::static_pointer_cast<const facebook::react::RNSScreenProps>(_props);
  const auto &newScreenProps = *std::static_pointer_cast<const facebook::react::RNSScreenProps>(props);

  [self setFullScreenSwipeEnabled:newScreenProps.fullScreenSwipeEnabled];

  [self setGestureEnabled:newScreenProps.gestureEnabled];

  [self setTransitionDuration:[NSNumber numberWithInt:newScreenProps.transitionDuration]];

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

  if (newScreenProps.stackPresentation != oldScreenProps.stackPresentation) {
    [self
        setStackPresentation:[RNSConvert RNSScreenStackPresentationFromCppEquivalent:newScreenProps.stackPresentation]];
  }

  if (newScreenProps.stackAnimation != oldScreenProps.stackAnimation) {
    [self setStackAnimation:[RNSConvert RNSScreenStackAnimationFromCppEquivalent:newScreenProps.stackAnimation]];
  }

  if (newScreenProps.statusBarColor) {
    [self logPropNotAvailable:@"statusBarColor"];
  }

  if (newScreenProps.statusBarTranslucent) {
    [self logPropNotAvailable:@"statusBarTranslucent"];
  }

  [self setFullScreenSwipeEnabled:newScreenProps.fullScreenSwipeEnabled];

  [self setGestureEnabled:newScreenProps.gestureEnabled];

  if (newScreenProps.statusBarHidden != oldScreenProps.statusBarHidden) {
    [self setStatusBarHidden:newScreenProps.statusBarHidden];
  }

  if (newScreenProps.statusBarStyle != oldScreenProps.statusBarStyle) {
    [self setStatusBarStyle:[RCTConvert RNSStatusBarStyle:[self stringToPropValue:newScreenProps.statusBarStyle]]];
  }

  if (newScreenProps.statusBarAnimation != oldScreenProps.statusBarAnimation) {
    [self setStatusBarAnimation:[RCTConvert
                                    UIStatusBarAnimation:[self stringToPropValue:newScreenProps.statusBarAnimation]]];
  }

  if (newScreenProps.screenOrientation != oldScreenProps.screenOrientation) {
    [self
        setScreenOrientation:[RCTConvert
                                 UIInterfaceOrientationMask:[self stringToPropValue:newScreenProps.screenOrientation]]];
  }

  if (newScreenProps.statusBarColor) {
    [self logPropNotAvailable:@"statusBarColor"];
  }

  if (newScreenProps.statusBarTranslucent) {
    [self logPropNotAvailable:@"statusBarTranslucent"];
  }

  [super updateProps:props oldProps:oldProps];

  _fullScreenSwipeEnabled = newScreenProps.fullScreenSwipeEnabled;
  _gestureEnabled = newScreenProps.gestureEnabled;
}

- (void)updateState:(facebook::react::State::Shared const &)state
           oldState:(facebook::react::State::Shared const &)oldState
{
  _state = std::static_pointer_cast<const facebook::react::RNSScreenShadowNode::ConcreteState>(state);
}

#pragma mark - Util

- (void)logPropNotAvailable:(NSString *)propName
{
  NSLog(@"%@ prop not available on iOS", propName);
}

- (NSString *)stringToPropValue:(std::string)value
{
  if (value.empty())
    return nil;
  return [[NSString alloc] initWithUTF8String:value.c_str()];
}
@end

Class<RCTComponentViewProtocol> RNSScreenCls(void)
{
  return RNSScreenComponentView.class;
}

@implementation RCTConvert (RNSScreenComponentView)

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
