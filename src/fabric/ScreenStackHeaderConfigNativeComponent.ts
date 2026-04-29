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
  onAttached?: CT.DirectEventHandler<OnAttachedEvent> | undefined;
  onDetached?: CT.DirectEventHandler<OnDetachedEvent> | undefined;
  backgroundColor?: ColorValue | undefined;
  backTitle?: string | undefined;
  backTitleFontFamily?: string | undefined;
  backTitleFontSize?: CT.Int32 | undefined;
  backTitleVisible?: CT.WithDefault<boolean, 'true'>;
  color?: ColorValue | undefined;
  direction?: CT.WithDefault<DirectionType, 'ltr'>;
  hidden?: boolean | undefined;
  hideShadow?: boolean | undefined;
  largeTitle?: boolean | undefined;
  largeTitleFontFamily?: string | undefined;
  largeTitleFontSize?: CT.Int32 | undefined;
  largeTitleFontWeight?: string | undefined;
  largeTitleBackgroundColor?: ColorValue | undefined;
  largeTitleHideShadow?: boolean | undefined;
  largeTitleColor?: ColorValue | undefined;
  translucent?: boolean | undefined;
  title?: string | undefined;
  titleFontFamily?: string | undefined;
  titleFontSize?: CT.Int32 | undefined;
  titleFontWeight?: string | undefined;
  titleColor?: ColorValue | undefined;
  disableBackButtonMenu?: boolean | undefined;
  backButtonDisplayMode?: CT.WithDefault<BackButtonDisplayMode, 'default'>;
  hideBackButton?: boolean | undefined;
  backButtonInCustomView?: boolean | undefined;
  blurEffect?: CT.WithDefault<BlurEffect, 'none'>;
  // TODO: implement this props on iOS
  topInsetEnabled?: boolean | undefined;
  headerLeftBarButtonItems?: CT.UnsafeMixed[] | undefined;
  headerRightBarButtonItems?: CT.UnsafeMixed[] | undefined;
  onPressHeaderBarButtonItem?:
    | CT.DirectEventHandler<OnPressHeaderBarButtonItemEvent>
    | undefined;
  onPressHeaderBarButtonMenuItem?:
    | CT.DirectEventHandler<OnPressHeaderBarButtonMenuItemEvent>
    | undefined;
  synchronousShadowStateUpdatesEnabled?: CT.WithDefault<boolean, false>;

  // Experimental
  userInterfaceStyle?: CT.WithDefault<UserInterfaceStyle, 'unspecified'>;
  consumeTopInset?: boolean | undefined;
  legacyTopInsetBehavior?: boolean | undefined;
}

export default codegenNativeComponent<NativeProps>(
  'RNSScreenStackHeaderConfig',
  {
    interfaceOnly: true,
  },
);
