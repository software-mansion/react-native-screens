#import "RNSBottomTabsScreenEventEmitter.h"
#import "RNSEnums.h"
#import "RNSReactBaseView.h"
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

@end

#pragma mark - Props

/**
 * Properties set on component in JavaScript.
 */
@interface RNSBottomTabsScreenComponentView () <RNSTabBarAppearanceProvider>

@property (nonatomic, readonly) BOOL isSelectedScreen;
@property (nonatomic, readonly, nullable) NSString *tabKey;
@property (nonatomic, readonly, nullable) NSString *badgeValue;

@property (nonatomic, strong, readonly, nullable) UIColor *tabBarBackgroundColor;
@property (nonatomic, strong, readonly, nullable) UIBlurEffect *tabBarBlurEffect;

@property (nonatomic, strong, readonly, nullable) NSString *tabBarItemTitleFontFamily;
@property (nonatomic, strong, readonly, nullable) NSNumber *tabBarItemTitleFontSize;
@property (nonatomic, strong, readonly, nullable) NSString *tabBarItemTitleFontWeight;
@property (nonatomic, strong, readonly, nullable) NSString *tabBarItemTitleFontStyle;
@property (nonatomic, strong, readonly, nullable) UIColor *tabBarItemTitleFontColor;
@property (nonatomic, readonly) UIOffset tabBarItemTitlePositionAdjustment;

@property (nonatomic, strong, readonly, nullable) UIColor *tabBarItemIconColor;

@property (nonatomic, readonly, nullable) UIColor *tabBarItemBadgeBackgroundColor;

@property (nonatomic, strong, readonly, nullable) NSString *iconSFSymbolName;
@property (nonatomic, strong, readonly, nullable) NSString *selectedIconSFSymbolName;

@property (nonatomic, readonly, nullable) NSString *title;

@end

#pragma mark - Events

@interface RNSBottomTabsScreenComponentView ()

/**
 * Use returned object to emit appropriate React Events to Element Tree.
 */
- (nonnull RNSBottomTabsScreenEventEmitter *)reactEventEmitter;

@end

NS_ASSUME_NONNULL_END
