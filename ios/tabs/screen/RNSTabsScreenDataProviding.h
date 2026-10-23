#pragma once

#import <UIKit/UIKit.h>
#import "RNSEnums.h"

NS_ASSUME_NONNULL_BEGIN

/**
 * What the view of a tab screen provides to its `RNSTabsScreenViewController` and to the tab bar controller.
 *
 * The values are ready to use: the provider converts its own configuration (e.g. React props) into them.
 */
@protocol RNSTabsScreenDataProviding <NSObject>

@property (nonatomic, readonly, nullable) NSString *screenKey;
@property (nonatomic, readonly, nullable) NSString *title;
@property (nonatomic, readonly, nullable) NSString *badgeValue;
@property (nonatomic, readonly) RNSTabsScreenSystemItem systemItem;

/**
 * The system role of this tab. `RNSTabsScreenTabRoleSearch` marks the screen as the system search tab: on the UITab
 * path (iOS 26.1+) it decides the backing tab class, `UISearchTab` vs plain `UITab`. Fixed for the screen's lifetime.
 */
@property (nonatomic, readonly) RNSTabsScreenTabRole tabRole;

/**
 * Whether selecting the search tab should automatically activate its search controller. Effective only on iOS 26.1+
 * for screens with the search `tabRole`.
 */
@property (nonatomic, readonly) BOOL automaticallyActivatesSearch;

@property (nonatomic, readonly) RNSOrientation orientation;
@property (nonatomic, readonly) BOOL preventNativeSelection;
@property (nonatomic, readonly) BOOL shouldUseRepeatedTabSelectionPopToRootSpecialEffect;
@property (nonatomic, readonly) BOOL shouldUseRepeatedTabSelectionScrollToTopSpecialEffect;
@property (nonatomic, readonly) UIUserInterfaceStyle userInterfaceStyle;

@property (nonatomic, readonly, nullable) UITabBarAppearance *standardAppearance;
@property (nonatomic, readonly, nullable) UITabBarAppearance *scrollEdgeAppearance;

@property (nonatomic, readonly) RNSTabsIconType iconType;
@property (nonatomic, readonly) RNSTabsIconImageRenderingMode iconImageRenderingMode;
@property (nonatomic, readonly) RNSTabsIconSymbolRenderingMode iconSymbolRenderingMode;
@property (nonatomic, readonly, nullable) NSString *iconResourceName;
@property (nonatomic, readonly) RNSTabsIconImageRenderingMode selectedIconImageRenderingMode;
@property (nonatomic, readonly) RNSTabsIconSymbolRenderingMode selectedIconSymbolRenderingMode;
@property (nonatomic, readonly, nullable) NSString *selectedIconResourceName;

@property (nonatomic, readonly, nullable) NSString *tabItemTestID;
@property (nonatomic, readonly, nullable) NSString *tabItemAccessibilityLabel;

/**
 * Invalidation flags. The provider sets them when the related configuration changes; the tab bar controller clears
 * them once it has applied the change.
 */
@property (nonatomic) BOOL tabBarItemNeedsA11yUpdate;
@property (nonatomic) BOOL tabBarItemNeedsRecreation;
@property (nonatomic) BOOL tabBarItemNeedsUpdate;

/**
 * Content scroll view registered within the screen, or nil if none has been registered.
 */
- (nullable UIScrollView *)cachedContentScrollView;

@end

NS_ASSUME_NONNULL_END
