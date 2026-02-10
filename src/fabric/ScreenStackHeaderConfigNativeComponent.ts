'use client';

import { codegenNativeComponent } from 'react-native';
import type { CodegenTypes as CT, ViewProps, ColorValue } from 'react-native';

type DirectionType = 'rtl' | 'ltr';

// eslint-disable-next-line @typescript-eslint/ban-types
type OnAttachedEvent = Readonly<{}>;
// eslint-disable-next-line @typescript-eslint/ban-types
type OnDetachedEvent = Readonly<{}>;

type OnPressHeaderBarButtonItemEvent = Readonly<{ buttonId: string }>;
type OnPressHeaderBarButtonMenuItemEvent = Readonly<{ menuId: string }>;

type BackButtonDisplayMode = 'minimal' | 'default' | 'generic';

type BlurEffect =
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

type UserInterfaceStyle = 'unspecified' | 'light' | 'dark';

export interface NativeProps extends ViewProps {
  onAttached?: CT.DirectEventHandler<OnAttachedEvent>;
  onDetached?: CT.DirectEventHandler<OnDetachedEvent>;
  backgroundColor?: ColorValue;
  backTitle?: string;
  backTitleFontFamily?: string;
  backTitleFontSize?: CT.Int32;
  backTitleVisible?: CT.WithDefault<boolean, 'true'>;
  color?: ColorValue;
  direction?: CT.WithDefault<DirectionType, 'ltr'>;
  hidden?: boolean;
  hideShadow?: boolean;
  largeTitle?: boolean;
  largeTitleFontFamily?: string;
  largeTitleFontSize?: CT.Int32;
  largeTitleFontWeight?: string;
  largeTitleBackgroundColor?: ColorValue;
  largeTitleHideShadow?: boolean;
  largeTitleColor?: ColorValue;
  translucent?: boolean;
  title?: string;
  titleFontFamily?: string;
  titleFontSize?: CT.Int32;
  titleFontWeight?: string;
  titleColor?: ColorValue;
  disableBackButtonMenu?: boolean;
  backButtonDisplayMode?: CT.WithDefault<BackButtonDisplayMode, 'default'>;
  hideBackButton?: boolean;
  backButtonInCustomView?: boolean;
  blurEffect?: CT.WithDefault<BlurEffect, 'none'>;
  // TODO: implement this props on iOS
  topInsetEnabled?: boolean;
  headerLeftBarButtonItems?: CT.UnsafeMixed[];
  headerRightBarButtonItems?: CT.UnsafeMixed[];
  onPressHeaderBarButtonItem?: CT.DirectEventHandler<OnPressHeaderBarButtonItemEvent>;
  onPressHeaderBarButtonMenuItem?: CT.DirectEventHandler<OnPressHeaderBarButtonMenuItemEvent>;
  synchronousShadowStateUpdatesEnabled?: CT.WithDefault<boolean, false>;

  // Experimental
  userInterfaceStyle?: CT.WithDefault<UserInterfaceStyle, 'unspecified'>;
}

export default codegenNativeComponent<NativeProps>(
  'RNSScreenStackHeaderConfig',
  {
    interfaceOnly: true,
  },
);
