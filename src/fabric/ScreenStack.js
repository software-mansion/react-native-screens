import React from 'react';
import ScreenStackNativeComponent from './ScreenStackNativeComponent';

function ScreenStack(props) {
  return (
    <ScreenStackNativeComponent {...props} style={[{ flex: 1 }, props.style]} />
  );
}

export default ScreenStack;
