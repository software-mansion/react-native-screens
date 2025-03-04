#pragma once

#ifdef RCT_NEW_ARCH_ENABLED
#import <React/RCTViewComponentView.h>
#else
#import <React/RCTShadowView.h>
#import <React/RCTViewManager.h>
#endif

#import <React/RCTConvert.h>
#import "RNSHeaderConfigInsetsPayload.h"
#import "RNSScreenStackHeaderSubview.h"
#import "RNSScreenView.h"
#import "RNSSearchBar.h"

#ifdef RCT_NEW_ARCH_ENABLED
#else

/**
 * Custom shadow view for header config. This is used on Paper to provide Yoga
 * with knowledge of native header insets (horizontal padding).
 */
@interface RNSScreenStackHeaderConfigShadowView : RCTShadowView

@end
#endif
