import React from 'react';
import { StyleSheet } from 'react-native';
import StackScreenNativeComponent from '../../../fabric/gamma/stack/StackScreenNativeComponent';
import type { NativeSyntheticEvent } from 'react-native';
import { StackScreenProps } from './StackScreen.types';
import { NativeComponentGenericRef, useRenderDebugInfo } from 'react-native-screens/private';

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
  onDismiss,
  onNativeDismiss,
}: StackScreenProps) {
  const onDismissWrapper = React.useCallback(() => {
    onDismiss?.(screenKey);
  }, [onDismiss, screenKey]);

  const onNativeDismissWrapper = React.useCallback(() => {
    onNativeDismiss?.(screenKey);
  }, [onNativeDismiss, screenKey]);

  const componentRef = useRenderDebugInfo(React.useMemo(() => `StackScreen (${screenKey})`, [screenKey]));

  return (
    <StackScreenNativeComponent
      ref={componentRef}
      style={StyleSheet.absoluteFill}
      // Control
      activityMode={activityMode}
      screenKey={screenKey}
      // Events
      onWillAppear={onWillAppear}
      onDidAppear={onDidAppear}
      onWillDisappear={onWillDisappear}
      onDidDisappear={onDidDisappear}
      onDismiss={onDismissWrapper}
      onNativeDismiss={onNativeDismissWrapper}
    >
      {children}
    </StackScreenNativeComponent>
  );
}

export default StackScreen;
