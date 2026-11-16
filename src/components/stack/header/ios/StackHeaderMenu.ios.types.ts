import type { PlatformIconIOS } from '../../../shared/types';
import type {
  StackHeaderMenuSelectionHandler,
  StackHeaderPressHandler,
} from '../StackHeaderConfig.types';

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
   */
  id: string;
  /**
   * Marks this object as a menu item definition.
   */
  type: 'menuItem';
  /**
   * Title displayed for the menu item.
   */
  title?: string | undefined;
  /**
   * Determines the behavior of the menu item.
   *
   * @defaultValue `'automatic'`
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
   * @defaultValue `false`
   */
  initialToggleState?: boolean | undefined;
  /**
   * Icon displayed for the menu item.
   *
   * @remarks
   * Supports SF Symbols, xcassets, and image sources. For async image sources,
   * the menu item renders without an icon first and updates when loaded.
   */
  icon?: PlatformIconIOS | undefined;
  /**
   * Callback invoked when the menu item is pressed.
   *
   * @remarks
   * Fires only for items whose effective type is `'action'`. For toggle items,
   * this callback will not fire — use
   * {@link StackHeaderMenuIOS.onSelectionChange | onSelectionChange} on the
   * parent menu instead.
   */
  onPress?: StackHeaderPressHandler | undefined;
  /**
   * Keeps the menu presented after this item is tapped.
   *
   * @remarks
   * When enabled, selecting this item will not dismiss the menu, allowing the
   * user to continue interacting with other items.
   *
   * This prop should only be used for items in top-level menus. Requires iOS
   * 16.0 or later.
   *
   * @defaultValue `false`
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
 * Note: The topmost menu that enables this prop becomes Single Selection Root.
 * Only the root receives
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
   */
  id: string;
  /**
   * Marks this object as a menu definition.
   */
  type: 'menu';
  /**
   * Title displayed for the menu.
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
   */
  singleSelection?: boolean | undefined;
  /**
   * Icon displayed for the submenu.
   *
   * @remarks
   * Supports SF Symbols, xcassets, and image sources. For async image sources,
   * the menu renders without an icon first and updates when loaded.
   */
  icon?: PlatformIconIOS | undefined;
  /**
   * Displays the menu inline with parent menu instead of as a submenu.
   *
   * @remarks
   * A menu displayed inline is rendered directly inside its parent menu,
   * with horizontal bars separating it from the surrounding items.
   *
   * @defaultValue `false`
   */
  displayInline?: boolean | undefined;
  /**
   * Displays the menu as a row of compact items (palette).
   *
   * @remarks
   * When enabled, the menu children are rendered as a horizontal palette
   * row instead of a vertical list. Best suited for menus with icon-only items.
   *
   * Requires iOS 17.0 or later. On older versions, this option is ignored.
   *
   * @defaultValue `false`
   */
  displayAsPalette?: boolean | undefined;
  /**
   * Child elements of this menu.
   *
   * @remarks
   * Each child is either a {@link StackHeaderMenuItemIOS} (leaf) or another
   * {@link StackHeaderMenuIOS}, allowing arbitrarily nested menu trees.
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
