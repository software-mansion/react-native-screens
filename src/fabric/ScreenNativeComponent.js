/**
 * @flow strict-local
 * @format
 */
/* eslint-disable */
import codegenNativeComponent from 'react-native/Libraries/Utilities/codegenNativeComponent';
import type { ViewProps } from 'react-native/Libraries/Components/View/ViewPropTypes';
import type { HostComponent } from 'react-native/Libraries/Renderer/shims/ReactNativeTypes';
import type {
  DirectEventHandler,
  Int32,
} from 'react-native/Libraries/Types/CodegenTypes';

type ScreenEvent = $ReadOnly<{||}>;

type ScreenDismissedEvent = $ReadOnly<{|
  dismissCount: Int32,
|}>;

export type NativeProps = $ReadOnly<{|
  ...ViewProps,
  onAppear?: ?DirectEventHandler<ScreenEvent>,
  onDisappear?: ?DirectEventHandler<ScreenEvent>,
  onDismissed?: ?DirectEventHandler<ScreenDismissedEvent>,
  onWillAppear?: ?DirectEventHandler<ScreenEvent>,
  onWillDisappear?: ?DirectEventHandler<ScreenEvent>,
|}>;

type ComponentType = HostComponent<NativeProps>;

export default (codegenNativeComponent<NativeProps>('RNSScreen', {
  interfaceOnly: true,
}): ComponentType);
