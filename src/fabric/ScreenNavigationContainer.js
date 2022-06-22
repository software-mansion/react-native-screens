import React from 'react';
import ScreenNavigationContainerNativeComponent from './ScreenNavigationContainerNativeComponent';

function ScreenNavigationContainer(props) {
  return (
    <ScreenNavigationContainerNativeComponent
      {...props}
      style={[
        { flex: 1, alignItems: 'center', justifyContent: 'center' },
        props.style,
      ]}
    />
  );
}

export default ScreenNavigationContainer;
