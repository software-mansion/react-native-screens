import React from 'react';
import { StyleSheet } from 'react-native';
import StackScreenNativeComponent from '../../../fabric/stack/StackScreenNativeComponent';
import type { NativeEventHandler } from '../../shared/types';
import type {
  OnDismissEventPayload,
  StackScreenProps,
} from './StackScreen.types';
import { useRenderDebugInfo } from '../../../private';

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
  onNativeDismissPrevented,
  // Configuration
  preventNativeDismiss,
  animation,
  replaceAnimation,
}: StackScreenProps) {
  const onDismissWrapper = React.useCallback<
    NativeEventHandler<OnDismissEventPayload>
  >(
    event => {
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
      onDismiss={onDismissWrapper}
      onNativeDismissPrevented={onNativeDismissPrevented}
      // Configuration
      preventNativeDismiss={preventNativeDismiss}
      animation={animation}
      replaceAnimation={replaceAnimation}>
      {children}
    </StackScreenNativeComponent>
  );
}

export default StackScreen;
