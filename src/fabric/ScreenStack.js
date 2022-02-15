import * as React from 'react';
import ScreenStackNativeComponent from './ScreenStackNativeComponent';

export default function ScreenStack(props) {
  return (
    <ScreenStackNativeComponent {...props} style={[{ flex: 1 }, props.style]} />
  );
}
