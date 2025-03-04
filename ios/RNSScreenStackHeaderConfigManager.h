#pragma once

#ifdef RCT_NEW_ARCH_ENABLED
#import <React/RCTViewComponentView.h>
#else
#import <React/RCTShadowView.h>
#import <React/RCTViewManager.h>
#endif

#import <React/RCTConvert.h>
#import "RNSScreenStackHeaderConfig.h"
#import "RNSScreenStackHeaderConfigShadowView.h"
#import "RNSScreenStackHeaderSubview.h"
#import "RNSScreenView.h"
#import "RNSSearchBar.h"

@interface RNSScreenStackHeaderConfigManager : RCTViewManager

@end
