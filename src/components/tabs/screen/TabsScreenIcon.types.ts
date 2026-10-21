import type {
  PlatformIconAndroidDrawableResource,
  PlatformIconIOSSfSymbol,
  PlatformIconShared,
} from '../../shared/types';

/**
 * How the tab bar renders an `imageSource` icon on iOS. The names follow
 * `UIImage.RenderingMode`.
 *
 * - `default` - the system behavior (UIKit's automatic mode), also used when
 *   `renderingMode` is unset: the tab bar decides how to draw the image.
 * - `template` - the image is used as a template image: its shape is drawn in
 *   the state-dependent item icon color (`tabBarItemIconColor`,
 *   `tabBarTintColor`).
 * - `original` - the image keeps its own colors and ignores the item icon color.
 */
export type TabsScreenIconImageRenderingModeIOS =
  | 'default'
  | 'template'
  | 'original';

/**
 * How the tab bar renders an `sfSymbol` icon on iOS. The names follow the
 * SF Symbols rendering modes.
 *
 * - `default` - the system behavior (UIKit's automatic mode), also used when
 *   `renderingMode` is unset: system symbols are rendered in a single color,
 *   the state-dependent item icon color; for custom symbols the rendering mode
 *   set in the asset catalog may change it.
 * - `monochrome` - the symbol is rendered in a single color: the
 *   state-dependent item icon color (`tabBarItemIconColor`, `tabBarTintColor`).
 * - `original` - the symbol keeps its own colors (Apple's "multicolor"
 *   rendering) and ignores the item icon color. A symbol without color layers
 *   is drawn as authored.
 */
export type TabsScreenIconSymbolRenderingModeIOS =
  | 'default'
  | 'monochrome'
  | 'original';

type WithImageRenderingMode<Icon> = Icon & {
  /**
   * @summary How the tab bar renders this image. See
   * {@link TabsScreenIconImageRenderingModeIOS}.
   *
   * `icon` and `selectedIcon` may use different values.
   */
  renderingMode?: TabsScreenIconImageRenderingModeIOS | undefined;
};

type WithSymbolRenderingMode<Icon> = Icon & {
  /**
   * @summary How the tab bar renders this symbol. See
   * {@link TabsScreenIconSymbolRenderingModeIOS}.
   *
   * Defaults to `default`, the system behavior. Set `renderingMode`
   * explicitly to be independent of it.
   *
   * `icon` and `selectedIcon` may use different values.
   */
  renderingMode?: TabsScreenIconSymbolRenderingModeIOS | undefined;
};

/**
 * How the tab bar tints an `imageSource` or `drawableResource` icon on Android.
 *
 * - `default` - the tab bar's default, also used when `tinting` is unset: the
 *   icon is tinted, as with `tinted`.
 * - `tinted` - the icon is drawn in the state-dependent item icon color
 *   (`tabBarItemIconColor`).
 * - `original` - the icon keeps its own colors and ignores the item icon color,
 *   e.g. a multicolor VectorDrawable.
 */
export type TabsScreenIconTintingAndroid = 'default' | 'tinted' | 'original';

type WithTinting<Icon> = Icon & {
  /**
   * @summary How the tab bar tints this icon. See
   * `TabsScreenIconTintingAndroid`.
   *
   * Defaults to `default`, which tints the icon.
   *
   * `icon` and `selectedIcon` may use different values.
   */
  tinting?: TabsScreenIconTintingAndroid | undefined;
};

export type TabsScreenIconIOS =
  | WithSymbolRenderingMode<PlatformIconIOSSfSymbol>
  | WithImageRenderingMode<PlatformIconShared>;

export type TabsScreenIconAndroid =
  | WithTinting<PlatformIconAndroidDrawableResource>
  | WithTinting<PlatformIconShared>;
