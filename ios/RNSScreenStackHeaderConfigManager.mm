#import "RNSScreenStackHeaderConfigManager.h"

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
