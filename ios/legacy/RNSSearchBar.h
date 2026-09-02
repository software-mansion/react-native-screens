#pragma once

#import <UIKit/UIKit.h>

#import <React/RCTComponent.h>
#import <React/RCTViewComponentView.h>
#import <React/RCTViewManager.h>
#import <react/renderer/components/rnscreens/RCTComponentViewHelpers.h>

#import "RNSDefines.h"
#import "RNSLegacyEnums.h"

@interface RNSSearchBar : RCTViewComponentView <UISearchBarDelegate, RCTRNSSearchBarViewProtocol>

@property (nonatomic) BOOL hideWhenScrolling;
@property (nonatomic) RNSSearchBarPlacement placement;
@property (nonatomic) BOOL allowToolbarIntegration;

@property (nonatomic, retain) UISearchController *controller;

#if RNS_IPHONE_OS_VERSION_AVAILABLE(16_0) && !TARGET_OS_TV
- (UINavigationItemSearchBarPlacement)placementAsUINavigationItemSearchBarPlacement API_AVAILABLE(ios(16.0))
    API_UNAVAILABLE(tvos, watchos);
#endif // Check for iOS >= 16 && !TARGET_OS_TV

@end

@interface RNSSearchBarManager : RCTViewManager

@end
