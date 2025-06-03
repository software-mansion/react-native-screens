import React from 'react';
import type { ViewProps } from 'react-native';
import ScreenStackHostNativeComponent from '../../fabric/gamma/ScreenStackHostNativeComponent';

interface ScreenStackHostProps {
  children?: ViewProps['children'];
}

function ScreenStackHost(props: ScreenStackHostProps) {
  return (
    <ScreenStackHostNativeComponent style={{ flex: 1 }}>
      {props.children}
    </ScreenStackHostNativeComponent>
  );
}

export default ScreenStackHost;
