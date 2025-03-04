#pragma once

#ifdef RCT_NEW_ARCH_ENABLED
#import <React/RCTViewComponentView.h>
#else
#import <React/RCTShadowView.h>
#import <React/RCTViewManager.h>
#endif

#import <React/RCTConvert.h>
#import "RNSScreenStackHeaderSubview.h"
#import "RNSScreenView.h"
#import "RNSSearchBar.h"

#ifdef RCT_NEW_ARCH_ENABLED
#else

/**
 * Used as local data send to shadow view on Paper. This helps us to provide Yoga
 * with knowledge of native insets in the navigation bar.
 */
@interface RNSHeaderConfigInsetsPayload : NSObject

@property (nonatomic) NSDirectionalEdgeInsets insets;

- (instancetype)initWithInsets:(NSDirectionalEdgeInsets)insets NS_DESIGNATED_INITIALIZER;

@end
#endif
