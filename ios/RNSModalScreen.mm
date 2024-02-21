#import "RNSModalScreen.h"

#ifdef RCT_NEW_ARCH_ENABLED
#import <React/RCTFabricComponentsPlugins.h>
#import <rnscreens/RNSModalScreenComponentDescriptor.h>
#import "RNSConvert.h"
#endif


@implementation RNSModalScreen

#ifdef RCT_NEW_ARCH_ENABLED
+ (react::ComponentDescriptorProvider)componentDescriptorProvider
{
  return react::concreteComponentDescriptorProvider<react::RNSModalScreenComponentDescriptor>();
}
#endif
@end

#ifdef RCT_NEW_ARCH_ENABLED
Class<RCTComponentViewProtocol> RNSModalScreenCls(void)
{
  return RNSModalScreen.class;
}
#endif

@implementation RNSModalScreenManager

RCT_EXPORT_MODULE()

#ifdef RCT_NEW_ARCH_ENABLED
#else
- (UIView *)view
{
  return [[RNSModalScreen alloc] initWithBridge:self.bridge];
}
#endif // RCT_NEW_ARCH_ENABLED
@end

@implementation RCTConvert (RNSModalScreen)

RCT_ENUM_CONVERTER(
    RNSScreenStackPresentation,
    (@{
      @"push" : @(RNSScreenStackPresentationPush),
      @"modal" : @(RNSScreenStackPresentationModal),
      @"fullScreenModal" : @(RNSScreenStackPresentationFullScreenModal),
      @"formSheet" : @(RNSScreenStackPresentationFormSheet),
      @"containedModal" : @(RNSScreenStackPresentationContainedModal),
      @"transparentModal" : @(RNSScreenStackPresentationTransparentModal),
      @"containedTransparentModal" : @(RNSScreenStackPresentationContainedTransparentModal)
    }),
    RNSScreenStackPresentationPush,
    integerValue)

RCT_ENUM_CONVERTER(
    RNSScreenStackAnimation,
    (@{
      @"default" : @(RNSScreenStackAnimationDefault),
      @"none" : @(RNSScreenStackAnimationNone),
      @"fade" : @(RNSScreenStackAnimationFade),
      @"fade_from_bottom" : @(RNSScreenStackAnimationFadeFromBottom),
      @"flip" : @(RNSScreenStackAnimationFlip),
      @"simple_push" : @(RNSScreenStackAnimationSimplePush),
      @"slide_from_bottom" : @(RNSScreenStackAnimationSlideFromBottom),
      @"slide_from_right" : @(RNSScreenStackAnimationDefault),
      @"slide_from_left" : @(RNSScreenStackAnimationDefault),
      @"ios" : @(RNSScreenStackAnimationDefault),
    }),
    RNSScreenStackAnimationDefault,
    integerValue)

RCT_ENUM_CONVERTER(
    RNSScreenReplaceAnimation,
    (@{
      @"push" : @(RNSScreenReplaceAnimationPush),
      @"pop" : @(RNSScreenReplaceAnimationPop),
    }),
    RNSScreenReplaceAnimationPop,
    integerValue)

RCT_ENUM_CONVERTER(
    RNSScreenSwipeDirection,
    (@{
      @"vertical" : @(RNSScreenSwipeDirectionVertical),
      @"horizontal" : @(RNSScreenSwipeDirectionHorizontal),
    }),
    RNSScreenSwipeDirectionHorizontal,
    integerValue)

#if !TARGET_OS_TV
RCT_ENUM_CONVERTER(
    UIStatusBarAnimation,
    (@{
      @"none" : @(UIStatusBarAnimationNone),
      @"fade" : @(UIStatusBarAnimationFade),
      @"slide" : @(UIStatusBarAnimationSlide)
    }),
    UIStatusBarAnimationNone,
    integerValue)

RCT_ENUM_CONVERTER(
    RNSStatusBarStyle,
    (@{
      @"auto" : @(RNSStatusBarStyleAuto),
      @"inverted" : @(RNSStatusBarStyleInverted),
      @"light" : @(RNSStatusBarStyleLight),
      @"dark" : @(RNSStatusBarStyleDark),
    }),
    RNSStatusBarStyleAuto,
    integerValue)

RCT_ENUM_CONVERTER(
    RNSScreenDetentType,
    (@{
      @"large" : @(RNSScreenDetentTypeLarge),
      @"medium" : @(RNSScreenDetentTypeMedium),
      @"all" : @(RNSScreenDetentTypeAll),
    }),
    RNSScreenDetentTypeAll,
    integerValue)

+ (UIInterfaceOrientationMask)UIInterfaceOrientationMask:(id)json
{
  json = [self NSString:json];
  if ([json isEqualToString:@"default"]) {
    return UIInterfaceOrientationMaskAllButUpsideDown;
  } else if ([json isEqualToString:@"all"]) {
    return UIInterfaceOrientationMaskAll;
  } else if ([json isEqualToString:@"portrait"]) {
    return UIInterfaceOrientationMaskPortrait | UIInterfaceOrientationMaskPortraitUpsideDown;
  } else if ([json isEqualToString:@"portrait_up"]) {
    return UIInterfaceOrientationMaskPortrait;
  } else if ([json isEqualToString:@"portrait_down"]) {
    return UIInterfaceOrientationMaskPortraitUpsideDown;
  } else if ([json isEqualToString:@"landscape"]) {
    return UIInterfaceOrientationMaskLandscape;
  } else if ([json isEqualToString:@"landscape_left"]) {
    return UIInterfaceOrientationMaskLandscapeLeft;
  } else if ([json isEqualToString:@"landscape_right"]) {
    return UIInterfaceOrientationMaskLandscapeRight;
  }
  return UIInterfaceOrientationMaskAllButUpsideDown;
}
#endif

@end
