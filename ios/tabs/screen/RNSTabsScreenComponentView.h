#pragma once

#import <React/RCTImageSource.h>
#import "RNSEnums.h"
#import "RNSReactBaseView.h"
#import "RNSSafeAreaProviding.h"
#import "RNSScrollViewBehaviorOverriding.h"
#import "RNSTabsScreenEventEmitter.h"

NS_ASSUME_NONNULL_BEGIN

@class RNSTabsHostComponentView;
@class RNSTabsScreenViewController;

/**
 * Component view with react managed lifecycle. This view serves as root view in hierarchy
 * of a particular tab.
 */
@interface RNSTabsScreenComponentView : RNSReactBaseView <RNSSafeAreaProviding>

/**
 * View controller responsible for managing tab represented by this component view.
 */
@property (nonatomic, strong, readonly, nullable) RNSTabsScreenViewController *controller;

/**
 * If not null, the tabs host view that this tab component view belongs to.
 */
@property (nonatomic, weak, nullable) RNSTabsHostComponentView *reactSuperview;

@end

#pragma mark - Props

/**
 * Properties set on component in JavaScript.
 */
@interface RNSTabsScreenComponentView () <RNSScrollViewBehaviorOverriding>

@property (nonatomic, readonly, nullable) NSString *screenKey;
@property (nonatomic, readonly, nullable) NSString *badgeValue;

@property (nonatomic, readonly, nullable) NSString *tabBarItemTestID;
@property (nonatomic, readonly, nullable) NSString *tabBarItemAccessibilityLabel;

@property (nonatomic, readonly) RNSTabsIconType iconType;

@property (nonatomic, strong, readonly, nullable) RCTImageSource *iconImageSource;
@property (nonatomic, strong, readonly, nullable) NSString *iconResourceName;

@property (nonatomic, strong, readonly, nullable) RCTImageSource *selectedIconImageSource;
@property (nonatomic, strong, readonly, nullable) NSString *selectedIconResourceName;

@property (nonatomic, strong, readonly, nullable) UITabBarAppearance *standardAppearance;
@property (nonatomic, strong, readonly, nullable) UITabBarAppearance *scrollEdgeAppearance;

@property (nonatomic, readonly, nullable) NSString *title;
@property (nonatomic, readonly) BOOL isTitleUndefined;
@property (nonatomic, readonly) RNSOrientation orientation;

@property (nonatomic, readonly) BOOL shouldUseRepeatedTabSelectionPopToRootSpecialEffect;
@property (nonatomic, readonly) BOOL shouldUseRepeatedTabSelectionScrollToTopSpecialEffect;

@property (nonatomic, readonly) BOOL preventNativeSelection;

@property (nonatomic, readonly) BOOL overrideScrollViewContentInsetAdjustmentBehavior;

@property (nonatomic, readonly, nullable) NSString *tabItemTestID;
@property (nonatomic, readonly, nullable) NSString *tabItemAccessibilityLabel;
@property (nonatomic) BOOL tabBarItemNeedsA11yUpdate;

@property (nonatomic, readonly) RNSTabsScreenSystemItem systemItem;
@property (nonatomic, copy, readonly, nullable) NSArray<NSDictionary<NSString *, id> *> *searchToolbarItems;

@end

#pragma mark - Experimental

@interface RNSTabsScreenComponentView ()

@property (nonatomic, readonly) UIUserInterfaceStyle userInterfaceStyle;

@end

#pragma mark - Events

@interface RNSTabsScreenComponentView ()

/**
 * Use returned object to emit appropriate React Events to Element Tree.
 */
- (nonnull RNSTabsScreenEventEmitter *)reactEventEmitter;

@end

NS_ASSUME_NONNULL_END
