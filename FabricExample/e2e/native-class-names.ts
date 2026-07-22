/**
 * Shared registry of native component class names used across e2e tests.
 *
 * Keeping these in one place means a native symbol rename only has to be
 * applied here, not chased down across every test that queries by class name.
 *
 * Values are the exact native class names passed to Detox's `by.type(...)`.
 * Names for classes prefixed with an underscore are private UIKit classes and
 * may change between iOS versions — where that already happened, both variants
 * are exported side by side (see the iOS 26 pairs below).
 */

// --- react-native-screens views ---

export const CLASS_NAME_RNS_TABS_BOTTOM_ACCESSORY =
  'RNSTabsBottomAccessoryComponentView';

// --- React Native host views ---

export const CLASS_NAME_RCT_ROOT_COMPONENT_VIEW = 'RCTRootComponentView';

// --- UIKit: tab bar ---

export const CLASS_NAME_UI_TAB_BAR = 'UITabBar';
export const CLASS_NAME_UI_TAB_BAR_BUTTON_LABEL = 'UITabBarButtonLabel';
export const CLASS_NAME_UI_FLOATING_TAB_BAR_COLLECTION_VIEW =
  '_UIFloatingTabBarCollectionView';
export const CLASS_NAME_UI_FLOATING_TAB_BAR_ITEM_CELL =
  '_UIFloatingTabBarItemCell';
export const CLASS_NAME_UI_TAB_SIDEBAR_COLLECTION_VIEW =
  '_UITabSidebarCollectionView';
export const CLASS_NAME_UI_TAB_SIDEBAR_CELL = '_UITabSidebarCell';

// The tab bar button class was renamed in iOS 26. Pick the variant matching
// the device's iOS version at the call site.
export const CLASS_NAME_UI_TAB_BAR_BUTTON_IOS26 = '_UITabButton';
export const CLASS_NAME_UI_TAB_BAR_BUTTON_LEGACY = 'UITabBarButton';

// The tab bar item badge view class was likewise renamed in iOS 26.
export const CLASS_NAME_UI_TAB_BAR_BADGE_VIEW_IOS26 = '_UIBarBadgeView';
export const CLASS_NAME_UI_TAB_BAR_BADGE_VIEW_LEGACY = '_UIBadgeView';

// --- UIKit: navigation bar ---

export const CLASS_NAME_UI_BUTTON_BAR_BUTTON = '_UIButtonBarButton';
export const CLASS_NAME_UI_MODERN_BAR_BUTTON = '_UIModernBarButton';
export const CLASS_NAME_UI_NAVIGATION_BAR_LARGE_TITLE_VIEW =
  '_UINavigationBarLargeTitleView';

// --- UIKit: context menu ---

export const CLASS_NAME_UI_CONTEXT_MENU_VIEW = '_UIContextMenuView';
export const CLASS_NAME_UI_CONTEXT_MENU_LIST_VIEW = '_UIContextMenuListView';
export const CLASS_NAME_UI_CONTEXT_MENU_CELL = '_UIContextMenuCell';
export const CLASS_NAME_UI_CONTEXT_MENU_CELL_CONTENT_VIEW =
  '_UIContextMenuCellContentView';

// --- UIKit: other controls ---

export const CLASS_NAME_UI_BUTTON = 'UIButton';
export const CLASS_NAME_UI_REFRESH_CONTROL = 'UIRefreshControl';
export const CLASS_NAME_UI_SEARCH_BAR_TEXT_FIELD = 'UISearchBarTextField';
export const CLASS_NAME_UI_CONTEXT_MENU_SUBMENU_TITLE_VIEW =
  '_UIContextMenuSubmenuTitleView';
export const CLASS_NAME_UI_LIST_CONTENT_IMAGE_VIEW = '_UIListContentImageView';
export const CLASS_NAME_UI_LABEL = 'UILabel';
export const CLASS_NAME_UI_IMAGE_VIEW = 'UIImageView';

// --- Android ---

export const CLASS_NAME_ANDROID_APP_COMPAT_IMAGE_BUTTON =
  'androidx.appcompat.widget.AppCompatImageButton';
