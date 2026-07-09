/**
 * Shared registry of native component type names used across e2e tests.
 *
 * Keeping these in one place means a native symbol rename only has to be
 * applied here, not chased down across every test that queries by type.
 *
 * Values are the exact native class names passed to Detox's `by.type(...)`.
 * Names prefixed with an underscore are private UIKit classes and may change
 * between iOS versions — where that already happened, both variants are
 * exported side by side (see the iOS 26 pairs below).
 */

// --- react-native-screens views ---

export const RNS_TABS_BOTTOM_ACCESSORY_TYPE =
  'RNSTabsBottomAccessoryComponentView';

// --- React Native host views ---

export const RCT_ROOT_COMPONENT_VIEW_TYPE = 'RCTRootComponentView';

// --- UIKit: tab bar ---

export const UI_TAB_BAR_TYPE = 'UITabBar';
export const UI_TAB_BAR_BUTTON_LABEL_TYPE = 'UITabBarButtonLabel';
export const UI_FLOATING_TAB_BAR_COLLECTION_VIEW_TYPE =
  '_UIFloatingTabBarCollectionView';
export const UI_FLOATING_TAB_BAR_ITEM_CELL_TYPE = '_UIFloatingTabBarItemCell';
export const UI_TAB_SIDEBAR_COLLECTION_VIEW_TYPE =
  '_UITabSidebarCollectionView';
export const UI_TAB_SIDEBAR_CELL_TYPE = '_UITabSidebarCell';

// The tab bar button class was renamed in iOS 26. Pick the variant matching
// the device's iOS version at the call site.
export const UI_TAB_BAR_BUTTON_TYPE_IOS26 = '_UITabButton';
export const UI_TAB_BAR_BUTTON_TYPE_LEGACY = 'UITabBarButton';

// The tab bar item badge view class was likewise renamed in iOS 26.
export const UI_TAB_BAR_BADGE_VIEW_TYPE_IOS26 = '_UIBarBadgeView';
export const UI_TAB_BAR_BADGE_VIEW_TYPE_LEGACY = '_UIBadgeView';

// --- UIKit: navigation bar ---

export const UI_BUTTON_BAR_BUTTON_TYPE = '_UIButtonBarButton';
export const UI_NAVIGATION_BAR_LARGE_TITLE_VIEW_TYPE =
  '_UINavigationBarLargeTitleView';

// --- UIKit: other controls ---

export const UI_BUTTON_TYPE = 'UIButton';
export const UI_REFRESH_CONTROL_TYPE = 'UIRefreshControl';
export const UI_SEARCH_BAR_TEXT_FIELD_TYPE = 'UISearchBarTextField';
export const UI_CONTEXT_MENU_VIEW_TYPE = '_UIContextMenuView';
export const UI_LIST_CONTENT_IMAGE_VIEW_TYPE = '_UIListContentImageView';

// --- Android ---

export const ANDROID_APP_COMPAT_IMAGE_BUTTON_TYPE =
  'androidx.appcompat.widget.AppCompatImageButton';
