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
#import "RNSScreenStack.h"
#import "RNSScreenStackHeaderConfig.h"

#import "RNSDefines.h"
#import "UIView+RNSUtility.h"

#ifdef RCT_NEW_ARCH_ENABLED
namespace react = facebook::react;
#define ReactScrollViewBase RCTScrollViewComponentView
#else
#define ReactScrollViewBase RCTScrollView
#endif // RCT_NEW_ARCH_ENABLED

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
#ifdef RCT_NEW_ARCH_ENABLED
#else
  [self traverseForScrollView:self.screenView];
#endif
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

  // Calculate header height on modal open
  if (self.screenView.isPresentedAsNativeModal) {
    [self calculateAndNotifyHeaderHeightChangeIsModal:YES];
  }

  if (isDisplayedWithinUINavController || self.screenView.isPresentedAsNativeModal) {
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

#if defined(__IPHONE_OS_VERSION_MAX_ALLOWED) && defined(__IPHONE_13_0) && \
    __IPHONE_OS_VERSION_MAX_ALLOWED >= __IPHONE_13_0
  if (@available(iOS 13.0, *)) {
    CGSize primaryStatusBarSize = self.view.window.windowScene.statusBarManager.statusBarFrame.size;
    if (primaryStatusBarSize.height == 0 || primaryStatusBarSize.width == 0)
      return fallbackStatusBarSize;

    return primaryStatusBarSize;
  } else {
    return fallbackStatusBarSize;
  }
#endif /* Check for iOS 13.0 */

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
  if (@available(iOS 13.0, *)) {
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
  }
#endif
}

#ifdef RCT_NEW_ARCH_ENABLED
#pragma mark - Fabric specific

- (void)setViewToSnapshot
{
  UIView *superView = self.view.superview;
  // if we dismissed the view natively, it will already be detached from view hierarchy
  if (self.view.window != nil) {
    UIView *snapshot = [self.view snapshotViewAfterScreenUpdates:NO];
    [self.view removeFromSuperview];
    self.view = snapshot;
    [superView addSubview:snapshot];
  }
}

#else
#pragma mark - Paper specific

- (void)traverseForScrollView:(UIView *)view
{
  if (![[self.view valueForKey:@"_bridge"] valueForKey:@"_jsThread"]) {
    // we don't want to send `scrollViewDidEndDecelerating` event to JS before the JS thread is ready
    return;
  }

  if ([NSStringFromClass([view class]) isEqualToString:@"AVPlayerView"]) {
    // Traversing through AVPlayerView is an uncommon edge case that causes the disappearing screen
    // to an excessive traversal through all video player elements
    // (e.g., for react-native-video, this includes all controls and additional video views).
    // Thus, we want to avoid unnecessary traversals through these views.
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
#endif

@end

// So that the define-macro is not leaked out of this file.
// This one is defined in very top of the file depending on RN architecture.
#undef ReactScrollViewBase
