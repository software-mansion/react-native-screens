import codegenNativeComponent from 'react-native/Libraries/Utilities/codegenNativeComponent';
import type { ViewProps, ColorValue } from 'react-native';
import type {
  Int32,
  WithDefault,
} from 'react-native/Libraries/Types/CodegenTypes';

type DirectionType = 'rtl' | 'ltr';
type BlurEffectTypes =
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

export interface NativeProps extends ViewProps {
  backgroundColor?: ColorValue;
  backTitle?: string;
  backTitleFontFamily?: string;
  backTitleFontSize?: Int32;
  backTitleVisible?: WithDefault<boolean, 'true'>;
  blurEffect?: WithDefault<BlurEffectTypes, 'extraLight'>;
  color?: ColorValue;
  direction?: WithDefault<DirectionType, 'ltr'>;
  hidden?: boolean;
  hideShadow?: boolean;
  largeTitle?: boolean;
  largeTitleFontFamily?: string;
  largeTitleFontSize?: Int32;
  largeTitleFontWeight?: string;
  largeTitleBackgroundColor?: ColorValue;
  largeTitleHideShadow?: boolean;
  largeTitleColor?: ColorValue;
  translucent?: boolean;
  title?: string;
  titleFontFamily?: string;
  titleFontSize?: Int32;
  titleFontWeight?: string;
  titleColor?: ColorValue;
  disableBackButtonMenu?: boolean;
  hideBackButton?: boolean;
  backButtonInCustomView?: boolean;
  // TODO: implement this props on iOS
  topInsetEnabled?: boolean;
}

export default codegenNativeComponent<NativeProps>(
  'RNSScreenStackHeaderConfig',
  {}
);
