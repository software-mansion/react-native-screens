/**
 * @flow strict-local
 * @format
 */
/* eslint-disable */
import codegenNativeComponent from 'react-native/Libraries/Utilities/codegenNativeComponent';
import type { ViewProps } from 'react-native/Libraries/Components/View/ViewPropTypes';
import type { HostComponent } from 'react-native/Libraries/Renderer/shims/ReactNativeTypes';
import type { DirectEventHandler } from 'react-native/Libraries/Types/CodegenTypes';

type FinishTransitioningEvent = $ReadOnly<{||}>;

type NativeProps = $ReadOnly<{|
  ...ViewProps,
  onFinishTransitioning?: ?DirectEventHandler<FinishTransitioningEvent>,
|}>;

type ComponentType = HostComponent<NativeProps>;

export default (codegenNativeComponent<NativeProps>(
  'RNSScreenStack',
  {}
): ComponentType);
