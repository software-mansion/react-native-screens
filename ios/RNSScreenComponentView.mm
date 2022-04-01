#import "RNSScreenComponentView.h"
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

using namespace facebook::react;

@interface RNSScreenComponentView () <RCTRNSScreenViewProtocol>
@end

@implementation RNSScreenComponentView {
  RNSScreenController *_controller;
  RNSScreenShadowNode::ConcreteState::Shared _state;
  RCTSurfaceTouchHandler *_touchHandler;
}

- (instancetype)initWithFrame:(CGRect)frame
{
  if (self = [super initWithFrame:frame]) {
    static const auto defaultProps = std::make_shared<const RNSScreenProps>();
    _props = defaultProps;
    _controller = [[RNSScreenController alloc] initWithView:self];
    // TODO: use default props (?)
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
    auto newState = RNSScreenState{RCTSizeFromCGSize(self.bounds.size)};
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
    std::dynamic_pointer_cast<const RNSScreenEventEmitter>(_eventEmitter)
        ->onWillAppear(RNSScreenEventEmitter::OnWillAppear{});
  }
}

- (void)notifyWillDisappear
{
  // If screen is already unmounted then there will be no event emitter
  // it will be cleaned in prepareForRecycle
  if (_eventEmitter != nullptr) {
    std::dynamic_pointer_cast<const RNSScreenEventEmitter>(_eventEmitter)
        ->onWillDisappear(RNSScreenEventEmitter::OnWillDisappear{});
  }
}

- (void)notifyAppear
{
  // If screen is already unmounted then there will be no event emitter
  // it will be cleaned in prepareForRecycle
  if (_eventEmitter != nullptr) {
    std::dynamic_pointer_cast<const RNSScreenEventEmitter>(_eventEmitter)->onAppear(RNSScreenEventEmitter::OnAppear{});
  }
}

- (void)notifyDismissedWithCount:(int)dismissCount
{
  // If screen is already unmounted then there will be no event emitter
  // it will be cleaned in prepareForRecycle
  if (_eventEmitter != nullptr) {
    std::dynamic_pointer_cast<const RNSScreenEventEmitter>(_eventEmitter)
        ->onDismissed(RNSScreenEventEmitter::OnDismissed{dismissCount : dismissCount});
  }
}

- (void)notifyDisappear
{
  // If screen is already unmounted then there will be no event emitter
  // it will be cleaned in prepareForRecycle
  if (_eventEmitter != nullptr) {
    std::dynamic_pointer_cast<const RNSScreenEventEmitter>(_eventEmitter)
        ->onDisappear(RNSScreenEventEmitter::OnDisappear{});
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

+ (ComponentDescriptorProvider)componentDescriptorProvider
{
  return concreteComponentDescriptorProvider<RNSScreenComponentDescriptor>();
}

- (void)updateProps:(Props::Shared const &)props oldProps:(Props::Shared const &)oldProps
{
  const auto &oldScreenProps = *std::static_pointer_cast<const RNSScreenProps>(_props);
  const auto &newScreenProps = *std::static_pointer_cast<const RNSScreenProps>(props);

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
  _state = std::static_pointer_cast<const RNSScreenShadowNode::ConcreteState>(state);
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

RCT_ENUM_CONVERTER(
    UIStatusBarAnimation,
    (@{
      @"none" : @(UIStatusBarAnimationNone),
      @"fade" : @(UIStatusBarAnimationFade),
      @"slide" : @(UIStatusBarAnimationSlide)
    }),
    UIStatusBarAnimationNone,
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
