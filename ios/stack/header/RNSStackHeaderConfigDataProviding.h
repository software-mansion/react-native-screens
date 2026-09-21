#pragma once

#import <UIKit/UIKit.h>
#import "RNSDefines.h"

@class RNSStackHeaderMenuData;

NS_ASSUME_NONNULL_BEGIN

@protocol RNSStackHeaderConfigDataProviding <NSObject>

@property (nonatomic, readonly, nullable) NSString *title;
@property (nonatomic, readonly, nullable) NSString *subtitle;
@property (nonatomic, readonly) BOOL hidden;
@property (nonatomic, readonly, nullable) NSString *largeTitle;
@property (nonatomic, readonly, nullable) NSString *largeSubtitle;
@property (nonatomic, readonly) BOOL largeTitleEnabled;
@property (nonatomic, readonly, nullable) NSString *prompt;
#if RNS_IPHONE_OS_VERSION_AVAILABLE(27_0)
@property (nonatomic, readonly) UIBarMinimizationBehavior minimizationBehavior API_AVAILABLE(ios(27.0));
@property (nonatomic, readonly) UIBarMinimizationRestorationBehavior restorationBehavior API_AVAILABLE(ios(27.0));
#endif // Check for iOS >= 27
@property (nonatomic, readonly, nullable) NSString *backButtonTitle;
@property (nonatomic, readonly) UINavigationItemBackButtonDisplayMode backButtonDisplayMode;
@property (nonatomic, readonly) BOOL backButtonMenuEnabled;
@property (nonatomic, readonly, nullable) RNSStackHeaderMenuData *titleMenu;
@property (nonatomic, readonly, nullable) UINavigationBarAppearance *standardAppearance;
@property (nonatomic, readonly, nullable) UINavigationBarAppearance *scrollEdgeAppearance;

/**
 Children are expected to conform to either RNSStackHeaderItemDataProviding
 or RNSStackHeaderItemSpacerDataProviding, other types are ignored.
 */
@property (nonatomic, readonly) NSArray<id> *children;

@end

NS_ASSUME_NONNULL_END
