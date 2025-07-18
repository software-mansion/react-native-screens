import React from 'react';
import { StyleSheet } from 'react-native';
import StackScreenNativeComponent from '../../fabric/gamma/StackScreenNativeComponent';
import type { NativeSyntheticEvent, ViewProps } from 'react-native';
import type { NativeProps } from '../../fabric/gamma/StackScreenNativeComponent';

export const StackScreenLifecycleState = {
  INITIAL: 0,
  DETACHED: 1,
  ATTACHED: 2,
} as const;

export type StackScreenNativeProps = NativeProps & {
  // Overrides
  maxLifecycleState: (typeof StackScreenLifecycleState)[keyof typeof StackScreenLifecycleState];
};

type StackScreenProps = {
  children?: ViewProps['children'];
  // Custom events
  onPop?: (screenKey: string) => void;
} & StackScreenNativeProps;

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
