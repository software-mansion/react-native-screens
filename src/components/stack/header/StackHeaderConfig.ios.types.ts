import type { ColorValue, TextStyle } from 'react-native';
import type { PlatformIconIOS } from '../../shared/types';
import type {
  StackHeaderElementFactory,
  StackHeaderPressHandler,
} from './StackHeaderConfig.types';
import type { StackHeaderMenuIOS } from './ios/StackHeaderMenu.ios.types';

/**
 * Options for updating a menu action (leaf item) at runtime.
 *
 * @remarks
 * Omitted keys preserve current values. Explicit `undefined` resets to default.
 */
export interface StackHeaderMenuItemOptionsIOS {
  /**
   * New title for the menu action.
   *
   * @platform ios
   */
  title?: string | undefined;
  /**
   * New icon for the menu action.
   *
   * @platform ios
   */
  icon?: PlatformIconIOS | undefined;
  /**
   * Sets the toggle state of the menu item.
   *
   * @remarks
   * When inside a single selection hierarchy, setting `true` deselects the
   * previously selected item and selects this one. Setting `false` is a noop
   * in this case - only has effect for regular toggles.
   *
   * @platform ios
   */
  toggleState?: boolean | undefined;
}

/**
 * Options for updating a submenu at runtime.
 *
 * @remarks
 * Omitted keys preserve current values. Explicit `undefined` resets to default.
 */
export interface StackHeaderMenuOptionsIOS {
  /**
   * New title for the submenu.
   *
   * @platform ios
   */
  title?: string | undefined;
  /**
   * New icon for the submenu.
   *
   * @platform ios
   */
  icon?: PlatformIconIOS | undefined;
}

/**
 * Identifier, title and icon of a header item.
 */
export interface StackHeaderItemBaseIOS {
  /**
   * A unique identifier within the screen header.
   *
   * @platform ios
   */
  id: string;
  /**
   * A title for the item that is displayed in the header.
   *
   * @platform ios
   */
  title?: string | undefined;
  /**
   * Icon displayed for the header item.
   *
   * @remarks
   * Supports SF Symbols, xcassets, and image sources. For async image sources,
   * the item renders without an icon first and updates when loaded. Ignored
   * when custom view ({@link StackHeaderInlineCustomItemIOS.render | render})
   * is set.
   *
   * @platform ios
   */
  icon?: PlatformIconIOS | undefined;
}

/**
 * Menu fields of a header item.
 */
export interface StackHeaderSupportsMenuIOS {
  /**
   * Menu definition for the context menu that appears when item is tapped.
   *
   * @platform ios
   */
  menu?: StackHeaderMenuIOS | undefined;
  /**
   * Menu definition substituting the item when it is displayed in a menu.
   *
   * @remarks
   * When the system moves the item into a menu (e.g. the navigation bar
   * overflow menu), this menu is displayed in its place. Useful for custom
   * items ({@link StackHeaderInlineCustomItemIOS.render | render}), which iOS
   * doesn't display in the overflow menu otherwise. The `id`s used in the menu
   * are expected to be unique across every
   * {@link StackHeaderSupportsMenuIOS.menu | menu} and `menuRepresentation`.
   *
   * @platform ios >= 16
   */
  menuRepresentation?: StackHeaderMenuIOS | undefined;
}

/**
 * Fields of a header item that control its visual appearance inside the bar.
 */
export interface StackHeaderSupportsInlineVisualModificationsIOS {
  /**
   * Whether the liquid glass background for this item should be hidden.
   *
   * @remarks
   * On iOS 26, adjacent bar button items are grouped inside a shared liquid
   * glass background. Setting this to `true` removes the shared background
   * from this item.
   *
   * @defaultValue `false`
   * @platform ios >= 26
   */
  hidesSharedBackground?: boolean | undefined;
  /**
   * Whether the internal padding around the item's content should be removed.
   *
   * @remarks
   * Bar button items reserve internal padding around their content
   * inside the liquid glass background. Setting this to `true` removes that
   * padding, so the item's content spans its full frame.
   *
   * @defaultValue `false`
   * @platform ios >= 27
   */
  paddingRemoved?: boolean | undefined;
}

/**
 * Priority used when the header has to decide which items to keep.
 *
 * @remarks
 * The following values are supported:
 * - `'low'`
 * - `'standard'`
 * - `'high'`
 *
 * @see {@link https://developer.apple.com/documentation/uikit/uibarbuttonitemvisibilitypriority | UIBarButtonItemVisibilityPriority}
 */
export type StackHeaderItemVisibilityPriorityIOS = 'low' | 'standard' | 'high';

/**
 * Field of a header item that sets its visibility priority.
 */
export interface StackHeaderSupportsVisibilityPriorityIOS {
  /**
   * Decides which items give way first when the header runs out of room.
   *
   * @remarks
   * When the items do not fit, the header moves the ones with the lowest
   * priority into the overflow ("...") menu, and keeps the higher ones.
   *
   * When the item is placed in an implicit group of items, the group
   * inherits this priority.
   *
   * A custom item ({@link StackHeaderInlineCustomItemIOS.render | render})
   * moved into the overflow menu has no content to show there.
   *
   * @defaultValue `'standard'`
   * @platform ios >= 27
   */
  visibilityPriority?: StackHeaderItemVisibilityPriorityIOS | undefined;
}

/**
 * Field of a header item that identifies it across screens for transition
 * animations.
 */
export interface StackHeaderSupportsIdentifierIOS {
  /**
   * Stable identifier used to match the item across different screens
   * for more intelligent animation on transition.
   *
   * @remarks
   * When navigating between screens, iOS tries to match similarly looking items
   * (i.e. same sfSymbol) and animate between them. If the heuristic fails, a
   * simpler crossfade is applied. In a situation where visually different items
   * should be logically considered the same across screens, you may use this
   * prop to tell this fact to the system. The identifier shouldn't be updated
   * at runtime; doing so will result in item rebuild and visual flash.
   *
   * @platform ios >= 26
   */
  identifier?: string | undefined;
}

/**
 * Visual variant (style) of a header item.
 *
 * @remarks
 * The following values are supported:
 * - `'plain'` — the default look of a bar button item.
 * - `'prominent'` — the item is emphasized with a tinted background.
 *   On iOS below 26 it falls back to bold text (the `done` style).
 */
export type StackHeaderItemVariantIOS = 'plain' | 'prominent';

/**
 * Native header item with a title or an icon.
 */
export interface StackHeaderInlineItemIOS
  extends StackHeaderItemBaseIOS,
    StackHeaderSupportsMenuIOS,
    StackHeaderSupportsIdentifierIOS,
    StackHeaderSupportsInlineVisualModificationsIOS,
    StackHeaderSupportsVisibilityPriorityIOS {
  /**
   * Marks this object as a header item definition.
   *
   * @platform ios
   */
  type: 'item';
  /**
   * Visual variant (style) of the item.
   *
   * @defaultValue `'plain'`
   * @platform ios
   */
  variant?: StackHeaderItemVariantIOS | undefined;
  /**
   * Tint color of the item.
   *
   * @remarks
   * Applied to the item's title and icon. For `'prominent'` items on iOS 26,
   * the tint affects the emphasized background instead.
   *
   * When unset, the item uses the default system tint.
   *
   * @platform ios
   */
  tintColor?: ColorValue | undefined;
  /**
   * Whether the item is disabled.
   *
   * @remarks
   * A disabled item is grayed out and does not respond to user interaction:
   * neither {@link StackHeaderInlineItemIOS.onPress | onPress} nor
   * {@link StackHeaderSupportsMenuIOS.menu | menu} is triggered.
   *
   * @defaultValue `false`
   * @platform ios
   */
  disabled?: boolean | undefined;
  /**
   * Callback invoked when the header item is pressed.
   *
   * @remarks
   * Fires when the user taps the header item. When combined with
   * {@link StackHeaderSupportsMenuIOS.menu | menu}, tapping fires `onPress` and
   * long-pressing shows the menu.
   *
   * @platform ios
   */
  onPress?: StackHeaderPressHandler | undefined;
}

/**
 * Header item with custom view.
 */
export interface StackHeaderInlineCustomItemIOS
  extends StackHeaderSupportsMenuIOS,
    StackHeaderSupportsIdentifierIOS,
    StackHeaderSupportsInlineVisualModificationsIOS,
    StackHeaderSupportsVisibilityPriorityIOS {
  /**
   * A unique identifier within the screen header.
   *
   * @platform ios
   */
  id: string;
  /**
   * Marks this object as a header item definition.
   *
   * @platform ios
   */
  type: 'item';
  /**
   * A function that renders the custom view.
   *
   * @remarks
   * The subview is sized by React Native's layout engine but positioned by the
   * platform native layout. Each item's size is calculated independently and
   * will not respect flex layout. Use static width and height for best results.
   *
   * @platform ios
   */
  render: StackHeaderElementFactory;
}

/**
 * A fixed-width spacer item for visual separation of items.
 *
 * @remarks
 * Separates items defined in
 * {@link StackHeaderConfigPropsIOS.leadingItems | leadingItems} and
 * {@link StackHeaderConfigPropsIOS.trailingItems | trailingItems}. The fixed
 * size spacing works for iOS 18 and below, for iOS 26 it only splits liquid
 * glass bubble for two adjacent items.
 */
export interface StackHeaderFixedSpacerItemIOS {
  /**
   * A unique identifier within the screen header.
   *
   * @platform ios
   */
  id: string;
  /**
   * Marks this object as a spacer definition.
   *
   * @platform ios
   */
  type: 'spacer';
  /**
   * Marks this object as a fixed-size spacer definition.
   *
   * @platform ios
   */
  sizing: 'fixed';
  /**
   * Specifies space width between adjacent header items.
   *
   * @platform ios
   */
  width: number;
}

/**
 * A flexible spacer item for visual separation of items.
 *
 * @remarks
 * Separates items defined in
 * {@link StackHeaderConfigPropsIOS.leadingItems | leadingItems} and
 * {@link StackHeaderConfigPropsIOS.trailingItems | trailingItems}. For iOS 26
 * it splits liquid glass bubble for two adjacent items.
 */
export interface StackHeaderFlexibleSpacerItemIOS {
  /**
   * A unique identifier within the screen header.
   *
   * @platform ios
   */
  id: string;
  /**
   * Marks this object as a spacer definition.
   *
   * @platform ios
   */
  type: 'spacer';
  /**
   * Marks this object as a flexible-size spacer definition.
   *
   * @platform ios
   */
  sizing: 'flexible';
}

/**
 * A header spacer item type.
 */
export type StackHeaderSpacerItemIOS =
  | StackHeaderFixedSpacerItemIOS
  | StackHeaderFlexibleSpacerItemIOS;

/**
 * Item that can be placed in
 * {@link StackHeaderConfigPropsIOS.leadingItems | leadingItems} and
 * {@link StackHeaderConfigPropsIOS.trailingItems | trailingItems}.
 */
export type StackHeaderItemIOS =
  | StackHeaderInlineItemIOS
  | StackHeaderInlineCustomItemIOS
  | StackHeaderSpacerItemIOS;

/**
 * Custom item rendered in place of the title, subtitle or large subtitle text.
 */
export interface StackHeaderTitleCustomItemIOS {
  /**
   * A unique identifier within the screen header.
   *
   * @platform ios
   */
  id: string;
  /**
   * A function that renders the custom view.
   *
   * @remarks
   * The subview is sized by React Native's layout engine but positioned by the
   * platform native layout. Each item's size is calculated independently and
   * will not respect flex layout. Use static width and height for best results.
   *
   * @note
   * Due to layout process limitations, text view will not resize and ellipsize
   * to fit available space without manually setting desired view width. For
   * text-only elements that should ellipsize it is recommended to use regular
   * {@link StackHeaderConfigPropsBase.title | title} instead.
   *
   * @platform ios
   */
  render: StackHeaderElementFactory;
}

/**
 * Controls how the back button title is displayed.
 *
 * @remarks
 * The following values are supported:
 * - `'default'` — the system chooses the title depending on available space. On
 *   `iOS < 26` options include: custom title (defaults to previous screen
 *   title), generic "Back", no title; on `iOS >= 26` it's either custom title
 *   (if set) or no title.
 * - `'generic'` — on `iOS < 26`, the system uses a generic "Back" title or no
 *   title; on `iOS >= 26` it's the same as `'minimal'`.
 * - `'minimal'` — no title is displayed next to the back button chevron.
 */
export type StackHeaderBackButtonDisplayModeIOS =
  | 'default'
  | 'generic'
  | 'minimal';

/**
 * Controls when the navigation bar minimizes in response to scrolling.
 *
 * @remarks
 * The following values are supported:
 * - `'automatic'` — the system determines the minimization behavior.
 * - `'never'` — the navigation bar does not minimize.
 * - `'onScrollDown'` — the navigation bar minimizes when the user scrolls down.
 * - `'onScrollUp'` — the navigation bar minimizes when the user scrolls up.
 */
export type StackHeaderMinimizationBehaviorIOS =
  | 'automatic'
  | 'never'
  | 'onScrollDown'
  | 'onScrollUp';

/**
 * Controls when a minimized navigation bar restores.
 *
 * @remarks
 * The following values are supported:
 * - `'automatic'` — the system determines the restoration behavior. By default
 *   the navigation bar restores when the user reverses scroll direction.
 * - `'atScrollEdge'` — the navigation bar restores only when the scroll view's
 *   content reaches the scroll edge. Honored only together with
 *   `minimizationBehavior: 'onScrollDown'`.
 */
export type StackHeaderRestorationBehaviorIOS = 'automatic' | 'atScrollEdge';

/**
 * Controls whether the safe area adjusts while the navigation bar
 * minimizes.
 *
 * @remarks
 * The following values are supported:
 * - `'automatic'` — the system determines the safe area adjustment.
 * - `'enabled'` — the safe area adjusts as the navigation bar minimizes,
 *   allowing content to reflow.
 * - `'disabled'` — the safe area remains unchanged as the navigation bar
 *   minimizes.
 */
export type StackHeaderSafeAreaAdjustmentIOS =
  | 'automatic'
  | 'enabled'
  | 'disabled';

/**
 * Text attributes of header items in a single control state.
 */
export interface StackHeaderButtonStateAppearanceIOS {
  /**
   * Specifies the font family used for the item's text.
   *
   * @platform ios
   */
  fontFamily?: TextStyle['fontFamily'] | undefined;
  /**
   * Specifies the font size used for the item's text.
   *
   * @remarks
   * This prop also scales SF Symbol icons of the items.
   *
   * @platform ios
   */
  fontSize?: TextStyle['fontSize'] | undefined;
  /**
   * Specifies the font weight used for the item's text.
   *
   * @platform ios
   */
  fontWeight?: TextStyle['fontWeight'] | undefined;
  /**
   * Specifies the font style used for the item's text.
   *
   * @platform ios
   */
  fontStyle?: TextStyle['fontStyle'] | undefined;
  /**
   * Specifies the font color used for the item's text.
   *
   * @platform ios
   */
  fontColor?: TextStyle['color'] | undefined;
}

/**
 * Per-state appearance of header items of a single variant.
 *
 * @remarks
 * For each state left unset, UIKit derives the appearance from
 * the `normal` state. Explicitly set per-state attributes merge into the
 * state's defaults, so e.g. a font-only state keeps the system text color
 * for that state.
 */
export interface StackHeaderButtonAppearanceIOS {
  /**
   * Text attributes of the item in the normal state.
   *
   * @platform ios
   */
  normal?: StackHeaderButtonStateAppearanceIOS | undefined;
  /**
   * Text attributes of the item in the highlighted (pressed) state.
   *
   * @platform ios
   */
  highlighted?: StackHeaderButtonStateAppearanceIOS | undefined;
  /**
   * Text attributes of the item in the disabled state.
   *
   * @platform ios
   */
  disabled?: StackHeaderButtonStateAppearanceIOS | undefined;
  /**
   * Text attributes of the item in the focused state.
   *
   * @platform ios
   */
  focused?: StackHeaderButtonStateAppearanceIOS | undefined;
}

/**
 * Fonts and colors of the header text and the header items.
 */
export interface StackHeaderAppearanceIOS {
  /**
   * Specifies the font family used for the title of the header.
   *
   * @platform ios
   */
  titleFontFamily?: TextStyle['fontFamily'] | undefined;
  /**
   * Specifies the font size used for the title of the header.
   *
   * @platform ios
   */
  titleFontSize?: TextStyle['fontSize'] | undefined;
  /**
   * Specifies the font weight used for the title of the header.
   *
   * @platform ios
   */
  titleFontWeight?: TextStyle['fontWeight'] | undefined;
  /**
   * Specifies the font style used for the title of the header.
   *
   * @platform ios
   */
  titleFontStyle?: TextStyle['fontStyle'] | undefined;
  /**
   * Specifies the font color used for the title of the header.
   *
   * @platform ios
   */
  titleFontColor?: TextStyle['color'] | undefined;
  /**
   * Specifies the font family used for the large title of the header.
   *
   * @platform ios
   */
  largeTitleFontFamily?: TextStyle['fontFamily'] | undefined;
  /**
   * Specifies the font size used for the large title of the header.
   *
   * @platform ios
   */
  largeTitleFontSize?: TextStyle['fontSize'] | undefined;
  /**
   * Specifies the font weight used for the large title of the header.
   *
   * @platform ios
   */
  largeTitleFontWeight?: TextStyle['fontWeight'] | undefined;
  /**
   * Specifies the font style used for the large title of the header.
   *
   * @platform ios
   */
  largeTitleFontStyle?: TextStyle['fontStyle'] | undefined;
  /**
   * Specifies the font color used for the large title of the header.
   *
   * @platform ios
   */
  largeTitleFontColor?: TextStyle['color'] | undefined;
  /**
   * Specifies the font family used for the subtitle of the header.
   *
   * @remarks
   * Applies to both the regular and the large subtitle.
   *
   * @platform ios >= 26
   */
  subtitleFontFamily?: TextStyle['fontFamily'] | undefined;
  /**
   * Specifies the font size used for the subtitle of the header.
   *
   * @remarks
   * Applies to both the regular and the large subtitle.
   *
   * @platform ios >= 26
   */
  subtitleFontSize?: TextStyle['fontSize'] | undefined;
  /**
   * Specifies the font weight used for the subtitle of the header.
   *
   * @remarks
   * Applies to both the regular and the large subtitle.
   *
   * @platform ios >= 26
   */
  subtitleFontWeight?: TextStyle['fontWeight'] | undefined;
  /**
   * Specifies the font style used for the subtitle of the header.
   *
   * @remarks
   * Applies to both the regular and the large subtitle.
   *
   * @platform ios >= 26
   */
  subtitleFontStyle?: TextStyle['fontStyle'] | undefined;
  /**
   * Specifies the font color used for the subtitle of the header.
   *
   * @remarks
   * Applies to both the regular and the large subtitle.
   *
   * @platform ios >= 26
   */
  subtitleFontColor?: TextStyle['color'] | undefined;
  /**
   * Appearance of plain header items.
   *
   * @remarks
   * Applies to the text of header items with the `'plain'` variant.
   * Also applies to the back button title; the
   * {@link StackHeaderAppearanceIOS.backButton | backButton} attributes
   * override it per attribute. Attributes can be customized per control
   * state: `normal`, `highlighted`, `disabled` and `focused`.
   *
   * @platform ios
   */
  button?: StackHeaderButtonAppearanceIOS | undefined;
  /**
   * Appearance of prominent header items.
   *
   * @remarks
   * Applies to the text of header items with the `'prominent'`
   * variant (on iOS below 26 these fall back to the `done` style, which this
   * prop styles as well). Attributes can be customized per control state:
   * `normal`, `highlighted`, `disabled` and `focused`.
   *
   * @platform ios
   */
  prominentButton?: StackHeaderButtonAppearanceIOS | undefined;
  /**
   * Appearance of the back button title.
   *
   * @remarks
   * Overrides the {@link StackHeaderAppearanceIOS.button | button} attributes
   * for the back button title, attribute by attribute — the unset attributes
   * keep following the `button` appearance. Attributes can be customized per
   * control state: `normal`, `highlighted`, `disabled` and `focused`.
   *
   * @platform ios
   */
  backButton?: StackHeaderButtonAppearanceIOS | undefined;
}

/**
 * iOS-specific props for {@link Stack.HeaderConfig}.
 */
export interface StackHeaderConfigPropsIOS {
  /**
   * Title displayed next to the back button on this screen.
   *
   * @remarks
   * Configured on the screen whose back button it applies to (the screen that
   * is pushed on top). When unset, the system derives the back title from the
   * previous screen's {@link StackHeaderConfigPropsBase.title | title}.
   *
   * @platform ios
   */
  backButtonTitle?: string | undefined;
  /**
   * Controls how the back button title is displayed.
   *
   * @defaultValue `'default'`
   * @platform ios
   */
  backButtonDisplayMode?: StackHeaderBackButtonDisplayModeIOS | undefined;
  /**
   * Whether the back button shows the navigation history menu.
   *
   * @remarks
   * Configured on the screen whose back button it applies to (the screen that
   * is pushed on top). When `false`, the navigation history menu is not shown
   * on either of the gestures that normally open it: long-pressing the back
   * button and secondary-clicking it (trackpad / mouse right click); tapping
   * it still pops the screen.
   *
   * @defaultValue `true`
   * @platform ios
   */
  backButtonMenuEnabled?: boolean | undefined;
  /**
   * Custom item to display as a subtitle.
   *
   * @remarks
   * Takes precedence over subtitle text.
   *
   * @platform ios >= 26
   */
  subtitleItem?: StackHeaderTitleCustomItemIOS | undefined;
  /**
   * A list of items placed starting from the leading edge.
   *
   * @remarks
   * Items are placed next to the back button, if present. If there is not
   * enough space to fit all leading items at once, they are all moved to the
   * overflow menu. This differs from trailing items, which are moved one by
   * one.
   *
   * @note
   * Custom items are not put into the overflow menu, but are removed entirely.
   *
   * @platform ios
   */
  leadingItems?: StackHeaderItemIOS[] | undefined;
  /**
   * Custom item to display as a title.
   *
   * @remarks
   * Takes precedence over title text.
   *
   * @platform ios
   */
  titleItem?: StackHeaderTitleCustomItemIOS | undefined;
  /**
   * Menu definition for the title context menu.
   *
   * @remarks
   * Configures a dropdown menu attached to the navigation bar title area.
   * Works independently of
   * {@link StackHeaderConfigPropsIOS.titleItem | titleItem}; the menu appears
   * for both plain text and custom view title.
   *
   * @platform ios >= 16
   */
  titleMenu?: StackHeaderMenuIOS | undefined;
  /**
   * A list of items placed starting from the trailing edge.
   *
   * @remarks
   * If there is not enough space to fit some items, they are moved to the
   * overflow menu, one by one.
   *
   * @note
   * Custom items are not put into the overflow menu, but are removed entirely.
   *
   * @platform ios
   */
  trailingItems?: StackHeaderItemIOS[] | undefined;
  /**
   * Large title text, displayed when `largeTitleEnabled = true`.
   *
   * @remarks
   * When ScrollView is present on the screen, large header is displayed only
   * when fully scrolled to top, otherwise it collapses to regular header. If
   * `largeTitle` is not defined, it falls back to regular title.
   *
   * @platform ios >= 26
   */
  largeTitle?: string | undefined;
  /**
   * Specifies if the header should display the large title. It collapses to a
   * regular header when scrolling.
   *
   * @defaultValue `false`
   * @platform ios
   */
  largeTitleEnabled?: boolean | undefined;
  /**
   * Large subtitle text, displayed when `largeTitleEnabled = true`.
   *
   * @remarks
   * When ScrollView is present on the screen, large header is displayed only
   * when fully scrolled to top, otherwise it collapses to regular header. If
   * `largeSubtitle` is not defined, it falls back to regular subtitle.
   *
   * @platform ios >= 26
   */
  largeSubtitle?: string | undefined;
  /**
   * Custom item to display as a subtitle for large header.
   *
   * @remarks
   * Takes precedence over
   * {@link StackHeaderConfigPropsIOS.largeSubtitle | largeSubtitle} text.
   *
   * @platform ios >= 26
   */
  largeSubtitleItem?: StackHeaderTitleCustomItemIOS | undefined;
  /**
   * A single line of text displayed at the top of the navigation bar,
   * above the title.
   *
   * @remarks
   * Setting this prop increases the height of the navigation bar.
   *
   * @platform ios
   */
  prompt?: string | undefined;
  /**
   * Controls when the navigation bar minimizes in response to scrolling.
   *
   * @remarks
   * When the navigation bar minimizes, an integrated top tab bar minimizes as
   * well.
   *
   * @defaultValue `'automatic'`
   * @platform ios >= 27
   */
  minimizationBehavior?: StackHeaderMinimizationBehaviorIOS | undefined;
  /**
   * Controls when a minimized navigation bar restores.
   *
   * @remarks
   * Currently honored only together with
   * `minimizationBehavior: 'onScrollDown'`. With other minimization behaviors,
   * the system falls back to `'automatic'`.
   *
   * @defaultValue `'automatic'`
   * @platform ios >= 27
   */
  restorationBehavior?: StackHeaderRestorationBehaviorIOS | undefined;
  /**
   * Controls whether the safe area adjusts while the navigation bar
   * minimizes.
   *
   * @defaultValue `'automatic'`
   * @platform ios >= 27
   */
  safeAreaAdjustment?: StackHeaderSafeAreaAdjustmentIOS | undefined;
  /**
   * Appearance of the header when the edge of scrollable content
   * is not aligned with the edge of the header.
   *
   * @info
   * Native platform limitation: on iOS 26, header items resolve the `button` /
   * `prominentButton` attributes once, from whichever appearance is in effect
   * at the moment the items are attached to the navigation bar, and do not
   * update on property changes or scroll edge transitions.
   *
   * @platform ios
   */
  standardAppearance?: StackHeaderAppearanceIOS | undefined;
  /**
   * Appearance of the header when the edge of scrollable content
   * is aligned with the edge of the header.
   *
   * @remarks
   * If unset, derives the configuration from
   * {@link StackHeaderConfigPropsIOS.standardAppearance | standardAppearance},
   * otherwise becomes a standalone definition. In both cases it keeps
   * transparent background by default (`iOS < 18`).
   *
   * @info
   * Native platform limitation: on iOS 26, header items resolve the `button` /
   * `prominentButton` attributes once, from whichever appearance is in effect
   * at the moment the items are attached to the navigation bar, and do not
   * update on property changes or scroll edge transitions.
   *
   * @platform ios
   */
  scrollEdgeAppearance?: StackHeaderAppearanceIOS | undefined;
}

/**
 * iOS-specific commands of {@link Stack.HeaderConfig}, available through the
 * {@link StackHeaderConfigRef.ios | ios} key of {@link StackHeaderConfigRef}.
 */
export interface StackHeaderConfigCommandsIOS {
  /**
   * Updates properties of a menu action (leaf item) at runtime.
   *
   * @param menuElementId - The ID of the menu action to update.
   * @param options - Object with properties to change. Omitted keys preserve
   *   current values. Explicit `undefined` resets to default.
   * @platform ios
   */
  setMenuItemOptions: (
    menuElementId: string,
    options: StackHeaderMenuItemOptionsIOS,
  ) => void;
  /**
   * Updates properties of a submenu at runtime.
   *
   * @param menuElementId - The ID of the submenu to update.
   * @param options - Object with properties to change. Omitted keys preserve
   *   current values. Explicit `undefined` resets to default.
   * @platform ios
   */
  setMenuOptions: (
    menuElementId: string,
    options: StackHeaderMenuOptionsIOS,
  ) => void;
}
