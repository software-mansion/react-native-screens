import type { ImageSourcePropType } from 'react-native';

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

export type ColorScheme = 'light' | 'dark';

export type Direction = 'ltr' | 'rtl';

export type InterfaceOrientation =
  | 'all'
  | 'allButUpsideDown'
  | 'portrait'
  | 'portraitUp'
  | 'portraitDown'
  | 'landscape'
  | 'landscapeLeft'
  | 'landscapeRight';

export type ScrollEdgeEffect = 'automatic' | 'hard' | 'soft' | 'hidden';

export type UserInterfaceStyle = 'unspecified' | 'light' | 'dark';

export type PlatformIconShared = {
  type: 'imageSource';
  imageSource: ImageSourcePropType;
  /**
   * Whether the host component tints the icon with its state-dependent icon color.
   * The default is platform-specific: Android tints image icons, while iOS
   * renders them in their original colors unless `tinted` is `true`.
   */
  tinted?: boolean;
};

export type PlatformIconAndroidDrawableResource = {
  type: 'drawableResource';
  name: string;
  /**
   * Whether the host component tints the icon with its state-dependent icon color.
   * Defaults to `true`; `false` keeps the drawable's own colors.
   */
  tinted?: boolean;
};

/**
 * @deprecated Use `{ type: 'imageSource', imageSource, tinted: true }` instead.
 */
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
