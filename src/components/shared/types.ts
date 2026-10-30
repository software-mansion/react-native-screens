import type { ImageSourcePropType, NativeSyntheticEvent } from 'react-native';

/**
 * Blur effect applied to the background of a native view.
 *
 * @remarks
 * `'none'` disables the blur effect. Every other value is the UIKit
 * `UIBlurEffect.Style` of the same name; see the UIKit documentation for how
 * each one looks. The following values are supported:
 * - `'none'`
 * - `'extraLight'`
 * - `'light'`
 * - `'dark'`
 * - `'regular'`
 * - `'prominent'`
 * - `'systemUltraThinMaterial'`
 * - `'systemThinMaterial'`
 * - `'systemMaterial'`
 * - `'systemThickMaterial'`
 * - `'systemChromeMaterial'`
 * - `'systemUltraThinMaterialLight'`
 * - `'systemThinMaterialLight'`
 * - `'systemMaterialLight'`
 * - `'systemThickMaterialLight'`
 * - `'systemChromeMaterialLight'`
 * - `'systemUltraThinMaterialDark'`
 * - `'systemThinMaterialDark'`
 * - `'systemMaterialDark'`
 * - `'systemThickMaterialDark'`
 * - `'systemChromeMaterialDark'`
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
 * @see {@link https://developer.apple.com/documentation/uikit/uiscrolledgeeffect/style-swift.class/ | UIScrollEdgeEffect.Style}
 * @platform ios >= 26
 */
export type ScrollEdgeEffect = 'automatic' | 'hard' | 'soft' | 'hidden';

/**
 * Interface style of a native view.
 *
 * @remarks
 * The following values are supported:
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
 */
export type EmptyEventPayload = Record<string, never>;

/**
 * Handler of a native event.
 *
 * @typeParam T - Payload the native event carries.
 * @param event - The native event, with the payload in `event.nativeEvent`.
 */
export type NativeEventHandler<T> = (event: NativeSyntheticEvent<T>) => void;

export type PlatformIconShared = {
  type: 'imageSource';
  imageSource: ImageSourcePropType;
};

export type PlatformIconAndroidDrawableResource = {
  type: 'drawableResource';
  name: string;
};

export type PlatformIconIOSTemplate = {
  type: 'templateSource';
  templateSource: ImageSourcePropType;
};

export type PlatformIconIOSSfSymbol = {
  type: 'sfSymbol';
  name: string;
};

export type PlatformIconIOSXcasset = {
  type: 'xcasset';
  name: string;
};

export type PlatformIconIOS =
  | PlatformIconIOSSfSymbol
  | PlatformIconIOSXcasset
  | PlatformIconIOSTemplate
  | PlatformIconShared;

export type PlatformIconAndroid =
  | PlatformIconAndroidDrawableResource
  | PlatformIconShared;
