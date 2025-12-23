import React from 'react';
import { StyleSheet } from 'react-native';
import StackScreenNativeComponent from '../../../fabric/gamma/stack/StackScreenNativeComponent';
import type { NativeSyntheticEvent } from 'react-native';
import { StackScreenProps } from './StackScreen.types';

/**
 * EXPERIMENTAL API, MIGHT CHANGE W/O ANY NOTICE
 */
function StackScreen({
  children,
  // Control
  activityMode,
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
      activityMode={activityMode}
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
