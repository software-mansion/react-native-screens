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

export interface PlatformIconShared {
  type: 'imageSource';
  imageSource: ImageSourcePropType;
}

export interface PlatformIconAndroidDrawableResource {
  type: 'drawableResource';
  name: string;
}

export interface PlatformIconIOSTemplate {
  type: 'templateSource';
  templateSource: ImageSourcePropType;
}

export interface PlatformIconIOSSfSymbol {
  type: 'sfSymbol';
  name: string;
}

export interface PlatformIconIOSXcasset {
  type: 'xcasset';
  name: string;
}

export type PlatformIconIOS =
  | PlatformIconIOSSfSymbol
  | PlatformIconIOSXcasset
  | PlatformIconIOSTemplate
  | PlatformIconShared;

export type PlatformIconAndroid =
  | PlatformIconAndroidDrawableResource
  | PlatformIconShared;
