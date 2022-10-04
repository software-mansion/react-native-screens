/**
 * @flow strict-local
 * @format
 */
/* eslint-disable */
import codegenNativeComponent from 'react-native/Libraries/Utilities/codegenNativeComponent';
import codegenNativeCommands from 'react-native/Libraries/Utilities/codegenNativeCommands';
import type { ViewProps } from 'react-native/Libraries/Components/View/ViewPropTypes';
import type { HostComponent } from 'react-native/Libraries/Renderer/shims/ReactNativeTypes';
import { ColorValue } from 'react-native/Libraries/StyleSheet/StyleSheet';
import type {
  WithDefault,
  BubblingEventHandler,
} from 'react-native/Libraries/Types/CodegenTypes';
import { tintColor } from 'react-native/Libraries/Components/View/ReactNativeStyleAttributes';
import React from 'react';

type SearchBarEvent = $ReadOnly<{||}>;

type SearchButtonPressedEvent = $ReadOnly<{|
  text?: string,
|}>;

type ChangeTextEvent = $ReadOnly<{|
  text?: string,
|}>;

type AutoCapitalizeType = 'none' | 'words' | 'sentences' | 'characters';

type NativeProps = $ReadOnly<{|
  ...ViewProps,
  onFocus?: ?BubblingEventHandler<SearchBarEvent>,
  onBlur?: ?BubblingEventHandler<SearchBarEvent>,
  onSearchButtonPress?: ?BubblingEventHandler<SearchButtonPressedEvent>,
  onCancelButtonPress?: ?BubblingEventHandler<SearchBarEvent>,
  onChangeText?: ?BubblingEventHandler<ChangeTextEvent>,
  hideWhenScrolling?: boolean,
  autoCapitalize?: WithDefault<AutoCapitalizeType, 'none'>,
  placeholder?: string,
  obscureBackground?: boolean,
  hideNavigationBar?: boolean,
  cancelButtonText?: string,
  // TODO: implement these on iOS
  barTintColor?: ColorValue,
  tintColor?: ColorValue,
  textColor?: ColorValue,

  // Android only
  disableBackButtonOverride?: boolean,
  // TODO: consider creating enum here
  inputType?: string,
  onClose?: ?BubblingEventHandler<SearchBarEvent>,
  onOpen?: ?BubblingEventHandler<SearchBarEvent>,
  hintTextColor?: ColorValue,
  headerIconColor?: ColorValue,
  shouldShowHintSearchIcon?: WithDefault<boolean, true>,
|}>;

type ComponentType = HostComponent<NativeProps>;

interface NativeCommands {
  +blur: (viewRef: React.ElementRef<ComponentType>) => void;
  +focus: (viewRef: React.ElementRef<ComponentType>) => void;
  +clearText: (viewRef: React.ElementRef<ComponentType>) => void;
  +toggleCancelButton: (
    viewRef: React.ElementRef<ComponentType>,
    flag: boolean
  ) => void;
}

export const Commands: NativeCommands = codegenNativeCommands<NativeCommands>({
  supportedCommands: ['blur', 'focus', 'clearText', 'toggleCancelButton'],
});

export default (codegenNativeComponent<NativeProps>(
  'RNSSearchBar',
  {}
): ComponentType);
