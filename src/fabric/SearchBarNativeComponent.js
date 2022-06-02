/**
 * @flow strict-local
 * @format
 */
/* eslint-disable */
import codegenNativeComponent from 'react-native/Libraries/Utilities/codegenNativeComponent';
import type { ViewProps } from 'react-native/Libraries/Components/View/ViewPropTypes';
import type { HostComponent } from 'react-native/Libraries/Renderer/shims/ReactNativeTypes';
import type {
  WithDefault,
  BubblingEventHandler,
} from 'react-native/Libraries/Types/CodegenTypes';

type SearchBarEvent = $ReadOnly<{||}>;

type NativeProps = $ReadOnly<{|
  ...ViewProps,
  onFocus?: ?BubblingEventHandler<SearchBarEvent>,
  onBlur?: ?BubblingEventHandler<SearchBarEvent>,
  onSearchButtonPress?: ?BubblingEventHandler<SearchBarEvent>,
  onCancelButtonPress?: ?BubblingEventHandler<SearchBarEvent>,
  onChangeText?: ?BubblingEventHandler<SearchBarEvent>,
|}>;

type ComponentType = HostComponent<NativeProps>;

export default (codegenNativeComponent<NativeProps>(
  'RNSSearchBar',
  {}
): ComponentType);
