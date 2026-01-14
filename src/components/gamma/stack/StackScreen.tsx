import React from 'react';
import { StyleSheet } from 'react-native';
import StackScreenNativeComponent from '../../../fabric/gamma/stack/StackScreenNativeComponent';
import { OnDismissEvent, StackScreenProps } from './StackScreen.types';
import { useRenderDebugInfo } from '../../../private/';

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
  onDismiss,
  onNativeDismiss,
}: StackScreenProps) {
  const onDismissWrapper = React.useCallback(
    (event: OnDismissEvent) => {
      if (event.nativeEvent.isNativeDismiss) {
        onNativeDismiss?.(screenKey);
      } else {
        onDismiss?.(screenKey);
      }
    },
    [onDismiss, onNativeDismiss, screenKey],
  );

  const componentRef = useRenderDebugInfo(
    React.useMemo(() => `StackScreen (${screenKey})`, [screenKey]),
  );

  return (
    <StackScreenNativeComponent
      // @ts-ignore - debug only
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
      onDismiss={onDismissWrapper}>
      {children}
    </StackScreenNativeComponent>
  );
}

export default StackScreen;
