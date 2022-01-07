/**
 * @flow strict-local
 * @format
 */
import codegenNativeComponent from 'react-native/Libraries/Utilities/codegenNativeComponent';
import type {ViewProps} from 'react-native/Libraries/Components/View/ViewPropTypes';
import type {HostComponent} from 'react-native/Libraries/Renderer/shims/ReactNativeTypes';
import type {BubblingEventHandler} from 'react-native/Libraries/Types/CodegenTypes';

type ScreenEvent = $ReadOnly<{||}>;

export type NativeProps = $ReadOnly<{|
  ...ViewProps,
  onAppear?: ?BubblingEventHandler<ScreenEvent>,
  onDisappear?: ?BubblingEventHandler<ScreenEvent>,
  onDismissed?: ?BubblingEventHandler<ScreenEvent>,
  onWillAppear?: ?BubblingEventHandler<ScreenEvent>,
  onWillDisappear?: ?BubblingEventHandler<ScreenEvent>,
|}>;

type ComponentType = HostComponent<NativeProps>;

export default (codegenNativeComponent<NativeProps>('RNSScreen', {
  interfaceOnly: true,
}): ComponentType);
