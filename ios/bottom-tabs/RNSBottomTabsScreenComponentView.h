#import <React/RCTImageSource.h>
#import "RNSBottomTabsScreenEventEmitter.h"
#import "RNSEnums.h"
#import "RNSReactBaseView.h"
#import "RNSSafeAreaProviding.h"
#import "RNSScrollEdgeEffectApplicator.h"
#import "RNSScrollViewBehaviorOverriding.h"

#ifdef RCT_NEW_ARCH_ENABLED
#import "RNSViewControllerInvalidating.h"
#else
#import <React/RCTInvalidating.h>
#endif

NS_ASSUME_NONNULL_BEGIN

@class RNSBottomTabsHostComponentView;
@class RNSTabsScreenViewController;

/**
 * Component view with react managed lifecycle. This view serves as root view in hierarchy
 * of a particular tab.
 */
@interface RNSBottomTabsScreenComponentView : RNSReactBaseView <
                                                  RNSSafeAreaProviding,
#ifdef RCT_NEW_ARCH_ENABLED
                                                  RNSViewControllerInvalidating
#else
                                                  RCTInvalidating
#endif
                                                  >

/**
 * View controller responsible for managing tab represented by this component view.
 */
@property (nonatomic, strong, readonly, nullable) RNSTabsScreenViewController *controller;

/**
 * If not null, the bottom tabs host view that this tab component view belongs to.
 */
@property (nonatomic, weak, nullable) RNSBottomTabsHostComponentView *reactSuperview;

/**
 * Updates [scroll edge effects](https://developer.apple.com/documentation/uikit/uiscrolledgeeffect)
 * on a content ScrollView inside the tab screen, if one exists. It uses ScrollViewFinder to find the ScrollView.
 */
- (void)updateContentScrollViewEdgeEffectsIfExists;

@end

#pragma mark - Props

/**
 * Properties set on component in JavaScript.
 */
@interface RNSBottomTabsScreenComponentView () <RNSScrollViewBehaviorOverriding, RNSScrollEdgeEffectProviding>

// TODO: All of these properties should be `readonly`. Do this when support for legacy
// architecture is dropped.

@property (nonatomic) BOOL isSelectedScreen;
@property (nonatomic, nullable) NSString *tabKey;
@property (nonatomic, nullable) NSString *badgeValue;

@property (nonatomic, readonly) RNSBottomTabsIconType iconType;

@property (nonatomic, strong, readonly, nullable) RCTImageSource *iconImageSource;
@property (nonatomic, strong, readonly, nullable) NSString *iconSfSymbolName;

@property (nonatomic, strong, readonly, nullable) RCTImageSource *selectedIconImageSource;
@property (nonatomic, strong, readonly, nullable) NSString *selectedIconSfSymbolName;

@property (nonatomic, strong, readonly, nullable) UITabBarAppearance *standardAppearance;
@property (nonatomic, strong, readonly, nullable) UITabBarAppearance *scrollEdgeAppearance;

@property (nonatomic, nullable) NSString *title;
@property (nonatomic, readonly) RNSOrientation orientation;

@property (nonatomic) BOOL shouldUseRepeatedTabSelectionPopToRootSpecialEffect;
@property (nonatomic) BOOL shouldUseRepeatedTabSelectionScrollToTopSpecialEffect;

@property (nonatomic, readonly) BOOL overrideScrollViewContentInsetAdjustmentBehavior;

@property (nonatomic) RNSScrollEdgeEffect bottomScrollEdgeEffect;
@property (nonatomic) RNSScrollEdgeEffect leftScrollEdgeEffect;
@property (nonatomic) RNSScrollEdgeEffect rightScrollEdgeEffect;
@property (nonatomic) RNSScrollEdgeEffect topScrollEdgeEffect;

@property (nonatomic) RNSBottomTabsScreenSystemItem systemItem;

@end

#pragma mark - Events

@interface RNSBottomTabsScreenComponentView ()

/**
 * Use returned object to emit appropriate React Events to Element Tree.
 */
- (nonnull RNSBottomTabsScreenEventEmitter *)reactEventEmitter;

#if !RCT_NEW_ARCH_ENABLED
#pragma mark - LEGACY Event emitting blocks
@property (nonatomic, copy, nullable) RCTDirectEventBlock onWillAppear;
@property (nonatomic, copy, nullable) RCTDirectEventBlock onDidAppear;
@property (nonatomic, copy, nullable) RCTDirectEventBlock onWillDisappear;
@property (nonatomic, copy, nullable) RCTDirectEventBlock onDidDisappear;
#endif // !RCT_NEW_ARCH_ENABLED

@end

NS_ASSUME_NONNULL_END
