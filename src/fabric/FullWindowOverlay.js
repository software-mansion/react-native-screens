import React from 'react';
import FullWindowOverlayNativeComponent from './FullWindowOverlayNativeComponent';

function FullWindowOverlay(props) {
  return (
    <FullWindowOverlayNativeComponent
      {...props}
      style={[{ flex: 1 }, props.style]}
    />
  );
}

export default FullWindowOverlay;
