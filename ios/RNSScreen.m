#import <UIKit/UIKit.h>

#import "RNSScreen.h"
#import "RNSScreenContainer.h"
#import "RNSScreenStack.h"
#import "RNSScreenStackHeaderConfig.h"

#import <React/RCTUIManager.h>
#import <React/RCTShadowView.h>
#import <React/RCTTouchHandler.h>

@interface RNSScreenView () <UIAdaptivePresentationControllerDelegate, RCTInvalidating>
@end

@implementation RNSScreenView {
  __weak RCTBridge *_bridge;
  RNSScreen *_controller;
  RCTTouchHandler *_touchHandler;
}

@synthesize controller = _controller;

- (instancetype)initWithBridge:(RCTBridge *)bridge
{
  if (self = [super init]) {
    _bridge = bridge;
    _controller = [[RNSScreen alloc] initWithView:self];
    _stackPresentation = RNSScreenStackPresentationPush;
    _stackAnimation = RNSScreenStackAnimationDefault;
    _gestureEnabled = YES;
    _replaceAnimation = RNSScreenReplaceAnimationPop;
    _dismissed = NO;
  }

  return self;
}

- (void)reactSetFrame:(CGRect)frame
{
  if (![self.reactViewController.parentViewController
        isKindOfClass:[UINavigationController class]]) {
    [super reactSetFrame:frame];
  }
  // when screen is mounted under UINavigationController it's size is controller
  // by the navigation controller itself. That is, it is set to fill space of
  // the controller. In that case we ignore react layout system from managing
  // the screen dimentions and we wait for the screen VC to update and then we
  // pass the dimentions to ui view manager to take into account when laying out
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

- (void)setActive:(BOOL)active
{
  if (active != _active) {
    _active = active;
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
#ifdef __IPHONE_13_0
      if (@available(iOS 13.0, *)) {
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
#if (TARGET_OS_IOS)
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
    // Documented here: https://developer.apple.com/documentation/uikit/uiviewcontroller/1621426-presentationcontroller?language=objc
    _controller.presentationController.delegate = self;
  } else if (_stackPresentation != RNSScreenStackPresentationPush) {
    RCTLogError(@"Screen presentation updated from modal to push, this may likely result in a screen object leakage. If you need to change presentation style create a new screen object instead");
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
#if (TARGET_OS_IOS)
    case RNSScreenStackAnimationFlip:
      _controller.modalTransitionStyle = UIModalTransitionStyleFlipHorizontal;
      break;
#endif
    case RNSScreenStackAnimationNone:
    case RNSScreenStackAnimationDefault:
      // Default
      break;
  }
}


- (void)setGestureEnabled:(BOOL)gestureEnabled
{
  #ifdef __IPHONE_13_0
    if (@available(iOS 13.0, *)) {
      _controller.modalInPresentation = !gestureEnabled;
    }
  #endif

  _gestureEnabled = gestureEnabled;
}

- (void)setReplaceAnimation:(RNSScreenReplaceAnimation)replaceAnimation
{
  _replaceAnimation = replaceAnimation;
}

- (UIView *)reactSuperview
{
  return _reactSuperview;
}

- (void)addSubview:(UIView *)view
{
  if (![view isKindOfClass:[RNSScreenStackHeaderConfig class]]) {
    [super addSubview:view];
  } else {
    ((RNSScreenStackHeaderConfig*) view).screenView = self;
  }
}

- (void)notifyFinishTransitioning
{
  [_controller notifyFinishTransitioning];
}

- (void)notifyDismissed
{
  _dismissed = YES;
  if (self.onDismissed) {
    dispatch_async(dispatch_get_main_queue(), ^{
      if (self.onDismissed) {
        self.onDismissed(nil);
      }
    });
  }
}

- (void)notifyWillAppear
{
  if (self.onWillAppear) {
    self.onWillAppear(nil);
  }
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

- (BOOL)presentationControllerShouldDismiss:(UIPresentationController *)presentationController
{
  return _gestureEnabled;
}

- (void)presentationControllerDidDismiss:(UIPresentationController *)presentationController
{
  if ([_reactSuperview respondsToSelector:@selector(presentationControllerDidDismiss:)]) {
    [_reactSuperview performSelector:@selector(presentationControllerDidDismiss:)
                          withObject:presentationController];
  }
}

- (void)invalidate
{
  _controller = nil;
}

@end

@implementation RNSScreen {
  __weak id _previousFirstResponder;
  CGRect _lastViewFrame;
}

- (instancetype)initWithView:(UIView *)view
{
  if (self = [super init]) {
    self.view = view;
  }
  return self;
}

- (UIStatusBarStyle)preferredStatusBarStyle
{
  UIViewController *child = [[self childViewControllers] lastObject];
  if ([child isKindOfClass:[RNScreensNavigationController class]] || [child isKindOfClass:[RNScreensViewController class]]) {
    return child.preferredStatusBarStyle;
  }
  RNSScreenStackHeaderConfig *config = [self findConfigForScreen];
  return [self statusBarStyleForRNSStatusBarStyle:config && config.statusBarStyle ? config.statusBarStyle : RNSStatusBarStyleAuto];
}

- (UIStatusBarAnimation)preferredStatusBarUpdateAnimation
{
  UIViewController *child = [[self childViewControllers] lastObject];
  if ([child isKindOfClass:[RNScreensNavigationController class]] || [child isKindOfClass:[RNScreensViewController class]]) {
    return child.preferredStatusBarUpdateAnimation;
  }
  RNSScreenStackHeaderConfig *config = [self findConfigForScreen];
  return config && config.statusBarAnimation ? config.statusBarAnimation : UIStatusBarAnimationFade;
}

- (BOOL)prefersStatusBarHidden
{
  UIViewController *child = [[self childViewControllers] lastObject];
  if ([child isKindOfClass:[RNScreensNavigationController class]] || [child isKindOfClass:[RNScreensViewController class]]) {
    if ([child childViewControllerForStatusBarHidden]) {
      return [child childViewControllerForStatusBarHidden].prefersStatusBarHidden;
    }
  }
  RNSScreenStackHeaderConfig *config = [self findConfigForScreen];
  return config && config.statusBarHidden ? config.statusBarHidden : NO;
}

- (UIInterfaceOrientationMask)supportedInterfaceOrientations
{
  UIViewController *presentedVC = [self presentedViewController];
  if ([presentedVC isKindOfClass:[RNSScreen class]]) {
    return presentedVC.supportedInterfaceOrientations;
  }

  UIViewController *child = [[self childViewControllers] lastObject];
  if ([child isKindOfClass:[RNScreensNavigationController class]] || [child isKindOfClass:[RNScreensViewController class]]) {
    return child.supportedInterfaceOrientations;
  }
  RNSScreenStackHeaderConfig *config = [self findConfigForScreen];
  return config && config.screenOrientation ? config.screenOrientation : UIInterfaceOrientationMaskAllButUpsideDown;
}

- (RNSScreenStackHeaderConfig *)findConfigForScreen
{
  // if there is no child navigator and the parent is `RNSScreenContainer`, we should fallback to the parent's (that is not `RNSScreenContainer`) option
  UIViewController *parent = [self parentViewController];
  while ([parent isKindOfClass:[RNScreensViewController class]] || [parent isKindOfClass:[RNSScreen class]]) {
    if ([parent parentViewController] == nil && [parent isKindOfClass:[RNSScreen class]]) {
      // we are at the top of hierarchy and the controller is RNSScreen so we are in modal screen
      break;
    } else {
      parent = [parent parentViewController];
    }
  }
  RNSScreenView *screenView = [parent isKindOfClass:[RNScreensNavigationController class]]
    ? ((RNSScreenView *)[[[parent childViewControllers] lastObject] view])
    : [parent isKindOfClass:[RNSScreen class]] ? ((RNSScreenView *)parent.view) : ((RNSScreenView *)self.view);
  RNSScreenStackHeaderConfig *config = nil;
  for (UIView *subview in screenView.reactSubviews) {
    if ([subview isKindOfClass:[RNSScreenStackHeaderConfig class]]) {
      config = (RNSScreenStackHeaderConfig*) subview;
      break;
    }
  }
  return config;
}

- (void)viewDidLayoutSubviews
{
  [super viewDidLayoutSubviews];

  if (!CGRectEqualToRect(_lastViewFrame, self.view.frame)) {
    _lastViewFrame = self.view.frame;
    [((RNSScreenView *)self.viewIfLoaded) updateBounds];
  }
}

- (id)findFirstResponder:(UIView*)parent
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

- (void)willMoveToParentViewController:(UIViewController *)parent
{
  [super willMoveToParentViewController:parent];
  if (parent == nil) {
    id responder = [self findFirstResponder:self.view];
    if (responder != nil) {
      _previousFirstResponder = responder;
    }
  }
}

- (void)viewWillAppear:(BOOL)animated
{
  [super viewWillAppear:animated];
  [self updateStatusBarAppearance];
  [RNSScreen enforceDesiredDeviceOrientationWithOrientationMask:self.supportedInterfaceOrientations];
  [((RNSScreenView *)self.view) notifyWillAppear];
}

- (void)viewWillDisappear:(BOOL)animated
{
  [super viewWillDisappear:animated];

  [((RNSScreenView *)self.view) notifyWillDisappear];
}

- (void)viewDidAppear:(BOOL)animated
{
  [super viewDidAppear:animated];
  [((RNSScreenView *)self.view) notifyAppear];
}

- (void)viewDidDisappear:(BOOL)animated
{
  [super viewDidDisappear:animated];

  [((RNSScreenView *)self.view) notifyDisappear];
  if (self.parentViewController == nil && self.presentingViewController == nil) {
    // screen dismissed, send event
    [((RNSScreenView *)self.view) notifyDismissed];
  }
  [self traverseForScrollView:self.view];
}

- (void)traverseForScrollView:(UIView*)view
{
  if([view isKindOfClass:[UIScrollView class]] && ([[(UIScrollView*)view delegate] respondsToSelector:@selector(scrollViewDidEndDecelerating:)]) ) {
    [[(UIScrollView*)view delegate] scrollViewDidEndDecelerating:(id)view];
  }
  [view.subviews enumerateObjectsUsingBlock:^(__kindof UIView * _Nonnull obj, NSUInteger idx, BOOL * _Nonnull stop) {
    [self traverseForScrollView:obj];
  }];
}

- (void)notifyFinishTransitioning
{
  [_previousFirstResponder becomeFirstResponder];
  _previousFirstResponder = nil;
}

+ (UIInterfaceOrientation)defaultOrientationForOrientationMask:(UIInterfaceOrientationMask)orientationMask
{
  if (UIInterfaceOrientationMaskPortrait & orientationMask) {
    return UIInterfaceOrientationPortrait;
  } else if (UIInterfaceOrientationMaskLandscapeLeft & orientationMask) {
    return UIInterfaceOrientationLandscapeLeft;
  } else if (UIInterfaceOrientationMaskLandscapeRight & orientationMask) {
    return UIInterfaceOrientationLandscapeRight;
  } else if (UIInterfaceOrientationMaskPortraitUpsideDown & orientationMask) {
    return UIInterfaceOrientationPortraitUpsideDown;
  }
  return UIInterfaceOrientationUnknown;
}

+ (UIInterfaceOrientation)interfaceOrientationFromDeviceOrientation:(UIDeviceOrientation)deviceOrientation
{
   switch (deviceOrientation) {
     case UIDeviceOrientationPortrait:
       return UIInterfaceOrientationPortrait;
     case UIDeviceOrientationPortraitUpsideDown:
       return UIInterfaceOrientationPortraitUpsideDown;
     // UIDevice and UIInterface landscape orientations are switched
     case UIDeviceOrientationLandscapeLeft:
       return UIInterfaceOrientationLandscapeRight;
     case UIDeviceOrientationLandscapeRight:
       return UIInterfaceOrientationLandscapeLeft;
     default:
       return UIInterfaceOrientationUnknown;
   }
}
  
+ (UIInterfaceOrientationMask)maskFromOrientation:(UIInterfaceOrientation)orientation
{
  return 1 << orientation;
}

+ (void)enforceDesiredDeviceOrientationWithOrientationMask:(UIInterfaceOrientationMask)orientationMask
{
  dispatch_async(dispatch_get_main_queue(), ^{
    UIInterfaceOrientation currentDeviceOrientation = [RNSScreen interfaceOrientationFromDeviceOrientation:[[UIDevice currentDevice] orientation]];
    UIInterfaceOrientation currentInterfaceOrientation = [RNSScreen interfaceOrientation];
    UIInterfaceOrientation newOrientation = UIInterfaceOrientationUnknown;
    if ([RNSScreen maskFromOrientation:currentDeviceOrientation] & orientationMask) {
      if (!([RNSScreen maskFromOrientation:currentInterfaceOrientation] & orientationMask)) {
        // if the device orientation is in the mask, but interface orientation is not, we rotate to device's orientation
        newOrientation = currentDeviceOrientation;
      } else {
        if (currentDeviceOrientation != currentInterfaceOrientation) {
          // if both device orientation and interface orientation are in the mask, but in different orientations, we rotate to device's orientation
          newOrientation = currentDeviceOrientation;
        }
      }
    } else {
      if (!([RNSScreen maskFromOrientation:currentInterfaceOrientation] & orientationMask)) {
        // if both device orientation and interface orientation are not in the mask, we rotate to closest available rotation from mask
        newOrientation = [RNSScreen defaultOrientationForOrientationMask:orientationMask];
      } else {
        // if the device orientation is not in the mask, but interface orientation is in the mask, do nothing
      }
    }
    if (newOrientation != UIInterfaceOrientationUnknown) {
      [[UIDevice currentDevice] setValue:@(newOrientation) forKey:@"orientation"];
      [UIViewController attemptRotationToDeviceOrientation];
    }
  });
}

// based on https://stackoverflow.com/questions/57965701/statusbarorientation-was-deprecated-in-ios-13-0-when-attempting-to-get-app-ori/61249908#61249908
+ (UIInterfaceOrientation)interfaceOrientation
{
    if (@available(iOS 13.0, *)) {
        UIWindow *firstWindow = [[[UIApplication sharedApplication] windows] firstObject];
        if (firstWindow == nil) {
          return UIInterfaceOrientationUnknown;
        }
        UIWindowScene *windowScene = firstWindow.windowScene;
        if (windowScene == nil) {
          return UIInterfaceOrientationUnknown;
        }
        return windowScene.interfaceOrientation;
    } else {
        return UIApplication.sharedApplication.statusBarOrientation;
    }
}

// duration based on "Programming iOS 13" p. 311 implementation
- (void)updateStatusBarAppearance
{
  self.modalPresentationCapturesStatusBarAppearance = YES;
  [UIView animateWithDuration:0.4 animations:^{
    [self setNeedsStatusBarAppearanceUpdate];
  }];
}

- (UIStatusBarStyle)statusBarStyleForRNSStatusBarStyle:(RNSStatusBarStyle)statusBarStyle
{
#ifdef __IPHONE_13_0
  if (@available(iOS 13.0, *)) {
    switch (statusBarStyle) {
      case RNSStatusBarStyleAuto:
          return [[self traitCollection] userInterfaceStyle] == UIUserInterfaceStyleDark ? UIStatusBarStyleLightContent : UIStatusBarStyleDarkContent;
      case RNSStatusBarStyleInverted:
          return [[self traitCollection] userInterfaceStyle] == UIUserInterfaceStyleDark ? UIStatusBarStyleDarkContent : UIStatusBarStyleLightContent;
      case RNSStatusBarStyleLight:
          return UIStatusBarStyleLightContent;
      case RNSStatusBarStyleDark:
          return UIStatusBarStyleDarkContent;
      default:
        return UIStatusBarStyleLightContent;
    }
  }
#endif
  return UIStatusBarStyleLightContent;
}

@end

@implementation RNSScreenManager

RCT_EXPORT_MODULE()

RCT_EXPORT_VIEW_PROPERTY(active, BOOL)
RCT_EXPORT_VIEW_PROPERTY(gestureEnabled, BOOL)
RCT_EXPORT_VIEW_PROPERTY(replaceAnimation, RNSScreenReplaceAnimation)
RCT_EXPORT_VIEW_PROPERTY(stackPresentation, RNSScreenStackPresentation)
RCT_EXPORT_VIEW_PROPERTY(stackAnimation, RNSScreenStackAnimation)
RCT_EXPORT_VIEW_PROPERTY(onWillAppear, RCTDirectEventBlock);
RCT_EXPORT_VIEW_PROPERTY(onWillDisappear, RCTDirectEventBlock);
RCT_EXPORT_VIEW_PROPERTY(onAppear, RCTDirectEventBlock);
RCT_EXPORT_VIEW_PROPERTY(onDisappear, RCTDirectEventBlock);
RCT_EXPORT_VIEW_PROPERTY(onDismissed, RCTDirectEventBlock);

- (UIView *)view
{
  return [[RNSScreenView alloc] initWithBridge:self.bridge];
}

@end

@implementation RCTConvert (RNSScreen)

RCT_ENUM_CONVERTER(RNSScreenStackPresentation, (@{
                                                  @"push": @(RNSScreenStackPresentationPush),
                                                  @"modal": @(RNSScreenStackPresentationModal),
                                                  @"fullScreenModal": @(RNSScreenStackPresentationFullScreenModal),
                                                  @"formSheet": @(RNSScreenStackPresentationFormSheet),
                                                  @"containedModal": @(RNSScreenStackPresentationContainedModal),
                                                  @"transparentModal": @(RNSScreenStackPresentationTransparentModal),
                                                  @"containedTransparentModal": @(RNSScreenStackPresentationContainedTransparentModal)
                                                  }), RNSScreenStackPresentationPush, integerValue)

RCT_ENUM_CONVERTER(RNSScreenStackAnimation, (@{
                                                  @"default": @(RNSScreenStackAnimationDefault),
                                                  @"none": @(RNSScreenStackAnimationNone),
                                                  @"fade": @(RNSScreenStackAnimationFade),
                                                  @"flip": @(RNSScreenStackAnimationFlip),
                                                  }), RNSScreenStackAnimationDefault, integerValue)

RCT_ENUM_CONVERTER(RNSScreenReplaceAnimation, (@{
                                                  @"push": @(RNSScreenReplaceAnimationPush),
                                                  @"pop": @(RNSScreenReplaceAnimationPop),
                                                  }), RNSScreenReplaceAnimationPop, integerValue)

@end
