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
   * Header icons only. `synchronous` attempts immediate loading of local PNG
   * files and packaged PNG resources. Other sources and failed loads use the
   * existing loader. Use this for small icons; reading local files can block
   * the UI thread. Omitted or `automatic` preserves the existing behavior.
   */
  preferredLoadingMode?: 'automatic' | 'synchronous' | undefined;
};

export type PlatformIconAndroidDrawableResource = {
  type: 'drawableResource';
  name: string;
};

export type PlatformIconIOSTemplate = {
  type: 'templateSource';
  templateSource: ImageSourcePropType;
  /**
   * Header icons only. `synchronous` attempts immediate loading of local PNGs,
   * falling back to the existing loader otherwise. Use this for small icons;
   * reading local files can block the UI thread. Defaults to `automatic`.
   */
  preferredLoadingMode?: 'automatic' | 'synchronous' | undefined;
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
