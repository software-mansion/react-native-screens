#import <React/RCTImageSource.h>
#import "RNSBottomTabsScreenEventEmitter.h"
#import "RNSEnums.h"
#import "RNSReactBaseView.h"
#import "RNSScrollViewBehaviorOverriding.h"
#import "RNSTabBarAppearanceProvider.h"

NS_ASSUME_NONNULL_BEGIN

@class RNSBottomTabsHostComponentView;
@class RNSTabsScreenViewController;

/**
 * Component view with react managed lifecycle. This view serves as root view in hierarchy
 * of a particular tab.
 */
@interface RNSBottomTabsScreenComponentView : RNSReactBaseView

/**
 * View controller responsible for managing tab represented by this component view.
 */
@property (nonatomic, strong, readonly, nullable) RNSTabsScreenViewController *controller;

/**
 * If not null, the bottom tabs host view that this tab component view belongs to.
 */
@property (nonatomic, weak, nullable) RNSBottomTabsHostComponentView *reactSuperview;

/**
 * @brief A function responsible for requesting a cleanup in the BottomTabsScreen component.
 *
 * Should be called when the component is about to be deleted.
 */
- (void)invalidate;

@end

#pragma mark - Props

/**
 * Properties set on component in JavaScript.
 */
@interface RNSBottomTabsScreenComponentView () <RNSTabBarAppearanceProvider, RNSScrollViewBehaviorOverriding>

// TODO: All of these properties should be `readonly`. Do this when support for legacy
// architecture is dropped.

@property (nonatomic) BOOL isSelectedScreen;
@property (nonatomic, nullable) NSString *tabKey;
@property (nonatomic, nullable) NSString *badgeValue;

@property (nonatomic, strong, nullable) UIColor *tabBarBackgroundColor;
@property (nonatomic, readonly) RNSBlurEffectStyle tabBarBlurEffect;

@property (nonatomic, strong, nullable) NSString *tabBarItemTitleFontFamily;
@property (nonatomic, strong, nullable) NSNumber *tabBarItemTitleFontSize;
@property (nonatomic, strong, nullable) NSString *tabBarItemTitleFontWeight;
@property (nonatomic, strong, nullable) NSString *tabBarItemTitleFontStyle;
@property (nonatomic, strong, nullable) UIColor *tabBarItemTitleFontColor;
@property (nonatomic) UIOffset tabBarItemTitlePositionAdjustment;

@property (nonatomic, strong, nullable) UIColor *tabBarItemIconColor;

@property (nonatomic, readonly) RNSBottomTabsIconType iconType;

@property (nonatomic, strong, readonly, nullable) RCTImageSource *iconImageSource;
@property (nonatomic, strong, readonly, nullable) NSString *iconSfSymbolName;

@property (nonatomic, strong, readonly, nullable) RCTImageSource *selectedIconImageSource;
@property (nonatomic, strong, readonly, nullable) NSString *selectedIconSfSymbolName;

@property (nonatomic, nullable) UIColor *tabBarItemBadgeBackgroundColor;

@property (nonatomic, nullable) NSString *title;

@property (nonatomic) BOOL shouldUseRepeatedTabSelectionPopToRootSpecialEffect;
@property (nonatomic) BOOL shouldUseRepeatedTabSelectionScrollToTopSpecialEffect;

@property (nonatomic, readonly) BOOL overrideScrollViewContentInsetAdjustmentBehavior;

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
