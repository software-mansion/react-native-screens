#ifdef RCT_NEW_ARCH_ENABLED
#import <React/RCTConversions.h>
#import <React/RCTFabricComponentsPlugins.h>
#import <React/RCTImageComponentView.h>
#import <React/UIView+React.h>
#import <react/renderer/components/image/ImageProps.h>
#import <react/renderer/components/rnscreens/ComponentDescriptors.h>
#import <react/renderer/components/rnscreens/EventEmitters.h>
#import <react/renderer/components/rnscreens/Props.h>
#import <react/renderer/components/rnscreens/RCTComponentViewHelpers.h>
#import <rnscreens/RNSScreenStackHeaderConfigComponentDescriptor.h>
#import "RCTImageComponentView+RNSScreenStackHeaderConfig.h"
#else
#import <React/RCTImageView.h>
#import <React/RCTShadowView.h>
#import <React/RCTUIManager.h>
#import <React/RCTUIManagerUtils.h>
#endif
#import <React/RCTBridge.h>
#import <React/RCTFont.h>
#import <React/RCTImageLoader.h>
#import <React/RCTImageSource.h>
#import "RNSConvert.h"
#import "RNSDefines.h"
#import "RNSScreen.h"
#import "RNSScreenStackHeaderConfig.h"
#import "RNSSearchBar.h"
#import "RNSUIBarButtonItem.h"

#ifdef RCT_NEW_ARCH_ENABLED
namespace react = facebook::react;
#endif // RCT_NEW_ARCH_ENABLED

#ifndef RCT_NEW_ARCH_ENABLED
// Some RN private method hacking below. Couldn't figure out better way to access image data
// of a given RCTImageView. See more comments in the code section processing SubviewTypeBackButton
@interface RCTImageView (Private)
- (UIImage *)image;
@end
#endif // !RCT_NEW_ARCH_ENABLED

@interface RCTImageLoader (Private)
- (id<RCTImageCache>)imageCache;
@end

@implementation NSString (RNSStringUtil)

+ (BOOL)RNSisBlank:(NSString *)string
{
  if (string == nil) {
    return YES;
  }
  return [[string stringByTrimmingCharactersInSet:[NSCharacterSet whitespaceAndNewlineCharacterSet]] length] == 0;
}

@end

@implementation RNSScreenStackHeaderConfig {
  NSMutableArray<RNSScreenStackHeaderSubview *> *_reactSubviews;
  NSDirectionalEdgeInsets _lastHeaderInsets;
#ifdef RCT_NEW_ARCH_ENABLED
  BOOL _initialPropsSet;
  react::RNSScreenStackHeaderConfigShadowNode::ConcreteState::Shared _state;
#else
  __weak RCTBridge *_bridge;
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
    static const auto defaultProps = std::make_shared<const react::RNSScreenStackHeaderConfigProps>();
    _props = defaultProps;
    _show = YES;
    _translucent = NO;
    [self initProps];
  }
  return self;
}
#else
- (instancetype)init
{
  if (self = [super init]) {
    _translucent = YES;
    [self initProps];
  }
  return self;
}

- (instancetype)initWithBridge:(RCTBridge *)bridge
{
  if (self = [super init]) {
    _bridge = bridge;
    _translucent = YES;
    [self initProps];
  }
  return self;
}
#endif

- (void)initProps
{
  self.hidden = YES;
  _reactSubviews = [NSMutableArray new];
  _backTitleVisible = YES;
  _blurEffect = RNSBlurEffectStyleNone;
}

RNS_IGNORE_SUPER_CALL_BEGIN
- (UIView *)reactSuperview
{
  return _screenView;
}

- (NSArray<UIView *> *)reactSubviews
{
  return _reactSubviews;
}
RNS_IGNORE_SUPER_CALL_END

- (void)removeFromSuperview
{
  [super removeFromSuperview];
  _screenView = nil;
}

// this method is never invoked by the system since this view
// is not added to native view hierarchy so we can apply our logic
- (UIView *)hitTest:(CGPoint)point withEvent:(UIEvent *)event
{
  for (RNSScreenStackHeaderSubview *subview in _reactSubviews) {
    if (subview.type == RNSScreenStackHeaderSubviewTypeLeft || subview.type == RNSScreenStackHeaderSubviewTypeRight) {
      // we wrap the headerLeft/Right component in a UIBarButtonItem
      // so we need to use the only subview of it to retrieve the correct view
      UIView *headerComponent = subview.subviews.firstObject;
      // we convert the point to RNSScreenStackView since it always contains the header inside it
      CGPoint convertedPoint = [_screenView.reactSuperview convertPoint:point toView:headerComponent];

      UIView *hitTestResult = [headerComponent hitTest:convertedPoint withEvent:event];
      if (hitTestResult != nil) {
        return hitTestResult;
      }
    }
  }
  return nil;
}

- (void)updateViewControllerIfNeeded
{
  UIViewController *vc = _screenView.controller;
  UINavigationController *nav = (UINavigationController *)vc.parentViewController;
  UIViewController *nextVC = nav.visibleViewController;
  if (nav.transitionCoordinator != nil) {
    // if navigator is performing transition instead of allowing to update of `visibleConttroller`
    // we look at `topController`. This is because during transitiong the `visibleController` won't
    // point to the controller that is going to be revealed after transition. This check fixes the
    // problem when config gets updated while the transition is ongoing.
    nextVC = nav.topViewController;
  }

  // we want updates sent to the VC directly below modal too since it is also visible
  BOOL isPresentingVC = nextVC != nil && vc.presentedViewController == nextVC && vc == nav.topViewController;

  BOOL isInFullScreenModal = nav == nil && _screenView.stackPresentation == RNSScreenStackPresentationFullScreenModal;
  // if nav is nil, it means we can be in a fullScreen modal, so there is no nextVC, but we still want to update
  if (vc != nil && (nextVC == vc || isInFullScreenModal || isPresentingVC)) {
    [RNSScreenStackHeaderConfig updateViewController:self.screenView.controller withConfig:self animated:YES];
    // As the header might have change in `updateViewController` we need to ensure that header height
    // returned by the `onHeaderHeightChange` event is correct.
    [self.screenView.controller calculateAndNotifyHeaderHeightChangeIsModal:NO];
  }
}

- (void)layoutNavigationControllerView
{
  // We need to layout navigation controller view after translucent prop changes, because otherwise
  // frame of RNSScreen will not be changed and screen content will remain the same size.
  // For more details look at https://github.com/software-mansion/react-native-screens/issues/1158
  UIViewController *vc = _screenView.controller;
  UINavigationController *navctr = vc.navigationController;
  [navctr.view setNeedsLayout];
}

- (void)updateHeaderInsetsInShadowTreeTo:(NSDirectionalEdgeInsets)insets
{
  if (_lastHeaderInsets.leading != insets.leading || _lastHeaderInsets.trailing != insets.trailing) {
#ifdef RCT_NEW_ARCH_ENABLED
    auto newState = react::RNSScreenStackHeaderConfigState{insets.leading, insets.trailing};
    _state->updateState(std::move(newState));
    _lastHeaderInsets = std::move(insets);
#else
    [_bridge.uiManager setLocalData:[[RNSHeaderConfigInsetsPayload alloc] initWithInsets:insets] forView:self];
    _lastHeaderInsets = std::move(insets);
#endif // RCT_NEW_ARCH_ENABLED
  }
}

- (BOOL)hasSubviewOfType:(RNSScreenStackHeaderSubviewType)type
{
  for (RNSScreenStackHeaderSubview *subview in _reactSubviews) {
    if (subview.type == type) {
      return YES;
    }
  }

  return NO;
}

- (BOOL)hasSubviewLeft
{
  return [self hasSubviewOfType:RNSScreenStackHeaderSubviewTypeLeft];
}

- (BOOL)shouldHeaderBeVisible
{
#ifdef RCT_NEW_ARCH_ENABLED
  return self.show;
#else
  return !self.hide;
#endif // RCT_NEW_ARCH_ENABLED
}

- (BOOL)shouldBackButtonBeVisibleInNavigationBar:(nullable UINavigationBar *)navBar
{
  return navBar.backItem != nil && !self.hideBackButton &&
      !(self.backButtonInCustomView == false && self.hasSubviewLeft);
}

+ (void)setAnimatedConfig:(UIViewController *)vc withConfig:(RNSScreenStackHeaderConfig *)config
{
  UINavigationBar *navbar = ((UINavigationController *)vc.parentViewController).navigationBar;
  // It is workaround for loading custom back icon when transitioning from a screen without header to the screen which
  // has one. This action fails when navigating to the screen with header for the second time and loads default back
  // button. It looks like changing the tint color of navbar triggers an update of the items belonging to it and it
  // seems to load the custom back image so we change the tint color's alpha by a very small amount and then set it to
  // the one it should have.
#if defined(__IPHONE_OS_VERSION_MAX_ALLOWED) && defined(__IPHONE_14_0) && \
    __IPHONE_OS_VERSION_MAX_ALLOWED >= __IPHONE_14_0
  // it brakes the behavior of `headerRight` in iOS 14, where the bug desribed above seems to be fixed, so we do nothing
  // in iOS 14
  if (@available(iOS 14.0, *)) {
  } else
#endif
  {
    [navbar setTintColor:[config.color colorWithAlphaComponent:CGColorGetAlpha(config.color.CGColor) - 0.01]];
  }
  [navbar setTintColor:config.color];

#if defined(__IPHONE_OS_VERSION_MAX_ALLOWED) && defined(__IPHONE_13_0) && \
    __IPHONE_OS_VERSION_MAX_ALLOWED >= __IPHONE_13_0
  if (@available(iOS 13.0, *)) {
    // font customized on the navigation item level, so nothing to do here
  } else
#endif
  {
    BOOL hideShadow = config.hideShadow;

    if (config.backgroundColor && CGColorGetAlpha(config.backgroundColor.CGColor) == 0.) {
      [navbar setBackgroundImage:[UIImage new] forBarMetrics:UIBarMetricsDefault];
      [navbar setBarTintColor:[UIColor clearColor]];
      hideShadow = YES;
    } else {
      [navbar setBackgroundImage:nil forBarMetrics:UIBarMetricsDefault];
      [navbar setBarTintColor:config.backgroundColor];
    }
    [navbar setTranslucent:config.translucent];
    [navbar setValue:@(hideShadow ? YES : NO) forKey:@"hidesShadow"];

    if (config.titleFontFamily || config.titleFontSize || config.titleFontWeight || config.titleColor) {
      NSMutableDictionary *attrs = [NSMutableDictionary new];

      if (config.titleColor) {
        attrs[NSForegroundColorAttributeName] = config.titleColor;
      }

      NSString *family = config.titleFontFamily ?: nil;
      NSNumber *size = config.titleFontSize ?: @17;
      NSString *weight = config.titleFontWeight ?: nil;
      if (family || weight) {
        attrs[NSFontAttributeName] = [RCTFont updateFont:nil
                                              withFamily:family
                                                    size:size
                                                  weight:weight
                                                   style:nil
                                                 variant:nil
                                         scaleMultiplier:1.0];
      } else {
        attrs[NSFontAttributeName] = [UIFont boldSystemFontOfSize:[size floatValue]];
      }
      [navbar setTitleTextAttributes:attrs];
    }

#if !TARGET_OS_TV && !TARGET_OS_VISION
    if (@available(iOS 11.0, *)) {
      if (config.largeTitle &&
          (config.largeTitleFontFamily || config.largeTitleFontSize || config.largeTitleFontWeight ||
           config.largeTitleColor || config.titleColor)) {
        NSMutableDictionary *largeAttrs = [NSMutableDictionary new];
        if (config.largeTitleColor || config.titleColor) {
          largeAttrs[NSForegroundColorAttributeName] =
              config.largeTitleColor ? config.largeTitleColor : config.titleColor;
        }
        NSString *largeFamily = config.largeTitleFontFamily ?: nil;
        NSNumber *largeSize = config.largeTitleFontSize ?: @34;
        NSString *largeWeight = config.largeTitleFontWeight ?: nil;
        if (largeFamily || largeWeight) {
          largeAttrs[NSFontAttributeName] = [RCTFont updateFont:nil
                                                     withFamily:largeFamily
                                                           size:largeSize
                                                         weight:largeWeight
                                                          style:nil
                                                        variant:nil
                                                scaleMultiplier:1.0];
        } else {
          largeAttrs[NSFontAttributeName] = [UIFont systemFontOfSize:[largeSize floatValue] weight:UIFontWeightBold];
        }
        [navbar setLargeTitleTextAttributes:largeAttrs];
      }
    }
#endif
  }
}

+ (void)setTitleAttibutes:(NSDictionary *)attrs forButton:(UIBarButtonItem *)button
{
  [button setTitleTextAttributes:attrs forState:UIControlStateNormal];
  [button setTitleTextAttributes:attrs forState:UIControlStateHighlighted];
  [button setTitleTextAttributes:attrs forState:UIControlStateDisabled];
  [button setTitleTextAttributes:attrs forState:UIControlStateSelected];
  [button setTitleTextAttributes:attrs forState:UIControlStateFocused];
}

+ (UIImage *)loadBackButtonImageInViewController:(UIViewController *)vc withConfig:(RNSScreenStackHeaderConfig *)config
{
  BOOL hasBackButtonImage = NO;
  for (RNSScreenStackHeaderSubview *subview in config.reactSubviews) {
    if (subview.type == RNSScreenStackHeaderSubviewTypeBackButton && subview.subviews.count > 0) {
      hasBackButtonImage = YES;
#ifdef RCT_NEW_ARCH_ENABLED
      RCTImageComponentView *imageView = subview.subviews[0];
#else
      RCTImageView *imageView = subview.subviews[0];
#endif // RCT_NEW_ARCH_ENABLED
      if (imageView.image == nil) {
        // This is yet another workaround for loading custom back icon. It turns out that under
        // certain circumstances image attribute can be null despite the app running in production
        // mode (when images are loaded from the filesystem). This can happen because image attribute
        // is reset when image view is detached from window, and also in some cases initialization
        // does not populate the frame of the image view before the loading start. The latter result
        // in the image attribute not being updated. We manually set frame to the size of an image
        // in order to trigger proper reload that'd update the image attribute.
        RCTImageSource *imageSource = [RNSScreenStackHeaderConfig imageSourceFromImageView:imageView];
        [imageView reactSetFrame:CGRectMake(
                                     imageView.frame.origin.x,
                                     imageView.frame.origin.y,
                                     imageSource.size.width,
                                     imageSource.size.height)];
      }

      UIImage *image = imageView.image;

      // IMPORTANT!!!
      // image can be nil in DEV MODE ONLY
      //
      // It is so, because in dev mode images are loaded over HTTP from the packager. In that case
      // we first check if image is already loaded in cache and if it is, we take it from cache and
      // display immediately. Otherwise we wait for the transition to finish and retry updating
      // header config.
      // Unfortunately due to some problems in UIKit we cannot update the image while the screen
      // transition is ongoing. This results in the settings being reset after the transition is done
      // to the state from before the transition.
      if (image == nil) {
        // in DEV MODE we try to load from cache (we use private API for that as it is not exposed
        // publically in headers).
        RCTImageSource *imageSource = [RNSScreenStackHeaderConfig imageSourceFromImageView:imageView];
        RCTImageLoader *imageLoader = [subview.bridge moduleForClass:[RCTImageLoader class]];

        image = [imageLoader.imageCache
            imageForUrl:imageSource.request.URL.absoluteString
                   size:imageSource.size
                  scale:imageSource.scale
#ifdef RCT_NEW_ARCH_ENABLED
             resizeMode:resizeModeFromCppEquiv(
                            std::static_pointer_cast<const react::ImageProps>(imageView.props)->resizeMode)];
#else
             resizeMode:imageView.resizeMode];
#endif // RCT_NEW_ARCH_ENABLED
      }
      if (image == nil) {
        // This will be triggered if the image is not in the cache yet. What we do is we wait until
        // the end of transition and run header config updates again. We could potentially wait for
        // image on load to trigger, but that would require even more private method hacking.
        if (vc.transitionCoordinator) {
          [vc.transitionCoordinator
              animateAlongsideTransition:^(id<UIViewControllerTransitionCoordinatorContext> _Nonnull context) {
                // nothing, we just want completion
              }
              completion:^(id<UIViewControllerTransitionCoordinatorContext> _Nonnull context) {
          // in order for new back button image to be loaded we need to trigger another change
          // in back button props that'd make UIKit redraw the button. Otherwise the changes are
          // not reflected. Here we change back button visibility which is then immediately restored
#if !TARGET_OS_TV
                vc.navigationItem.hidesBackButton = YES;
#endif
                [config updateViewControllerIfNeeded];
              }];
        }
        return [UIImage new];
      } else {
        return image;
      }
    }
  }
  return nil;
}

+ (void)willShowViewController:(UIViewController *)vc
                      animated:(BOOL)animated
                    withConfig:(RNSScreenStackHeaderConfig *)config
{
  [self updateViewController:vc withConfig:config animated:animated];
  // As the header might have change in `updateViewController` we need to ensure that header height
  // returned by the `onHeaderHeightChange` event is correct.
  if ([vc isKindOfClass:[RNSScreen class]]) {
    [(RNSScreen *)vc calculateAndNotifyHeaderHeightChangeIsModal:NO];
  }
}

#if defined(__IPHONE_OS_VERSION_MAX_ALLOWED) && defined(__IPHONE_13_0) && \
    __IPHONE_OS_VERSION_MAX_ALLOWED >= __IPHONE_13_0
+ (UINavigationBarAppearance *)buildAppearance:(UIViewController *)vc
                                    withConfig:(RNSScreenStackHeaderConfig *)config API_AVAILABLE(ios(13.0))
{
  UINavigationBarAppearance *appearance = [UINavigationBarAppearance new];

  if (config.backgroundColor && CGColorGetAlpha(config.backgroundColor.CGColor) == 0.) {
    // transparent background color
    [appearance configureWithTransparentBackground];
  } else {
    [appearance configureWithOpaqueBackground];
  }

  // set background color if specified
  if (config.backgroundColor) {
    appearance.backgroundColor = config.backgroundColor;
  }

  if (config.blurEffect != RNSBlurEffectStyleNone) {
    appearance.backgroundEffect =
        [UIBlurEffect effectWithStyle:[RNSConvert tryConvertRNSBlurEffectStyleToUIBlurEffectStyle:config.blurEffect]];
  } else {
    appearance.backgroundEffect = nil;
  }

  if (config.hideShadow) {
    appearance.shadowColor = nil;
  }

  if (config.titleFontFamily || config.titleFontSize || config.titleFontWeight || config.titleColor) {
    NSMutableDictionary *attrs = [NSMutableDictionary new];

    // Ignore changing header title color on visionOS
#if !TARGET_OS_VISION
    if (config.titleColor) {
      attrs[NSForegroundColorAttributeName] = config.titleColor;
    }
#endif

    NSString *family = config.titleFontFamily ?: nil;
    NSNumber *size = config.titleFontSize ?: @17;
    NSString *weight = config.titleFontWeight ?: nil;
    if (family || weight) {
      attrs[NSFontAttributeName] = [RCTFont updateFont:nil
                                            withFamily:config.titleFontFamily
                                                  size:size
                                                weight:weight
                                                 style:nil
                                               variant:nil
                                       scaleMultiplier:1.0];
    } else {
      attrs[NSFontAttributeName] = [UIFont boldSystemFontOfSize:[size floatValue]];
    }
    appearance.titleTextAttributes = attrs;
  }

  if (config.largeTitleFontFamily || config.largeTitleFontSize || config.largeTitleFontWeight ||
      config.largeTitleColor || config.titleColor) {
    NSMutableDictionary *largeAttrs = [NSMutableDictionary new];

    // Ignore changing header title color on visionOS
#if !TARGET_OS_VISION
    if (config.largeTitleColor || config.titleColor) {
      largeAttrs[NSForegroundColorAttributeName] = config.largeTitleColor ? config.largeTitleColor : config.titleColor;
    }
#endif

    NSString *largeFamily = config.largeTitleFontFamily ?: nil;
    NSNumber *largeSize = config.largeTitleFontSize ?: @34;
    NSString *largeWeight = config.largeTitleFontWeight ?: nil;
    if (largeFamily || largeWeight) {
      largeAttrs[NSFontAttributeName] = [RCTFont updateFont:nil
                                                 withFamily:largeFamily
                                                       size:largeSize
                                                     weight:largeWeight
                                                      style:nil
                                                    variant:nil
                                            scaleMultiplier:1.0];
    } else {
      largeAttrs[NSFontAttributeName] = [UIFont systemFontOfSize:[largeSize floatValue] weight:UIFontWeightBold];
    }

    appearance.largeTitleTextAttributes = largeAttrs;
  }

  UIImage *backButtonImage = [self loadBackButtonImageInViewController:vc withConfig:config];
  if (backButtonImage) {
    [appearance setBackIndicatorImage:backButtonImage transitionMaskImage:backButtonImage];
  } else if (appearance.backIndicatorImage) {
    [appearance setBackIndicatorImage:nil transitionMaskImage:nil];
  }
  return appearance;
}
#endif // Check for >= iOS 13.0

+ (void)updateViewController:(UIViewController *)vc
                  withConfig:(RNSScreenStackHeaderConfig *)config
                    animated:(BOOL)animated
{
  UINavigationItem *navitem = vc.navigationItem;
  UINavigationController *navctr = (UINavigationController *)vc.parentViewController;

  // When modal is shown the underlying RNSScreen isn't attached to any navigation controller.
  // During the modal dismissal transition this update method is called on this RNSScreen resulting in nil navctr.
  // After the transition is completed it will be called again and will configure the navigation controller correctly.
  // Also see: https://github.com/software-mansion/react-native-screens/pull/2336
  if (navctr == nil) {
    return;
  }

  NSUInteger currentIndex = [navctr.viewControllers indexOfObject:vc];
  UINavigationItem *prevItem =
      currentIndex > 0 ? [navctr.viewControllers objectAtIndex:currentIndex - 1].navigationItem : nil;

  BOOL wasHidden = navctr.navigationBarHidden;
  BOOL shouldHide = config == nil || !config.shouldHeaderBeVisible;

  if (!shouldHide && !config.translucent) {
    // when nav bar is not translucent we chage edgesForExtendedLayout to avoid system laying out
    // the screen underneath navigation controllers
    vc.edgesForExtendedLayout = UIRectEdgeNone;
  } else {
    // system default is UIRectEdgeAll
    vc.edgesForExtendedLayout = UIRectEdgeAll;
  }

  [navctr setNavigationBarHidden:shouldHide animated:animated];

  if ((config.direction == UISemanticContentAttributeForceLeftToRight ||
       config.direction == UISemanticContentAttributeForceRightToLeft) &&
      // iOS 12 cancels swipe gesture when direction is changed. See #1091
      navctr.view.semanticContentAttribute != config.direction) {
    // This is needed for swipe back gesture direction
    navctr.view.semanticContentAttribute = config.direction;

    // This is responsible for the direction of the navigationBar and its contents
    navctr.navigationBar.semanticContentAttribute = config.direction;
    [[UIButton appearanceWhenContainedInInstancesOfClasses:@[ navctr.navigationBar.class ]]
        setSemanticContentAttribute:config.direction];
    [[UIView appearanceWhenContainedInInstancesOfClasses:@[ navctr.navigationBar.class ]]
        setSemanticContentAttribute:config.direction];
    [[UISearchBar appearanceWhenContainedInInstancesOfClasses:@[ navctr.navigationBar.class ]]
        setSemanticContentAttribute:config.direction];
  }

  if (shouldHide) {
    navitem.title = config.title;
    return;
  }

#if !TARGET_OS_TV
  const auto isBackTitleBlank = [NSString RNSisBlank:config.backTitle] == YES;
  NSString *resolvedBackTitle = isBackTitleBlank ? prevItem.title : config.backTitle;
  RNSUIBarButtonItem *backBarButtonItem = [[RNSUIBarButtonItem alloc] initWithTitle:resolvedBackTitle
                                                                              style:UIBarButtonItemStylePlain
                                                                             target:nil
                                                                             action:nil];
  [backBarButtonItem setMenuHidden:config.disableBackButtonMenu];

  auto isBackButtonCustomized = !isBackTitleBlank || config.disableBackButtonMenu;

#if defined(__IPHONE_OS_VERSION_MAX_ALLOWED) && defined(__IPHONE_14_0) && \
    __IPHONE_OS_VERSION_MAX_ALLOWED >= __IPHONE_14_0
  if (@available(iOS 14.0, *)) {
    prevItem.backButtonDisplayMode = config.backButtonDisplayMode;
  }
#endif

  if (config.isBackTitleVisible) {
    if ((config.backTitleFontFamily &&
         // While being used by react-navigation, the `backTitleFontFamily` will
         // be set to "System" by default - which is the system default font.
         // To avoid always considering the font as customized, we need to have an additional check.
         // See: https://github.com/software-mansion/react-native-screens/pull/2105#discussion_r1565222738
         ![config.backTitleFontFamily isEqual:@"System"]) ||
        config.backTitleFontSize) {
      isBackButtonCustomized = YES;
      NSMutableDictionary *attrs = [NSMutableDictionary new];
      NSNumber *size = config.backTitleFontSize ?: @17;
      if (config.backTitleFontFamily) {
        attrs[NSFontAttributeName] = [RCTFont updateFont:nil
                                              withFamily:config.backTitleFontFamily
                                                    size:size
                                                  weight:nil
                                                   style:nil
                                                 variant:nil
                                         scaleMultiplier:1.0];
      } else {
        attrs[NSFontAttributeName] = [UIFont boldSystemFontOfSize:[size floatValue]];
      }
      [self setTitleAttibutes:attrs forButton:backBarButtonItem];
    }
  } else {
    // back button title should be not visible next to back button,
    // but it should still appear in back menu (if one is enabled)

    // When backBarButtonItem's title is null, back menu will use value
    // of backButtonTitle
    [backBarButtonItem setTitle:nil];
    isBackButtonCustomized = YES;
    prevItem.backButtonTitle = resolvedBackTitle;
  }

  // Prevent unnecessary assignment of backBarButtonItem if it is not customized,
  // as assigning one will override the native behavior of automatically shortening
  // the title to "Back" or hide the back title if there's not enough space.
  // See: https://github.com/software-mansion/react-native-screens/issues/1589
  if (isBackButtonCustomized) {
    prevItem.backBarButtonItem = backBarButtonItem;
  }

  if (@available(iOS 11.0, *)) {
    if (config.largeTitle) {
      navctr.navigationBar.prefersLargeTitles = YES;
    }
    navitem.largeTitleDisplayMode =
        config.largeTitle ? UINavigationItemLargeTitleDisplayModeAlways : UINavigationItemLargeTitleDisplayModeNever;
  }
#endif

#if defined(__IPHONE_OS_VERSION_MAX_ALLOWED) && defined(__IPHONE_13_0) && \
    __IPHONE_OS_VERSION_MAX_ALLOWED >= __IPHONE_13_0
  if (@available(iOS 13.0, tvOS 13.0, *)) {
    UINavigationBarAppearance *appearance = [self buildAppearance:vc withConfig:config];
    navitem.standardAppearance = appearance;
    navitem.compactAppearance = appearance;

// appearance does not apply to the tvOS so we need to use lagacy customization
#if TARGET_OS_TV
    navctr.navigationBar.titleTextAttributes = appearance.titleTextAttributes;
    navctr.navigationBar.backgroundColor = appearance.backgroundColor;
#endif

    UINavigationBarAppearance *scrollEdgeAppearance =
        [[UINavigationBarAppearance alloc] initWithBarAppearance:appearance];
    if (config.largeTitleBackgroundColor != nil) {
      scrollEdgeAppearance.backgroundColor = config.largeTitleBackgroundColor;
    }
    if (config.largeTitleHideShadow) {
      scrollEdgeAppearance.shadowColor = nil;
    }
    navitem.scrollEdgeAppearance = scrollEdgeAppearance;
  } else
#endif
  {
#if !TARGET_OS_TV
    // updating backIndicatotImage does not work when called during transition. On iOS pre 13 we need
    // to update it before the navigation starts.
    UIImage *backButtonImage = [self loadBackButtonImageInViewController:vc withConfig:config];
    if (backButtonImage) {
      navctr.navigationBar.backIndicatorImage = backButtonImage;
      navctr.navigationBar.backIndicatorTransitionMaskImage = backButtonImage;
    } else if (navctr.navigationBar.backIndicatorImage) {
      navctr.navigationBar.backIndicatorImage = nil;
      navctr.navigationBar.backIndicatorTransitionMaskImage = nil;
    }
#endif
  }
#if !TARGET_OS_TV
  navitem.hidesBackButton = config.hideBackButton;
#endif
  navitem.leftBarButtonItem = nil;
  navitem.rightBarButtonItem = nil;
  navitem.titleView = nil;

  for (RNSScreenStackHeaderSubview *subview in config.reactSubviews) {
    // This code should be kept in sync on Fabric with analogous switch statement in
    // `- [RNSScreenStackHeaderConfig replaceNavigationBarViewsWithSnapshotOfSubview:]` method.
    switch (subview.type) {
      case RNSScreenStackHeaderSubviewTypeLeft: {
#if !TARGET_OS_TV
        navitem.leftItemsSupplementBackButton = config.backButtonInCustomView;
#endif
        UIBarButtonItem *buttonItem = [[UIBarButtonItem alloc] initWithCustomView:subview];
        navitem.leftBarButtonItem = buttonItem;
        break;
      }
      case RNSScreenStackHeaderSubviewTypeRight: {
        UIBarButtonItem *buttonItem = [[UIBarButtonItem alloc] initWithCustomView:subview];
        navitem.rightBarButtonItem = buttonItem;
        break;
      }
      case RNSScreenStackHeaderSubviewTypeCenter:
      case RNSScreenStackHeaderSubviewTypeTitle: {
        navitem.titleView = subview;
        break;
      }
      case RNSScreenStackHeaderSubviewTypeSearchBar: {
        if (subview.subviews == nil || [subview.subviews count] == 0) {
          RCTLogWarn(
              @"Failed to attach search bar to the header. We recommend using `useLayoutEffect` when managing "
               "searchBar properties dynamically. \n\nSee: github.com/software-mansion/react-native-screens/issues/1188");
          break;
        }

        if ([subview.subviews[0] isKindOfClass:[RNSSearchBar class]]) {
#if !TARGET_OS_TV
          if (@available(iOS 11.0, *)) {
            RNSSearchBar *searchBar = subview.subviews[0];
            navitem.searchController = searchBar.controller;
            navitem.hidesSearchBarWhenScrolling = searchBar.hideWhenScrolling;
#if defined(__IPHONE_OS_VERSION_MAX_ALLOWED) && defined(__IPHONE_16_0) && \
    __IPHONE_OS_VERSION_MAX_ALLOWED >= __IPHONE_16_0
            if (@available(iOS 16.0, *)) {
              navitem.preferredSearchBarPlacement = [searchBar placementAsUINavigationItemSearchBarPlacement];
            }
#endif /* Check for iOS 16.0 */
          }
#endif /* !TARGET_OS_TV */
        }
        break;
      }
      case RNSScreenStackHeaderSubviewTypeBackButton: {
        break;
      }
    }
  }

  // This assignment should be done after `navitem.titleView = ...` assignment (iOS 16.0 bug).
  // See: https://github.com/software-mansion/react-native-screens/issues/1570 (comments)
  navitem.title = config.title;

  if (animated && vc.transitionCoordinator != nil &&
      vc.transitionCoordinator.presentationStyle == UIModalPresentationNone && !wasHidden) {
    // when there is an ongoing transition we may need to update navbar setting in animation block
    // using animateAlongsideTransition. However, we only do that given the transition is not a modal
    // transition (presentationStyle == UIModalPresentationNone) and that the bar was not previously
    // hidden. This is because both for modal transitions and transitions from screen with hidden bar
    // the transition animation block does not get triggered. This is ok, because with both of those
    // types of transitions there is no "shared" navigation bar that needs to be updated in an animated
    // way.
    [vc.transitionCoordinator
        animateAlongsideTransition:^(id<UIViewControllerTransitionCoordinatorContext> _Nonnull context) {
          [self setAnimatedConfig:vc withConfig:config];
        }
        completion:^(id<UIViewControllerTransitionCoordinatorContext> _Nonnull context) {
          if ([context isCancelled]) {
            UIViewController *fromVC = [context viewControllerForKey:UITransitionContextFromViewControllerKey];
            RNSScreenStackHeaderConfig *config = nil;
            for (UIView *subview in fromVC.view.reactSubviews) {
              if ([subview isKindOfClass:[RNSScreenStackHeaderConfig class]]) {
                config = (RNSScreenStackHeaderConfig *)subview;
                break;
              }
            }
            [self setAnimatedConfig:fromVC withConfig:config];
          }
        }];
  } else {
    [self setAnimatedConfig:vc withConfig:config];
  }
}

RNS_IGNORE_SUPER_CALL_BEGIN
- (void)insertReactSubview:(RNSScreenStackHeaderSubview *)subview atIndex:(NSInteger)atIndex
{
  [_reactSubviews insertObject:subview atIndex:atIndex];
  subview.reactSuperview = self;
}

- (void)removeReactSubview:(RNSScreenStackHeaderSubview *)subview
{
  [_reactSubviews removeObject:subview];
}
RNS_IGNORE_SUPER_CALL_BEGIN

- (void)didUpdateReactSubviews
{
  [super didUpdateReactSubviews];
  [self updateViewControllerIfNeeded];
}

#ifdef RCT_NEW_ARCH_ENABLED
#pragma mark - Fabric specific

- (void)mountChildComponentView:(UIView<RCTComponentViewProtocol> *)childComponentView index:(NSInteger)index
{
  if (![childComponentView isKindOfClass:[RNSScreenStackHeaderSubview class]]) {
    RCTLogError(@"ScreenStackHeader only accepts children of type ScreenStackHeaderSubview");
    return;
  }

  RCTAssert(
      childComponentView.superview == nil,
      @"Attempt to mount already mounted component view. (parent: %@, child: %@, index: %@, existing parent: %@)",
      self,
      childComponentView,
      @(index),
      @([childComponentView.superview tag]));

  //  [_reactSubviews insertObject:(RNSScreenStackHeaderSubview *)childComponentView atIndex:index];
  [self insertReactSubview:(RNSScreenStackHeaderSubview *)childComponentView atIndex:index];
  [self updateViewControllerIfNeeded];
}

- (void)unmountChildComponentView:(UIView<RCTComponentViewProtocol> *)childComponentView index:(NSInteger)index
{
  BOOL isGoingToBeRemoved = _screenView.isMarkedForUnmountInCurrentTransaction;
  if (isGoingToBeRemoved) {
    // For explanation of why we can make a snapshot here despite the fact that our children are already
    // unmounted see https://github.com/software-mansion/react-native-screens/pull/2261
    [self replaceNavigationBarViewsWithSnapshotOfSubview:(RNSScreenStackHeaderSubview *)childComponentView];
  }
  [_reactSubviews removeObject:(RNSScreenStackHeaderSubview *)childComponentView];
  [childComponentView removeFromSuperview];
  if (!isGoingToBeRemoved) {
    [self updateViewControllerIfNeeded];
  }
}

- (void)replaceNavigationBarViewsWithSnapshotOfSubview:(RNSScreenStackHeaderSubview *)childComponentView
{
  UINavigationItem *navitem = _screenView.controller.navigationItem;
  UIView *snapshot = [childComponentView snapshotViewAfterScreenUpdates:NO];

  // This code should be kept in sync with analogous switch statement in
  // `+ [RNSScreenStackHeaderConfig updateViewController: withConfig: animated:]` method.
  switch (childComponentView.type) {
    case RNSScreenStackHeaderSubviewTypeLeft:
      navitem.leftBarButtonItem.customView = snapshot;
      break;
    case RNSScreenStackHeaderSubviewTypeCenter:
    case RNSScreenStackHeaderSubviewTypeTitle:
      navitem.titleView = snapshot;
      break;
    case RNSScreenStackHeaderSubviewTypeRight:
      navitem.rightBarButtonItem.customView = snapshot;
      break;
    case RNSScreenStackHeaderSubviewTypeSearchBar:
    case RNSScreenStackHeaderSubviewTypeBackButton:
      break;
    default:
      RCTLogError(@"[RNScreens] Unhandled subview type: %ld", childComponentView.type);
  }
}

static RCTResizeMode resizeModeFromCppEquiv(react::ImageResizeMode resizeMode)
{
  switch (resizeMode) {
    case react::ImageResizeMode::Cover:
      return RCTResizeModeCover;
    case react::ImageResizeMode::Contain:
      return RCTResizeModeContain;
    case react::ImageResizeMode::Stretch:
      return RCTResizeModeStretch;
    case react::ImageResizeMode::Center:
      return RCTResizeModeCenter;
    case react::ImageResizeMode::Repeat:
      return RCTResizeModeRepeat;
    default:
      // Both RCTConvert and ImageProps use this as a default as of RN 0.76
      return RCTResizeModeStretch;
  }
}

/**
 * Fabric implementation of helper method for +loadBackButtonImageInViewController:withConfig:
 * There is corresponding Paper implementation (with different parameter type) in Paper specific section.
 */
+ (RCTImageSource *)imageSourceFromImageView:(RCTImageComponentView *)view
{
  const auto &imageProps = *std::static_pointer_cast<const react::ImageProps>(view.props);
  react::ImageSource cppImageSource = imageProps.sources.at(0);
  auto imageSize = CGSize{cppImageSource.size.width, cppImageSource.size.height};
  NSURLRequest *request =
      [NSURLRequest requestWithURL:[NSURL URLWithString:RCTNSStringFromStringNilIfEmpty(cppImageSource.uri)]];
  RCTImageSource *imageSource = [[RCTImageSource alloc] initWithURLRequest:request
                                                                      size:imageSize
                                                                     scale:cppImageSource.scale];
  return imageSource;
}

#pragma mark - RCTComponentViewProtocol

- (void)prepareForRecycle
{
  [super prepareForRecycle];
  _initialPropsSet = NO;
  _lastHeaderInsets = NSDirectionalEdgeInsets{};
}

- (NSNumber *)getFontSizePropValue:(int)value
{
  if (value > 0)
    return [NSNumber numberWithInt:value];
  return nil;
}

+ (react::ComponentDescriptorProvider)componentDescriptorProvider
{
  return react::concreteComponentDescriptorProvider<react::RNSScreenStackHeaderConfigComponentDescriptor>();
}

- (void)updateProps:(react::Props::Shared const &)props oldProps:(react::Props::Shared const &)oldProps
{
  const auto &oldScreenProps = *std::static_pointer_cast<const react::RNSScreenStackHeaderConfigProps>(_props);
  const auto &newScreenProps = *std::static_pointer_cast<const react::RNSScreenStackHeaderConfigProps>(props);

  BOOL needsNavigationControllerLayout = !_initialPropsSet;

  if (newScreenProps.hidden != !_show) {
    _show = !newScreenProps.hidden;
    needsNavigationControllerLayout = YES;
  }

  if (newScreenProps.translucent != _translucent) {
    _translucent = newScreenProps.translucent;
    needsNavigationControllerLayout = YES;
  }

  if (newScreenProps.backButtonInCustomView != _backButtonInCustomView) {
    [self setBackButtonInCustomView:newScreenProps.backButtonInCustomView];
  }

  _title = RCTNSStringFromStringNilIfEmpty(newScreenProps.title);
  if (newScreenProps.titleFontFamily != oldScreenProps.titleFontFamily) {
    _titleFontFamily = RCTNSStringFromStringNilIfEmpty(newScreenProps.titleFontFamily);
  }
  _titleFontWeight = RCTNSStringFromStringNilIfEmpty(newScreenProps.titleFontWeight);
  _titleFontSize = [self getFontSizePropValue:newScreenProps.titleFontSize];
  _hideShadow = newScreenProps.hideShadow;

  _largeTitle = newScreenProps.largeTitle;
  if (newScreenProps.largeTitleFontFamily != oldScreenProps.largeTitleFontFamily) {
    _largeTitleFontFamily = RCTNSStringFromStringNilIfEmpty(newScreenProps.largeTitleFontFamily);
  }
  _largeTitleFontWeight = RCTNSStringFromStringNilIfEmpty(newScreenProps.largeTitleFontWeight);
  _largeTitleFontSize = [self getFontSizePropValue:newScreenProps.largeTitleFontSize];
  _largeTitleHideShadow = newScreenProps.largeTitleHideShadow;
  _largeTitleBackgroundColor = RCTUIColorFromSharedColor(newScreenProps.largeTitleBackgroundColor);
  
  _backTitle = RCTNSStringFromStringNilIfEmpty(newScreenProps.backTitle);
  if (newScreenProps.backTitleFontFamily != oldScreenProps.backTitleFontFamily) {
    _backTitleFontFamily = RCTNSStringFromStringNilIfEmpty(newScreenProps.backTitleFontFamily);
  }
  _backTitleFontSize = [self getFontSizePropValue:newScreenProps.backTitleFontSize];
  _hideBackButton = newScreenProps.hideBackButton;
  _disableBackButtonMenu = newScreenProps.disableBackButtonMenu;
  _backButtonDisplayMode =
      [RNSConvert UINavigationItemBackButtonDisplayModeFromCppEquivalent:newScreenProps.backButtonDisplayMode];

  if (newScreenProps.direction != oldScreenProps.direction) {
    _direction = [RNSConvert UISemanticContentAttributeFromCppEquivalent:newScreenProps.direction];
  }

  _backTitleVisible = newScreenProps.backTitleVisible;

  // We cannot compare SharedColor because it is shared value.
  // We could compare color value, but it is more performant to just assign new value
  _titleColor = RCTUIColorFromSharedColor(newScreenProps.titleColor);
  _largeTitleColor = RCTUIColorFromSharedColor(newScreenProps.largeTitleColor);
  _color = RCTUIColorFromSharedColor(newScreenProps.color);
  _backgroundColor = RCTUIColorFromSharedColor(newScreenProps.backgroundColor);

  if (newScreenProps.blurEffect != oldScreenProps.blurEffect) {
    _blurEffect = [RNSConvert RNSBlurEffectStyleFromCppEquivalent:newScreenProps.blurEffect];
  }

  [self updateViewControllerIfNeeded];

  if (needsNavigationControllerLayout) {
    [self layoutNavigationControllerView];
  }

  _initialPropsSet = YES;
  _props = std::static_pointer_cast<react::RNSScreenStackHeaderConfigProps const>(props);

  [super updateProps:props oldProps:oldProps];
}

- (void)updateState:(const facebook::react::State::Shared &)state
           oldState:(const facebook::react::State::Shared &)oldState
{
  _state = std::static_pointer_cast<const react::RNSScreenStackHeaderConfigShadowNode::ConcreteState>(state);
}

#else
#pragma mark - Paper specific

- (void)didSetProps:(NSArray<NSString *> *)changedProps
{
  [super didSetProps:changedProps];
  [self updateViewControllerIfNeeded];
  // We need to layout navigation controller view after translucent prop changes, because otherwise
  // frame of RNSScreen will not be changed and screen content will remain the same size.
  // For more details look at https://github.com/software-mansion/react-native-screens/issues/1158
  if ([changedProps containsObject:@"translucent"]) {
    [self layoutNavigationControllerView];
  }
}

/**
 * Paper implementation of helper method for +loadBackButtonImageInViewController:withConfig:
 * There is corresponding Fabric implementation (with different parameter type) in Fabric specific section.
 */
+ (RCTImageSource *)imageSourceFromImageView:(RCTImageView *)view
{
  return view.imageSources[0];
}

#endif
@end

#ifdef RCT_NEW_ARCH_ENABLED
Class<RCTComponentViewProtocol> RNSScreenStackHeaderConfigCls(void)
{
  return RNSScreenStackHeaderConfig.class;
}
#endif

@implementation RNSScreenStackHeaderConfigManager

RCT_EXPORT_MODULE()

#ifdef RCT_NEW_ARCH_ENABLED
#else

- (UIView *)view
{
  return [[RNSScreenStackHeaderConfig alloc] initWithBridge:self.bridge];
}

- (RCTShadowView *)shadowView
{
  return [RNSScreenStackHeaderConfigShadowView new];
}

#endif // RCT_NEW_ARCH_ENABLED

RCT_EXPORT_VIEW_PROPERTY(title, NSString)
RCT_EXPORT_VIEW_PROPERTY(titleFontFamily, NSString)
RCT_EXPORT_VIEW_PROPERTY(titleFontSize, NSNumber)
RCT_EXPORT_VIEW_PROPERTY(titleFontWeight, NSString)
RCT_EXPORT_VIEW_PROPERTY(titleColor, UIColor)
RCT_EXPORT_VIEW_PROPERTY(backTitle, NSString)
RCT_EXPORT_VIEW_PROPERTY(backTitleFontFamily, NSString)
RCT_EXPORT_VIEW_PROPERTY(backTitleFontSize, NSNumber)
RCT_EXPORT_VIEW_PROPERTY(backgroundColor, UIColor)
RCT_EXPORT_VIEW_PROPERTY(backTitleVisible, BOOL)
RCT_EXPORT_VIEW_PROPERTY(blurEffect, RNSBlurEffectStyle)
RCT_EXPORT_VIEW_PROPERTY(color, UIColor)
RCT_EXPORT_VIEW_PROPERTY(direction, UISemanticContentAttribute)
RCT_EXPORT_VIEW_PROPERTY(largeTitle, BOOL)
RCT_EXPORT_VIEW_PROPERTY(largeTitleFontFamily, NSString)
RCT_EXPORT_VIEW_PROPERTY(largeTitleFontSize, NSNumber)
RCT_EXPORT_VIEW_PROPERTY(largeTitleFontWeight, NSString)
RCT_EXPORT_VIEW_PROPERTY(largeTitleColor, UIColor)
RCT_EXPORT_VIEW_PROPERTY(largeTitleBackgroundColor, UIColor)
RCT_EXPORT_VIEW_PROPERTY(largeTitleHideShadow, BOOL)
RCT_EXPORT_VIEW_PROPERTY(hideBackButton, BOOL)
RCT_EXPORT_VIEW_PROPERTY(hideShadow, BOOL)
RCT_EXPORT_VIEW_PROPERTY(backButtonInCustomView, BOOL)
RCT_EXPORT_VIEW_PROPERTY(disableBackButtonMenu, BOOL)
RCT_EXPORT_VIEW_PROPERTY(backButtonDisplayMode, UINavigationItemBackButtonDisplayMode)
RCT_REMAP_VIEW_PROPERTY(hidden, hide, BOOL) // `hidden` is an UIView property, we need to use different name internally
RCT_EXPORT_VIEW_PROPERTY(translucent, BOOL)

@end

#ifdef RCT_NEW_ARCH_ENABLED
#else

@implementation RNSHeaderConfigInsetsPayload

- (instancetype)init
{
  return [self initWithInsets:NSDirectionalEdgeInsets{}];
}

- (instancetype)initWithInsets:(NSDirectionalEdgeInsets)insets
{
  if (self = [super init]) {
    self.insets = insets;
  }
  return self;
}

@end

@implementation RNSScreenStackHeaderConfigShadowView {
}

- (void)setLocalData:(NSObject *)localData
{
  if ([localData isKindOfClass:RNSHeaderConfigInsetsPayload.class]) {
    RNSHeaderConfigInsetsPayload *payload = (RNSHeaderConfigInsetsPayload *)localData;
    [self setPaddingStart:YGValue{.value = (float)payload.insets.leading, .unit = YGUnitPoint}];
    [self setPaddingEnd:YGValue{.value = (float)payload.insets.trailing, .unit = YGUnitPoint}];

    // Trigger layout prop recomputation
    [self didSetProps:@[]];
  } else {
    [super setLocalData:localData];
  }
}

@end
#endif

@implementation RCTConvert (RNSScreenStackHeader)

+ (NSMutableDictionary *)blurEffectsForIOSVersion
{
  NSMutableDictionary *blurEffects = [NSMutableDictionary new];
  [blurEffects addEntriesFromDictionary:@{
    @"none" : @(RNSBlurEffectStyleNone),
    @"extraLight" : @(RNSBlurEffectStyleExtraLight),
    @"light" : @(RNSBlurEffectStyleLight),
    @"dark" : @(RNSBlurEffectStyleDark),
  }];

  if (@available(iOS 10.0, *)) {
    [blurEffects addEntriesFromDictionary:@{
      @"regular" : @(RNSBlurEffectStyleRegular),
      @"prominent" : @(RNSBlurEffectStyleProminent),
    }];
  }
#if !TARGET_OS_TV && defined(__IPHONE_OS_VERSION_MAX_ALLOWED) && defined(__IPHONE_13_0) && \
    __IPHONE_OS_VERSION_MAX_ALLOWED >= __IPHONE_13_0
  if (@available(iOS 13.0, *)) {
    [blurEffects addEntriesFromDictionary:@{
      @"systemUltraThinMaterial" : @(RNSBlurEffectStyleSystemUltraThinMaterial),
      @"systemThinMaterial" : @(RNSBlurEffectStyleSystemThinMaterial),
      @"systemMaterial" : @(RNSBlurEffectStyleSystemMaterial),
      @"systemThickMaterial" : @(RNSBlurEffectStyleSystemThickMaterial),
      @"systemChromeMaterial" : @(RNSBlurEffectStyleSystemChromeMaterial),
      @"systemUltraThinMaterialLight" : @(RNSBlurEffectStyleSystemUltraThinMaterialLight),
      @"systemThinMaterialLight" : @(RNSBlurEffectStyleSystemThinMaterialLight),
      @"systemMaterialLight" : @(RNSBlurEffectStyleSystemMaterialLight),
      @"systemThickMaterialLight" : @(RNSBlurEffectStyleSystemThickMaterialLight),
      @"systemChromeMaterialLight" : @(RNSBlurEffectStyleSystemChromeMaterialLight),
      @"systemUltraThinMaterialDark" : @(RNSBlurEffectStyleSystemUltraThinMaterialDark),
      @"systemThinMaterialDark" : @(RNSBlurEffectStyleSystemThinMaterialDark),
      @"systemMaterialDark" : @(RNSBlurEffectStyleSystemMaterialDark),
      @"systemThickMaterialDark" : @(RNSBlurEffectStyleSystemThickMaterialDark),
      @"systemChromeMaterialDark" : @(RNSBlurEffectStyleSystemChromeMaterialDark),
    }];
  }
#endif
  return blurEffects;
}

RCT_ENUM_CONVERTER(
    UISemanticContentAttribute,
    (@{
      @"ltr" : @(UISemanticContentAttributeForceLeftToRight),
      @"rtl" : @(UISemanticContentAttributeForceRightToLeft),
    }),
    UISemanticContentAttributeUnspecified,
    integerValue)

RCT_ENUM_CONVERTER(
    UINavigationItemBackButtonDisplayMode,
    (@{
      @"default" : @(UINavigationItemBackButtonDisplayModeDefault),
      @"generic" : @(UINavigationItemBackButtonDisplayModeGeneric),
      @"minimal" : @(UINavigationItemBackButtonDisplayModeMinimal),
    }),
    UINavigationItemBackButtonDisplayModeDefault,
    integerValue)

RCT_ENUM_CONVERTER(RNSBlurEffectStyle, ([self blurEffectsForIOSVersion]), RNSBlurEffectStyleNone, integerValue)

@end
