import type {
  PlatformIconAndroidDrawableResource,
  PlatformIconImageRenderingModeIOS,
  PlatformIconIOSSfSymbol,
  PlatformIconShared,
  PlatformIconSymbolRenderingModeIOS,
  PlatformIconTintingAndroid,
} from '../../shared/types';

/**
 * How the tab bar renders an `'imageSource'` icon on iOS. The names follow
 * `UIImage.RenderingMode`.
 *
 * @remarks
 * The following values are supported:
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
export type TabsPlatformIconImageRenderingModeIOS =
  PlatformIconImageRenderingModeIOS;

/**
 * How the tab bar renders an `'sfSymbol'` icon on iOS. The names follow the
 * SF Symbols rendering modes.
 *
 * @remarks
 * The following values are supported:
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
export type TabsPlatformIconSymbolRenderingModeIOS =
  PlatformIconSymbolRenderingModeIOS;

/**
 * Tab bar item icon on iOS, loaded from an image source.
 */
export interface TabsScreenIconImageSourceIOS extends PlatformIconShared {
  /**
   * How the tab bar renders this image.
   *
   * @remarks
   * {@link TabsScreenPropsIOS.icon | icon} and
   * {@link TabsScreenPropsIOS.selectedIcon | selectedIcon} may use different
   * values.
   *
   * @defaultValue `'default'`
   * @platform ios
   */
  renderingMode?: TabsPlatformIconImageRenderingModeIOS | undefined;
}

/**
 * Tab bar item icon on iOS, from the SF Symbols set.
 */
export interface TabsScreenIconSfSymbolIOS extends PlatformIconIOSSfSymbol {
  /**
   * How the tab bar renders this symbol.
   *
   * @remarks
   * {@link TabsScreenPropsIOS.icon | icon} and
   * {@link TabsScreenPropsIOS.selectedIcon | selectedIcon} may use different
   * values.
   *
   * @tip
   * Set `renderingMode` explicitly to be independent of the system behavior.
   *
   * @defaultValue `'default'`
   * @platform ios
   */
  renderingMode?: TabsPlatformIconSymbolRenderingModeIOS | undefined;
}

/**
 * How the tab bar tints an `'imageSource'` or `'drawableResource'` icon on
 * Android.
 *
 * @remarks
 * The following values are supported:
 * - `'default'` — the tab bar's default, also used when `tinting` is unset:
 *   the icon is tinted, as with `'tinted'`.
 * - `'tinted'` — the icon is drawn in the state-dependent item icon color
 *   ({@link TabsScreenItemStateAppearanceAndroid.tabBarItemIconColor | tabBarItemIconColor}).
 * - `'original'` — the icon keeps its own colors and ignores the item icon
 *   color, e.g. a multicolor VectorDrawable.
 */
export type TabsPlatformIconTintingAndroid = PlatformIconTintingAndroid;

/**
 * Tab bar item icon on Android, loaded from a drawable resource.
 */
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
   * @defaultValue `'default'`
   * @platform android
   */
  tinting?: TabsPlatformIconTintingAndroid | undefined;
}

/**
 * Tab bar item icon on Android, loaded from an image source.
 */
export interface TabsScreenIconImageSourceAndroid extends PlatformIconShared {
  /**
   * How the tab bar tints this icon.
   *
   * @remarks
   * {@link TabsScreenPropsAndroid.icon | icon} and
   * {@link TabsScreenPropsAndroid.selectedIcon | selectedIcon} may use
   * different values.
   *
   * @defaultValue `'default'`
   * @platform android
   */
  tinting?: TabsPlatformIconTintingAndroid | undefined;
}

/**
 * Icon of a tab bar item on iOS.
 *
 * @remarks
 * The `type` field selects the kind of the icon. The following kinds are
 * supported:
 * - {@link TabsScreenIconSfSymbolIOS} — an SF Symbol.
 * - {@link TabsScreenIconImageSourceIOS} — an image source.
 */
export type TabsScreenIconIOS =
  | TabsScreenIconSfSymbolIOS
  | TabsScreenIconImageSourceIOS;

/**
 * Icon of a tab bar item on Android.
 *
 * @remarks
 * The `type` field selects the kind of the icon. The following kinds are
 * supported:
 * - {@link TabsScreenIconDrawableResourceAndroid} — a drawable resource.
 * - {@link TabsScreenIconImageSourceAndroid} — an image source.
 */
export type TabsScreenIconAndroid =
  | TabsScreenIconDrawableResourceAndroid
  | TabsScreenIconImageSourceAndroid;
