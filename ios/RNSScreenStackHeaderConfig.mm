#ifdef RCT_NEW_ARCH_ENABLED
#import <React/RCTConversions.h>
#import <React/RCTFabricComponentsPlugins.h>
#import <React/RCTImageComponentView.h>
#import <React/RCTMountingTransactionObserving.h>
#import <React/UIView+React.h>
#import <react/renderer/components/image/ImageProps.h>
#import <react/renderer/components/rnscreens/ComponentDescriptors.h>
#import <react/renderer/components/rnscreens/EventEmitters.h>
#import <react/renderer/components/rnscreens/Props.h>
#import <react/renderer/components/rnscreens/RCTComponentViewHelpers.h>
#import <rnscreens/RNSScreenStackHeaderConfigComponentDescriptor.h>
#import "RCTImageComponentView+RNSScreenStackHeaderConfig.h"
#import "UINavigationBar+RNSUtility.h"
#ifndef NDEBUG
#import <react/utils/ManagedObjectWrapper.h>
#endif // !NDEBUG
#else
#import <React/RCTImageView.h>
#import <React/RCTShadowView.h>
#import <React/RCTUIManager.h>
#import <React/RCTUIManagerUtils.h>
#import <utility>
#endif
#import <React/RCTBridge.h>
#import <React/RCTFont.h>
#import <React/RCTImageLoader.h>
#import <React/RCTImageSource.h>
#import "RNSBackBarButtonItem.h"
#import "RNSConvert.h"
#import "RNSDefines.h"
#import "RNSScreen.h"
#import "RNSScreenStackHeaderConfig.h"
#import "RNSSearchBar.h"

#ifdef RCT_NEW_ARCH_ENABLED
namespace react = facebook::react;
#endif // RCT_NEW_ARCH_ENABLED

static constexpr auto DEFAULT_TITLE_FONT_SIZE = @17;
static constexpr auto DEFAULT_TITLE_LARGE_FONT_SIZE = @34;

#if !defined(RCT_NEW_ARCH_ENABLED)
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

+ (BOOL)rnscreens_isBlankOrNull:(NSString *)string
{
  if (string == nil) {
    return YES;
  }
  return [[string stringByTrimmingCharactersInSet:[NSCharacterSet whitespaceAndNewlineCharacterSet]] length] == 0;
}

@end

#ifdef RCT_NEW_ARCH_ENABLED
@interface RNSScreenStackHeaderConfig () <RCTMountingTransactionObserving>
@end
#endif // RCT_NEW_ARCH_ENABLED

@implementation RNSScreenStackHeaderConfig {
  NSMutableArray<RNSScreenStackHeaderSubview *> *_reactSubviews;

  // Workaround for UIKit edgesForExtendedLayout bug on iOS 26.
  // On iOS 26, there is additional offset for UINavigationBar that is not
  // accounted for when using edgesForExtendedLayout. That's why we additionaly
  // use safeAreaLayoutGuide when header is visible. When bug gets fixed, we can
  // get rid of all code related to this workaround.
  // More information: https://github.com/software-mansion/react-native-screens/pull/3111
  NSArray<NSLayoutConstraint *> *_safeAreaConstraints;
#ifdef RCT_NEW_ARCH_ENABLED
  BOOL _initialPropsSet;

  react::RNSScreenStackHeaderConfigState _lastSendState;
  react::RNSScreenStackHeaderConfigShadowNode::ConcreteState::Shared _state;

  /// Whether a react subview has been added / removed in current transaction. This flag is reset after each react
  /// transaction via RCTMountingTransactionObserving protocol.
  bool _addedReactSubviewsInCurrentTransaction;
#ifndef NDEBUG
  RCTImageLoader *imageLoader;
#endif // !NDEBUG
#else
  NSDirectionalEdgeInsets _lastHeaderInsets;
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
    _addedReactSubviewsInCurrentTransaction = false;
    _lastSendState = react::RNSScreenStackHeaderConfigState(react::Size{}, react::EdgeInsets{});
    _safeAreaConstraints = nil;
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
      // E.g. presence of focused search bar might cause the subviews to be temporarily unmounted & we don't want
      // them to be touch targets then, otherwise we might e.g. block cancel button.
      // See: https://github.com/software-mansion/react-native-screens/issues/2899
      if (subview.window == nil) {
        continue;
      }

      // we wrap the headerLeft/Right component in a UIBarButtonItem
      // so we need to hit test subviews from left to right, because of the view flattening
      UIView *headerComponent = nil;
      for (UIView *headerComponentSubview in subview.subviews) {
        CGPoint convertedPoint = [self convertPoint:point toView:headerComponentSubview];
        UIView *hitTestResult = [headerComponentSubview hitTest:convertedPoint withEvent:event];

        if (hitTestResult != nil) {
          headerComponent = hitTestResult;
        }
      }

      return headerComponent;
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

#ifdef RCT_NEW_ARCH_ENABLED
- (void)updateShadowStateWithSize:(CGSize)size edgeInsets:(NSDirectionalEdgeInsets)edgeInsets
{
  // I believe Yoga handles RTL internally & .left will be treated as .right in RTL etc.
  react::EdgeInsets convertedEdgeInsets{
      .left = edgeInsets.leading, .top = edgeInsets.top, .right = edgeInsets.trailing, .bottom = edgeInsets.bottom};
  react::Size convertedSize = RCTSizeFromCGSize(size);
  auto newState = react::RNSScreenStackHeaderConfigState(convertedSize, convertedEdgeInsets);

  if (newState != _lastSendState) {
    _lastSendState = newState;
    _state->updateState(std::move(newState));
  }
}

- (void)updateHeaderStateInShadowTreeInContextOfNavigationBar:(nullable UINavigationBar *)navigationBar
{
  if (!navigationBar) {
    return;
  }

  [self updateShadowStateWithSize:navigationBar.frame.size
                       edgeInsets:[self computeEdgeInsetsOfNavigationBar:navigationBar]];
  for (RNSScreenStackHeaderSubview *subview in self.reactSubviews) {
    [subview updateShadowStateInContextOfAncestorView:navigationBar];
  }
}

- (NSDirectionalEdgeInsets)computeEdgeInsetsOfNavigationBar:(nonnull UINavigationBar *)navigationBar
{
  NSDirectionalEdgeInsets navBarMargins = [navigationBar directionalLayoutMargins];
  NSDirectionalEdgeInsets navBarContentMargins = [navigationBar.rnscreens_findContentView directionalLayoutMargins];

  BOOL isDisplayingBackButton = [self shouldBackButtonBeVisibleInNavigationBar:navigationBar];

  // 44.0 is just "closed eyes default". It is so on device I've tested with, nothing more.
  UIView *barButtonView = isDisplayingBackButton ? navigationBar.rnscreens_findBackButtonWrapperView : nil;
  CGFloat platformBackButtonWidth = barButtonView != nil ? barButtonView.frame.size.width : 44.0f;

  const auto edgeInsets = NSDirectionalEdgeInsets{
      .leading =
          navBarMargins.leading + navBarContentMargins.leading + (isDisplayingBackButton ? platformBackButtonWidth : 0),
      .trailing = navBarMargins.trailing + navBarContentMargins.trailing,
  };

  return edgeInsets;
}

#else
- (void)updateHeaderConfigState:(NSDirectionalEdgeInsets)insets
{
  if (_lastHeaderInsets.leading != insets.leading || _lastHeaderInsets.trailing != insets.trailing) {
    [_bridge.uiManager setLocalData:[[RNSHeaderConfigInsetsPayload alloc] initWithInsets:insets] forView:self];
    _lastHeaderInsets = std::move(insets);
  }
}
#endif // RCT_NEW_ARCH_ENABLED

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
  [navbar setTintColor:config.color];

  // font customized on the navigation item level, so nothing to do here
}

+ (void)setTitleAttibutes:(NSDictionary *)attrs forButton:(UIBarButtonItem *)button
{
  [button setTitleTextAttributes:attrs forState:UIControlStateNormal];
  [button setTitleTextAttributes:attrs forState:UIControlStateHighlighted];
  [button setTitleTextAttributes:attrs forState:UIControlStateDisabled];
  [button setTitleTextAttributes:attrs forState:UIControlStateSelected];
  [button setTitleTextAttributes:attrs forState:UIControlStateFocused];
}

- (UIImage *)loadBackButtonImageInViewController:(UIViewController *)vc
{
  BOOL hasBackButtonImage = NO;
  for (RNSScreenStackHeaderSubview *subview in self.reactSubviews) {
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

#ifndef NDEBUG
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
#ifndef RCT_NEW_ARCH_ENABLED
        RCTImageLoader *imageLoader = [_bridge moduleForClass:[RCTImageLoader class]];
#endif // !RCT_NEW_ARCH_ENABLED
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
#endif // !NDEBUG
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
                [self updateViewControllerIfNeeded];
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

+ (UINavigationBarAppearance *)buildAppearance:(UIViewController *)vc
                                    withConfig:(RNSScreenStackHeaderConfig *)config API_AVAILABLE(ios(13.0))
{
  UINavigationBarAppearance *appearance = [UINavigationBarAppearance new];

  if (config.backgroundColor && CGColorGetAlpha(config.backgroundColor.CGColor) == 0.) {
    // Preserve the shadow properties in case the user wants to show the shadow on scroll.
    UIColor *shadowColor = appearance.shadowColor;
    UIImage *shadowImage = appearance.shadowImage;
    // transparent background color
    [appearance configureWithTransparentBackground];

    if (!config.hideShadow) {
      appearance.shadowColor = shadowColor;
      appearance.shadowImage = shadowImage;
    }
  } else {
    [appearance configureWithOpaqueBackground];
  }

  // set background color if specified
  if (config.backgroundColor) {
    appearance.backgroundColor = config.backgroundColor;
  }

  switch (config.blurEffect) {
    case RNSBlurEffectStyleNone:
      appearance.backgroundEffect = nil;
      break;

    case RNSBlurEffectStyleSystemDefault:
      RCTLogError(@"[RNScreens] ScreenStack does not support RNSBlurEffectStyleSystemDefault.");
      break;

    default:
      appearance.backgroundEffect =
          [UIBlurEffect effectWithStyle:[RNSConvert tryConvertRNSBlurEffectStyleToUIBlurEffectStyle:config.blurEffect]];
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
    NSNumber *size = config.titleFontSize ?: DEFAULT_TITLE_FONT_SIZE;
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
    NSNumber *largeSize = config.largeTitleFontSize ?: DEFAULT_TITLE_LARGE_FONT_SIZE;
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

  UIImage *backButtonImage = [config loadBackButtonImageInViewController:vc];
  if (backButtonImage) {
    [appearance setBackIndicatorImage:backButtonImage transitionMaskImage:backButtonImage];
  } else if (appearance.backIndicatorImage) {
    [appearance setBackIndicatorImage:nil transitionMaskImage:nil];
  }
  return appearance;
}

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
  UIViewController *prevVC = currentIndex > 0 ? [navctr.viewControllers objectAtIndex:currentIndex - 1] : nil;
  UINavigationItem *prevItem = currentIndex > 0 ? prevVC.navigationItem : nil;

  BOOL wasHidden = navctr.navigationBarHidden;
  BOOL shouldHide = config == nil || !config.shouldHeaderBeVisible;

  // See comment above _safeAreaConstraints declaration for reason why this is necessary.
  RNSScreenContentWrapper *contentWrapper = nil;
  if (@available(iOS 26, *)) {
    if (vc.view.subviews.count > 0 && [vc.view.subviews[0] isKindOfClass:[RNSScreenContentWrapper class]]) {
      contentWrapper = static_cast<RNSScreenContentWrapper *>(vc.view.subviews[0]);
    }
  }

  if (!shouldHide && !config.translucent) {
    // when nav bar is not translucent we change edgesForExtendedLayout to avoid system laying out
    // the screen underneath navigation controllers
    vc.edgesForExtendedLayout = UIRectEdgeAll - UIRectEdgeTop;

    // See comment above _safeAreaConstraints declaration for reason why this is necessary.
    if (contentWrapper != nil) {
      // Use auto-layout
      contentWrapper.translatesAutoresizingMaskIntoConstraints = NO;

      if (config->_safeAreaConstraints == nil) {
        config->_safeAreaConstraints = @[
          [contentWrapper.topAnchor constraintEqualToAnchor:vc.view.safeAreaLayoutGuide.topAnchor],
          [contentWrapper.bottomAnchor constraintEqualToAnchor:vc.view.bottomAnchor],
          [contentWrapper.leadingAnchor constraintEqualToAnchor:vc.view.leadingAnchor],
          [contentWrapper.trailingAnchor constraintEqualToAnchor:vc.view.trailingAnchor]
        ];
      }
      [NSLayoutConstraint activateConstraints:config->_safeAreaConstraints];
    }
  } else {
    // system default is UIRectEdgeAll
    vc.edgesForExtendedLayout = UIRectEdgeAll;

    // See comment above _safeAreaConstraints declaration for reason why this is necessary.
    if (contentWrapper != nil) {
      [NSLayoutConstraint deactivateConstraints:config->_safeAreaConstraints];
      config->_safeAreaConstraints = nil;
      contentWrapper.translatesAutoresizingMaskIntoConstraints = YES;
    }
  }

  [navctr setNavigationBarHidden:shouldHide animated:animated];

  [config applySemanticContentAttributeIfNeededToNavCtrl:navctr];

  if (shouldHide) {
    navitem.title = config.title;
    return;
  }

#if !TARGET_OS_TV
  [config configureBackItem:prevItem withPrevVC:prevVC];

  if (config.largeTitle) {
    navctr.navigationBar.prefersLargeTitles = YES;
  }
  navitem.largeTitleDisplayMode =
      config.largeTitle ? UINavigationItemLargeTitleDisplayModeAlways : UINavigationItemLargeTitleDisplayModeNever;
#endif

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
    // Add support for using a fully transparent bar when the backgroundColor is set to transparent.
    if (CGColorGetAlpha(config.largeTitleBackgroundColor.CGColor) == 0.) {
      // This will also remove the background blur effect in the large title which is otherwise inherited from the
      // standard appearance.
      [scrollEdgeAppearance configureWithTransparentBackground];
      // This must be set to nil otherwise a default view will be added to the navigation bar background with an
      // opaque background.
      scrollEdgeAppearance.backgroundColor = nil;
    } else {
      scrollEdgeAppearance.backgroundColor = config.largeTitleBackgroundColor;
    }
  }
  if (config.largeTitleHideShadow) {
    scrollEdgeAppearance.shadowColor = nil;
  }
  navitem.scrollEdgeAppearance = scrollEdgeAppearance;
#if !TARGET_OS_TV
  navitem.hidesBackButton = config.hideBackButton;
#endif
  navitem.leftBarButtonItem = nil;
  navitem.rightBarButtonItem = nil;
  navitem.titleView = nil;

#if !TARGET_OS_TV
  // We want to set navitem.searchController to nil only if we are sure
  // that we are removing the search bar from the header.
  bool searchBarPresent = false;
#endif /* !TARGET_OS_TV */

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
          RNSSearchBar *searchBar = subview.subviews[0];
          searchBarPresent = true;
          navitem.searchController = searchBar.controller;
          navitem.hidesSearchBarWhenScrolling = searchBar.hideWhenScrolling;
#if RNS_IPHONE_OS_VERSION_AVAILABLE(16_0)
          if (@available(iOS 16.0, *)) {
            navitem.preferredSearchBarPlacement = [searchBar placementAsUINavigationItemSearchBarPlacement];
          }
#endif /* Check for iOS 16.0 */
#if RNS_IPHONE_OS_VERSION_AVAILABLE(26_0)
          if (@available(iOS 26.0, *)) {
            // On iOS 26 beta 6, we observe that search bar is buggy if we change the configuration
            // of search bar multiple times. Sometimes, when `stacked` search bar is enabled for root screen,
            // it does not show up. It's because we're calling *this* method 2 additional times before
            // UIKit does, in order to handle some other bugs. Only for the third time, UIKit "wants" to
            // integrate the search bar - we suspect that this final "reconfiguration" causes the bug.
            // Setting searchBarPlacementAllowsToolbarIntegration to NO fixes the issue without changing
            // older stack logic and shouldn't impact users negatively - if user wants `stacked` placement,
            // the search bar should not be integrated anyway. We should monitor if workaround is still
            // necessary in next iOS versions and remove it when the bug gets fixed.
            // More details: https://github.com/software-mansion/react-native-screens/pull/3168
            if (navitem.preferredSearchBarPlacement != UINavigationItemSearchBarPlacementStacked) {
              navitem.searchBarPlacementAllowsToolbarIntegration = searchBar.allowToolbarIntegration;
            } else {
              navitem.searchBarPlacementAllowsToolbarIntegration = NO;
            }
          }
#endif /* Check for iOS 26.0 */
#endif /* !TARGET_OS_TV */
        }
        break;
      }
      case RNSScreenStackHeaderSubviewTypeBackButton: {
        break;
      }
    }
  }

#if !TARGET_OS_TV
  if (!searchBarPresent) {
    navitem.searchController = nil;
  }
#endif /* !TARGET_OS_TV */

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

- (void)configureBackItem:(nullable UINavigationItem *)prevItem
               withPrevVC:(nullable UIViewController *)prevVC API_UNAVAILABLE(tvos)
{
#if !TARGET_OS_TV
  if (prevItem == nil) {
    return;
  }

  const auto *config = self;

  const auto isBackTitleBlank = [NSString rnscreens_isBlankOrNull:config.backTitle] == YES;
  NSString *resolvedBackTitle = isBackTitleBlank ? prevItem.title : config.backTitle;

  // If previous screen controller was recreated (e.g. when you go back to tab with stack that has multiple screens),
  // its navigationItem may not have any information from screen's headerConfig, including the title.
  // If this is the case, we attempt to extract the title from previous screen's config directly.
  if (resolvedBackTitle == nil && [prevVC isKindOfClass:[RNSScreen class]]) {
    RNSScreen *prevScreen = static_cast<RNSScreen *>(prevVC);
    resolvedBackTitle = prevScreen.screenView.findHeaderConfig.title;
  }

  prevItem.backButtonTitle = resolvedBackTitle;
  // This has any effect only in case the `backBarButtonItem` is not set.
  // We apply it before we configure the back item, because it might get overriden.
  prevItem.backButtonDisplayMode = config.backButtonDisplayMode;

  if (config.isBackTitleVisible) {
    RNSBackBarButtonItem *backBarButtonItem = [[RNSBackBarButtonItem alloc] initWithTitle:resolvedBackTitle
                                                                                    style:UIBarButtonItemStylePlain
                                                                                   target:nil
                                                                                   action:nil];
    auto shouldUseCustomBackBarButtonItem = config.disableBackButtonMenu;
    [backBarButtonItem setMenuHidden:config.disableBackButtonMenu];

    if ((config.backTitleFontFamily &&
         // While being used by react-navigation, the `backTitleFontFamily` will
         // be set to "System" by default - which is the system default font.
         // To avoid always considering the font as customized, we need to have an additional check.
         // See: https://github.com/software-mansion/react-native-screens/pull/2105#discussion_r1565222738
         ![config.backTitleFontFamily isEqual:@"System"]) ||
        config.backTitleFontSize) {
      shouldUseCustomBackBarButtonItem = YES;
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
      [RNSScreenStackHeaderConfig setTitleAttibutes:attrs forButton:backBarButtonItem];
    }

    // Prevent unnecessary assignment of backBarButtonItem if it is not customized,
    // as assigning one will override the native behavior of automatically shortening
    // the title to "Back" or hide the back title if there's not enough space.
    // See: https://github.com/software-mansion/react-native-screens/issues/1589
    if (shouldUseCustomBackBarButtonItem) {
      prevItem.backBarButtonItem = backBarButtonItem;
    }
  } else {
    // back button title should be not visible next to back button,
    // but it should still appear in back menu
    prevItem.backButtonDisplayMode = UINavigationItemBackButtonDisplayModeMinimal;
  }
#endif
}

- (void)applySemanticContentAttributeIfNeededToNavCtrl:(UINavigationController *)navCtrl
{
  if ((self.direction == UISemanticContentAttributeForceLeftToRight ||
       self.direction == UISemanticContentAttributeForceRightToLeft) &&
      // iOS 12 cancels swipe gesture when direction is changed. See #1091
      navCtrl.view.semanticContentAttribute != self.direction) {
    // This is needed for swipe back gesture direction
    navCtrl.view.semanticContentAttribute = self.direction;

    // This is responsible for the direction of the navigationBar and its contents
    navCtrl.navigationBar.semanticContentAttribute = self.direction;
    [[UIButton appearanceWhenContainedInInstancesOfClasses:@[ navCtrl.navigationBar.class ]]
        setSemanticContentAttribute:self.direction];
    [[UIView appearanceWhenContainedInInstancesOfClasses:@[ navCtrl.navigationBar.class ]]
        setSemanticContentAttribute:self.direction];
    [[UISearchBar appearanceWhenContainedInInstancesOfClasses:@[ navCtrl.navigationBar.class ]]
        setSemanticContentAttribute:self.direction];
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
RNS_IGNORE_SUPER_CALL_END

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

  _addedReactSubviewsInCurrentTransaction = true;
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

- (void)mountingTransactionDidMount:(const facebook::react::MountingTransaction &)transaction
               withSurfaceTelemetry:(const facebook::react::SurfaceTelemetry &)surfaceTelemetry
{
  if (_addedReactSubviewsInCurrentTransaction) {
    [self updateViewControllerIfNeeded];

    // This call is made for the sake of https://github.com/software-mansion/react-native-screens/pull/2466.
    // In case header subview is added **after initial screen render** the system positions it correctly,
    // however `viewDidLayoutSubviews` is not called on `RNSNavigationController` and updated frame sizes of the
    // subviews are not sent to ShadowTree leading to issues with pressables.
    // Sending state update to ShadowTree from here is not enough, because native layout has not yet
    // happened after the child had been added. Requesting layout on navigation bar does not trigger layout callbacks
    // either, however doing so on main view of navigation controller does the trick.
    if (self.shouldHeaderBeVisible) {
      [self layoutNavigationControllerView];
    }
  }
  _addedReactSubviewsInCurrentTransaction = false;
}

- (void)replaceNavigationBarViewsWithSnapshotOfSubview:(RNSScreenStackHeaderSubview *)childComponentView
{
  if (childComponentView.window != nil) {
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

  // See comment above _safeAreaConstraints declaration for reason why this is necessary.
  if (_safeAreaConstraints.count > 0 &&
      [_safeAreaConstraints[0].firstItem isKindOfClass:[RNSScreenContentWrapper class]]) {
    RNSScreenContentWrapper *contentWrapper = static_cast<RNSScreenContentWrapper *>(_safeAreaConstraints[0].firstItem);

    // Disable auto-layout
    contentWrapper.translatesAutoresizingMaskIntoConstraints = YES;
  }
  [NSLayoutConstraint deactivateConstraints:_safeAreaConstraints];
  _safeAreaConstraints = nil;

#ifdef RCT_NEW_ARCH_ENABLED
  _lastSendState = react::RNSScreenStackHeaderConfigState(react::Size{}, react::EdgeInsets{});
#else
  _lastHeaderInsets = NSDirectionalEdgeInsets{};
#endif
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
#ifndef NDEBUG
  if (auto imgLoaderPtr = _state.get()->getData().getImageLoader().lock()) {
    imageLoader = react::unwrapManagedObject(imgLoaderPtr);
  }
#endif // !NDEBUG
}

#else
#pragma mark - Paper specific

- (void)didUpdateReactSubviews
{
  [self updateViewControllerIfNeeded];
}

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

@end
