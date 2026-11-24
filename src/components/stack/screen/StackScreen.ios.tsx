import React from 'react';
import { StyleSheet } from 'react-native';
import StackScreenIOSNativeComponent from '../../../fabric/stack/StackScreenIOSNativeComponent';
import type { StackScreenProps } from './StackScreen.types';
import { useStackScreen } from './useStackScreen';
import SplitColumnMarkerContext from '../../split/SplitColumnMarkerContext';

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
  // Platform-specific
  ios,
}: StackScreenProps) {
  const { componentRef, onDismissWrapper, nativeAnimation } = useStackScreen({
    screenKey,
    onDismiss,
    onNativeDismiss,
    animation,
  });

  const isSplitColumnContent = React.useContext(SplitColumnMarkerContext);

  return (
    <StackScreenIOSNativeComponent
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
      replaceAnimation={replaceAnimation}
      // Platform-specific
      backGestureEnabled={ios?.backGestureEnabled}
      fullScreenBackGestureEnabled={ios?.fullScreenBackGestureEnabled}
      reportsFrameToShadowTree={isSplitColumnContent}>
      <SplitColumnMarkerContext.Provider value={false}>
        {children}
      </SplitColumnMarkerContext.Provider>
    </StackScreenIOSNativeComponent>
  );
}

export default StackScreen;
