#import "RNSScreenWindowTraits.h"
#import "RNSScreenContainer.h"
#import "RNSScreenStack.h"

@implementation RNSScreenWindowTraits

#if !TARGET_OS_TV
+ (void)assertViewControllerBasedStatusBarAppearenceSet
{
  static dispatch_once_t once;
  static bool viewControllerBasedAppearence;
  dispatch_once(&once, ^{
    viewControllerBasedAppearence =
        [[[NSBundle mainBundle] objectForInfoDictionaryKey:@"UIViewControllerBasedStatusBarAppearance"] boolValue];
  });
  if (!viewControllerBasedAppearence) {
    RCTLogError(@"If you want to change the appearance of status bar, you have to change \
    UIViewControllerBasedStatusBarAppearance key in the Info.plist to YES");
  }
}
#endif

+ (void)updateStatusBarAppearance
{
#if !TARGET_OS_TV
  [UIView animateWithDuration:0.4
                   animations:^{ // duration based on "Programming iOS 13" p. 311 implementation
#if defined(__IPHONE_OS_VERSION_MAX_ALLOWED) && defined(__IPHONE_13_0) && \
    __IPHONE_OS_VERSION_MAX_ALLOWED >= __IPHONE_13_0
                     if (@available(iOS 13, *)) {
                       UIWindow *firstWindow = [[[UIApplication sharedApplication] windows] firstObject];
                       if (firstWindow != nil) {
                         [[firstWindow rootViewController] setNeedsStatusBarAppearanceUpdate];
                       }
                     } else
#endif
                     {
                       [UIApplication.sharedApplication.keyWindow.rootViewController setNeedsStatusBarAppearanceUpdate];
                     }
                   }];
#endif
}

+ (void)updateHomeIndicatorAutoHidden
{
#if !TARGET_OS_TV

#if defined(__IPHONE_OS_VERSION_MAX_ALLOWED) && defined(__IPHONE_13_0) && \
    __IPHONE_OS_VERSION_MAX_ALLOWED >= __IPHONE_13_0
  if (@available(iOS 13, *)) {
    UIWindow *firstWindow = [[[UIApplication sharedApplication] windows] firstObject];
    if (firstWindow != nil) {
      [[firstWindow rootViewController] setNeedsUpdateOfHomeIndicatorAutoHidden];
    }
  } else
#endif
  {
    if (@available(iOS 11.0, *)) {
      [UIApplication.sharedApplication.keyWindow.rootViewController setNeedsUpdateOfHomeIndicatorAutoHidden];
    }
  }
#endif
}

#if !TARGET_OS_TV
+ (UIStatusBarStyle)statusBarStyleForRNSStatusBarStyle:(RNSStatusBarStyle)statusBarStyle
{
#if defined(__IPHONE_OS_VERSION_MAX_ALLOWED) && defined(__IPHONE_13_0) && \
    __IPHONE_OS_VERSION_MAX_ALLOWED >= __IPHONE_13_0
  if (@available(iOS 13.0, *)) {
    switch (statusBarStyle) {
      case RNSStatusBarStyleAuto:
        return [UITraitCollection.currentTraitCollection userInterfaceStyle] == UIUserInterfaceStyleDark
            ? UIStatusBarStyleLightContent
            : UIStatusBarStyleDarkContent;
      case RNSStatusBarStyleInverted:
        return [UITraitCollection.currentTraitCollection userInterfaceStyle] == UIUserInterfaceStyleDark
            ? UIStatusBarStyleDarkContent
            : UIStatusBarStyleLightContent;
      case RNSStatusBarStyleLight:
        return UIStatusBarStyleLightContent;
      case RNSStatusBarStyleDark:
        return UIStatusBarStyleDarkContent;
      default:
        return UIStatusBarStyleLightContent;
    }
  }
#endif
  // it is the only non-default style available for iOS < 13
  if (statusBarStyle == RNSStatusBarStyleLight) {
    return UIStatusBarStyleLightContent;
  }
  return UIStatusBarStyleDefault;
}
#endif

#if !TARGET_OS_TV
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
#endif

+ (void)enforceDesiredDeviceOrientation
{
#if !TARGET_OS_TV
  dispatch_async(dispatch_get_main_queue(), ^{
    UIInterfaceOrientationMask orientationMask = UIInterfaceOrientationMaskAllButUpsideDown;
#if defined(__IPHONE_OS_VERSION_MAX_ALLOWED) && defined(__IPHONE_13_0) && \
    __IPHONE_OS_VERSION_MAX_ALLOWED >= __IPHONE_13_0
    if (@available(iOS 13, *)) {
      UIWindow *firstWindow = [[[UIApplication sharedApplication] windows] firstObject];
      if (firstWindow != nil) {
        orientationMask = [firstWindow rootViewController].supportedInterfaceOrientations;
      }
    } else
#endif
    {
      orientationMask = UIApplication.sharedApplication.keyWindow.rootViewController.supportedInterfaceOrientations;
    }

    UIInterfaceOrientation currentDeviceOrientation =
        [RNSScreenWindowTraits interfaceOrientationFromDeviceOrientation:[[UIDevice currentDevice] orientation]];
    UIInterfaceOrientation currentInterfaceOrientation = [RNSScreenWindowTraits interfaceOrientation];
    NSLog(
        @"[RNSScreenWindowTraits] REFERENCE Up: %ld, Left: %ld, Rigth: %ld, Unknown: %ld\n",
        UIInterfaceOrientationPortrait,
        UIInterfaceOrientationLandscapeLeft,
        UIInterfaceOrientationLandscapeRight,
        UIInterfaceOrientationUnknown);
    NSLog(@"[RNSScreenWindowTraits] currentInterfaceOrientation: %ld\n", currentInterfaceOrientation);
    NSLog(@"[RNSScreenWindowTraits] currentDeviceOrientation: %ld\n", currentDeviceOrientation);
    UIInterfaceOrientation newOrientation = UIInterfaceOrientationUnknown;
    if ([RNSScreenWindowTraits maskFromOrientation:currentDeviceOrientation] & orientationMask) {
      if (!([RNSScreenWindowTraits maskFromOrientation:currentInterfaceOrientation] & orientationMask)) {
        // if the device orientation is in the mask, but interface orientation is not, we rotate to device's orientation
        newOrientation = currentDeviceOrientation;
      } else {
        if (currentDeviceOrientation != currentInterfaceOrientation) {
          // if both device orientation and interface orientation are in the mask, but in different orientations, we
          // rotate to device's orientation
          newOrientation = currentDeviceOrientation;
        }
      }
    } else {
      if (!([RNSScreenWindowTraits maskFromOrientation:currentInterfaceOrientation] & orientationMask)) {
        // if both device orientation and interface orientation are not in the mask, we rotate to closest available
        // rotation from mask
        newOrientation = [RNSScreenWindowTraits defaultOrientationForOrientationMask:orientationMask];
      } else {
        // if the device orientation is not in the mask, but interface orientation is in the mask, do nothing
      }
    }
    NSLog(@"[RNSScreenWindowTraits] newOrientation: %ld\n", newOrientation);
    if (newOrientation != UIInterfaceOrientationUnknown) {
      NSLog(
          @"[RNSScreenWindowTraits] Attempting to change orientation from %ld to %ld\n",
          currentInterfaceOrientation,
          newOrientation);
      if (@available(iOS 16.0, *)) {
        NSArray *array = [[[UIApplication sharedApplication] connectedScenes] allObjects];
        UIWindowScene *scene = (UIWindowScene *)array[0];
        UIWindowSceneGeometryPreferencesIOS *geometryPreferences =
            [[UIWindowSceneGeometryPreferencesIOS alloc] initWithInterfaceOrientations:orientationMask];
        [scene requestGeometryUpdateWithPreferences:geometryPreferences
                                       errorHandler:^(NSError *_Nonnull error){
                                       }];

        // `attemptRotationToDeviceOrientation` is deprecated for modern OS versions
        // so we need to use `setNeedsUpdateOfSupportedInterfaceOrientations`
        UIViewController *topController = [UIApplication sharedApplication].keyWindow.rootViewController;
        while (topController.presentedViewController) {
          topController = topController.presentedViewController;
        }

        [topController setNeedsUpdateOfSupportedInterfaceOrientations];
      } else {
        [[UIDevice currentDevice] setValue:@(newOrientation) forKey:@"orientation"];
        [UIViewController attemptRotationToDeviceOrientation];
      }
    }
  });
#endif
}

+ (void)updateWindowTraits
{
  [RNSScreenWindowTraits updateStatusBarAppearance];
  [RNSScreenWindowTraits enforceDesiredDeviceOrientation];
  [RNSScreenWindowTraits updateHomeIndicatorAutoHidden];
}

#if !TARGET_OS_TV
// based on
// https://stackoverflow.com/questions/57965701/statusbarorientation-was-deprecated-in-ios-13-0-when-attempting-to-get-app-ori/61249908#61249908
+ (UIInterfaceOrientation)interfaceOrientation
{
#if defined(__IPHONE_OS_VERSION_MAX_ALLOWED) && defined(__IPHONE_13_0) && \
    __IPHONE_OS_VERSION_MAX_ALLOWED >= __IPHONE_13_0
  if (@available(iOS 16.0, *)) {
    NSArray *array = [[[UIApplication sharedApplication] connectedScenes] allObjects];
    UIWindowScene *scene = (UIWindowScene *)array[0];
    if (scene != nil) {
      NSLog(@"[RNSScreenWindowTraits#interfaceOrientation] 16.0 returning %ld\n", scene.interfaceOrientation);
      return scene.interfaceOrientation;
    } else {
      NSLog(@"[RNSScreenWindowTraits#interfaceOrientation] 16.0 returning %ld\n", UIInterfaceOrientationUnknown);
      return UIInterfaceOrientationUnknown;
    }
    //    return scene == nil ? UIInterfaceOrientationUnknown : scene.interfaceOrientation;
  } else

      if (@available(iOS 13.0, *)) {
    UIWindow *firstWindow = [[[UIApplication sharedApplication] windows] firstObject];
    if (firstWindow == nil) {
      NSLog(@"[RNSScreenWindowTraits#interfaceOrientation] 13.0 returning %ld\n", UIInterfaceOrientationUnknown);
      return UIInterfaceOrientationUnknown;
    }
    UIWindowScene *windowScene = firstWindow.windowScene;
    if (windowScene == nil) {
      NSLog(@"[RNSScreenWindowTraits#interfaceOrientation] 13.0 returning %ld\n", UIInterfaceOrientationUnknown);
      return UIInterfaceOrientationUnknown;
    }
    NSLog(@"[RNSScreenWindowTraits#interfaceOrientation] 13.0 returning %ld\n", windowScene.interfaceOrientation);
    return windowScene.interfaceOrientation;
  } else
#endif
  {
    NSLog(
        @"[RNSScreenWindowTraits#interfaceOrientation] default returning %ld\n",
        UIApplication.sharedApplication.statusBarOrientation);
    return UIApplication.sharedApplication.statusBarOrientation;
  }
}
#endif

// method to be used in Expo for checking if RNScreens have trait set
+ (BOOL)shouldAskScreensForTrait:(RNSWindowTrait)trait
                 includingModals:(BOOL)includingModals
                inViewController:(UIViewController *)vc
{
  UIViewController *lastViewController = [[vc childViewControllers] lastObject];
  if ([lastViewController conformsToProtocol:@protocol(RNScreensViewControllerDelegate)]) {
    UIViewController *vc = nil;
    if ([lastViewController isKindOfClass:[RNScreensViewController class]]) {
      vc = [(RNScreensViewController *)lastViewController findActiveChildVC];
    } else if ([lastViewController isKindOfClass:[RNScreensNavigationController class]]) {
      vc = [(RNScreensNavigationController *)lastViewController topViewController];
    }
    return [vc isKindOfClass:[RNSScreen class]] &&
        [(RNSScreen *)vc findChildVCForConfigAndTrait:trait includingModals:includingModals] != nil;
  }
  return NO;
}

// same method as above, but directly for orientation
+ (BOOL)shouldAskScreensForScreenOrientationInViewController:(UIViewController *)vc
{
  return [RNSScreenWindowTraits shouldAskScreensForTrait:RNSWindowTraitOrientation
                                         includingModals:YES
                                        inViewController:vc];
}

@end
