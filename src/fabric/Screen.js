import React from 'react';
import ScreenNativeComponent from './ScreenNativeComponent';
import { StyleSheet } from 'react-native';

function Screen(props, ref) {
  return (
    <ScreenNativeComponent
      ref={ref}
      {...props}
      style={[props.style, StyleSheet.absoluteFill]}
    />
  );
}

export default React.forwardRef(Screen);
