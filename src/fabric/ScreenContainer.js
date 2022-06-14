import React from 'react';
import ScreenContainerNativeComponent from './ScreenContainerNativeComponent';

function ScreenContainer(props) {
  return (
    <ScreenContainerNativeComponent
      {...props}
      style={[
        { flex: 1, alignItems: 'center', justifyContent: 'center' },
        props.style,
      ]}
    />
  );
}

export default ScreenContainer;
