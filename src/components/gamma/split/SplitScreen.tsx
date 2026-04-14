import React from 'react';
import { StyleSheet } from 'react-native';
import SplitScreenNativeComponent from '../../../fabric/gamma/split/SplitScreenNativeComponent';
import type { OnDismissEvent, SplitScreenProps } from './SplitScreen.types';

/**
 * EXPERIMENTAL API, MIGHT CHANGE W/O ANY NOTICE
 *
 * Represents one screen in a SplitNavigator column's stack. Set `activityMode="attached"`
 * to push the screen onto the navigation stack, or `"detached"` to hide it.
 *
 * The `screenKey` must be a stable, unique identifier for this screen within its column.
 */
function SplitScreen({
  children,
  // Control
  activityMode,
  screenKey,
  // Dismiss control
  preventNativeDismiss,
  // Lifecycle events
  onWillAppear,
  onDidAppear,
  onWillDisappear,
  onDidDisappear,
  // Dismiss events
  onDismiss,
  onNativeDismiss,
  ...rest
}: SplitScreenProps) {
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

  return (
    <SplitScreenNativeComponent
      style={StyleSheet.absoluteFill}
      activityMode={activityMode}
      screenKey={screenKey}
      preventNativeDismiss={preventNativeDismiss}
      onWillAppear={onWillAppear}
      onDidAppear={onDidAppear}
      onWillDisappear={onWillDisappear}
      onDidDisappear={onDidDisappear}
      onDismiss={onDismissWrapper}
      {...rest}>
      {children}
    </SplitScreenNativeComponent>
  );
}

export default SplitScreen;
