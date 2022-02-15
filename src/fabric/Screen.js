import * as React from 'react';
import ScreenNativeComponent from './ScreenNativeComponent';
import { StyleSheet } from 'react-native';

export default function Screen(props) {
  return (
    <ScreenNativeComponent
      {...props}
      style={[props.style, StyleSheet.absoluteFill]}
    />
  );
}
