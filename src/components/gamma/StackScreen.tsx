import React from 'react';
import type { ViewProps } from 'react-native';
import {StyleSheet} from 'react-native';
import StackScreenNativeComponent from '../../fabric/gamma/StackScreenNativeComponent';

interface StackScreenProps {
  children?: ViewProps['children'];
}

function StackScreen(props: StackScreenProps) {
  return (
    <StackScreenNativeComponent style={StyleSheet.absoluteFill}>
      {props.children}
    </StackScreenNativeComponent>
  );
}

export default StackScreen;
