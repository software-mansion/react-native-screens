#if RN_FABRIC_ENABLED
#import <react/renderer/components/rnscreens/RCTComponentViewHelpers.h>
#else
#import "RNSScreen.h"
#import "RNSScreenStack.h"
#import "RNSScreenStackHeaderConfig.h"
#endif

#import "RNSScreenComponentView.h"
#import "RNSScreenWindowTraits.h"

@implementation RNSScreenController {
#if RN_FABRIC_ENABLED
  RNSScreenComponentView *_initialView;
#else
  __weak id _previousFirstResponder;
  CGRect _lastViewFrame;
  UIView *_fakeView;
  CADisplayLink *_animationTimer;
  CGFloat _currentAlpha;
  BOOL _closing;
  BOOL _goingForward;
  int _dismissCount;
  BOOL _isSwiping;
  BOOL _shouldNotify;
#endif
}

#pragma mark-- Common
- (instancetype)initWithView:(UIView *)view
{
  if (self = [super init]) {
    self.view = view;
#if RN_FABRIC_ENABLED
    if ([view isKindOfClass:[RNSScreenComponentView class]]) {
      _initialView = (RNSScreenComponentView *)view;
    } else {
      RCTLogError(@"ScreenController can only be initialized with ScreenComponentView");
    }
#else
    _shouldNotify = YES;
    _fakeView = [UIView new];
#endif
  }
  return self;
}

// TODO: Find out why this is executed when screen is going out
- (void)viewWillAppear:(BOOL)animated
{
  [super viewWillAppear:animated];
#if RN_FABRIC_ENABLED
  [RNSScreenWindowTraits updateWindowTraits];
  [_initialView notifyWillAppear];
#else
  if (!_isSwiping) {
    [((RNSScreenView *)self.view) notifyWillAppear];
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
#endif
}

- (void)viewWillDisappear:(BOOL)animated
{
  [super viewWillDisappear:animated];
#if RN_FABRIC_ENABLED
  [_initialView notifyWillDisappear];
#else
  if (!self.transitionCoordinator.isInteractive) {
    // user might have long pressed ios 14 back button item,
    // so he can go back more than one screen and we need to dismiss more screens in JS stack then.
    // We check it by calculating the difference between the index of currently displayed screen
    // and the index of the target screen, which is the view of topViewController at this point.
    // If the value is lower than 1, it means we are dismissing a modal, or navigating forward, or going back with JS.
    int selfIndex = [self getIndexOfView:self.view];
    int targetIndex = [self getIndexOfView:self.navigationController.topViewController.view];
    _dismissCount = selfIndex - targetIndex > 0 ? selfIndex - targetIndex : 1;
  } else {
    _dismissCount = 1;
  }

  // same flow as in viewWillAppear
  if (!_isSwiping) {
    [((RNSScreenView *)self.view) notifyWillDisappear];
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
#endif
}

- (void)viewDidAppear:(BOOL)animated
{
  [super viewDidAppear:animated];
#if RN_FABRIC_ENABLED
  [_initialView notifyAppear];
#else
  if (!_isSwiping || _shouldNotify) {
    // we are going forward or dismissing without swipe
    // or successfully swiped back
    [((RNSScreenView *)self.view) notifyAppear];
    [self notifyTransitionProgress:1.0 closing:NO goingForward:_goingForward];
  }

  _isSwiping = NO;
  _shouldNotify = YES;
#endif
}

- (void)viewDidDisappear:(BOOL)animated
{
  [super viewDidDisappear:animated];
#if RN_FABRIC_ENABLED
  [_initialView notifyDisappear];
  if (self.parentViewController == nil && self.presentingViewController == nil) {
    // screen dismissed, send event
    [_initialView notifyDismissedWithCount:1];
  }
#else
  if (self.parentViewController == nil && self.presentingViewController == nil) {
    if (((RNSScreenView *)self.view).preventNativeDismiss) {
      // if we want to prevent the native dismiss, we do not send dismissal event,
      // but instead call `updateContainer`, which restores the JS navigation stack
      [((RNSScreenView *)self.view).reactSuperview updateContainer];
      [((RNSScreenView *)self.view) notifyDismissCancelledWithDismissCount:_dismissCount];
    } else {
      // screen dismissed, send event
      [((RNSScreenView *)self.view) notifyDismissedWithCount:_dismissCount];
    }
  }

  // same flow as in viewDidAppear
  if (!_isSwiping || _shouldNotify) {
    [((RNSScreenView *)self.view) notifyDisappear];
    [self notifyTransitionProgress:1.0 closing:YES goingForward:_goingForward];
  }

  _isSwiping = NO;
  _shouldNotify = YES;

  [self traverseForScrollView:self.view];

#endif
}

- (void)viewDidLayoutSubviews
{
  [super viewDidLayoutSubviews];
#if RN_FABRIC_ENABLED
  BOOL isDisplayedWithinUINavController = [self.parentViewController isKindOfClass:[UINavigationController class]];
  if (isDisplayedWithinUINavController) {
    [_initialView updateBounds];
  }
#else
  // The below code makes the screen view adapt dimensions provided by the system. We take these
  // into account only when the view is mounted under RNScreensNavigationController in which case system
  // provides additional padding to account for possible header, and in the case when screen is
  // shown as a native modal, as the final dimensions of the modal on iOS 12+ are shorter than the
  // screen size
  BOOL isDisplayedWithinUINavController =
      [self.parentViewController isKindOfClass:[RNScreensNavigationController class]];
  BOOL isPresentedAsNativeModal = self.parentViewController == nil && self.presentingViewController != nil;
  if ((isDisplayedWithinUINavController || isPresentedAsNativeModal) &&
      !CGRectEqualToRect(_lastViewFrame, self.view.frame)) {
    _lastViewFrame = self.view.frame;
    [((RNSScreenComponentView *)self.viewIfLoaded) updateBounds];
  }
#endif
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
  if ([self.presentedViewController isKindOfClass:[RNSScreenController class]]) {
    lastViewController = self.presentedViewController;
    // we don't want to allow controlling of status bar appearance when we present non-fullScreen modal
    // and it is not possible if `modalPresentationCapturesStatusBarAppearance` is not set to YES, so even
    // if we went into a modal here and ask it, it wouldn't take any effect. For fullScreen modals, the system
    // asks them by itself, so we can stop traversing here.
    // for screen orientation, we need to start the search again from that modal
    return !includingModals
        ? nil
        : [(RNSScreenController *)lastViewController findChildVCForConfigAndTrait:trait includingModals:includingModals]
            ?: lastViewController;
  }

  UIViewController *selfOrNil = [self hasTraitSet:trait] ? self : nil;
  if (lastViewController == nil) {
    return selfOrNil;
  } else {
    if ([lastViewController conformsToProtocol:@protocol(RNScreensViewControllerDelegate)]) {
      // If there is a child (should be VC of ScreenContainer or ScreenStack), that has a child that could provide the
      // trait, we recursively go into its findChildVCForConfig, and if one of the children has the trait set, we return
      // it, otherwise we return self if this VC has config, and nil if it doesn't we use
      // `childViewControllerForStatusBarStyle` for all options since the behavior is the same for all of them
      UIViewController *childScreen = [lastViewController childViewControllerForStatusBarStyle];
      if ([childScreen isKindOfClass:[RNSScreenController class]]) {
        return [(RNSScreenController *)childScreen findChildVCForConfigAndTrait:trait includingModals:includingModals]
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
      return ((RNSScreenComponentView *)self.view).hasStatusBarStyleSet;
    }
    case RNSWindowTraitAnimation: {
      return ((RNSScreenComponentView *)self.view).hasStatusBarAnimationSet;
    }
    case RNSWindowTraitHidden: {
      return ((RNSScreenComponentView *)self.view).hasStatusBarHiddenSet;
    }
    case RNSWindowTraitOrientation: {
      return ((RNSScreenComponentView *)self.view).hasOrientationSet;
    }
    case RNSWindowTraitHomeIndicatorHidden: {
      return ((RNSScreenComponentView *)self.view).hasHomeIndicatorHiddenSet;
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
  return ((RNSScreenComponentView *)self.view).statusBarHidden;
}

- (UIViewController *)childViewControllerForStatusBarStyle
{
  UIViewController *vc = [self findChildVCForConfigAndTrait:RNSWindowTraitStyle includingModals:NO];
  return vc == self ? nil : vc;
}

- (UIStatusBarStyle)preferredStatusBarStyle
{
  return
      [RNSScreenWindowTraits statusBarStyleForRNSStatusBarStyle:((RNSScreenComponentView *)self.view).statusBarStyle];
}

- (UIStatusBarAnimation)preferredStatusBarUpdateAnimation
{
  UIViewController *vc = [self findChildVCForConfigAndTrait:RNSWindowTraitAnimation includingModals:NO];

  if ([vc isKindOfClass:[RNSScreenController class]]) {
    return ((RNSScreenComponentView *)vc.view).statusBarAnimation;
  }
  return UIStatusBarAnimationFade;
}

- (UIInterfaceOrientationMask)supportedInterfaceOrientations
{
  UIViewController *vc = [self findChildVCForConfigAndTrait:RNSWindowTraitOrientation includingModals:YES];

  if ([vc isKindOfClass:[RNSScreenController class]]) {
    return ((RNSScreenComponentView *)vc.view).screenOrientation;
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
  return ((RNSScreenComponentView *)self.view).homeIndicatorHidden;
}
#endif

#pragma mark - Fabric specific
#if RN_FABRIC_ENABLED

- (void)setViewToSnapshot:(UIView *)snapshot
{
  [self.view removeFromSuperview];
  self.view = snapshot;
}

- (void)resetViewToScreen
{
  [self.view removeFromSuperview];
  self.view = _initialView;
}

#pragma mark - Paper specific
#else

- (void)notifyFinishTransitioning
{
  [_previousFirstResponder becomeFirstResponder];
  _previousFirstResponder = nil;
  // the correct Screen for appearance is set after the transition, same for orientation.
  [RNSScreenWindowTraits updateWindowTraits];
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

- (void)notifyTransitionProgress:(double)progress closing:(BOOL)closing goingForward:(BOOL)goingForward
{
  [((RNSScreenView *)self.view) notifyTransitionProgress:progress closing:closing goingForward:goingForward];
}

- (void)traverseForScrollView:(UIView *)view
{
  if (![[self.view valueForKey:@"_bridge"] valueForKey:@"_jsThread"]) {
    // we don't want to send `scrollViewDidEndDecelerating` event to JS before the JS thread is ready
    return;
  }
  if ([view isKindOfClass:[UIScrollView class]] &&
      ([[(UIScrollView *)view delegate] respondsToSelector:@selector(scrollViewDidEndDecelerating:)])) {
    [[(UIScrollView *)view delegate] scrollViewDidEndDecelerating:(id)view];
  }
  [view.subviews enumerateObjectsUsingBlock:^(__kindof UIView *_Nonnull obj, NSUInteger idx, BOOL *_Nonnull stop) {
    [self traverseForScrollView:obj];
  }];
}

- (int)getIndexOfView:(UIView *)view
{
  return (int)[[self.view.reactSuperview reactSubviews] indexOfObject:view];
}

- (int)getParentChildrenCount
{
  return (int)[[self.view.reactSuperview reactSubviews] count];
}

#pragma mark - transition progress related methods

- (void)setupProgressNotification
{
  if (self.transitionCoordinator != nil) {
    _fakeView.alpha = 0.0;
    [self.transitionCoordinator
        animateAlongsideTransition:^(id<UIViewControllerTransitionCoordinatorContext> _Nonnull context) {
          [[context containerView] addSubview:self->_fakeView];
          self->_fakeView.alpha = 1.0;
          self->_animationTimer = [CADisplayLink displayLinkWithTarget:self selector:@selector(handleAnimation)];
          [self->_animationTimer addToRunLoop:[NSRunLoop currentRunLoop] forMode:NSDefaultRunLoopMode];
        }
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

- (void)hideHeaderIfNecessary
{
#if !TARGET_OS_TV
  // On iOS >=13, there is a bug when user transitions from screen with active search bar to screen without header
  // In that case default iOS header will be shown. To fix this we hide header when the screens that appears has header
  // hidden and search bar was active on previous screen. We need to do it asynchronously, because default header is
  // added after viewWillAppear.
  if (@available(iOS 13.0, *)) {
    NSUInteger currentIndex = [self.navigationController.viewControllers indexOfObject:self];

    if (currentIndex > 0 && [self.view.reactSubviews[0] isKindOfClass:[RNSScreenStackHeaderConfig class]]) {
      UINavigationItem *prevNavigationItem =
          [self.navigationController.viewControllers objectAtIndex:currentIndex - 1].navigationItem;
      RNSScreenStackHeaderConfig *config = ((RNSScreenStackHeaderConfig *)self.view.reactSubviews[0]);

      BOOL wasSearchBarActive = prevNavigationItem.searchController.active;
      BOOL shouldHideHeader = config.hide;

      if (wasSearchBarActive && shouldHideHeader) {
        dispatch_time_t popTime = dispatch_time(DISPATCH_TIME_NOW, 0);
        dispatch_after(popTime, dispatch_get_main_queue(), ^(void) {
          [self.navigationController setNavigationBarHidden:YES animated:NO];
        });
      }
    }
  }
#endif
}

#endif // RN_FABRIC_ENABLED

@end
