import * as React from 'react';
import ScreenNativeComponent from './ScreenNativeComponent';
import StyleSheet from 'react-native';

const Screen = function (props) {
  return (
    <ScreenNativeComponent
      {...props}
      style={[props.style, StyleSheet.absoluteFill]}
    />
  );
};

export default Screen;
