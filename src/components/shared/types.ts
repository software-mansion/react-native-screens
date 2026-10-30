import type { ImageSourcePropType, NativeSyntheticEvent } from 'react-native';

/**
 * Blur effect applied to the background of a native view.
 *
 * @remarks
 * Apart from `'none'`, each value maps to the UIKit `UIBlurEffect.Style` of
 * the same name. The following values are supported:
 * - `'none'` — no blur effect.
 * - `'extraLight'` — makes the area lighter in hue than the underlying view.
 * - `'light'` — keeps the hue of the underlying view.
 * - `'dark'` — makes the area darker in hue than the underlying view.
 * - `'regular'` — adapts to the interface style.
 * - `'prominent'` — adapts to the interface style, more prominent than
 *   `'regular'`.
 * - `'systemUltraThinMaterial'` — the most translucent material.
 * - `'systemThinMaterial'` — a material more translucent than
 *   `'systemMaterial'`.
 * - `'systemMaterial'` — the standard material.
 * - `'systemThickMaterial'` — a material more opaque than `'systemMaterial'`.
 * - `'systemChromeMaterial'` — the material of the system chrome.
 * - `'systemUltraThinMaterialLight'`, `'systemThinMaterialLight'`,
 *   `'systemMaterialLight'`, `'systemThickMaterialLight'`,
 *   `'systemChromeMaterialLight'` — the materials above, always light.
 * - `'systemUltraThinMaterialDark'`, `'systemThinMaterialDark'`,
 *   `'systemMaterialDark'`, `'systemThickMaterialDark'`,
 *   `'systemChromeMaterialDark'` — the materials above, always dark.
 *
 * The materials without `Light` or `Dark` in the name adapt to the interface
 * style.
 *
 * @see {@link https://developer.apple.com/documentation/uikit/uiblureffect/style | UIBlurEffect.Style}
 * @platform ios >= 13
 */
export type BlurEffect =
  | 'none'
  | 'extraLight'
  | 'light'
  | 'dark'
  | 'regular'
  | 'prominent'
  | 'systemUltraThinMaterial'
  | 'systemThinMaterial'
  | 'systemMaterial'
  | 'systemThickMaterial'
  | 'systemChromeMaterial'
  | 'systemUltraThinMaterialLight'
  | 'systemThinMaterialLight'
  | 'systemMaterialLight'
  | 'systemThickMaterialLight'
  | 'systemChromeMaterialLight'
  | 'systemUltraThinMaterialDark'
  | 'systemThinMaterialDark'
  | 'systemMaterialDark'
  | 'systemThickMaterialDark'
  | 'systemChromeMaterialDark';

/**
 * Color scheme of a container and its child containers.
 *
 * @remarks
 * The following values are supported:
 * - `'light'` — the light interface style.
 * - `'dark'` — the dark interface style.
 *
 * @platform android >= 21, ios >= 13
 */
export type ColorScheme = 'light' | 'dark';

/**
 * Layout direction of a container, its views and child containers.
 *
 * @remarks
 * The following values are supported:
 * - `'ltr'` — forces the left-to-right layout direction.
 * - `'rtl'` — forces the right-to-left layout direction.
 *
 * @platform android >= 21, ios >= 13
 */
export type Direction = 'ltr' | 'rtl';

/**
 * Interface orientations a screen supports.
 *
 * @remarks
 * The following values are supported:
 * - `'all'` — all orientations.
 * - `'allButUpsideDown'` — all orientations but the upside-down portrait.
 * - `'portrait'` — both the portrait-up and portrait-down orientations.
 * - `'portraitUp'` — the portrait-up orientation.
 * - `'portraitDown'` — the portrait-down orientation.
 * - `'landscape'` — both the landscape-left and landscape-right orientations.
 * - `'landscapeLeft'` — the landscape-left orientation.
 * - `'landscapeRight'` — the landscape-right orientation.
 *
 * The values without `portrait` in the name match the UIKit
 * `UIInterfaceOrientationMask` values of the same name.
 *
 * @see {@link https://developer.apple.com/documentation/uikit/uiinterfaceorientationmask | UIInterfaceOrientationMask}
 * @platform ios >= 13
 */
export type InterfaceOrientation =
  | 'all'
  | 'allButUpsideDown'
  | 'portrait'
  | 'portraitUp'
  | 'portraitDown'
  | 'landscape'
  | 'landscapeLeft'
  | 'landscapeRight';

/**
 * Effect applied to the scrolling content at an edge of a scroll view.
 *
 * @remarks
 * The values map to the `style` and `isHidden` properties of the UIKit
 * `UIScrollEdgeEffect`. The following values are supported:
 * - `'automatic'` — the automatic scroll edge effect style.
 * - `'hard'` — a scroll edge effect with a hard cutoff and dividing line.
 * - `'soft'` — a soft-edged scroll edge effect.
 * - `'hidden'` — no scroll edge effect.
 *
 * @see {@link https://developer.apple.com/documentation/uikit/uiscrolledgeeffect | UIScrollEdgeEffect}
 * @platform ios >= 26
 */
export type ScrollEdgeEffect = 'automatic' | 'hard' | 'soft' | 'hidden';

/**
 * Interface style of a native view.
 *
 * @remarks
 * Each value maps to the UIKit `UIUserInterfaceStyle` of the same name. The
 * following values are supported:
 * - `'unspecified'` — an unspecified interface style; the style of the parent
 *   is used.
 * - `'light'` — the light interface style.
 * - `'dark'` — the dark interface style.
 *
 * @see {@link https://developer.apple.com/documentation/uikit/uiuserinterfacestyle | UIUserInterfaceStyle}
 * @platform ios >= 13
 */
export type UserInterfaceStyle = 'unspecified' | 'light' | 'dark';

/**
 * Payload of a native event that carries no data.
 *
 * @platform android >= 21, ios >= 13
 */
export type EmptyEventPayload = Record<string, never>;

/**
 * Handler of a native event.
 *
 * @typeParam T - Payload the native event carries.
 * @param event - The native event, with the payload in `event.nativeEvent`.
 * @platform android >= 21, ios >= 13
 */
export type NativeEventHandler<T> = (event: NativeSyntheticEvent<T>) => void;

/**
 * Icon loaded from an image source.
 *
 * @remarks
 * The source takes the same values as the `source` of React Native's `Image`.
 *
 * @note
 * This is an implementation detail and may change. On iOS, the image is
 * loaded with React Native's image loader, so `headers` and the other fields
 * of the source are used. On Android, only the `uri` of the source is used:
 * its other fields are ignored and animated images are not supported.
 *
 * @platform android >= 21, ios >= 13
 */
export interface PlatformIconShared {
  /**
   * Kind of the icon.
   *
   * @platform android >= 21, ios >= 13
   */
  type: 'imageSource';
  /**
   * Image source the icon is loaded from.
   *
   * @see {@link https://reactnative.dev/docs/image#imagesource | React Native: ImageSource}
   * @platform android >= 21, ios >= 13
   */
  imageSource: ImageSourcePropType;
}

/**
 * Icon loaded from an Android drawable resource.
 *
 * @remarks
 * The resource is looked up by name among the drawables of the app first and
 * then among the drawables of the Android system.
 *
 * @platform android >= 21
 */
export interface PlatformIconAndroidDrawableResource {
  /**
   * Kind of the icon.
   *
   * @platform android >= 21
   */
  type: 'drawableResource';
  /**
   * Name of the drawable resource, without the file extension.
   *
   * @remarks
   * For example, `'ic_search'` for `res/drawable/ic_search.xml`.
   *
   * @platform android >= 21
   */
  name: string;
}

/**
 * Icon loaded from an image source and rendered as a template image.
 *
 * @remarks
 * The colors of the image are ignored and only its alpha channel is used, so
 * the icon is drawn in the current tint color.
 *
 * @see {@link https://developer.apple.com/documentation/uikit/uiimage/renderingmode/alwaystemplate | UIImage.RenderingMode.alwaysTemplate}
 * @platform ios >= 13
 */
export interface PlatformIconIOSTemplate {
  /**
   * Kind of the icon.
   *
   * @platform ios >= 13
   */
  type: 'templateSource';
  /**
   * Image source the icon is loaded from.
   *
   * @see {@link https://reactnative.dev/docs/image#imagesource | React Native: ImageSource}
   * @platform ios >= 13
   */
  templateSource: ImageSourcePropType;
}

/**
 * Icon from the SF Symbols set.
 *
 * @see {@link https://developer.apple.com/sf-symbols/ | SF Symbols}
 * @platform ios >= 13
 */
export interface PlatformIconIOSSfSymbol {
  /**
   * Kind of the icon.
   *
   * @platform ios >= 13
   */
  type: 'sfSymbol';
  /**
   * Name of the SF Symbol, for example `'magnifyingglass'`.
   *
   * @platform ios >= 13
   */
  name: string;
}

/**
 * Icon loaded by name from the app's asset catalog.
 *
 * @remarks
 * The image is looked up the way `UIImage(named:)` looks it up, so an image
 * file in the app bundle with the same name is found too.
 *
 * @platform ios >= 13
 */
export interface PlatformIconIOSXcasset {
  /**
   * Kind of the icon.
   *
   * @platform ios >= 13
   */
  type: 'xcasset';
  /**
   * Name of the image set in the asset catalog.
   *
   * @platform ios >= 13
   */
  name: string;
}

/**
 * Icon of a native element on iOS, such as a header item.
 *
 * @remarks
 * The `type` field selects the kind of the icon. The following kinds are
 * supported:
 * - {@link PlatformIconIOSSfSymbol} — an SF Symbol.
 * - {@link PlatformIconIOSXcasset} — an image from the app's asset catalog.
 * - {@link PlatformIconIOSTemplate} — an image source rendered as a template
 *   image.
 * - {@link PlatformIconShared} — an image source.
 *
 * @platform ios >= 13
 */
export type PlatformIconIOS =
  | PlatformIconIOSSfSymbol
  | PlatformIconIOSXcasset
  | PlatformIconIOSTemplate
  | PlatformIconShared;

/**
 * Icon of a native element on Android, such as a header item.
 *
 * @remarks
 * The `type` field selects the kind of the icon. The following kinds are
 * supported:
 * - {@link PlatformIconAndroidDrawableResource} — a drawable resource.
 * - {@link PlatformIconShared} — an image source.
 *
 * @platform android >= 21
 */
export type PlatformIconAndroid =
  | PlatformIconAndroidDrawableResource
  | PlatformIconShared;
