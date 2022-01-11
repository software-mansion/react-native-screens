/**
 * @flow strict-local
 * @format
 */
/* eslint-disable */
import * as React from 'react';

import codegenNativeComponent from 'react-native/Libraries/Utilities/codegenNativeComponent';
import type { ViewProps } from 'react-native/Libraries/Components/View/ViewPropTypes';
import type { HostComponent } from 'react-native/Libraries/Renderer/shims/ReactNativeTypes';

export type NativeProps = $ReadOnly<{|
  ...ViewProps,
  hidden: boolean,
  translucent: boolean,
|}>;

type ComponentType = HostComponent<NativeProps>;

export default (codegenNativeComponent<NativeProps>(
  'RNSScreenStackHeaderConfig',
  {}
): ComponentType);
