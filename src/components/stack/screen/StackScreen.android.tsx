import React from 'react';
import { StyleSheet } from 'react-native';
import StackScreenAndroidNativeComponent from '../../../fabric/stack/StackScreenAndroidNativeComponent';
import type { StackScreenProps } from './StackScreen.types';
import { useStackScreen } from './useStackScreen';

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
  const { componentRef, onDismissWrapper, nativeAnimation } = useStackScreen({
    screenKey,
    onDismiss,
    onNativeDismiss,
    animation,
  });

  return (
    <StackScreenAndroidNativeComponent
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
      animation={nativeAnimation}
      replaceAnimation={replaceAnimation}>
      {children}
    </StackScreenAndroidNativeComponent>
  );
}

export default StackScreen;
