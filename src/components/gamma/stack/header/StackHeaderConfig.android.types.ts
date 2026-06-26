import type { ReactElement } from 'react';
import type { ColorValue } from 'react-native';
import type { StackHeaderSubviewCollapseModeAndroid } from './android/StackHeaderSubview.android.types';
import type { PlatformIconAndroid } from '../../../../types';

export type StackHeaderTypeAndroid = 'small' | 'medium' | 'large';

export type StackHeaderBackgroundSubviewCollapseModeAndroid =
  StackHeaderSubviewCollapseModeAndroid;

export interface StackHeaderToolbarSubviewAndroid {
  /**
   * @summary Render callback for the React element placed in this toolbar slot.
   *
   * @description
   * The subview is sized by React Native's layout engine but positioned by the
   * platform native layout. Each subview is placed independently — subviews do
   * not participate in a shared flex layout and cannot influence each other's
   * sizing.
   *
   * @remarks
   * Intrinsic sizing and explicit dimensions work as expected. Avoid
   * parent-relative sizing (e.g. `flex: 1`) on the root element — it will
   * produce incorrect dimensions. Flex layout within a root that has a known
   * size works as expected.
   *
   * @platform android
   */
  render: () => ReactElement;
}

export interface StackHeaderBackgroundSubviewAndroid {
  /**
   * @summary Controls how the background subview behaves when the app bar
   * collapses.
   *
   * @description
   * The following values are available:
   * - `off` - the subview scrolls away with the app bar,
   * - `parallax` - the subview scrolls at a slower rate, creating a parallax
   *   effect.
   *
   * @remarks
   * `pin` is not currently supported because the background subview is
   * stretched to match the entire `AppBarLayout`, which causes pinned content
   * to move immediately rather than staying fixed. Support for `pin` collapse
   * mode might be added in the future.
   *
   * @default off
   *
   * @platform android
   */
  collapseMode?: StackHeaderSubviewCollapseModeAndroid | undefined;
  /**
   * @summary Render callback for the React element used as the header
   * background.
   *
   * @remarks
   * The subview is stretched to match the header (`AppBarLayout`) dimensions,
   * so parent-relative sizing (e.g. `flex: 1`) works correctly.
   *
   * @platform android
   */
  render: () => ReactElement;
}

export type StackHeaderToolbarMenuItemShowAsActionAndroid =
  | 'always'
  | 'alwaysWithText'
  | 'ifRoom'
  | 'ifRoomWithText'
  | 'never';

export interface StackHeaderToolbarMenuItemBaseAndroid {
  /**
   * @summary Unique identifier of the menu element.
   *
   * @platform android
   */
  id: string;
  /**
   * @summary Title of the menu element.
   *
   * @platform android
   */
  title?: string | undefined;
  /**
   * @summary Specifies if the menu element should be hidden.
   *
   * @default false
   * @platform android
   */
  hidden?: boolean | undefined;
  /**
   * @summary Specifies whether the element should be displayed as a button in
   * the Toolbar.
   *
   * @description
   * The following values are available:
   * - `always` - always displays the element as a button in the Toolbar,
   * - `alwaysWithText` - always displays the element as a button in the
   *   Toolbar, forcing the text label to be visible even if an icon is
   *   provided,
   * - `ifRoom` - displays the element as a button in the Toolbar only if the
   *   system determines there is sufficient space,
   * - `ifRoomWithText` - displays the element as a button in the Toolbar if
   *   the system determines there is sufficient space, forcing the text label
   *   to be visible even if an icon is provided,
   * - `never` - never displays the element as a button in the Toolbar; it
   *   will be placed in the overflow menu instead.
   *
   * @remarks
   * Due to native limitations, the width limit for the `ifRoom` options is
   * determined during the initial render and will not adapt to subsequent
   * layout or orientation changes.
   *
   * @default never
   * @platform android
   */
  showAsAction?: StackHeaderToolbarMenuItemShowAsActionAndroid | undefined;
  /**
   * @summary Specifies the icon for the menu element.
   *
   * @description
   * Supported values:
   * - `{ type: 'imageSource', imageSource }`
   *   Uses an image from the provided resource.
   *
   *   Remarks: `imageSource` type doesn't support SVGs on Android.
   *   For loading SVGs use `drawableResource` type.
   *
   * - `{ type: 'drawableResource', name }`
   *   Uses a drawable resource with the given name.
   *
   *   Remarks: Requires passing a drawable to resources via Android Studio.
   *
   * @remarks
   * The icon will be visible only if the menu element is shown in the
   * Toolbar.
   *
   * @platform android
   */
  icon?: PlatformIconAndroid | undefined;
  /**
   * @summary Specifies the tint color to apply to the menu element icon.
   *
   * @platform android
   */
  iconTintColorNormal?: ColorValue | undefined;
  /**
   * @summary Specifies the tint color to apply to the menu element icon when
   * it is pressed.
   *
   * @remarks
   * Due to native platform limitations, if you set this prop, you must also
   * provide `iconTintColorNormal`. Otherwise, the icon will become
   * transparent.
   *
   * @platform android
   */
  iconTintColorPressed?: ColorValue | undefined;
  /**
   * @summary Specifies the tint color to apply to the menu element icon when
   * it is focused (e.g. by keyboard navigation).
   *
   * @remarks
   * Due to native platform limitations, if you set this prop, you must also
   * provide `iconTintColorNormal`. Otherwise, the icon will become
   * transparent.
   *
   * @platform android
   */
  iconTintColorFocused?: ColorValue | undefined;
  /**
   * @summary Specifies the tint color to apply to the menu element icon when
   * it is disabled.
   *
   * @remarks
   * Disabling menu elements isn't currently supported.
   *
   * Due to native platform limitations, if you set this prop, you must also
   * provide `iconTintColorNormal`. Otherwise, the icon will become
   * transparent.
   *
   * @platform android
   */
  iconTintColorDisabled?: ColorValue | undefined;
}

export interface StackHeaderToolbarMenuItemAndroid
  extends StackHeaderToolbarMenuItemBaseAndroid {
  /**
   * @summary Marks this object as a menu item.
   *
   * @platform android
   */
  type: 'menuItem';
  /**
   * @summary Callback invoked when the menu item is clicked.
   *
   * @platform android
   */
  onPress?: (() => void) | undefined;
}

export interface StackHeaderToolbarMenuBaseAndroid {
  /**
   * @summary Menu elements displayed in the toolbar menu.
   *
   * @platform android
   */
  children?: StackHeaderToolbarMenuElementAndroid[];
}

export interface StackHeaderToolbarMenuAndroid
  extends StackHeaderToolbarMenuItemBaseAndroid,
    StackHeaderToolbarMenuBaseAndroid {
  /**
   * @summary Marks this object as a submenu.
   *
   * @platform android
   */
  type: 'menu';
}

export type StackHeaderToolbarMenuElementAndroid =
  | StackHeaderToolbarMenuItemAndroid
  | StackHeaderToolbarMenuAndroid;

export type StackHeaderToolbarMenuItemOptionsAndroid = Partial<
  Omit<StackHeaderToolbarMenuItemBaseAndroid, 'id'>
>;

export interface StackHeaderConfigCommandsAndroid {
  /**
   * @summary Allows to change menu item configuration in runtime.
   *
   * @param id The ID of the menu item which will be updated.
   * @param options Object with properties that should be changed. If property
   *        is omitted, the current value will be preserved. If property is
   *        explicitly set to `undefined`, the default value of the prop will be
   *        restored.
   */
  setToolbarMenuItemOptions: (
    id: string,
    options: StackHeaderToolbarMenuItemOptionsAndroid,
  ) => void;
}

export interface StackHeaderConfigPropsAndroid {
  /**
   * @summary Specifies the type of the Material 3 app bar.
   *
   * @description
   * The following values are available:
   * - `small` - small app bar with fixed title,
   * - `medium` - medium app bar with collapsing title,
   * - `large` - large app bar with collapsing title.
   *
   * @remarks
   * M3 Expressive headers aren't currently supported (there is no stable
   * `MDC-Android` version yet).
   *
   * @see {@link https://m3.material.io/components/app-bars/overview|Material Design 3: App bars}
   *
   * @default small
   *
   * @platform android
   */
  type?: StackHeaderTypeAndroid | undefined;
  /**
   * @summary Custom view rendered behind the header content.
   *
   * @platform android
   */
  backgroundSubview?: StackHeaderBackgroundSubviewAndroid | undefined;
  /**
   * @summary Custom view placed in the leading (start) slot of the toolbar.
   *
   * @platform android
   */
  leadingSubview?: StackHeaderToolbarSubviewAndroid | undefined;
  /**
   * @summary Custom view placed in the center slot of the toolbar.
   *
   * @platform android
   */
  centerSubview?: StackHeaderToolbarSubviewAndroid | undefined;
  /**
   * @summary Custom view placed in the trailing (end) slot of the toolbar.
   *
   * @platform android
   */
  trailingSubview?: StackHeaderToolbarSubviewAndroid | undefined;
  /**
   * @summary Tint color applied to the back button icon in its normal state.
   *
   * @description
   * When `undefined`, the default tint color is used. This applies to the
   * native back arrow and `drawableResource` icons that have an associated
   * tint. For `imageSource` icons, no tint is applied by default.
   *
   * @platform android
   */
  backButtonTintColorNormal?: ColorValue | undefined;
  /**
   * @summary Tint color applied to the back button icon when it is pressed.
   *
   * @remarks
   * Due to native platform limitations, if you set this prop, you must also
   * provide `backButtonTintColorNormal`. Otherwise, the icon will become
   * transparent.
   *
   * @platform android
   */
  backButtonTintColorPressed?: ColorValue | undefined;
  /**
   * @summary Tint color applied to the back button icon when it is focused
   * (e.g. by keyboard navigation).
   *
   * @remarks
   * Due to native platform limitations, if you set this prop, you must also
   * provide `backButtonTintColorNormal`. Otherwise, the icon will become
   * transparent.
   *
   * @platform android
   */
  backButtonTintColorFocused?: ColorValue | undefined;
  /**
   * @summary Custom icon for the back button.
   *
   * @description
   * When `undefined`, the native back arrow (`homeAsUpIndicator`) is used.
   *
   * Supported values:
   * - `{ type: 'imageSource', imageSource }`
   *   Uses an image from the provided resource.
   *
   *   Remarks: `imageSource` type doesn't support SVGs on Android.
   *   For loading SVGs use `drawableResource` type.
   *
   * - `{ type: 'drawableResource', name }`
   *   Uses a drawable resource with the given name.
   *
   *   Remarks: Requires passing a drawable to resources via Android Studio.
   *
   * @platform android
   */
  backButtonIcon?: PlatformIconAndroid | undefined;
  /**
   * @summary Whether the header reacts to nested scroll. Required for any
   * other `scrollFlag*` prop to take effect.
   *
   * @description
   * When `undefined`, falls back to the type-specific default:
   * - `small` -> `false`
   * - `medium` / `large` -> `true`
   *
   * @remarks
   * Changing any `scrollFlag*` at runtime forces the header back to
   * its fully expanded state, which produces a visible snap. Treat these
   * props as a static configuration.
   *
   * @platform android
   */
  scrollFlagScroll?: boolean | undefined;
  /**
   * @summary When enabled, the header re-expands as soon as the user scrolls
   * back toward the top of the content, regardless of the ScrollView's current
   * scroll position. Without this flag, the header only begins expanding once
   * the list has reached the top of its content. Requires `scrollFlagScroll`.
   *
   * @description
   * When `undefined`, falls back to the type-specific default (`false` for
   * all types).
   *
   * @platform android
   */
  scrollFlagEnterAlways?: boolean | undefined;
  /**
   * @summary Modifies `scrollFlagEnterAlways` so that the initial re-entry
   * stops at the header's collapsed height (the toolbar); the remainder
   * expands only after the ScrollView reaches the top of its content. Requires
   * `scrollFlagEnterAlways`.
   *
   * @description
   * When `undefined`, falls back to the type-specific default (`false` for
   * all types).
   *
   * @remarks
   * This flag does not have any effect for `small` header.
   *
   * @platform android
   */
  scrollFlagEnterAlwaysCollapsed?: boolean | undefined;
  /**
   * @summary When enabled, the header collapses only until its minimum height
   * (the toolbar) remains pinned at the top. Without this flag, the entire
   * header scrolls off the screen. Requires `scrollFlagScroll`.
   *
   * @description
   * When `undefined`, falls back to the type-specific default:
   * - `small` -> `false`
   * - `medium` / `large` -> `true`
   *
   * @remarks
   * Setting this flag for `small` header is equivalent to disabling
   * `scrollFlagScroll`.
   *
   * Even when this flag is disabled, a strip with the height of the system top
   * inset (status bar and display cutout) remains visible at the top.
   *
   * @platform android
   */
  scrollFlagExitUntilCollapsed?: boolean | undefined;
  /**
   * @summary When enabled, the header snaps to its nearest edge (fully
   * expanded, or fully collapsed as defined by `scrollFlagExitUntilCollapsed`)
   * after a scroll gesture ends, instead of resting partway. Requires
   * `scrollFlagScroll`.
   *
   * @description
   * When `undefined`, falls back to the type-specific default:
   * - `small` -> `false`
   * - `medium` / `large` -> `true`
   *
   * @platform android
   */
  scrollFlagSnap?: boolean | undefined;
  /**
   * @summary Toolbar menu configuration.
   *
   * @description
   * This prop serves as initial configuration of the toolbar menu. If you
   * want to change some property in runtime, use `setToolbarMenuItemOptions`
   * view command.
   *
   * Changing this prop in runtime will result in full toolbar menu rebuild.
   * Any prior changes applied via `setToolbarMenuItemOptions` will be lost.
   *
   * @platform android
   */
  toolbarMenu?: StackHeaderToolbarMenuBaseAndroid | undefined;
}
