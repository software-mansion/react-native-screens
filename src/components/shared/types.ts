import { ImageSourcePropType } from 'react-native';

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
