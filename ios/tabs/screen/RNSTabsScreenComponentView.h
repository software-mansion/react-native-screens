#pragma once

#import <React/RCTImageSource.h>
#import "RNSEnums.h"
#import "RNSReactBaseView.h"
#import "RNSSafeAreaProviding.h"
#import "RNSScrollViewBehaviorOverriding.h"
#import "RNSTabsScreenEventEmitter.h"

#if !RCT_NEW_ARCH_ENABLED
#import <React/RCTInvalidating.h>
#endif

NS_ASSUME_NONNULL_BEGIN

@class RNSTabsHostComponentView;
@class RNSTabsScreenViewController;

/**
 * Component view with react managed lifecycle. This view serves as root view in hierarchy
 * of a particular tab.
 */
@interface RNSTabsScreenComponentView : RNSReactBaseView <
                                            RNSSafeAreaProviding
#if !RCT_NEW_ARCH_ENABLED
                                            ,
                                            RCTInvalidating
#endif
                                            >

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

// TODO: All of these properties should be `readonly`. Do this when support for legacy
// architecture is dropped.

@property (nonatomic, nullable) NSString *screenKey;
@property (nonatomic, nullable) NSString *badgeValue;

@property (nonatomic, nullable) NSString *tabBarItemTestID;
@property (nonatomic, nullable) NSString *tabBarItemAccessibilityLabel;

@property (nonatomic, readonly) RNSTabsIconType iconType;

@property (nonatomic, strong, readonly, nullable) RCTImageSource *iconImageSource;
@property (nonatomic, strong, readonly, nullable) NSString *iconResourceName;

@property (nonatomic, strong, readonly, nullable) RCTImageSource *selectedIconImageSource;
@property (nonatomic, strong, readonly, nullable) NSString *selectedIconResourceName;

@property (nonatomic, strong, readonly, nullable) UITabBarAppearance *standardAppearance;
@property (nonatomic, strong, readonly, nullable) UITabBarAppearance *scrollEdgeAppearance;

@property (nonatomic, nullable) NSString *title;
@property (nonatomic, readonly) BOOL isTitleUndefined;
@property (nonatomic, readonly) RNSOrientation orientation;

@property (nonatomic) BOOL shouldUseRepeatedTabSelectionPopToRootSpecialEffect;
@property (nonatomic) BOOL shouldUseRepeatedTabSelectionScrollToTopSpecialEffect;

@property (nonatomic) BOOL preventNativeSelection;

@property (nonatomic, readonly) BOOL overrideScrollViewContentInsetAdjustmentBehavior;

@property (nonatomic, nullable) NSString *tabItemTestID;
@property (nonatomic, nullable) NSString *tabItemAccessibilityLabel;
@property (nonatomic) BOOL tabBarItemNeedsA11yUpdate;

@property (nonatomic) RNSTabsScreenSystemItem systemItem;

@end

#pragma mark - Experimental

@interface RNSTabsScreenComponentView ()

@property (nonatomic) UIUserInterfaceStyle userInterfaceStyle;

@end

#pragma mark - Events

@interface RNSTabsScreenComponentView ()

/**
 * Use returned object to emit appropriate React Events to Element Tree.
 */
- (nonnull RNSTabsScreenEventEmitter *)reactEventEmitter;

#if !RCT_NEW_ARCH_ENABLED
#pragma mark - LEGACY Event emitting blocks
@property (nonatomic, copy, nullable) RCTDirectEventBlock onWillAppear;
@property (nonatomic, copy, nullable) RCTDirectEventBlock onDidAppear;
@property (nonatomic, copy, nullable) RCTDirectEventBlock onWillDisappear;
@property (nonatomic, copy, nullable) RCTDirectEventBlock onDidDisappear;
#endif // !RCT_NEW_ARCH_ENABLED

@end

NS_ASSUME_NONNULL_END
