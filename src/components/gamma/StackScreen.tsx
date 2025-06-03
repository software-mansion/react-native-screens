import React from 'react';
import type { ViewProps } from 'react-native';
import StackScreenNativeComponent from '../../fabric/gamma/StackScreenNativeComponent';

interface StackScreenProps {
  children?: ViewProps['children'];
}

function StackScreen(props: StackScreenProps) {
  return (
    <StackScreenNativeComponent style={{ flex: 1 }}>
      {props.children}
    </StackScreenNativeComponent>
  );
}

export default StackScreen;
