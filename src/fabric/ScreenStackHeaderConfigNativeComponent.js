/**
 * @flow strict-local
 * @format
 */
/* eslint-disable */
import * as React from 'react';

import codegenNativeComponent from 'react-native/Libraries/Utilities/codegenNativeComponent';
import type { ViewProps } from 'react-native/Libraries/Components/View/ViewPropTypes';
import type { HostComponent } from 'react-native/Libraries/Renderer/shims/ReactNativeTypes';
import type { ColorValue } from 'react-native/Libraries/StyleSheet/StyleSheet';
import type {
  Int32,
  WithDefault,
} from 'react-native/Libraries/Types/CodegenTypes';

type DirectionType = 'rtl' | 'ltr';

export type NativeProps = $ReadOnly<{|
  ...ViewProps,
  backgroundColor?: ColorValue,
  backTitle?: string,
  backTitleFontFamily?: string,
  backTitleFontSize?: Int32,
  color?: ColorValue,
  direction?: WithDefault<DirectionType, 'ltr'>,
  hidden?: boolean,
  hideShadow?: boolean,
  largeTitle?: boolean,
  largeTitleFontFamily?: string,
  largeTitleFontSize?: Int32,
  largeTitleFontWeight?: string,
  largeTitleBackgroundColor?: ColorValue,
  largeTitleHideShadow?: boolean,
  largeTitleColor?: ColorValue,
  translucent?: boolean,
  title?: string,
  titleFontFamily?: string,
  titleFontSize?: Int32,
  titleFontWeight?: string,
  titleColor?: ColorValue,
  disableBackButtonMenu?: boolean,
  hideBackButton?: boolean,
  // TODO: implement this props on iOS
  topInsetEnabled?: boolean,
  backButtonInCustomView?: boolean,
|}>;

type ComponentType = HostComponent<NativeProps>;

export default (codegenNativeComponent<NativeProps>(
  'RNSScreenStackHeaderConfig',
  {}
): ComponentType);
