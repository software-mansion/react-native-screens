#pragma once

#import <UIKit/UIKit.h>

#if defined(__cplusplus)
#import <React/RCTComponent.h>
#import <React/RCTViewComponentView.h>
#import <React/RCTViewManager.h>
#import <react/renderer/components/rnscreens/RCTComponentViewHelpers.h>
#endif

#import "RNSDefines.h"
#import "RNSEnums.h"

@interface RNSSearchBar :
#if defined(__cplusplus)
    RCTViewComponentView <UISearchBarDelegate, RCTRNSSearchBarViewProtocol>
#else
    UIView <UISearchBarDelegate>
#endif

@property (nonatomic) BOOL hideWhenScrolling;
@property (nonatomic) RNSSearchBarPlacement placement;
@property (nonatomic) BOOL allowToolbarIntegration;

@property (nonatomic, retain) UISearchController *controller;

#if RNS_IPHONE_OS_VERSION_AVAILABLE(16_0) && !TARGET_OS_TV
- (UINavigationItemSearchBarPlacement)placementAsUINavigationItemSearchBarPlacement API_AVAILABLE(ios(16.0))
    API_UNAVAILABLE(tvos, watchos);
#endif // Check for iOS >= 16 && !TARGET_OS_TV

@end

#if defined(__cplusplus)
@interface RNSSearchBarManager : RCTViewManager
#else
@interface RNSSearchBarManager : NSObject
#endif

@end
