#import <UIKit/UIKit.h>

#import "RNSScreen.h"
#import "RNSScreenStackHeaderConfig.h"
#import "RNSScreenContainer.h"
#import "RNSTransitionProgressEvent.h"

#import <React/RCTUIManager.h>
#import <React/RCTShadowView.h>
#import <React/RCTTouchHandler.h>
#import <React/RCTEventDispatcher.h>
#import <React/RCTImageView.h>

// same hack as in header
@interface RCTImageView (Private)
- (UIImage*)image;
@end

@interface RNSScreenView () <UIAdaptivePresentationControllerDelegate, RCTInvalidating>
@end

@implementation RNSScreenView {
  RNSScreen *_controller;
  RCTTouchHandler *_touchHandler;
  CGRect _reactFrame;
  RCTEventDispatcher *_eventDispatcher;
}

@synthesize controller = _controller;

- (instancetype)initWithBridge:(RCTBridge *)bridge
{
  if (self = [super init]) {
    _bridge = bridge;
    _eventDispatcher = bridge.eventDispatcher;
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
  _reactFrame = frame;
  UIViewController *parentVC = self.reactViewController.parentViewController;
  if (parentVC != nil && ![parentVC isKindOfClass:[UINavigationController class]]) {
    [super reactSetFrame:frame];
  }
  // when screen is mounted under UINavigationController it's size is controller
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
#if !TARGET_OS_TV
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
#if defined(__IPHONE_OS_VERSION_MAX_ALLOWED) && defined(__IPHONE_13_0) && \
    __IPHONE_OS_VERSION_MAX_ALLOWED >= __IPHONE_13_0
  if (@available(iOS 13.0, *)) {
    _controller.modalInPresentation = !gestureEnabled;
  }
#endif

  _gestureEnabled = gestureEnabled;
}

- (void)setSharedElements:(NSArray *)sharedElements
{
  _sharedElements = sharedElements;
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

- (void)notifyTransitionProgress:(double)progress closing:(BOOL)closing
{
  [_eventDispatcher sendEvent:[[RNSTransitionProgressEvent alloc] initWithReactTag:self.reactTag progress:progress closing:closing]];
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
  while (parent != nil && ![parent respondsToSelector:@selector(touchHandler)]) parent = parent.superview;
  if (parent != nil) {
    return [parent performSelector:@selector(touchHandler)];
  }
  return nil;
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
  UIView *_fakeView;
  CADisplayLink *_animationTimer;
  CGFloat _currentAlpha;
  BOOL _closing;
  NSMutableArray<NSArray *> *_sharedElements;
  UIView *_containerView;
  UIView *_toView;
}

- (instancetype)initWithView:(UIView *)view
{
  if (self = [super init]) {
    self.view = view;
  }
  return self;
}

#if !TARGET_OS_TV
- (UIViewController *)childViewControllerForStatusBarStyle
{
  UIViewController *vc = [self findChildVCForConfigIncludingModals:NO];
  return vc == self ? nil : vc;
}

- (UIStatusBarStyle)preferredStatusBarStyle
{
  RNSScreenStackHeaderConfig *config = [self findScreenConfig];
  return [RNSScreenStackHeaderConfig statusBarStyleForRNSStatusBarStyle:config && config.statusBarStyle ? config.statusBarStyle : RNSStatusBarStyleAuto];
}

- (UIViewController *)childViewControllerForStatusBarHidden
{
  UIViewController *vc = [self findChildVCForConfigIncludingModals:NO];
  return vc == self ? nil : vc;
}

- (BOOL)prefersStatusBarHidden
{
  RNSScreenStackHeaderConfig *config = [self findScreenConfig];
  return config && config.statusBarHidden ? config.statusBarHidden : NO;
}

- (UIStatusBarAnimation)preferredStatusBarUpdateAnimation
{
  UIViewController *vc = [self findChildVCForConfigIncludingModals:NO];
  
  if ([vc isKindOfClass:[RNSScreen class]]) {
    RNSScreenStackHeaderConfig *config = [(RNSScreen *)vc findScreenConfig];
    return config && config.statusBarAnimation ? config.statusBarAnimation : UIStatusBarAnimationFade;
  }
  return UIStatusBarAnimationFade;
}

- (UIInterfaceOrientationMask)supportedInterfaceOrientations
{
  UIViewController *vc = [self findChildVCForConfigIncludingModals:YES];

  if ([vc isKindOfClass:[RNSScreen class]]) {
    RNSScreenStackHeaderConfig *config = [(RNSScreen *)vc findScreenConfig];
    return config && config.screenOrientation ? config.screenOrientation : UIInterfaceOrientationMaskAllButUpsideDown;
  }
  return UIInterfaceOrientationMaskAllButUpsideDown;
}

// if the returned vc is a child, it means that it can provide config;
// if the returned vc is self, it means that there is no child for config and self has config to provide,
// so we return self which results in asking self for preferredStatusBarStyle/Animation etc.;
// if the returned vc is nil, it means none of children could provide config and self does not have config either,
// so if it was asked by parent, it will fallback to parent's option, or use default option if it is the top Screen
- (UIViewController *)findChildVCForConfigIncludingModals:(BOOL)includingModals
{
  UIViewController *lastViewController = [[self childViewControllers] lastObject];
  if ([self.presentedViewController isKindOfClass:[RNSScreen class]]) {
    lastViewController = self.presentedViewController;
    // we don't want to allow controlling of status bar appearance when we present non-fullScreen modal
    // and it is not possible if `modalPresentationCapturesStatusBarAppearance` is not set to YES, so even
    // if we went into a modal here and ask it, it wouldn't take any effect. For fullScreen modals, the system
    // asks them by itself, so we can stop traversing here.
    // for screen orientation, we need to start the search again from that modal
    return !includingModals ? nil : [(RNSScreen *)lastViewController findChildVCForConfigIncludingModals:includingModals] ?: lastViewController;
  }

  UIViewController *selfOrNil = [self findScreenConfig] != nil ? self : nil;
  if (lastViewController == nil) {
    return selfOrNil;
  } else {
    if ([lastViewController conformsToProtocol:@protocol(RNScreensViewControllerDelegate)]) {
      // If there is a child (should be VC of ScreenContainer or ScreenStack), that has a child that could provide config,
      // we recursively go into its findChildVCForConfig, and if one of the children has the config, we return it,
      // otherwise we return self if this VC has config, and nil if it doesn't
      // we use `childViewControllerForStatusBarStyle` for all options since the behavior is the same for all of them
      UIViewController *childScreen = [lastViewController childViewControllerForStatusBarStyle];
      if ([childScreen isKindOfClass:[RNSScreen class]]) {
        return [(RNSScreen *)childScreen findChildVCForConfigIncludingModals:includingModals] ?: selfOrNil;
      } else {
        return selfOrNil;
      }
    } else {
      // child vc is not from this library, so we don't ask it
      return selfOrNil;
    }
  }
}
#endif

- (RNSScreenStackHeaderConfig *)findScreenConfig
{
  for (UIView *subview in self.view.reactSubviews) {
    if ([subview isKindOfClass:[RNSScreenStackHeaderConfig class]]) {
      return (RNSScreenStackHeaderConfig *)subview;
    }
  }
  return nil;
}

- (void)viewDidLayoutSubviews
{
  [super viewDidLayoutSubviews];

  // The below code makes the screen view adapt dimensions provided by the system. We take these
  // into account only when the view is mounted under UINavigationController in which case system
  // provides additional padding to account for possible header, and in the case when screen is
  // shown as a native modal, as the final dimensions of the modal on iOS 12+ are shorter than the
  // screen size
  BOOL isDisplayedWithinUINavController = [self.parentViewController isKindOfClass:[UINavigationController class]];
  BOOL isPresentedAsNativeModal = self.parentViewController == nil && self.presentingViewController != nil;
  if ((isDisplayedWithinUINavController || isPresentedAsNativeModal) && !CGRectEqualToRect(_lastViewFrame, self.view.frame)) {
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
  [RNSScreenStackHeaderConfig updateWindowTraits];
  [((RNSScreenView *)self.view) notifyWillAppear];
  _closing = NO;
  [self setupProgressNotification];
}

- (void)viewWillDisappear:(BOOL)animated
{
  [super viewWillDisappear:animated];

  [((RNSScreenView *)self.view) notifyWillDisappear];
  _closing = YES;
  [self setupProgressNotification];
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
  // the correct Screen for appearance is set after the transition, same for orientation.
  [RNSScreenStackHeaderConfig updateWindowTraits];
}

# pragma mark - transition progress related methods

- (void)setupProgressNotification
{
  if (self.transitionCoordinator != nil && !_isSendingProgress) {
    _isSendingProgress = YES;
    UIView *fakeView = [UIView new];
    fakeView.alpha = 0.0;
    _fakeView = fakeView;

    _sharedElements = [self prepareSharedElementsArray];

    [self.transitionCoordinator animateAlongsideTransition:^(id<UIViewControllerTransitionCoordinatorContext>  _Nonnull transitionContext) {
      self->_containerView = [transitionContext containerView];
      self->_toView = [transitionContext viewForKey:UITransitionContextToViewKey];
      [[transitionContext containerView] addSubview:fakeView];
      fakeView.alpha = 1.0;

      UIViewController* toViewController = [transitionContext viewControllerForKey:UITransitionContextToViewControllerKey];
      [toViewController.view setNeedsLayout];
      [toViewController.view layoutIfNeeded];
      if (self->_closing) {
        for (NSArray *sharedElement in self->_sharedElements) {
          UIView *endingView = sharedElement[1];
          UIView *snapshotView = sharedElement[2];
          [[transitionContext containerView] addSubview:snapshotView];
//          snapshotView.frame = endingView.frame;
          [self copyValuesFromView:endingView toSnapshot:snapshotView];
//          snapshotView.layer.backgroundColor = endingView.backgroundColor.CGColor;
          NSDictionary *originalValues = sharedElement[3];
          double endAlpha = [[originalValues objectForKey:@"endAlpha"] doubleValue];
          snapshotView.alpha = endAlpha;
//          snapshotView.layer.transform = endingView.layer.transform;
        }
      }
      self->_animationTimer = [CADisplayLink displayLinkWithTarget:self selector:@selector(handleAnimation)];
      [self->_animationTimer addToRunLoop:[NSRunLoop currentRunLoop] forMode:NSDefaultRunLoopMode];
    } completion:^(id<UIViewControllerTransitionCoordinatorContext>  _Nonnull context) {
      [self resetSharedViewsAndFakeView:fakeView];
    }];
  }
}

- (void)resetSharedViewsAndFakeView:(UIView *)fakeView
{
  for (NSArray *sharedElement in self->_sharedElements) {
    NSDictionary *originalValues = sharedElement[3];
    double startAlpha = [[originalValues objectForKey:@"startAlpha"] doubleValue];
    double endAlpha = [[originalValues objectForKey:@"endAlpha"] doubleValue];
    UIView *startingView = sharedElement[0];
    startingView.alpha = startAlpha;
    UIView *endingView = sharedElement[1];
    endingView.alpha = endAlpha;
    UIView *snapshotView = sharedElement[2];
    [snapshotView removeFromSuperview];
  }
  self->_sharedElements = nil;
  
  [self->_animationTimer setPaused:YES];
  [self->_animationTimer invalidate];
  self->_fakeView = nil;
  [fakeView removeFromSuperview];
  self->_isSendingProgress = NO;
  self->_containerView = nil;
  self->_toView = nil;
}

- (void)handleAnimation
{
  if (_fakeView != nil && _fakeView.layer != nil && _fakeView.layer.presentationLayer != nil) {
    CGFloat fakeViewAlpha = [_fakeView.layer.presentationLayer opacity];
    if (_currentAlpha != fakeViewAlpha) {
      _currentAlpha = fmax(0.0, fmin(1.0, fakeViewAlpha));
      [self notifyTransitionProgress:_currentAlpha];
      [self updateSharedElements:_currentAlpha];
    }
  }
}

- (void)updateSharedElements:(double)progress
{
  [self calculateFramesOfSharedElements:progress];
}

- (void)calculateFramesOfSharedElements:(double)progress
{
  for (NSArray *sharedElement in _sharedElements) {
    UIView *to = sharedElement[1];
    UIView *snapshotView = sharedElement[2];
    NSDictionary *originalValues = sharedElement[3];
    CGRect startFrame = [[originalValues objectForKey:@"convertedStartFrame"] CGRectValue];
    CGRect toFrame = [_containerView convertRect:to.frame fromView:_toView];
    snapshotView.frame = CGRectMake([RNSScreen interpolateWithFrom:startFrame.origin.x to:toFrame.origin.x progress:progress],
                                          [RNSScreen interpolateWithFrom:startFrame.origin.y to:toFrame.origin.y progress:progress],
                                          [RNSScreen interpolateWithFrom:startFrame.size.width to:toFrame.size.width progress:progress],
                                          [RNSScreen interpolateWithFrom:startFrame.size.height to:toFrame.size.height progress:progress]);
  }
}

+ (float)interpolateWithFrom:(double)from to:(double)to progress:(double)progress
{
    return from + progress * (to - from);
}

- (void)notifyTransitionProgress:(double)progress
{
  [((RNSScreenView *)self.view) notifyTransitionProgress:progress closing:_closing];
  // if we are in a modal, we want to send transition to the above screen too, which might not trigger appear/disappear events
  // e.g. when we are in iOS >= 13 default modal
  // we also check if we are not already sending the progress of transition and if it does not present another modal,
  // because otherwise we would send progress to the screen 2 levels higher then the current one
  if ([_presentingScreen isKindOfClass:[RNSScreen class]] && !_presentingScreen.isSendingProgress && self.presentedViewController == nil) {
    [((RNSScreenView *)_presentingScreen.view) notifyTransitionProgress:progress closing:!_closing];
  }
}

- (NSMutableArray<NSArray *> *)prepareSharedElementsArray
{
  NSMutableArray<NSArray *> *sharedElementsArray = [NSMutableArray new];
  
  if (_closing) {
    NSArray<__kindof UIViewController *> *viewControllers = self.navigationController.viewControllers;
    RNSScreenView *screenView = (RNSScreenView *)self.view;

    for (NSDictionary *sharedElementDict in screenView.sharedElements) {
      UIView *start;
      UIView *end;
      UIView *snapshot;
      
      NSString *fromID = sharedElementDict[@"fromID"];
      NSString *toID = sharedElementDict[@"toID"];
      if ([viewControllers containsObject:self]) {

        // we are in previous vc and going forward
        start = [[screenView bridge].uiManager viewForNativeID:fromID withRootTag:[(RNSScreenView *)self.view rootTag]];
        end = [[screenView bridge].uiManager viewForNativeID:toID withRootTag:[(RNSScreenView *)self.view rootTag]];
      } else {
        // we are in next vc and going back
        start = [[(RNSScreenView *)self.view bridge].uiManager viewForNativeID:toID withRootTag:[(RNSScreenView *)self.view rootTag]];
        end = [[(RNSScreenView *)self.view bridge].uiManager viewForNativeID:fromID withRootTag:[(RNSScreenView *)self.view rootTag]];
      }
      // we are always the vc that is going to be closed so the starting rect must be converted from our perspective
      CGRect startFrame = [self.transitionCoordinator.containerView convertRect:start.frame fromView:self.view];
      
      NSDictionary *originalValues = @{
        @"startAlpha": @(start.alpha),
        @"endAlpha": @(end.alpha),
        @"convertedStartFrame": @(startFrame),
      };
      
      if ([start isKindOfClass:[RCTImageView class]]) {
        snapshot = [[UIImageView alloc] initWithImage:((RCTImageView *) start).image];
      } else {
        snapshot = [[UIView alloc] initWithFrame:start.frame];
      }
      
      snapshot.alpha = start.alpha;
      
      [self copyValuesFromView:start toSnapshot:snapshot];
      
      start.alpha = 0;
      end.alpha = 0;
      if (start != nil && end != nil && snapshot != nil) {
        [sharedElementsArray addObject:@[start, end, snapshot, originalValues]];
      }
    }
  }
  return sharedElementsArray;
}

-(void)copyValuesFromView:(UIView *)view toSnapshot:(UIView *)snapshot
{
  snapshot.layer.backgroundColor = view.backgroundColor.CGColor;
}



@end



@implementation RNSScreenManager

RCT_EXPORT_MODULE()

// we want to handle the case when activityState is nil
RCT_REMAP_VIEW_PROPERTY(activityState, activityStateOrNil, NSNumber)
RCT_EXPORT_VIEW_PROPERTY(gestureEnabled, BOOL)
RCT_EXPORT_VIEW_PROPERTY(replaceAnimation, RNSScreenReplaceAnimation)
RCT_EXPORT_VIEW_PROPERTY(sharedElements, NSArray<NSDictionary *>)
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
                                                  @"slide_from_right": @(RNSScreenStackAnimationDefault),
                                                  @"slide_from_left": @(RNSScreenStackAnimationDefault),
                                                  }), RNSScreenStackAnimationDefault, integerValue)

RCT_ENUM_CONVERTER(RNSScreenReplaceAnimation, (@{
                                                  @"push": @(RNSScreenReplaceAnimationPush),
                                                  @"pop": @(RNSScreenReplaceAnimationPop),
                                                  }), RNSScreenReplaceAnimationPop, integerValue)

@end
