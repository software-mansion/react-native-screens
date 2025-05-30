#import "RNSScreenWindowTraits.h"
#import "RNSScreenContainer.h"
#import "RNSScreenStack.h"

@implementation RNSScreenWindowTraits

#if !TARGET_OS_TV && !TARGET_OS_VISION
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
#if !TARGET_OS_TV && !TARGET_OS_VISION
  [UIView animateWithDuration:0.4
                   animations:^{ // duration based on "Programming iOS 13" p. 311 implementation
                     [RCTKeyWindow().rootViewController setNeedsStatusBarAppearanceUpdate];
                   }];
#endif
}

+ (void)updateHomeIndicatorAutoHidden
{
#if !TARGET_OS_TV
  [RCTKeyWindow().rootViewController setNeedsUpdateOfHomeIndicatorAutoHidden];
#endif
}

#if !TARGET_OS_TV
+ (UIStatusBarStyle)statusBarStyleForRNSStatusBarStyle:(RNSStatusBarStyle)statusBarStyle
{
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
#if !TARGET_OS_TV && !TARGET_OS_VISION
  dispatch_async(dispatch_get_main_queue(), ^{
    UIInterfaceOrientationMask orientationMask = [RCTKeyWindow().rootViewController supportedInterfaceOrientations];

    UIInterfaceOrientation currentDeviceOrientation =
        [RNSScreenWindowTraits interfaceOrientationFromDeviceOrientation:[[UIDevice currentDevice] orientation]];
    UIInterfaceOrientation currentInterfaceOrientation = [RNSScreenWindowTraits interfaceOrientation];
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
    if (newOrientation != UIInterfaceOrientationUnknown) {
#if defined(__IPHONE_OS_VERSION_MAX_ALLOWED) && defined(__IPHONE_16_0) && \
    __IPHONE_OS_VERSION_MAX_ALLOWED >= __IPHONE_16_0
      if (@available(iOS 16.0, *)) {
        NSArray *array = [[[UIApplication sharedApplication] connectedScenes] allObjects];

        // when an app supports multiple scenes (e.g. CarPlay), it is possible that
        // UIWindowScene is not the first scene, or it may not be present at all
        UIWindowScene *scene = nil;
        for (id connectedScene in array) {
          if ([connectedScene isKindOfClass:[UIWindowScene class]]) {
            scene = connectedScene;
            break;
          }
        }

        if (scene == nil) {
          return;
        }

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
      } else
#endif // Check for iOS 16
      {
        [[UIDevice currentDevice] setValue:@(newOrientation) forKey:@"orientation"];
        [UIViewController attemptRotationToDeviceOrientation];
      }
    }
  });
#endif // !TARGET_TV_OS
}

+ (void)updateWindowTraits
{
  [RNSScreenWindowTraits updateStatusBarAppearance];
  [RNSScreenWindowTraits enforceDesiredDeviceOrientation];
  [RNSScreenWindowTraits updateHomeIndicatorAutoHidden];
}

#if !TARGET_OS_TV && !TARGET_OS_VISION
// based on
// https://stackoverflow.com/questions/57965701/statusbarorientation-was-deprecated-in-ios-13-0-when-attempting-to-get-app-ori/61249908#61249908
+ (UIInterfaceOrientation)interfaceOrientation
{
  UIWindowScene *windowScene = RCTKeyWindow().windowScene;
  if (windowScene == nil) {
    return UIInterfaceOrientationUnknown;
  }
  return windowScene.interfaceOrientation;
}
#endif

// method to be used in Expo for checking if RNScreens have trait set
+ (BOOL)shouldAskScreensForTrait:(RNSWindowTrait)trait
                 includingModals:(BOOL)includingModals
                inViewController:(UIViewController *)vc
{
  UIViewController *lastViewController = [[vc childViewControllers] lastObject];
  if ([lastViewController conformsToProtocol:@protocol(RNSViewControllerDelegate)]) {
    UIViewController *vc = nil;
    if ([lastViewController isKindOfClass:[RNSViewController class]]) {
      vc = [(RNSViewController *)lastViewController findActiveChildVC];
    } else if ([lastViewController isKindOfClass:[RNSNavigationController class]]) {
      vc = [(RNSNavigationController *)lastViewController topViewController];
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
