/**
 * @flow strict-local
 * @format
 */

import * as React from 'react';

import ScreenNativeComponent from './ScreenNativeComponent';
import type {NativeProps} from './ScreenNativeComponent';
import StyleSheet from 'react-native/Libraries/StyleSheet/StyleSheet';

const CustomButton: React.AbstractComponent<NativeProps> = function (
  props: NativeProps,
) {
  return (
    <ScreenNativeComponent
      {...props}
      style={[props.style, StyleSheet.absoluteFill]}
    />
  );
};

export default CustomButton;
