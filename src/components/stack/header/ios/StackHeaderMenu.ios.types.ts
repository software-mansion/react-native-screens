import type {
  StackHeaderMenuSelectionHandler,
  StackHeaderPressHandler,
} from '../StackHeaderConfig.types';
import type { StackPlatformIconIOS } from '../StackHeaderConfig.ios.types';

/**
 * Behavior of a menu item.
 *
 * @remarks
 * The following values are available:
 * - `'action'` — a button that fires
 *   {@link StackHeaderMenuItemIOS.onPress | onPress} when tapped. Cannot be
 *   used inside a {@link StackHeaderMenuIOS.singleSelection | singleSelection}
 *   menu.
 * - `'toggle'` — a stateful item whose on/off state is tracked automatically.
 *   Toggle items do not fire `onPress`; instead, parent menu (or Single
 *   Selection Root in case of
 *   {@link StackHeaderMenuIOS.singleSelection | singleSelection}) is passed
 *   currently selected items with
 *   {@link StackHeaderMenuIOS.onSelectionChange | onSelectionChange}.
 * - `'automatic'` — resolved at render time: becomes `'toggle'` when the item
 *   is under `singleSelection` hierarchy, `'action'` otherwise.
 */
export type StackHeaderMenuItemTypeIOS = 'action' | 'toggle' | 'automatic';

/**
 * Represents a single actionable item inside a {@link StackHeaderMenuIOS} menu.
 *
 * @remarks
 * A menu item is a leaf element that the user can interact with.
 * Depending on its {@link StackHeaderMenuItemIOS.itemType | itemType}, the item
 * behaves as a one-shot action or a stateful toggle.
 */
export interface StackHeaderMenuItemIOS {
  /**
   * Unique identifier of the menu item.
   *
   * @remarks
   * Used to locate the item inside a menu tree and to identify selected items
   * in {@link StackHeaderMenuIOS.onSelectionChange | onSelectionChange}
   * callback.
   *
   * @platform ios
   */
  id: string;
  /**
   * Marks this object as a menu item definition.
   *
   * @platform ios
   */
  type: 'menuItem';
  /**
   * Title displayed for the menu item.
   *
   * @platform ios
   */
  title?: string | undefined;
  /**
   * Determines the behavior of the menu item.
   *
   * @defaultValue `'automatic'`
   * @platform ios
   */
  itemType?: StackHeaderMenuItemTypeIOS | undefined;
  /**
   * Initial on/off state of a toggle item.
   *
   * @remarks
   * Only meaningful when {@link StackHeaderMenuItemIOS.itemType | itemType}
   * resolves to `'toggle'`. Inside a
   * {@link StackHeaderMenuIOS.singleSelection | singleSelection} hierarchy, at
   * most one item can set this to `true`.
   *
   * The initial state does not trigger
   * {@link StackHeaderMenuIOS.onSelectionChange | onSelectionChange} at mount
   * time.
   *
   * A change of the menu restores the selection to this value. The `menu` and
   * `menuRepresentation` of a header item share their toggle state, so a
   * change of either one restores both and discards everything view commands
   * changed in both; a `titleMenu` change does the same for the title menu.
   * Any real change counts; passing an equal menu again is a no-op and
   * preserves the state. Removing a header item and adding it again, or
   * moving it between `leadingItems` and `trailingItems`, restores the
   * selection as well.
   *
   * Everything else preserves the state: a native header rebuild, navigating
   * away from the screen and back, reordering the header items (this one
   * included), adding or removing other header items and changing other
   * props of the item. Neither a restore nor a rebuild triggers
   * `onSelectionChange`.
   *
   * @defaultValue `false`
   * @platform ios
   */
  initialToggleState?: boolean | undefined;
  /**
   * Icon displayed for the menu item.
   *
   * @remarks
   * Supports SF Symbols, xcassets, and image sources. For async image sources,
   * the menu item renders without an icon first and updates when loaded.
   *
   * @platform ios
   */
  icon?: StackPlatformIconIOS | undefined;
  /**
   * Callback invoked when the menu item is pressed.
   *
   * @remarks
   * Fires only for items whose effective type is `'action'`. For toggle items,
   * this callback will not fire — use
   * {@link StackHeaderMenuIOS.onSelectionChange | onSelectionChange} on the
   * parent menu instead.
   *
   * @platform ios
   */
  onPress?: StackHeaderPressHandler | undefined;
  /**
   * Keeps the menu presented after this item is tapped.
   *
   * @remarks
   * When enabled, selecting this item will not dismiss the menu, allowing the
   * user to continue interacting with other items.
   *
   * This prop should only be used for items in top-level menus.
   *
   * @defaultValue `false`
   * @platform ios >= 16
   */
  keepsMenuPresented?: boolean | undefined;
}

/**
 * Represents a menu (or submenu) that groups
 * {@link StackHeaderMenuElementIOS} children.
 *
 * @remarks
 * A menu is a container that can hold both leaf items
 * ({@link StackHeaderMenuItemIOS}) and nested menus. Set
 * {@link StackHeaderMenuIOS.singleSelection | singleSelection} to `true` to
 * make the menu behave like a radio group across its entire hierarchy.
 *
 * The topmost menu that enables this prop becomes Single Selection Root. Only
 * the root receives
 * {@link StackHeaderMenuIOS.onSelectionChange | onSelectionChange} event, with
 * exactly one item id passed to the callback. Only one item may be selected,
 * across the whole hierarchy under Single Selection Root (even when mixing
 * items and nested menus). Previously selected item is deselected
 * automatically. Multiple Single Selection Roots may exist only if their
 * hierarchy is completely separate.
 */
export interface StackHeaderMenuIOS {
  /**
   * Unique identifier of the menu.
   *
   * @remarks
   * Used to locate the menu inside a tree and as the reference when querying or
   * manipulating menu state.
   *
   * @platform ios
   */
  id: string;
  /**
   * Marks this object as a menu definition.
   *
   * @platform ios
   */
  type: 'menu';
  /**
   * Title displayed for the menu.
   *
   * @platform ios
   */
  title?: string | undefined;
  /**
   * Enables single selection mode for this menu and its descendants.
   *
   * @remarks
   * The topmost menu with `singleSelection` enabled becomes Single Selection
   * Root. At most one toggle item in the entire hierarchy rooted at this menu
   * can be selected at a time.
   *
   * Items with {@link StackHeaderMenuItemIOS.itemType | itemType} set to
   * `'automatic'` are resolved to `'toggle'` inside a `singleSelection`
   * hierarchy. `'action'` items are disallowed.
   *
   * @defaultValue `false`
   * @platform ios
   */
  singleSelection?: boolean | undefined;
  /**
   * Icon displayed for the submenu.
   *
   * @remarks
   * Supports SF Symbols, xcassets, and image sources. For async image sources,
   * the menu renders without an icon first and updates when loaded.
   *
   * @platform ios
   */
  icon?: StackPlatformIconIOS | undefined;
  /**
   * Displays the menu inline with parent menu instead of as a submenu.
   *
   * @remarks
   * A menu displayed inline is rendered directly inside its parent menu,
   * with horizontal bars separating it from the surrounding items.
   *
   * @defaultValue `false`
   * @platform ios
   */
  displayInline?: boolean | undefined;
  /**
   * Displays the menu as a row of compact items (palette).
   *
   * @remarks
   * When enabled, the menu children are rendered as a horizontal palette
   * row instead of a vertical list. Best suited for menus with icon-only items.
   *
   * @defaultValue `false`
   * @platform ios >= 17
   */
  displayAsPalette?: boolean | undefined;
  /**
   * Child elements of this menu.
   *
   * @remarks
   * Each child is either a {@link StackHeaderMenuItemIOS} (leaf) or another
   * {@link StackHeaderMenuIOS}, allowing arbitrarily nested menu trees.
   *
   * @platform ios
   */
  children: StackHeaderMenuElementIOS[];
  /**
   * Callback invoked when the set of selected toggle items changes.
   *
   * @remarks
   * Receives an array of IDs of all currently selected toggle items in this
   * menu's hierarchy. For Single Selection Root, the array always has one item.
   * When defined below Single Selection Root, the callback doesn't fire. In
   * regular non-single-selection case, only changes to direct children are
   * reflected.
   *
   * @platform ios
   */
  onSelectionChange?: StackHeaderMenuSelectionHandler | undefined;
}

/**
 * A menu element type.
 *
 * @remarks
 * A menu element is either a {@link StackHeaderMenuIOS | menu} (container with
 * children) or a {@link StackHeaderMenuItemIOS | menu item} (actionable leaf).
 */
export type StackHeaderMenuElementIOS =
  | StackHeaderMenuIOS
  | StackHeaderMenuItemIOS;
