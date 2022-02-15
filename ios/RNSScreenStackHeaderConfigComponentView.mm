#import "RNSScreenStackHeaderConfigComponentView.h"
#import "RNSScreenStackHeaderSubviewComponentView.h"

#import "./utils/RNSUIBarButtonItem.h"

#import <React/RCTConversions.h>
#import <React/RCTFont.h>

#import <react/renderer/components/rnscreens/ComponentDescriptors.h>
#import <react/renderer/components/rnscreens/EventEmitters.h>
#import <react/renderer/components/rnscreens/Props.h>
#import <react/renderer/components/rnscreens/RCTComponentViewHelpers.h>

#import <React/UIView+React.h>

#import "RCTFabricComponentsPlugins.h"

using namespace facebook::react;

@implementation RNSScreenStackHeaderConfigComponentView {
  BOOL _initialPropsSet;
  NSMutableArray<RNSScreenStackHeaderSubviewComponentView *> *_reactSubviews;
  SharedColor _backgroundSharedColor;
}

- (instancetype)initWithFrame:(CGRect)frame
{
  if (self = [super initWithFrame:frame]) {
    static const auto defaultProps = std::make_shared<const RNSScreenStackHeaderConfigProps>();
    _props = defaultProps;
    self.hidden = YES;
    _show = YES;
    _translucent = NO;
    _reactSubviews = [NSMutableArray new];
  }

  return self;
}

- (UIView *)reactSuperview
{
  return _screenView;
}

- (void)removeFromSuperview
{
  [super removeFromSuperview];
  _screenView = nil;
}

// this method is never invoked by the system since this view
// is not added to native view hierarchy so we can apply our logic
- (UIView *)hitTest:(CGPoint)point withEvent:(UIEvent *)event
{
  for (RNSScreenStackHeaderSubviewComponentView *subview in _reactSubviews) {
    if (subview.type == facebook::react::RNSScreenStackHeaderSubviewType::Left ||
        subview.type == facebook::react::RNSScreenStackHeaderSubviewType::Right) {
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

  if (vc != nil && (nextVC == vc)) {
    [RNSScreenStackHeaderConfigComponentView updateViewController:self.screenView.controller
                                                       withConfig:self
                                                         animated:YES];
  }
}

- (void)layoutNavigationControllerView
{
  UIViewController *vc = _screenView.controller;
  UINavigationController *navctr = vc.navigationController;
  [navctr.view setNeedsLayout];
}

+ (void)setAnimatedConfig:(UIViewController *)vc withConfig:(RNSScreenStackHeaderConfigComponentView *)config
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

#if !TARGET_OS_TV
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

#if defined(__IPHONE_OS_VERSION_MAX_ALLOWED) && defined(__IPHONE_13_0) && \
    __IPHONE_OS_VERSION_MAX_ALLOWED >= __IPHONE_13_0
+ (UINavigationBarAppearance *)buildAppearance:(UIViewController *)vc
                                    withConfig:(RNSScreenStackHeaderConfigComponentView *)config
    API_AVAILABLE(ios(13.0))
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

  //  if (config.blurEffect) {
  //    appearance.backgroundEffect = [UIBlurEffect effectWithStyle:config.blurEffect];
  //  }

  if (config.hideShadow) {
    appearance.shadowColor = nil;
  }

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

    if (config.largeTitleColor || config.titleColor) {
      largeAttrs[NSForegroundColorAttributeName] = config.largeTitleColor ? config.largeTitleColor : config.titleColor;
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

    appearance.largeTitleTextAttributes = largeAttrs;
  }

  //  UIImage *backButtonImage = [self loadBackButtonImageInViewController:vc withConfig:config];
  //  if (backButtonImage) {
  //    [appearance setBackIndicatorImage:backButtonImage transitionMaskImage:backButtonImage];
  //  } else if (appearance.backIndicatorImage) {
  [appearance setBackIndicatorImage:nil transitionMaskImage:nil];
  //  }
  return appearance;
}
#endif

+ (void)willShowViewController:(UIViewController *)vc
                      animated:(BOOL)animated
                    withConfig:(RNSScreenStackHeaderConfigComponentView *)config
{
  [self updateViewController:vc withConfig:config animated:animated];
}

+ (void)setTitleAttibutes:(NSDictionary *)attrs forButton:(UIBarButtonItem *)button
{
  [button setTitleTextAttributes:attrs forState:UIControlStateNormal];
  [button setTitleTextAttributes:attrs forState:UIControlStateHighlighted];
  [button setTitleTextAttributes:attrs forState:UIControlStateDisabled];
  [button setTitleTextAttributes:attrs forState:UIControlStateSelected];
  [button setTitleTextAttributes:attrs forState:UIControlStateFocused];
}

+ (UIImage *)loadBackButtonImageInViewController:(UIViewController *)vc
                                      withConfig:(RNSScreenStackHeaderConfigComponentView *)config
{
  @throw([NSException exceptionWithName:@"UNIMPLEMENTED" reason:@"Implement" userInfo:nil]);
  return nil;
}

+ (void)updateViewController:(UIViewController *)vc
                  withConfig:(RNSScreenStackHeaderConfigComponentView *)config
                    animated:(BOOL)animated
{
  UINavigationItem *navitem = vc.navigationItem;
  UINavigationController *navctr = (UINavigationController *)vc.parentViewController;

  NSUInteger currentIndex = [navctr.viewControllers indexOfObject:vc];
  UINavigationItem *prevItem =
      currentIndex > 0 ? [navctr.viewControllers objectAtIndex:currentIndex - 1].navigationItem : nil;

  BOOL wasHidden = navctr.navigationBarHidden;
  BOOL shouldHide = config == nil || !config.show;

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
    navctr.view.semanticContentAttribute = config.direction;
    navctr.navigationBar.semanticContentAttribute = config.direction;
  }

  if (shouldHide) {
    return;
  }

  navitem.title = config.title;
#if !TARGET_OS_TV
  if (config.backTitle != nil || config.backTitleFontFamily || config.backTitleFontSize ||
      config.disableBackButtonMenu) {
    RNSUIBarButtonItem *backBarButtonItem = [[RNSUIBarButtonItem alloc] initWithTitle:config.backTitle ?: prevItem.title
                                                                                style:UIBarButtonItemStylePlain
                                                                               target:nil
                                                                               action:nil];

    [backBarButtonItem setMenuHidden:config.disableBackButtonMenu];

    prevItem.backBarButtonItem = backBarButtonItem;
    if (config.backTitleFontFamily || config.backTitleFontSize) {
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
      [self setTitleAttibutes:attrs forButton:prevItem.backBarButtonItem];
    }
  } else {
    prevItem.backBarButtonItem = nil;
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
  for (RNSScreenStackHeaderSubviewComponentView *subview in config.reactSubviews) {
    switch (subview.type) {
      case RNSScreenStackHeaderSubviewType::Left: {
        //#if !TARGET_OS_TV
        //        navitem.leftItemsSupplementBackButton = config.backButtonInCustomView;
        //#endif
        UIBarButtonItem *buttonItem = [[UIBarButtonItem alloc] initWithCustomView:subview];
        navitem.leftBarButtonItem = buttonItem;
        break;
      }
      case RNSScreenStackHeaderSubviewType::Right: {
        UIBarButtonItem *buttonItem = [[UIBarButtonItem alloc] initWithCustomView:subview];
        navitem.rightBarButtonItem = buttonItem;
        break;
      }
      case RNSScreenStackHeaderSubviewType::Center:
      case RNSScreenStackHeaderSubviewType::Title: {
        navitem.titleView = subview;
        break;
      }
      case RNSScreenStackHeaderSubviewType::SearchBar: {
        RCTLogWarn(@"SearchBar is not yet Fabric compatible in react-native-screens");
        break;
      }
      case RNSScreenStackHeaderSubviewType::Back: {
        RCTLogWarn(@"Back button subivew is not yet Fabric compatible in react-native-screens");
        break;
        ;
      }
    }
  }

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
            RNSScreenStackHeaderConfigComponentView *config = nil;

            // TODO: make sure this will exist in fabirc
            for (UIView *subview in fromVC.view.reactSubviews) {
              if ([subview isKindOfClass:[RNSScreenStackHeaderConfigComponentView class]]) {
                config = (RNSScreenStackHeaderConfigComponentView *)subview;
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

+ (void)addSubviewsToNavItem:(UINavigationItem *)navitem withConfig:(RNSScreenStackHeaderConfigComponentView *)config
{
  for (RNSScreenStackHeaderSubviewComponentView *subview in config.reactSubviews) {
    switch (subview.type) {
      case facebook::react::RNSScreenStackHeaderSubviewType::Left: {
        UIBarButtonItem *buttonItem = [[UIBarButtonItem alloc] initWithCustomView:subview];
        navitem.leftBarButtonItem = buttonItem;
        break;
      }
      case facebook::react::RNSScreenStackHeaderSubviewType::Right: {
        UIBarButtonItem *buttonItem = [[UIBarButtonItem alloc] initWithCustomView:subview];
        navitem.rightBarButtonItem = buttonItem;
        break;
      }
      case facebook::react::RNSScreenStackHeaderSubviewType::Center:
      case facebook::react::RNSScreenStackHeaderSubviewType::Title: {
        navitem.titleView = subview;
        break;
      }
      case facebook::react::RNSScreenStackHeaderSubviewType::SearchBar: {
        RCTLogWarn(@"SearchBar is not yet supported in react-native-screens with Fabric enabled");
        break;
      }
      case facebook::react::RNSScreenStackHeaderSubviewType::Back: {
        break;
      }
    }
  }
}

- (void)mountChildComponentView:(UIView<RCTComponentViewProtocol> *)childComponentView index:(NSInteger)index
{
  if (![childComponentView isKindOfClass:[RNSScreenStackHeaderSubviewComponentView class]]) {
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

  [_reactSubviews insertObject:(RNSScreenStackHeaderSubviewComponentView *)childComponentView atIndex:index];
  [self updateViewControllerIfNeeded];
}

- (void)unmountChildComponentView:(UIView<RCTComponentViewProtocol> *)childComponentView index:(NSInteger)index
{
  [_reactSubviews removeObject:(RNSScreenStackHeaderSubviewComponentView *)childComponentView];
  [childComponentView removeFromSuperview];
}

#pragma mark - RCTComponentViewProtocol

- (void)prepareForRecycle
{
  [super prepareForRecycle];
  _initialPropsSet = NO;
}

+ (ComponentDescriptorProvider)componentDescriptorProvider
{
  return concreteComponentDescriptorProvider<RNSScreenStackHeaderConfigComponentDescriptor>();
}

- (NSString *)getFontFamilyPropValue:(std::string)propValue
{
  if (propValue.length() > 0) {
    return [[NSString alloc] initWithUTF8String:propValue.c_str()];
  } else {
    return nil;
  }
}

- (NSString *)stringToPropValue:(std::string)value
{
  if (value.empty())
    return nil;
  return [[NSString alloc] initWithUTF8String:value.c_str()];
}

- (NSNumber *)getFontSizePropValue:(int)value
{
  if (value > 0)
    return [NSNumber numberWithInt:value];
  return nil;
}

- (UISemanticContentAttribute)getDirectionPropValue:(RNSScreenStackHeaderConfigDirection)direction
{
  switch (direction) {
    case RNSScreenStackHeaderConfigDirection::Rtl:
      return UISemanticContentAttributeForceRightToLeft;
    case RNSScreenStackHeaderConfigDirection::Ltr:
      return UISemanticContentAttributeForceLeftToRight;
  }
}

- (void)updateProps:(Props::Shared const &)props oldProps:(Props::Shared const &)oldProps
{
  [super updateProps:props oldProps:oldProps];

  const auto &oldScreenProps = *std::static_pointer_cast<const RNSScreenStackHeaderConfigProps>(_props);
  const auto &newScreenProps = *std::static_pointer_cast<const RNSScreenStackHeaderConfigProps>(props);

  BOOL needsNavigationControllerLayout = !_initialPropsSet;

  if (newScreenProps.hidden != !_show) {
    _show = !newScreenProps.hidden;
    needsNavigationControllerLayout = YES;
  }

  if (newScreenProps.translucent != _translucent) {
    _translucent = newScreenProps.translucent;
    needsNavigationControllerLayout = YES;
  }

  _title = [self stringToPropValue:newScreenProps.title];
  if (newScreenProps.titleFontFamily != oldScreenProps.titleFontFamily) {
    _titleFontFamily = [self getFontFamilyPropValue:newScreenProps.titleFontFamily];
  }
  _titleFontWeight = [self stringToPropValue:newScreenProps.titleFontWeight];
  _titleFontSize = [self getFontSizePropValue:newScreenProps.titleFontSize];
  _hideShadow = newScreenProps.hideShadow;

  _largeTitle = newScreenProps.largeTitle;
  if (newScreenProps.largeTitleFontFamily != oldScreenProps.largeTitleFontFamily) {
    _largeTitleFontFamily = [self getFontFamilyPropValue:newScreenProps.largeTitleFontFamily];
  }
  _largeTitleFontWeight = [self stringToPropValue:newScreenProps.largeTitleFontWeight];
  _largeTitleFontSize = [self getFontSizePropValue:newScreenProps.largeTitleFontSize];
  _largeTitleHideShadow = newScreenProps.largeTitleHideShadow;

  _backTitle = [self stringToPropValue:newScreenProps.backTitle];
  ;
  if (newScreenProps.backTitleFontFamily != oldScreenProps.backTitleFontFamily) {
    _backTitleFontFamily = [self getFontFamilyPropValue:newScreenProps.backTitleFontFamily];
  }
  _backTitleFontSize = [self getFontSizePropValue:newScreenProps.backTitleFontSize];
  _hideBackButton = newScreenProps.hideBackButton;
  _disableBackButtonMenu = newScreenProps.disableBackButtonMenu;

  if (newScreenProps.direction != oldScreenProps.direction) {
    _direction = [self getDirectionPropValue:newScreenProps.direction];
  }

  // We cannot compare SharedColor because it is shared value.
  // We could compare color value, but it is more performant to just assign new value
  _titleColor = RCTUIColorFromSharedColor(newScreenProps.titleColor);
  _largeTitleColor = RCTUIColorFromSharedColor(newScreenProps.largeTitleColor);
  _color = RCTUIColorFromSharedColor(newScreenProps.color);

  if (_backgroundSharedColor != newScreenProps.backgroundColor) {
    _backgroundSharedColor = newScreenProps.backgroundColor;
    _backgroundColor = RCTUIColorFromSharedColor(_backgroundSharedColor);
  }

  [self updateViewControllerIfNeeded];

  if (needsNavigationControllerLayout) {
    [self layoutNavigationControllerView];
  }

  _initialPropsSet = YES;
  _props = std::static_pointer_cast<RNSScreenStackHeaderConfigProps const>(props);
}

@end

Class<RCTComponentViewProtocol> RNSScreenStackHeaderConfigCls(void)
{
  return RNSScreenStackHeaderConfigComponentView.class;
}
