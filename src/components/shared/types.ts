import type { ImageSourcePropType, NativeSyntheticEvent } from 'react-native';

/**
 * Style of a UIKit blur effect.
 *
 * @remarks
 * Every value is the UIKit `UIBlurEffect.Style` of the same name; see the UIKit
 * documentation for how each one looks.
 *
 * @see {@link https://developer.apple.com/documentation/uikit/uiblureffect/style | UIBlurEffect.Style}
 */
export type BlurEffectStyle =
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
 * Blur effect applied to the background of a native view.
 *
 * @remarks
 * Accepts any {@link BlurEffectStyle} value, plus:
 * - `'none'` — disables the blur effect.
 *
 * @see {@link https://developer.apple.com/documentation/uikit/uiblureffect/style | UIBlurEffect.Style}
 */
export type BlurEffect = 'none' | BlurEffectStyle;

/**
 * Color scheme of a container and its child containers.
 *
 * @remarks
 * The following values are supported:
 * - `'light'` — the light interface style.
 * - `'dark'` — the dark interface style.
 */
export type ColorScheme = 'light' | 'dark';

/**
 * Layout direction of a container, its views and child containers.
 *
 * @remarks
 * The following values are supported:
 * - `'ltr'` — forces the left-to-right layout direction.
 * - `'rtl'` — forces the right-to-left layout direction.
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
 * its other fields are ignored and animated images are not supported. SVG
 * images are not supported on Android either; use a
 * {@link PlatformIconAndroidDrawableResource | drawable resource} instead.
 */
export interface PlatformIconShared {
  /**
   * Kind of the icon.
   *
   * @platform android, ios
   */
  type: 'imageSource';
  /**
   * Image source the icon is loaded from.
   *
   * @see {@link https://reactnative.dev/docs/image#imagesource | React Native: ImageSource}
   * @platform android, ios
   */
  imageSource: ImageSourcePropType;
}

/**
 * Icon loaded from an Android drawable resource.
 *
 * @remarks
 * The resource is looked up by name among the drawables of the app first and
 * then among the drawables of the Android system.
 */
export interface PlatformIconAndroidDrawableResource {
  /**
   * Kind of the icon.
   *
   * @platform android
   */
  type: 'drawableResource';
  /**
   * Name of the drawable resource, without the file extension.
   *
   * @example
   * For `res/drawable/ic_search.xml`:
   * ```tsx
   * { type: 'drawableResource', name: 'ic_search' }
   * ```
   * @platform android
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
 */
export interface PlatformIconIOSTemplate {
  /**
   * Kind of the icon.
   *
   * @platform ios
   */
  type: 'templateSource';
  /**
   * Image source the icon is loaded from.
   *
   * @see {@link https://reactnative.dev/docs/image#imagesource | React Native: ImageSource}
   * @platform ios
   */
  templateSource: ImageSourcePropType;
}

/**
 * Icon from the SF Symbols set.
 *
 * @see {@link https://developer.apple.com/sf-symbols/ | SF Symbols}
 */
export interface PlatformIconIOSSfSymbol {
  /**
   * Kind of the icon.
   *
   * @platform ios
   */
  type: 'sfSymbol';
  /**
   * Name of the SF Symbol, for example `'magnifyingglass'`.
   *
   * @platform ios
   */
  name: string;
}

/**
 * Icon loaded by name from the app's asset catalog.
 *
 * @remarks
 * The image is looked up the way `UIImage(named:)` looks it up, so an image
 * file in the app bundle with the same name is found too.
 */
export interface PlatformIconIOSXcasset {
  /**
   * Kind of the icon.
   *
   * @platform ios
   */
  type: 'xcasset';
  /**
   * Name of the image set in the asset catalog.
   *
   * @platform ios
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
 */
export type PlatformIconAndroid =
  | PlatformIconAndroidDrawableResource
  | PlatformIconShared;

/**
 * How an image icon is rendered on iOS.
 *
 * @remarks
 * The following values are supported:
 * - `'default'` — the default of the element that shows the icon.
 * - `'template'` — the image is used as a template image: its shape is drawn
 *   in the icon color of the element.
 * - `'original'` — the image keeps its own colors.
 *
 * @see {@link https://developer.apple.com/documentation/uikit/uiimage/renderingmode-swift.enum | UIImage.RenderingMode}
 */
export type PlatformIconImageRenderingModeIOS =
  | 'default'
  | 'template'
  | 'original';

/**
 * How an SF Symbol icon is rendered on iOS.
 *
 * @remarks
 * The following values are supported:
 * - `'default'` — the default of the element that shows the icon.
 * - `'monochrome'` — the symbol is rendered in a single color, the icon color
 *   of the element.
 * - `'original'` — the symbol keeps its own colors (Apple's "multicolor"
 *   rendering).
 */
export type PlatformIconSymbolRenderingModeIOS =
  | 'default'
  | 'monochrome'
  | 'original';

/**
 * How an icon is tinted on Android.
 *
 * @remarks
 * The following values are supported:
 * - `'default'` — the default of the element that shows the icon.
 * - `'tinted'` — the icon is drawn in the icon color of the element.
 * - `'original'` — the icon keeps its own colors.
 */
export type PlatformIconTintingAndroid = 'default' | 'tinted' | 'original';
