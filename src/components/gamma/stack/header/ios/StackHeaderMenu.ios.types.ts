/**
 * @summary Represents a single actionable item inside a {@link StackHeaderMenuIOS} menu.
 *
 * @description
 * A menu item is a leaf element that the user can interact with.
 * Depending on its {@link StackHeaderMenuItemIOS.itemType | itemType}, the item
 * behaves as a one-shot action or a stateful toggle.
 *
 * @platform ios
 */
export interface StackHeaderMenuItemIOS {
  /**
   * @summary Unique identifier of the menu item.
   *
   * @description
   * Used to locate the item inside a menu tree and to identify selected items
   * in {@link StackHeaderMenuIOS.onSelectionChange} callback.
   *
   * @platform ios
   */
  id: string;
  /**
   * @summary Marks this object as a menu item definition.
   *
   * @platform ios
   */
  type: 'menuItem';
  /**
   * @summary Title displayed for the menu item.
   *
   * @platform ios
   */
  title?: string | undefined;
  /**
   * @summary Determines the behavior of the menu item.
   *
   * @description
   * The following values are available:
   * - `action` - a button that fires {@link StackHeaderMenuItemIOS.onPress | onPress}
   *   when tapped. Cannot be used inside a `singleSelection` menu.
   * - `toggle` - a stateful item whose on/off state is tracked automatically.
   *   Toggle items do not fire `onPress`; instead, parent menu
   *   (or Single Selection Root in case of {@link StackHeaderMenuIOS.singleSelection | singleSelection})
   *   is passed currently selected items with {@link StackHeaderMenuIOS.onSelectionChange | onSelectionChange}
   * - `automatic` - resolved at render time: becomes `toggle` when the item is
   *   under `singleSelection` hierarchy, `action` otherwise.
   *
   * @default automatic
   *
   * @platform ios
   */
  itemType?: 'action' | 'toggle' | 'automatic' | undefined;
  /**
   * @summary Initial on/off state of a toggle item.
   *
   * @description
   * Only meaningful when {@link StackHeaderMenuItemIOS.itemType | itemType}
   * resolves to `toggle`. Inside a `singleSelection` hierarchy, at most one
   * item can set this to `true`.
   *
   * @default false
   *
   * @platform ios
   */
  initialToggleState?: boolean | undefined;
  /**
   * @summary Callback invoked when the menu item is pressed.
   *
   * @description
   * Fires only for items whose effective type is `action`. For toggle items,
   * this callback will not fire — use
   * {@link StackHeaderMenuIOS.onSelectionChange | onSelectionChange} on the
   * parent menu instead.
   *
   * @platform ios
   */
  onPress?: () => void | undefined;
  /**
   * @summary Keeps the menu presented after this item is tapped.
   *
   * @description
   * When enabled, selecting this item will not dismiss the menu,
   * allowing the user to continue interacting with other items.
   *
   * @remarks
   * This prop should only be used for items in top-level menus. Requires iOS 16.0 or later.
   *
   * @default false
   *
   * @platform ios
   */
  keepsMenuPresented?: boolean | undefined;
}

/**
 * @summary Represents a menu (or submenu) that groups
 * {@link StackHeaderMenuElementIOS} children.
 *
 * @description
 * A menu is a container that can hold both leaf items
 * ({@link StackHeaderMenuItemIOS}) and nested menus. Set
 * {@link StackHeaderMenuIOS.singleSelection | singleSelection} to `true` to
 * make the menu behave like radio group across its entire hierarchy.
 *
 * Note: The topmost menu that enables this prop becomes Single Selection Root.
 * Only the root receives {@link StackHeaderMenuIOS.onSelectionChange | onSelectionChange}
 * event, with exactly one item id passed to the callback. Only one item may be selected,
 * across the whole hierarchy under Single Selection Root (even when mixing items and nested menus).
 * Previously selected item is deselected automatically.
 * Multiple Single Selection Roots may exist only if their hierarchy is completely separate.
 *
 * @platform ios
 */
export interface StackHeaderMenuIOS {
  /**
   * @summary Unique identifier of the menu.
   *
   * @description
   * Used to locate the menu inside a tree and as the reference when querying or
   * manipulating menu state.
   *
   * @platform ios
   */
  id: string;
  /**
   * @summary Marks this object as a menu definition.
   *
   * @platform ios
   */
  type: 'menu';
  /**
   * @summary Title displayed for the menu.
   *
   * @platform ios
   */
  title?: string | undefined;
  /**
   * @summary Enables single selection mode for this menu and its descendants.
   *
   * @description
   * The topmost menu with `singleSelection` enabled becomes Single Selection Root.
   * At most one toggle item in the entire hierarchy rooted at this
   * menu can be selected at a time.
   *
   * Items with `itemType` set to `automatic` are resolved to `toggle` inside a
   * `singleSelection` hierarchy. `action` items are disallowed.
   *
   * @default false
   * @platform ios
   */
  singleSelection?: boolean | undefined;
  /**
   * @summary Child elements of this menu.
   *
   * @description
   * Each child is either a {@link StackHeaderMenuItemIOS} (leaf) or another
   * {@link StackHeaderMenuIOS}, allowing arbitrarily nested menu trees.
   *
   * @platform ios
   */
  children: StackHeaderMenuElementIOS[];
  /**
   * @summary Callback invoked when the set of selected toggle items changes.
   *
   * @description
   * Receives an array of IDs of all currently selected toggle items in this
   * menu's hierarchy. For Single Selection Root, always returns one item.
   * When defined below Single Selection Root, the callback doesn't fire.
   * In regular non-single-selection case, only changes to direct children are reflected.
   *
   * @platform ios
   */
  onSelectionChange?: (selectedMenuElementIds: string[]) => void;
}

/**
 * @summary A menu element type.
 *
 * @description
 * A menu element is either a {@link StackHeaderMenuIOS | menu} (container with
 * children) or a {@link StackHeaderMenuItemIOS | menu item} (actionable leaf).
 *
 * @platform ios
 */
export type StackHeaderMenuElementIOS =
  | StackHeaderMenuIOS
  | StackHeaderMenuItemIOS;
