/**
 * @flow strict-local
 * @format
 */
/* eslint-disable */
import codegenNativeComponent from 'react-native/Libraries/Utilities/codegenNativeComponent';
import type { ViewProps } from 'react-native/Libraries/Components/View/ViewPropTypes';
import type { HostComponent } from 'react-native/Libraries/Renderer/shims/ReactNativeTypes';
import { ColorValue } from 'react-native/Libraries/StyleSheet/StyleSheet';
import type {
  WithDefault,
  BubblingEventHandler,
} from 'react-native/Libraries/Types/CodegenTypes';
import { tintColor } from 'react-native/Libraries/Components/View/ReactNativeStyleAttributes';

type SearchBarEvent = $ReadOnly<{||}>;

type AutoCapitalizeType = 'none' | 'words' | 'sentences' | 'characters';

type NativeProps = $ReadOnly<{|
  ...ViewProps,
  // implement these on iOS
  onFocus?: ?BubblingEventHandler<SearchBarEvent>,
  onBlur?: ?BubblingEventHandler<SearchBarEvent>,
  onSearchButtonPress?: ?BubblingEventHandler<SearchBarEvent>,
  onCancelButtonPress?: ?BubblingEventHandler<SearchBarEvent>,
  onChangeText?: ?BubblingEventHandler<SearchBarEvent>,
  hideWhenScrolling?: boolean,
  autoCapitalize?: WithDefault<AutoCapitalizeType, 'none'>,
  placeholder?: string,
  obscureBackground?: boolean,
  hideNavigationBar?: boolean,
  barTintColor?: ColorValue,
  tintColor?: ColorValue,
  textColor?: ColorValue,
  cancelButtonText?: string,

  // Android only
  disableBackButtonOverride?: boolean,
  // consider creating enum here
  inputType?: string,
  onClose?: ?BubblingEventHandler<SearchBarEvent>,
  onOpen?: ?BubblingEventHandler<SearchBarEvent>,
  hintTextColor?: ColorValue,
  headerIconColor?: ColorValue,
  shouldShowHintSearchIcon?: WithDefault<boolean, true>,
|}>;

type ComponentType = HostComponent<NativeProps>;

export default (codegenNativeComponent<NativeProps>(
  'RNSSearchBar',
  {}
): ComponentType);
