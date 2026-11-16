import type {
  PlatformIconAndroidDrawableResource,
  PlatformIconIOSSfSymbol,
  PlatformIconShared,
} from '../../shared/types';

/**
 * How the tab bar renders an `'imageSource'` icon on iOS. The names follow
 * `UIImage.RenderingMode`.
 *
 * @remarks
 * - `'default'` — the system behavior (UIKit's automatic mode), also used
 *   when {@link TabsScreenIconImageSourceIOS.renderingMode | renderingMode} is
 *   unset: the tab bar decides how to draw the image.
 * - `'template'` — the image is used as a template image: its shape is drawn
 *   in the state-dependent item icon color
 *   ({@link TabsScreenItemStateAppearanceIOS.tabBarItemIconColor | tabBarItemIconColor},
 *   {@link TabsHostPropsIOS.tabBarTintColor | tabBarTintColor}).
 * - `'original'` — the image keeps its own colors and ignores the item icon
 *   color.
 */
export type TabsScreenIconImageRenderingModeIOS =
  | 'default'
  | 'template'
  | 'original';

/**
 * How the tab bar renders an `'sfSymbol'` icon on iOS. The names follow the
 * SF Symbols rendering modes.
 *
 * @remarks
 * - `'default'` — the system behavior (UIKit's automatic mode), also used
 *   when {@link TabsScreenIconSfSymbolIOS.renderingMode | renderingMode} is
 *   unset: system symbols are rendered in a single color, the state-dependent
 *   item icon color; for custom symbols the rendering mode set in the asset
 *   catalog may change it.
 * - `'monochrome'` — the symbol is rendered in a single color: the
 *   state-dependent item icon color
 *   ({@link TabsScreenItemStateAppearanceIOS.tabBarItemIconColor | tabBarItemIconColor},
 *   {@link TabsHostPropsIOS.tabBarTintColor | tabBarTintColor}).
 * - `'original'` — the symbol keeps its own colors (Apple's "multicolor"
 *   rendering) and ignores the item icon color. A symbol without color layers
 *   is drawn as authored.
 */
export type TabsScreenIconSymbolRenderingModeIOS =
  | 'default'
  | 'monochrome'
  | 'original';

export interface TabsScreenIconImageSourceIOS extends PlatformIconShared {
  /**
   * How the tab bar renders this image.
   *
   * @remarks
   * {@link TabsScreenPropsIOS.icon | icon} and
   * {@link TabsScreenPropsIOS.selectedIcon | selectedIcon} may use different
   * values.
   *
   * @defaultValue `'default'`, the system behavior.
   */
  renderingMode?: TabsScreenIconImageRenderingModeIOS | undefined;
}

export interface TabsScreenIconSfSymbolIOS extends PlatformIconIOSSfSymbol {
  /**
   * How the tab bar renders this symbol.
   *
   * @remarks
   * Set `renderingMode` explicitly to be independent of the system behavior.
   *
   * {@link TabsScreenPropsIOS.icon | icon} and
   * {@link TabsScreenPropsIOS.selectedIcon | selectedIcon} may use different
   * values.
   *
   * @defaultValue `'default'`, the system behavior.
   */
  renderingMode?: TabsScreenIconSymbolRenderingModeIOS | undefined;
}

/**
 * How the tab bar tints an `'imageSource'` or `'drawableResource'` icon on
 * Android.
 *
 * @remarks
 * - `'default'` — the tab bar's default, also used when `tinting` is unset:
 *   the icon is tinted, as with `'tinted'`.
 * - `'tinted'` — the icon is drawn in the state-dependent item icon color
 *   ({@link TabsScreenItemStateAppearanceAndroid.tabBarItemIconColor | tabBarItemIconColor}).
 * - `'original'` — the icon keeps its own colors and ignores the item icon
 *   color, e.g. a multicolor VectorDrawable.
 */
export type TabsScreenIconTintingAndroid = 'default' | 'tinted' | 'original';

export interface TabsScreenIconDrawableResourceAndroid
  extends PlatformIconAndroidDrawableResource {
  /**
   * How the tab bar tints this icon.
   *
   * @remarks
   * {@link TabsScreenPropsAndroid.icon | icon} and
   * {@link TabsScreenPropsAndroid.selectedIcon | selectedIcon} may use
   * different values.
   *
   * @defaultValue `'default'`, which tints the icon.
   */
  tinting?: TabsScreenIconTintingAndroid | undefined;
}

export interface TabsScreenIconImageSourceAndroid extends PlatformIconShared {
  /**
   * How the tab bar tints this icon.
   *
   * @remarks
   * {@link TabsScreenPropsAndroid.icon | icon} and
   * {@link TabsScreenPropsAndroid.selectedIcon | selectedIcon} may use
   * different values.
   *
   * @defaultValue `'default'`, which tints the icon.
   */
  tinting?: TabsScreenIconTintingAndroid | undefined;
}

export type TabsScreenIconIOS =
  | TabsScreenIconSfSymbolIOS
  | TabsScreenIconImageSourceIOS;

export type TabsScreenIconAndroid =
  | TabsScreenIconDrawableResourceAndroid
  | TabsScreenIconImageSourceAndroid;
