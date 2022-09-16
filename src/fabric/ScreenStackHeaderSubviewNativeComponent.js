/**
 * @flow strict-local
 * @format
 */
/* eslint-disable */
import * as React from 'react';

import codegenNativeComponent from 'react-native/Libraries/Utilities/codegenNativeComponent';
import type { ViewProps } from 'react-native/Libraries/Components/View/ViewPropTypes';
import type { HostComponent } from 'react-native/Libraries/Renderer/shims/ReactNativeTypes';
import type { WithDefault } from 'react-native/Libraries/Types/CodegenTypes';

export type HeaderSubviewTypes =
  | 'back'
  | 'right'
  | 'left'
  | 'title'
  | 'center'
  | 'searchBar';

export type NativeProps = $ReadOnly<{|
  ...ViewProps,
  type?: WithDefault<HeaderSubviewTypes, 'left'>,
|}>;

type ComponentType = HostComponent<NativeProps>;

export default (codegenNativeComponent<NativeProps>(
  'RNSScreenStackHeaderSubview',
  {}
): ComponentType);
