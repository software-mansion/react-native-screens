/**
 * Shared registry of Android native component class names used across e2e tests (iOS half: `native-classes-ios.ts`).
 *
 * Keeping these in one place means a native symbol rename only has to be
 * applied here, not chased down across every test that queries by class name.
 *
 * Values are the exact, fully-qualified class names passed to Detox's
 * `by.type(...)`. Detox resolves `by.type` with `isAssignableFrom`, so a
 * constant also matches subclasses of the named class.
 */

// --- AndroidX / Material ---

export const CLASS_NAME_ANDROID_APP_COMPAT_IMAGE_BUTTON =
  'androidx.appcompat.widget.AppCompatImageButton';
export const CLASS_NAME_ANDROID_MENU_DROP_DOWN_LIST_VIEW =
  'androidx.appcompat.widget.MenuPopupWindow$MenuDropDownListView';
// Matches every toolbar (`by.type` uses `isAssignableFrom`): the legacy
// `CustomToolbar` and the Stack v5 `MaterialToolbar` alike.
export const CLASS_NAME_ANDROID_TOOLBAR = 'androidx.appcompat.widget.Toolbar';
export const CLASS_NAME_ANDROID_MATERIAL_TOOLBAR =
  'com.google.android.material.appbar.MaterialToolbar';
// Detox resolves `by.type` with `isAssignableFrom`, so this also matches the
// library's internal `StackHeaderAppBarLayout` subclasses.
export const CLASS_NAME_ANDROID_APP_BAR_LAYOUT =
  'com.google.android.material.appbar.AppBarLayout';
export const CLASS_NAME_ANDROID_ACTION_MENU_ITEM_VIEW =
  'androidx.appcompat.view.menu.ActionMenuItemView';

// A bottom navigation tab. Its title is rendered by two `TextView`s (one of
// them hidden), so match the item by descendant text, not the text itself.
export const CLASS_NAME_ANDROID_NAVIGATION_BAR_ITEM_VIEW =
  'com.google.android.material.navigation.NavigationBarItemView';
// The medium / large Stack v5 header's title host. The title is drawn, not a
// `TextView`, but mirrored into the content description (`by.label`).
export const CLASS_NAME_ANDROID_COLLAPSING_TOOLBAR_LAYOUT =
  'com.google.android.material.appbar.CollapsingToolbarLayout';

// A row of a popup menu — the anchor for addressing its widgets by item title.
export const CLASS_NAME_ANDROID_LIST_MENU_ITEM_VIEW =
  'androidx.appcompat.view.menu.ListMenuItemView';

// A menu row's `group_divider` and `submenuarrow`.
export const CLASS_NAME_ANDROID_APP_COMPAT_IMAGE_VIEW =
  'androidx.appcompat.widget.AppCompatImageView';

// A grouped menu item's checkmark. `by.type` matches subclasses, so these also
// cover the `AppCompat*` variants the platform inflates.
export const CLASS_NAME_ANDROID_CHECK_BOX = 'android.widget.CheckBox';
export const CLASS_NAME_ANDROID_RADIO_BUTTON = 'android.widget.RadioButton';

// --- React Native ---

// A vertical RN `ScrollView` — the handle on one that carries no `testID`.
export const CLASS_NAME_ANDROID_REACT_SCROLL_VIEW =
  'com.facebook.react.views.scroll.ReactScrollView';
