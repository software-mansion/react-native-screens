import React from 'react';
import { StyleSheet } from 'react-native';
import StackScreenNativeComponent from '../../../fabric/gamma/StackScreenNativeComponent';
import type { NativeSyntheticEvent } from 'react-native';
import { StackScreenProps } from './StackScreen.types';

export const StackScreenLifecycleState = {
  INITIAL: 0,
  DETACHED: 1,
  ATTACHED: 2,
} as const;

/**
 * EXPERIMENTAL API, MIGHT CHANGE W/O ANY NOTICE
 */
function StackScreen({
  children,
  // Control
  maxLifecycleState,
  screenKey,
  // Events
  onWillAppear,
  onWillDisappear,
  onDidAppear,
  onDidDisappear,
  // Custom events
  onPop,
}: StackScreenProps) {
  const handleOnDidDisappear = React.useCallback(
    (e: NativeSyntheticEvent<Record<string, never>>) => {
      onDidDisappear?.(e);
      onPop?.(screenKey);
    },
    [onDidDisappear, onPop, screenKey],
  );

  return (
    <StackScreenNativeComponent
      style={StyleSheet.absoluteFill}
      // Control
      maxLifecycleState={maxLifecycleState}
      screenKey={screenKey}
      // Events
      onWillAppear={onWillAppear}
      onDidAppear={onDidAppear}
      onWillDisappear={onWillDisappear}
      onDidDisappear={handleOnDidDisappear}>
      {children}
    </StackScreenNativeComponent>
  );
}

export default StackScreen;
