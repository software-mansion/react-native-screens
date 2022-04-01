#import <react/renderer/components/rnscreens/RCTComponentViewHelpers.h>
#import "RNSScreenComponentView.h"
#import "RNSScreenWindowTraits.h"

@implementation RNSScreenController {
  RNSScreenComponentView *_initialView;
}

- (instancetype)initWithView:(UIView *)view
{
  if (self = [super init]) {
    self.view = view;
    if ([view isKindOfClass:[RNSScreenComponentView class]]) {
      _initialView = (RNSScreenComponentView *)view;
    } else {
      RCTLogError(@"ScreenController can only be initialized with ScreenComponentView");
    }
  }
  return self;
}

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

// TODO: Find out why this is executed when screen is going out
- (void)viewWillAppear:(BOOL)animated
{
  [super viewWillAppear:animated];
  [RNSScreenWindowTraits updateWindowTraits];
  [_initialView notifyWillAppear];
}

- (void)viewWillDisappear:(BOOL)animated
{
  [super viewWillDisappear:animated];
  [_initialView notifyWillDisappear];
}

- (void)viewDidAppear:(BOOL)animated
{
  [super viewDidAppear:animated];
  [_initialView notifyAppear];
}

- (void)viewDidDisappear:(BOOL)animated
{
  [super viewDidDisappear:animated];
  [_initialView notifyDisappear];
  if (self.parentViewController == nil && self.presentingViewController == nil) {
    // screen dismissed, send event
    [_initialView notifyDismissedWithCount:1];
  }
}

- (void)viewDidLayoutSubviews
{
  [super viewDidLayoutSubviews];
  BOOL isDisplayedWithinUINavController = [self.parentViewController isKindOfClass:[UINavigationController class]];
  if (isDisplayedWithinUINavController) {
    [_initialView updateBounds];
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

@end
