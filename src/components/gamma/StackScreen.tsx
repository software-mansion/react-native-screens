import React from 'react';
import { StyleSheet } from 'react-native';
import StackScreenNativeComponent from '../../fabric/gamma/StackScreenNativeComponent';
import type { NativeSyntheticEvent, ViewProps } from 'react-native';
import type { NativeProps } from '../../fabric/gamma/StackScreenNativeComponent';

export const StackScreenLifecycleState = {
  INIT: 0, // JS rendered & detached native
  VISIBLE: 1, // JS rendered & attached native
  FREEZED: 2, // JS rendered+freezed & detached native
  POPPED: 3, // JS rendered & detaching native 
} as const;

export type StackScreenNativeProps = NativeProps & {
  // Overrides
  lifecycleState: (typeof StackScreenLifecycleState)[keyof typeof StackScreenLifecycleState];
}

type StackScreenProps = {
  children?: ViewProps['children'];
  // Custom events
  onPop?: (screenKey: string) => void;
} & StackScreenNativeProps;

function StackScreen({
  children,
  // Control
  lifecycleState,
  screenKey,
  // Events
  onWillAppear,
  onWillDisappear,
  onDidAppear,
  onDidDisappear,
  // Custom events
  onPop,
}: StackScreenProps) {


  const handleOnDidDisappear = React.useCallback((e: NativeSyntheticEvent<Record<string, never>>) => {
    onDidDisappear?.(e);
    onPop?.(screenKey)
  }, [onDidDisappear, onPop, screenKey]);

  return (
    <StackScreenNativeComponent 
      style={StyleSheet.absoluteFill}
      // Control
      lifecycleState={lifecycleState}
      screenKey={screenKey}
      // Events
      onWillAppear={onWillAppear}
      onDidAppear={onDidAppear}
      onWillDisappear={onWillDisappear}
      onDidDisappear={handleOnDidDisappear}
    >
      {children}
    </StackScreenNativeComponent>
  );
}

export default StackScreen;
