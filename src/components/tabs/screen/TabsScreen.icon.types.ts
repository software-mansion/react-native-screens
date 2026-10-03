import type {
  PlatformIconAndroidDrawableResource,
  PlatformIconIOSSfSymbol,
  PlatformIconIOSTemplate,
  PlatformIconIOSXcasset,
  PlatformIconShared,
} from '../../shared/types';

/**
 * How the tab bar colors an icon. The names follow the SF Symbols rendering
 * modes, not `UIImageRenderingMode`.
 *
 * - `monochrome` - the icon is rendered in a single color: the state-dependent
 *   item icon color of the tab bar (`tabBarItemIconColor`, `tabBarTintColor`).
 * - `original` - the icon keeps its own colors and ignores the item icon color.
 *   For an SF Symbol this is Apple's "multicolor" rendering. An asset without
 *   color layers (a plain PNG, a monochrome symbol) is drawn as authored.
 */
export type TabsScreenIconRenderingMode = 'monochrome' | 'original';

type WithRenderingMode<Icon> = Icon & {
  /**
   * @summary How the tab bar colors this icon. See `TabsScreenIconRenderingMode`.
   *
   * When unset, the platform default applies:
   * - iOS `imageSource`: `original`,
   * - iOS `sfSymbol`: the system default, which is `monochrome` for system
   *   symbols; for custom symbols the rendering intent set in the asset catalog
   *   may change it. Set `renderingMode` explicitly to be independent of it,
   * - Android `imageSource` and `drawableResource`: `monochrome`.
   *
   * `icon` and `selectedIcon` may use different values, e.g. a monochrome icon
   * that shows its own colors only while selected.
   */
  renderingMode?: TabsScreenIconRenderingMode | undefined;
};

/**
 * @deprecated Use `{ type: 'imageSource', imageSource, renderingMode: 'monochrome' }` instead.
 */
export type TabsScreenIconIOSTemplate = PlatformIconIOSTemplate;

export type TabsScreenIconIOS =
  | WithRenderingMode<PlatformIconIOSSfSymbol>
  | PlatformIconIOSXcasset
  | TabsScreenIconIOSTemplate
  | WithRenderingMode<PlatformIconShared>;

export type TabsScreenIconAndroid =
  | WithRenderingMode<PlatformIconAndroidDrawableResource>
  | WithRenderingMode<PlatformIconShared>;
