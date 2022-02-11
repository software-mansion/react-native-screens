import * as React from 'react';
import ScreenStackNativeComponent from './ScreenStackNativeComponent';

const ScreenStack = function (props) {
  return (
    <ScreenStackNativeComponent {...props} style={[{ flex: 1 }, props.style]} />
  );
};

export default ScreenStack;
