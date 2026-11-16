import type { ColorValue, TextStyle } from 'react-native';
import type { PlatformIconAndroid } from '../../shared/types';
import type {
  StackHeaderElementFactory,
  StackHeaderMenuSelectionHandler,
  StackHeaderPressHandler,
} from './StackHeaderConfig.types';

/**
 * Type of the Material 3 app bar used as the header.
 *
 * @remarks
 * The following values are available:
 * - `'small'` — small app bar with fixed title,
 * - `'medium'` — medium app bar with collapsing title,
 * - `'large'` — large app bar with collapsing title.
 */
export type StackHeaderTypeAndroid = 'small' | 'medium' | 'large';

/**
 * Horizontal alignment of the title and the subtitle of a `'medium'` or
 * `'large'` header.
 *
 * @remarks
 * The following values are supported:
 * - `'start'` — the start edge: left in left-to-right layouts, right in
 *   right-to-left layouts.
 * - `'center'`
 * - `'end'` — the end edge: right in left-to-right layouts, left in
 *   right-to-left layouts.
 */
export type StackHeaderTitleHorizontalGravityAndroid =
  | 'start'
  | 'center'
  | 'end';

/**
 * Vertical alignment of the title and the subtitle of a `'medium'` or
 * `'large'` header.
 *
 * @remarks
 * The following values are supported:
 * - `'top'`
 * - `'center'`
 * - `'bottom'`
 */
export type StackHeaderTitleVerticalGravityAndroid =
  | 'top'
  | 'center'
  | 'bottom';

/**
 * Anchor used to resolve the horizontal gravity of the collapsed title.
 *
 * @remarks
 * The following values are available:
 * - `'availableSpace'` — gravity is computed over the space left after the
 *   navigation icon, menu and subviews are laid out,
 * - `'entireSpace'` — gravity is computed over the whole app bar, so a
 *   centered title is centered relative to the app bar and pushed aside only
 *   if it would overlap another view.
 */
export type StackHeaderCollapsedTitleGravityModeAndroid =
  | 'entireSpace'
  | 'availableSpace';

/**
 * Behavior of the background subview when the app bar collapses.
 *
 * @remarks
 * The following values are available:
 * - `'off'` — the subview scrolls away with the app bar,
 * - `'parallax'` — the subview scrolls at a slower rate, creating a parallax
 *   effect.
 */
export type StackHeaderBackgroundSubviewCollapseModeAndroid =
  | 'off'
  | 'parallax';

/**
 * Custom view placed in a slot of the toolbar.
 */
export interface StackHeaderToolbarSubviewAndroid {
  /**
   * Render callback for the React element placed in this toolbar slot.
   *
   * @remarks
   * The subview is sized by React Native's layout engine but positioned by the
   * platform native layout. Each subview is placed independently — subviews do
   * not participate in a shared flex layout and cannot influence each other's
   * sizing.
   *
   * Intrinsic sizing and explicit dimensions work as expected. Avoid
   * parent-relative sizing (e.g. `flex: 1`) on the root element — it will
   * produce incorrect dimensions. Flex layout within a root that has a known
   * size works as expected.
   */
  render: StackHeaderElementFactory;
}

/**
 * Custom view rendered as the header background.
 */
export interface StackHeaderBackgroundSubviewAndroid {
  /**
   * Controls how the background subview behaves when the app bar collapses.
   *
   * @remarks
   * `pin` is not currently supported because the background subview is
   * stretched to match the entire `AppBarLayout`, which causes pinned content
   * to move immediately rather than staying fixed. Support for `pin` collapse
   * mode might be added in the future.
   *
   * @defaultValue `'off'`
   */
  collapseMode?: StackHeaderBackgroundSubviewCollapseModeAndroid | undefined;
  /**
   * Render callback for the React element used as the header background.
   *
   * @remarks
   * The subview is stretched to match the header (`AppBarLayout`) dimensions,
   * so parent-relative sizing (e.g. `flex: 1`) works correctly.
   */
  render: StackHeaderElementFactory;
}

/**
 * Controls when a menu element is displayed as a button in the Toolbar.
 *
 * @remarks
 * The following values are available:
 * - `'always'` — always displays the element as a button in the Toolbar,
 * - `'alwaysWithText'` — always displays the element as a button in the
 *   Toolbar, forcing the text label to be visible even if an icon is
 *   provided,
 * - `'ifRoom'` — displays the element as a button in the Toolbar only if the
 *   system determines there is sufficient space,
 * - `'ifRoomWithText'` — displays the element as a button in the Toolbar if
 *   the system determines there is sufficient space, forcing the text label
 *   to be visible even if an icon is provided,
 * - `'never'` — never displays the element as a button in the Toolbar; it
 *   will be placed in the overflow menu instead.
 *
 * @see {@link https://developer.android.com/reference/android/view/MenuItem#setShowAsAction(int) | MenuItem.setShowAsAction}
 */
export type StackHeaderToolbarMenuItemShowAsActionAndroid =
  | 'always'
  | 'alwaysWithText'
  | 'ifRoom'
  | 'ifRoomWithText'
  | 'never';

/**
 * Fields shared by the items and the submenus of the toolbar menu.
 */
export interface StackHeaderToolbarMenuItemBaseAndroid {
  /**
   * Unique identifier of the menu element.
   */
  id: string;
  /**
   * Title of the menu element.
   */
  title?: string | undefined;
  /**
   * Shorter title used for the menu element when it is displayed as a button in
   * the Toolbar.
   *
   * @remarks
   * When the element is shown in the Toolbar with a text label, this condensed
   * title is used instead of `title`. The full `title` is still used everywhere
   * else (the overflow menu and submenus).
   */
  titleCondensed?: string | undefined;
  /**
   * Tooltip shown on long-press (or pointer hover) of the menu element when it
   * is displayed as a button in the Toolbar.
   *
   * @remarks
   * Applies only to elements shown as a button in the Toolbar; it has no effect
   * on elements placed in the overflow menu.
   */
  tooltipText?: string | undefined;
  /**
   * Sets the accessibility label (content description) for the menu element.
   *
   * @remarks
   * When `undefined`, Android uses the `title` for the accessibility label when
   * the item is placed in the toolbar. There is no default accessibility label
   * for items inside overflow menu/submenus.
   *
   * Due to native platform limitations, it's not possible to provide `testID`
   * for menu items inside overflow menu/submenus. If possible, use
   * `accessibilityLabel` instead.
   */
  accessibilityLabel?: string | undefined;
  /**
   * Specifies if the menu element should be hidden.
   *
   * @defaultValue `false`
   */
  hidden?: boolean | undefined;
  /**
   * Specifies if the menu element should be disabled.
   *
   * @defaultValue `false`
   */
  disabled?: boolean | undefined;
  /**
   * Specifies whether the element should be displayed as a button in the
   * Toolbar.
   *
   * @remarks
   * This prop only affects top-level menu elements. Items inside submenus are
   * always displayed in the popup and ignore this setting.
   *
   * Due to native limitations, the width limit for the `'ifRoom'` and
   * `'ifRoomWithText'` options is determined during the initial render and will
   * not adapt to subsequent layout or orientation changes.
   *
   * @defaultValue `'never'`
   */
  showAsAction?: StackHeaderToolbarMenuItemShowAsActionAndroid | undefined;
  /**
   * Specifies the icon for the menu element.
   *
   * @remarks
   * `'imageSource'` type doesn't support SVGs on Android. For loading SVGs use
   * `'drawableResource'` type. `'drawableResource'` type requires passing a
   * drawable to resources via Android Studio.
   *
   * The icon will be visible only if the menu element is shown in the Toolbar.
   *
   * An icon set via the
   * {@link StackHeaderConfigCommandsAndroid.updateToolbarMenuElements | updateToolbarMenuElements}
   * view command takes precedence over this one until the next
   * {@link StackHeaderConfigPropsAndroid.toolbarMenu | toolbarMenu} change.
   */
  icon?: PlatformIconAndroid | undefined;
  /**
   * Specifies the tint color to apply to the menu element icon.
   */
  iconTintColorNormal?: ColorValue | undefined;
  /**
   * Specifies the tint color to apply to the menu element icon when it is
   * pressed.
   *
   * @remarks
   * Due to native platform limitations, if you set this prop, you must also
   * provide `iconTintColorNormal`. Otherwise, the icon will become transparent.
   */
  iconTintColorPressed?: ColorValue | undefined;
  /**
   * Specifies the tint color to apply to the menu element icon when it is
   * focused (e.g. by keyboard navigation).
   *
   * @remarks
   * Due to native platform limitations, if you set this prop, you must also
   * provide `iconTintColorNormal`. Otherwise, the icon will become transparent.
   */
  iconTintColorFocused?: ColorValue | undefined;
  /**
   * Specifies the tint color to apply to the menu element icon when it is
   * disabled.
   *
   * @remarks
   * Due to native platform limitations, if you set this prop, you should also
   * provide `iconTintColorNormal`. Otherwise, the icon will become transparent
   * when the item is not disabled.
   */
  iconTintColorDisabled?: ColorValue | undefined;
}

/**
 * How a menu item behaves when clicked.
 *
 * @remarks
 * The following values are available:
 * - `'action'` — the item fires
 *   {@link StackHeaderToolbarMenuItemAndroid.onPress | onPress} without any
 *   toggle state,
 * - `'toggle'` — the item is checkable; requires
 *   {@link StackHeaderToolbarMenuItemAndroid.groupId | groupId},
 * - `'automatic'` — the item becomes checkable if it has a `groupId`, otherwise
 *   it behaves as an action.
 */
export type StackHeaderToolbarMenuItemTypeAndroid =
  | 'action'
  | 'toggle'
  | 'automatic';

/**
 * Item of the toolbar menu.
 *
 * @remarks
 * Depending on its
 * {@link StackHeaderToolbarMenuItemAndroid.itemType | itemType} and
 * {@link StackHeaderToolbarMenuItemAndroid.groupId | groupId}, the item calls
 * {@link StackHeaderToolbarMenuItemAndroid.onPress | onPress} or toggles its
 * checked state.
 */
export interface StackHeaderToolbarMenuItemAndroid
  extends StackHeaderToolbarMenuItemBaseAndroid {
  /**
   * Marks this object as a menu item.
   */
  type: 'menuItem';
  /**
   * Assigns this item to a group.
   *
   * @remarks
   * Groups enable selection behavior (single-selection / radio, or
   * multi-toggle). A group is scoped to the menu level it is defined in —
   * groups cannot span submenus.
   *
   * Required when `itemType` is `'toggle'`. Cannot be set when `itemType` is
   * `'action'`.
   */
  groupId?: string | undefined;
  /**
   * Controls how the item behaves when clicked.
   *
   * @remarks
   * If `'toggle'` menu item is shown in the toolbar by setting
   * {@link StackHeaderToolbarMenuItemBaseAndroid.showAsAction | showAsAction}
   * prop to value other than `'never'`, there is no visual indication of the
   * item toggle state.
   *
   * @defaultValue `'automatic'`
   */
  itemType?: StackHeaderToolbarMenuItemTypeAndroid | undefined;
  /**
   * Initial checked state for toggle items.
   *
   * @remarks
   * Only meaningful when effective `itemType` is `'toggle'`.
   *
   * The initial state does not trigger
   * {@link StackHeaderToolbarMenuGroupAndroid.onSelectionChange | onSelectionChange}
   * on the group at mount time.
   *
   * A {@link StackHeaderConfigPropsAndroid.toolbarMenu | toolbarMenu} prop
   * change restores the selection to this value. Neither that restore nor a
   * native header rebuild triggers `onSelectionChange`.
   *
   * @defaultValue `false`
   */
  initialToggleState?: boolean | undefined;
  /**
   * Callback invoked when the menu item is pressed.
   *
   * @remarks
   * Not called for items that behave as toggles (items with a `groupId` or
   * `itemType: 'toggle'`). For those items, use
   * {@link StackHeaderToolbarMenuGroupAndroid.onSelectionChange | onSelectionChange}
   * on the group instead.
   */
  onPress?: StackHeaderPressHandler | undefined;
}

/**
 * Group of toolbar menu items that share a selection behavior.
 *
 * @remarks
 * An item joins a group through its
 * {@link StackHeaderToolbarMenuItemAndroid.groupId | groupId}.
 */
export interface StackHeaderToolbarMenuGroupAndroid {
  /**
   * Unique identifier of the group.
   *
   * @remarks
   * Groups enable selection behavior (single-selection / radio, or
   * multi-toggle). A group is scoped to the menu level it is defined in —
   * groups cannot span submenus.
   *
   * Group identifier must be unique across the entire menu tree.
   */
  groupId: string;
  /**
   * Determines the type of selection in the group.
   *
   * @remarks
   * When `true`, only one item in the group can be selected at a time (radio
   * behavior). When `false`, items toggle independently (checkbox behavior).
   *
   * @defaultValue `false`
   */
  singleSelection?: boolean | undefined;
  /**
   * Callback invoked when the selection within the group changes. Receives the
   * list of currently selected item IDs.
   */
  onSelectionChange?: StackHeaderMenuSelectionHandler | undefined;
}

/**
 * Elements and groups of one level of the toolbar menu.
 *
 * @remarks
 * The top level is set with
 * {@link StackHeaderConfigPropsAndroid.toolbarMenu | toolbarMenu}; each
 * {@link StackHeaderToolbarMenuAndroid | submenu} holds the next level.
 */
export interface StackHeaderToolbarMenuBaseAndroid {
  /**
   * Group definitions for items in this menu level.
   *
   * @remarks
   * Groups enable selection behavior (single or multi-toggle) for items that
   * share the same {@link StackHeaderToolbarMenuItemAndroid.groupId | groupId}.
   * A group is scoped to the menu level it is defined in — groups cannot span
   * submenus.
   */
  groups?: StackHeaderToolbarMenuGroupAndroid[] | undefined;
  /**
   * Menu elements displayed in the toolbar menu.
   */
  children?: StackHeaderToolbarMenuElementAndroid[] | undefined;
}

/**
 * Submenu of the toolbar menu.
 *
 * @remarks
 * Pressing a submenu opens a popup with its own elements.
 */
export interface StackHeaderToolbarMenuAndroid
  extends StackHeaderToolbarMenuItemBaseAndroid,
    StackHeaderToolbarMenuBaseAndroid {
  /**
   * Marks this object as a submenu.
   *
   * @remarks
   * Android's `SubMenu` interface claims that nesting submenus isn't supported
   * but Material's implementation handles it correctly.
   */
  type: 'menu';
  /**
   * Header title displayed at the top of the submenu popup.
   *
   * @remarks
   * This is distinct from `title`, which controls the label shown in the parent
   * menu's item row.
   *
   * When left unset, the header falls back to `title`; when both are unset, the
   * popup shows no header.
   *
   * @see {@link https://developer.android.com/reference/android/view/SubMenu#setHeaderTitle(java.lang.CharSequence) | SubMenu.setHeaderTitle}
   */
  menuTitle?: string | undefined;
}

/**
 * Element of the toolbar menu.
 *
 * @remarks
 * An element is either a {@link StackHeaderToolbarMenuItemAndroid | menu item}
 * or a {@link StackHeaderToolbarMenuAndroid | submenu}, told apart by its
 * `type`.
 */
export type StackHeaderToolbarMenuElementAndroid =
  | StackHeaderToolbarMenuItemAndroid
  | StackHeaderToolbarMenuAndroid;

/**
 * Options for updating a toolbar menu element at runtime.
 *
 * @remarks
 * Accepts the fields of {@link StackHeaderToolbarMenuItemBaseAndroid} except
 * `id`. Omitted keys keep their current values; an explicit `undefined` resets
 * a field to its default.
 */
export interface StackHeaderToolbarMenuElementOptionsAndroid
  extends Partial<Omit<StackHeaderToolbarMenuItemBaseAndroid, 'id'>> {
  /**
   * Sets the checked state of the menu item.
   *
   * @remarks
   * In single-selection groups, setting `checked: true` automatically unchecks
   * other group members.
   */
  checked?: boolean | undefined;
  /**
   * Sets the header title of a submenu popup.
   *
   * @remarks
   * Only applies to `type: 'menu'` elements. Ignored if the target is a regular
   * menu item. Setting it to `undefined` drops the
   * {@link StackHeaderToolbarMenuAndroid.menuTitle | menuTitle} prop as well,
   * leaving the header to fall back to `title`.
   */
  menuTitle?: string | undefined;
}

/**
 * Update of one toolbar menu element, passed to
 * {@link StackHeaderConfigCommandsAndroid.updateToolbarMenuElements | updateToolbarMenuElements}.
 */
export interface StackHeaderToolbarMenuElementUpdateAndroid {
  /**
   * The ID of the menu element to update.
   */
  id: string;
  /**
   * Options to apply to the menu element.
   */
  options: StackHeaderToolbarMenuElementOptionsAndroid;
}

/**
 * Android-specific commands of {@link Stack.HeaderConfig}, available through
 * {@link StackHeaderConfigRef.android}.
 */
export interface StackHeaderConfigCommandsAndroid {
  /**
   * Applies one or more updates to the toolbar menu in a single batch.
   *
   * @remarks
   * Accepts a single update or an array of them; each targets a menu element
   * by `id` and applies its `options`. The call is queued and applied as one
   * atomic batch:
   * - if any update carries an `icon` that loads asynchronously, the whole
   *   batch waits for every icon before applying (updates are never applied
   *   partially);
   * - updates apply in array order, so an `id` may repeat and later values
   *   win field by field;
   * - once applied, each affected group emits at most one, coalesced
   *   {@link StackHeaderToolbarMenuGroupAndroid.onSelectionChange | onSelectionChange}
   *   call.
   *
   * Batches run in call order on a serial FIFO queue, so a later call is never
   * overtaken by an earlier one whose icon happened to load late.
   *
   * Updates persist for the lifetime of the current
   * {@link StackHeaderConfigPropsAndroid.toolbarMenu | toolbarMenu}
   * configuration: they survive every native header rebuild — an effective
   * color scheme change, a header
   * {@link StackHeaderConfigPropsAndroid.type | type},
   * {@link StackHeaderConfigPropsAndroid.maxLines | maxLines} or
   * {@link StackHeaderConfigPropsAndroid.collapsedTitleGravityMode | collapsedTitleGravityMode}
   * change, hiding and re-showing the header, reattaching the screen (e.g.
   * switching tabs) — and unrelated re-renders. Updates sent while the header
   * is hidden are recorded — and emit their selection events — as usual, and
   * take effect when the header is next shown. Only a `toolbarMenu` prop change
   * resets them, dropping the batches still queued as well (see its docs). An
   * update whose `id` is not in the current menu is ignored. An `icon` set via
   * this command takes precedence over the icon declared in `toolbarMenu` until
   * the next `toolbarMenu` change.
   *
   * @param updates - A single update object or an array of updates.
   * @platform android
   */
  updateToolbarMenuElements: (
    updates:
      | StackHeaderToolbarMenuElementUpdateAndroid
      | StackHeaderToolbarMenuElementUpdateAndroid[],
  ) => void;
}

/**
 * Android-specific props for {@link Stack.HeaderConfig}.
 */
export interface StackHeaderConfigPropsAndroid {
  /**
   * Specifies the type of the Material 3 app bar.
   *
   * @remarks
   * M3 Expressive headers aren't currently supported (there is no stable
   * `MDC-Android` version yet).
   *
   * @note
   * This is an implementation detail and may change. Changing this prop at
   * runtime rebuilds the header. Toolbar menu state survives the rebuild — see
   * {@link StackHeaderConfigCommandsAndroid.updateToolbarMenuElements | updateToolbarMenuElements}.
   *
   * @defaultValue `'small'`
   * @see {@link https://m3.material.io/components/app-bars/overview | Material Design 3: App bars}
   * @platform android
   */
  type?: StackHeaderTypeAndroid | undefined;
  /**
   * Custom view rendered behind the header content.
   *
   * @platform android
   */
  backgroundSubview?: StackHeaderBackgroundSubviewAndroid | undefined;
  /**
   * Custom view placed in the leading (start) slot of the toolbar.
   *
   * @platform android
   */
  leadingSubview?: StackHeaderToolbarSubviewAndroid | undefined;
  /**
   * Custom view placed in the center slot of the toolbar.
   *
   * @platform android
   */
  centerSubview?: StackHeaderToolbarSubviewAndroid | undefined;
  /**
   * Custom view placed in the trailing (end) slot of the toolbar.
   *
   * @platform android
   */
  trailingSubview?: StackHeaderToolbarSubviewAndroid | undefined;
  /**
   * Tint color applied to the back button icon in its normal state.
   *
   * @remarks
   * When `undefined`, the default tint color is used. This applies to the
   * native back arrow and `'drawableResource'` icons that have an associated
   * tint. For `'imageSource'` icons, no tint is applied by default.
   *
   * @platform android
   */
  backButtonTintColorNormal?: ColorValue | undefined;
  /**
   * Tint color applied to the back button icon when it is pressed.
   *
   * @remarks
   * Due to native platform limitations, if you set this prop, you must also
   * provide
   * {@link StackHeaderConfigPropsAndroid.backButtonTintColorNormal | backButtonTintColorNormal}.
   * Otherwise, the icon will become transparent.
   *
   * @platform android
   */
  backButtonTintColorPressed?: ColorValue | undefined;
  /**
   * Tint color applied to the back button icon when it is focused (e.g. by
   * keyboard navigation).
   *
   * @remarks
   * Due to native platform limitations, if you set this prop, you must also
   * provide
   * {@link StackHeaderConfigPropsAndroid.backButtonTintColorNormal | backButtonTintColorNormal}.
   * Otherwise, the icon will become transparent.
   *
   * @platform android
   */
  backButtonTintColorFocused?: ColorValue | undefined;
  /**
   * Custom icon for the back button.
   *
   * @remarks
   * When `undefined`, the native back arrow (`homeAsUpIndicator`) is used.
   *
   * `'imageSource'` type doesn't support SVGs on Android. For loading SVGs use
   * `'drawableResource'` type. `'drawableResource'` type requires passing a
   * drawable to resources via Android Studio.
   *
   * @platform android
   */
  backButtonIcon?: PlatformIconAndroid | undefined;
  /**
   * Custom icon for the overflow menu button (the three-dots button that opens
   * the toolbar menu's overflow popup).
   *
   * @remarks
   * When `undefined`, the Material 3 Expressive default overflow icon is used.
   *
   * `'imageSource'` type doesn't support SVGs on Android. For loading SVGs use
   * `'drawableResource'` type. `'drawableResource'` type requires passing a
   * drawable to resources via Android Studio.
   *
   * @platform android
   */
  overflowIcon?: PlatformIconAndroid | undefined;
  /**
   * Tint color applied to the overflow menu icon in its normal state.
   *
   * @remarks
   * When `undefined`, the default tint (the Material theme's menu icon color)
   * is used. This applies to the default overflow icon and `'drawableResource'`
   * icons that have an associated tint. For `'imageSource'` icons, no tint is
   * applied by default.
   *
   * @platform android
   */
  overflowIconTintColorNormal?: ColorValue | undefined;
  /**
   * Tint color applied to the overflow menu icon when it is pressed.
   *
   * @remarks
   * Due to native platform limitations, if you set this prop, you must also
   * provide
   * {@link StackHeaderConfigPropsAndroid.overflowIconTintColorNormal | overflowIconTintColorNormal}.
   * Otherwise, the icon will become transparent.
   *
   * @platform android
   */
  overflowIconTintColorPressed?: ColorValue | undefined;
  /**
   * Tint color applied to the overflow menu icon when it is focused (e.g. by
   * keyboard navigation).
   *
   * @remarks
   * Due to native platform limitations, if you set this prop, you must also
   * provide
   * {@link StackHeaderConfigPropsAndroid.overflowIconTintColorNormal | overflowIconTintColorNormal}.
   * Otherwise, the icon will become transparent.
   *
   * @platform android
   */
  overflowIconTintColorFocused?: ColorValue | undefined;
  /**
   * Whether the header reacts to nested scroll. Required for any other
   * `scrollFlag*` prop to take effect.
   *
   * @remarks
   * When `undefined`, falls back to the type-specific default:
   * - `'small'`: `false`
   * - `'medium'` / `'large'`: `true`
   *
   * Changing any `scrollFlag*` at runtime while the header is partially
   * collapsed snaps it back to its fully expanded state. A fully collapsed
   * header stays collapsed, unless the new flags do not allow collapsing at
   * all - then it expands.
   *
   * @platform android
   */
  scrollFlagScroll?: boolean | undefined;
  /**
   * When enabled, the header re-expands as soon as the user scrolls back toward
   * the top of the content, regardless of the ScrollView's current scroll
   * position. Without this flag, the header only begins expanding once the list
   * has reached the top of its content. Requires
   * {@link StackHeaderConfigPropsAndroid.scrollFlagScroll | scrollFlagScroll}.
   *
   * @remarks
   * When `undefined`, falls back to the type-specific default (`false` for all
   * types).
   *
   * @platform android
   */
  scrollFlagEnterAlways?: boolean | undefined;
  /**
   * Modifies
   * {@link StackHeaderConfigPropsAndroid.scrollFlagEnterAlways | scrollFlagEnterAlways}
   * so that the initial re-entry stops at the header's collapsed height (the
   * toolbar); the remainder expands only after the ScrollView reaches the top
   * of its content. Requires `scrollFlagEnterAlways`.
   *
   * @remarks
   * When `undefined`, falls back to the type-specific default (`false` for all
   * types).
   *
   * This flag does not have any effect for `'small'` header.
   *
   * @platform android
   */
  scrollFlagEnterAlwaysCollapsed?: boolean | undefined;
  /**
   * When enabled, the header collapses only until its minimum height (the
   * toolbar) remains pinned at the top. Without this flag, the entire header
   * scrolls off the screen. Requires
   * {@link StackHeaderConfigPropsAndroid.scrollFlagScroll | scrollFlagScroll}.
   *
   * @remarks
   * When `undefined`, falls back to the type-specific default:
   * - `'small'`: `false`
   * - `'medium'` / `'large'`: `true`
   *
   * Setting this flag for `'small'` header is equivalent to disabling
   * `scrollFlagScroll`.
   *
   * Even when this flag is disabled, a strip with the height of the system top
   * inset (status bar and display cutout) remains visible at the top.
   *
   * @platform android
   */
  scrollFlagExitUntilCollapsed?: boolean | undefined;
  /**
   * When enabled, the header snaps to its nearest edge (fully expanded, or
   * fully collapsed as defined by
   * {@link StackHeaderConfigPropsAndroid.scrollFlagExitUntilCollapsed | scrollFlagExitUntilCollapsed})
   * after a scroll gesture ends, instead of resting partway. Requires
   * {@link StackHeaderConfigPropsAndroid.scrollFlagScroll | scrollFlagScroll}.
   *
   * @remarks
   * When `undefined`, falls back to the type-specific default:
   * - `'small'`: `false`
   * - `'medium'` / `'large'`: `true`
   *
   * @platform android
   */
  scrollFlagSnap?: boolean | undefined;
  /**
   * Whether the app bar lifts (applies a tonal/elevation shift) when content is
   * scrolled beneath it.
   *
   * @remarks
   * For reliable behavior the content scroll view should be designated with a
   * {@link ScrollViewMarker}. Without it, the app bar cannot always locate the
   * scroll view, which can cause the lifted state to flicker while scrolling.
   *
   * Applies to the `'small'` header only. For `'medium'` and `'large'` headers
   * the Material `CollapsingToolbarLayout` uses a fade title-collapse mode that
   * installs its own content scrim and disables the app bar's lift-on-scroll,
   * so this prop has no effect there. The collapsed appearance of those headers
   * is instead controlled by that content scrim — see
   * {@link StackHeaderConfigPropsAndroid.scrolledBackgroundColor | scrolledBackgroundColor}.
   *
   * Has no effect while the header is
   * {@link StackHeaderConfigPropsBase.transparent | transparent} (there is no
   * scrolling content behavior installed in that mode).
   *
   * @defaultValue `true`
   * @platform android
   */
  liftOnScroll?: boolean | undefined;
  /**
   * Background color of the header.
   *
   * @remarks
   * Applies to all header types. For `'medium'` / `'large'` headers this is the
   * color of the expanded state — the collapsed state color is controlled by
   * {@link StackHeaderConfigPropsAndroid.scrolledBackgroundColor | scrolledBackgroundColor}.
   *
   * If value is not provided, falls back to Material's default.
   *
   * @platform android
   */
  backgroundColor?: ColorValue | undefined;
  /**
   * Background color of the header when content is scrolled beneath it.
   *
   * @remarks
   * For the `'small'` header, this is the lift-on-scroll target color: when
   * content is scrolled beneath the app bar, the background animates from
   * {@link StackHeaderConfigPropsAndroid.backgroundColor | backgroundColor} to
   * this color. Requires
   * {@link StackHeaderConfigPropsAndroid.liftOnScroll | liftOnScroll}.
   *
   * For `'medium'` / `'large'` headers, this is the color of the content scrim
   * that fades in as the header collapses. The scrim is drawn above the header
   * background (and the
   * {@link StackHeaderConfigPropsAndroid.backgroundSubview | backgroundSubview},
   * if any) but below the toolbar content.
   *
   * A translucent color is composited over the header background instead of
   * replacing it.
   *
   * If value is not provided, falls back to Material's default.
   *
   * @platform android
   */
  scrolledBackgroundColor?: ColorValue | undefined;
  /**
   * Color of the scrim drawn in the status-bar area, masking header content
   * that scrolls under the status bar in edge-to-edge apps.
   *
   * @remarks
   * For the `'small'` header, the scrim is a constant strip pinned to the top
   * of the window, drawn above the toolbar content. When not provided, the
   * strip follows the header's effective background color:
   * {@link StackHeaderConfigPropsAndroid.backgroundColor | backgroundColor} at
   * rest, animating together with the lift-on-scroll transition towards
   * {@link StackHeaderConfigPropsAndroid.scrolledBackgroundColor | scrolledBackgroundColor}.
   * An explicit color is applied statically, without tracking.
   *
   * For `'medium'` / `'large'` headers, the scrim fades in and out together
   * with the content scrim as the header collapses. When not provided, it
   * matches the content scrim color (`scrolledBackgroundColor`).
   *
   * Set to `'transparent'` to disable the scrim entirely.
   *
   * The default scrim is installed only when the color it follows resolves to a
   * fully opaque color; translucent headers stay see-through. An explicit
   * translucent color is honored and composites over the header background in
   * the status-bar area (for `'medium'` / `'large'` headers the content scrim
   * is excluded from that area while a scrim is installed, so the two scrims
   * never stack).
   *
   * @platform android
   */
  statusBarScrimColor?: ColorValue | undefined;
  /**
   * Toolbar menu configuration.
   *
   * @remarks
   * This prop serves as initial configuration of the toolbar menu. If you want
   * to change some property in runtime, use
   * {@link StackHeaderConfigCommandsAndroid.updateToolbarMenuElements | updateToolbarMenuElements}
   * view command.
   *
   * Changing this prop at runtime rebuilds the toolbar menu and resets all of
   * its runtime state: checkbox/radio selections return to their
   * {@link StackHeaderToolbarMenuItemAndroid.initialToggleState | initialToggleState}
   * and every change applied via `updateToolbarMenuElements` is discarded,
   * including batches still waiting in the queue (e.g. for an icon download).
   * Any real change counts, even one only swapping an item's icon; re-sending
   * an identical menu is a no-op and preserves the state.
   *
   * An invalid menu is rejected — for example duplicate item or group ids, a
   * {@link StackHeaderToolbarMenuItemAndroid.groupId | groupId} that is not
   * declared at the same menu level, or more than one `initialToggleState` in a
   * single-selection group. The menu is validated when the prop is set, and a
   * rejected menu leaves the previous one in effect.
   *
   * @platform android
   */
  toolbarMenu?: StackHeaderToolbarMenuBaseAndroid | undefined;
  /**
   * Enables visual dividers between menu groups.
   *
   * @remarks
   * Below API level 28, the value of this prop is ignored.
   *
   * @defaultValue `false`
   * @platform android >= 28
   */
  toolbarMenuGroupDividerEnabled?: boolean | undefined;
  /**
   * Horizontally centers the title within the app bar.
   *
   * @remarks
   * Applies to the `'small'` header only; ignored for `'medium'` / `'large'`
   * (use
   * {@link StackHeaderConfigPropsAndroid.expandedTitleHorizontalGravity | expandedTitleHorizontalGravity} /
   * {@link StackHeaderConfigPropsAndroid.collapsedTitleHorizontalGravity | collapsedTitleHorizontalGravity}
   * instead). The title is centered independently of the subtitle. Combining a
   * centered title with leading and/or center subviews is not recommended —
   * they may overlap or be laid out incorrectly.
   *
   * @defaultValue `false`
   * @platform android
   */
  titleCentered?: boolean | undefined;
  /**
   * Horizontally centers the subtitle within the app bar.
   *
   * @remarks
   * Applies to the `'small'` header only. The subtitle is centered
   * independently of the title. See
   * {@link StackHeaderConfigPropsAndroid.titleCentered | titleCentered}.
   *
   * @defaultValue `false`
   * @platform android
   */
  subtitleCentered?: boolean | undefined;
  /**
   * Horizontal alignment of the title (and subtitle) in the expanded state.
   *
   * @remarks
   * Applies to `'medium'` / `'large'` headers only; ignored for `'small'` (use
   * {@link StackHeaderConfigPropsAndroid.titleCentered | titleCentered}
   * instead). The subtitle always follows the title's alignment.
   *
   * @defaultValue `'start'`
   * @platform android
   */
  expandedTitleHorizontalGravity?:
    | StackHeaderTitleHorizontalGravityAndroid
    | undefined;
  /**
   * Vertical alignment of the title (and subtitle) in the expanded state.
   *
   * @remarks
   * Applies to `'medium'` / `'large'` headers only; ignored for `'small'`.
   *
   * @defaultValue `'bottom'`
   * @platform android
   */
  expandedTitleVerticalGravity?:
    | StackHeaderTitleVerticalGravityAndroid
    | undefined;
  /**
   * Horizontal alignment of the title (and subtitle) in the collapsed state.
   *
   * @remarks
   * Applies to `'medium'` / `'large'` headers only; ignored for `'small'`. The
   * subtitle always follows the title's alignment. `'center'` is further
   * affected by
   * {@link StackHeaderConfigPropsAndroid.collapsedTitleGravityMode | collapsedTitleGravityMode}.
   *
   * @defaultValue `'start'`
   * @platform android
   */
  collapsedTitleHorizontalGravity?:
    | StackHeaderTitleHorizontalGravityAndroid
    | undefined;
  /**
   * Vertical alignment of the title (and subtitle) in the collapsed state.
   *
   * @remarks
   * Applies to `'medium'` / `'large'` headers only; ignored for `'small'`.
   *
   * @defaultValue `'center'`
   * @platform android
   */
  collapsedTitleVerticalGravity?:
    | StackHeaderTitleVerticalGravityAndroid
    | undefined;
  /**
   * Anchor used when resolving the collapsed title's horizontal gravity.
   *
   * @remarks
   * Applies to `'medium'` / `'large'` headers only and affects only the
   * collapsed state; it is only visually meaningful with
   * `collapsedTitleHorizontalGravity: 'center'`.
   *
   * If the header is laid out during a screen transition, due to a native bug,
   * the title and the subtitle might be laid out incorrectly when
   * `'entireSpace'` gravity mode is used.
   *
   * @note
   * This is an implementation detail and may change. Because the underlying
   * Material field is set at construction time, changing this prop rebuilds the
   * header.
   *
   * @defaultValue `'availableSpace'`
   * @platform android
   */
  collapsedTitleGravityMode?:
    | StackHeaderCollapsedTitleGravityModeAndroid
    | undefined;
  /**
   * Maximum number of lines for the expanded title and subtitle.
   *
   * @remarks
   * A single shared value: the same limit applies to both the expanded title
   * and the expanded subtitle. Text exceeding the limit is ellipsized.
   *
   * Applies to `'medium'` / `'large'` headers only; ignored for `'small'`. The
   * collapsed title is always a single line regardless of this value.
   *
   * A value less than `1` is invalid and falls back to `1`.
   *
   * @note
   * This is an implementation detail and may change. Changing this value at
   * runtime rebuilds the header. This is required due to a native platform
   * limitation.
   *
   * @defaultValue `1`
   * @platform android
   */
  maxLines?: number | undefined;
  /**
   * Start inset of the toolbar.
   *
   * @remarks
   * The inset is a minimum: the navigation icon is positioned before it is
   * applied and is not bounded by it, so the content area starts at whichever
   * reaches further from the edge — the navigation icon's trailing edge or this
   * inset. A back button usually wins, which makes this prop inert while one is
   * visible.
   *
   * Applies to all header types. On `'medium'` / `'large'` it affects the
   * collapsed title only.
   *
   * By default, native platform applies non-zero inset which makes centered
   * collapsed title look off-center when `collapsedTitleGravityMode:
   * 'availableSpace'` is used.
   *
   * If value is not provided, falls back to Material's default.
   *
   * @platform android
   */
  contentInsetStart?: number | undefined;
  /**
   * End inset of the toolbar content area.
   *
   * @remarks
   * The end-side counterpart of
   * {@link StackHeaderConfigPropsAndroid.contentInsetStart | contentInsetStart}.
   * Applies to all header types. Like its start-side counterpart it is a
   * minimum, so it is inert while the toolbar menu shows items that already
   * reach further in.
   *
   * If value is not provided, falls back to Material's default.
   *
   * @platform android
   */
  contentInsetEnd?: number | undefined;
  /**
   * Color of the title text. Applies to `'small'` header only.
   *
   * @remarks
   * If value is not provided, falls back to Material's default.
   *
   * @platform android
   */
  titleColor?: ColorValue | undefined;
  /**
   * Font family of the title text. Applies to `'small'` header only.
   *
   * @remarks
   * If value is not provided, falls back to Material's default.
   *
   * @platform android
   */
  titleFontFamily?: TextStyle['fontFamily'] | undefined;
  /**
   * Font size (SP) of the title text. Applies to `'small'` header only.
   *
   * @remarks
   * If value is not provided, falls back to Material's default.
   *
   * @platform android
   */
  titleFontSize?: TextStyle['fontSize'] | undefined;
  /**
   * Font weight of the title text. Applies to `'small'` header only.
   *
   * @remarks
   * If value is not provided, falls back to Material's default.
   *
   * @platform android
   */
  titleFontWeight?: TextStyle['fontWeight'] | undefined;
  /**
   * Font style of the title text. Applies to `'small'` header only.
   *
   * @remarks
   * If value is not provided, falls back to Material's default.
   *
   * @platform android
   */
  titleFontStyle?: TextStyle['fontStyle'] | undefined;
  /**
   * Color of the subtitle text. Applies to `'small'` header only.
   *
   * @remarks
   * If value is not provided, falls back to Material's default.
   *
   * @platform android
   */
  subtitleColor?: ColorValue | undefined;
  /**
   * Font family of the subtitle text. Applies to `'small'` header only.
   *
   * @remarks
   * If value is not provided, falls back to Material's default.
   *
   * @platform android
   */
  subtitleFontFamily?: TextStyle['fontFamily'] | undefined;
  /**
   * Font size (SP) of the subtitle text. Applies to `'small'` header only.
   *
   * @remarks
   * If value is not provided, falls back to Material's default.
   *
   * @platform android
   */
  subtitleFontSize?: TextStyle['fontSize'] | undefined;
  /**
   * Font weight of the subtitle text. Applies to `'small'` header only.
   *
   * @remarks
   * If value is not provided, falls back to Material's default.
   *
   * @platform android
   */
  subtitleFontWeight?: TextStyle['fontWeight'] | undefined;
  /**
   * Font style of the subtitle text. Applies to `'small'` header only.
   *
   * @remarks
   * If value is not provided, falls back to Material's default.
   *
   * @platform android
   */
  subtitleFontStyle?: TextStyle['fontStyle'] | undefined;
  /**
   * Color of the expanded title text. Applies to `'medium'` and `'large'`
   * headers only.
   *
   * @remarks
   * If value is not provided, falls back to Material's default.
   *
   * @platform android
   */
  expandedTitleColor?: ColorValue | undefined;
  /**
   * Font family of the expanded title text. Applies to `'medium'` and `'large'`
   * headers only.
   *
   * @remarks
   * If value is not provided, falls back to Material's default.
   *
   * @platform android
   */
  expandedTitleFontFamily?: TextStyle['fontFamily'] | undefined;
  /**
   * Font size (SP) of the expanded title text. Applies to `'medium'` and
   * `'large'` headers only.
   *
   * @remarks
   * If value is not provided, falls back to Material's default.
   *
   * @platform android
   */
  expandedTitleFontSize?: TextStyle['fontSize'] | undefined;
  /**
   * Font weight of the expanded title text. Applies to `'medium'` and `'large'`
   * headers only.
   *
   * @remarks
   * If value is not provided, falls back to Material's default.
   *
   * @platform android
   */
  expandedTitleFontWeight?: TextStyle['fontWeight'] | undefined;
  /**
   * Font style of the expanded title text. Applies to `'medium'` and `'large'`
   * headers only.
   *
   * @remarks
   * If value is not provided, falls back to Material's default.
   *
   * @platform android
   */
  expandedTitleFontStyle?: TextStyle['fontStyle'] | undefined;
  /**
   * Color of the collapsed title text. Applies to `'medium'` and `'large'`
   * headers only.
   *
   * @remarks
   * If value is not provided, falls back to Material's default.
   *
   * @platform android
   */
  collapsedTitleColor?: ColorValue | undefined;
  /**
   * Font family of the collapsed title text. Applies to `'medium'` and
   * `'large'` headers only.
   *
   * @remarks
   * If value is not provided, falls back to Material's default.
   *
   * @platform android
   */
  collapsedTitleFontFamily?: TextStyle['fontFamily'] | undefined;
  /**
   * Font size (SP) of the collapsed title text. Applies to `'medium'` and
   * `'large'` headers only.
   *
   * @remarks
   * If value is not provided, falls back to Material's default.
   *
   * @platform android
   */
  collapsedTitleFontSize?: TextStyle['fontSize'] | undefined;
  /**
   * Font weight of the collapsed title text. Applies to `'medium'` and
   * `'large'` headers only.
   *
   * @remarks
   * If value is not provided, falls back to Material's default.
   *
   * @platform android
   */
  collapsedTitleFontWeight?: TextStyle['fontWeight'] | undefined;
  /**
   * Font style of the collapsed title text. Applies to `'medium'` and `'large'`
   * headers only.
   *
   * @remarks
   * If value is not provided, falls back to Material's default.
   *
   * @platform android
   */
  collapsedTitleFontStyle?: TextStyle['fontStyle'] | undefined;
  /**
   * Color of the expanded subtitle text. Applies to `'medium'` and `'large'`
   * headers only.
   *
   * @remarks
   * If value is not provided, falls back to Material's default.
   *
   * @platform android
   */
  expandedSubtitleColor?: ColorValue | undefined;
  /**
   * Font family of the expanded subtitle text. Applies to `'medium'` and
   * `'large'` headers only.
   *
   * @remarks
   * If value is not provided, falls back to Material's default.
   *
   * @platform android
   */
  expandedSubtitleFontFamily?: TextStyle['fontFamily'] | undefined;
  /**
   * Font size (SP) of the expanded subtitle text. Applies to `'medium'` and
   * `'large'` headers only.
   *
   * @remarks
   * If value is not provided, falls back to Material's default.
   *
   * @platform android
   */
  expandedSubtitleFontSize?: TextStyle['fontSize'] | undefined;
  /**
   * Font weight of the expanded subtitle text. Applies to `'medium'` and
   * `'large'` headers only.
   *
   * @remarks
   * If value is not provided, falls back to Material's default.
   *
   * @platform android
   */
  expandedSubtitleFontWeight?: TextStyle['fontWeight'] | undefined;
  /**
   * Font style of the expanded subtitle text. Applies to `'medium'` and
   * `'large'` headers only.
   *
   * @remarks
   * If value is not provided, falls back to Material's default.
   *
   * @platform android
   */
  expandedSubtitleFontStyle?: TextStyle['fontStyle'] | undefined;
  /**
   * Color of the collapsed subtitle text. Applies to `'medium'` and `'large'`
   * headers only.
   *
   * @remarks
   * If value is not provided, falls back to Material's default.
   *
   * @platform android
   */
  collapsedSubtitleColor?: ColorValue | undefined;
  /**
   * Font family of the collapsed subtitle text. Applies to `'medium'` and
   * `'large'` headers only.
   *
   * @remarks
   * If value is not provided, falls back to Material's default.
   *
   * @platform android
   */
  collapsedSubtitleFontFamily?: TextStyle['fontFamily'] | undefined;
  /**
   * Font size (SP) of the collapsed subtitle text. Applies to `'medium'` and
   * `'large'` headers only.
   *
   * @remarks
   * If value is not provided, falls back to Material's default.
   *
   * @platform android
   */
  collapsedSubtitleFontSize?: TextStyle['fontSize'] | undefined;
  /**
   * Font weight of the collapsed subtitle text. Applies to `'medium'` and
   * `'large'` headers only.
   *
   * @remarks
   * If value is not provided, falls back to Material's default.
   *
   * @platform android
   */
  collapsedSubtitleFontWeight?: TextStyle['fontWeight'] | undefined;
  /**
   * Font style of the collapsed subtitle text. Applies to `'medium'` and
   * `'large'` headers only.
   *
   * @remarks
   * If value is not provided, falls back to Material's default.
   *
   * @platform android
   */
  collapsedSubtitleFontStyle?: TextStyle['fontStyle'] | undefined;
}
