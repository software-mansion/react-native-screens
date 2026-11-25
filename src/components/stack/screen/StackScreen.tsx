import React from 'react';
import { Platform, StyleSheet } from 'react-native';
import StackScreenNativeComponent from '../../../fabric/stack/StackScreenNativeComponent';
import type { StackScreenProps } from './StackScreen.types';
import { useRenderDebugInfo } from '../../../private';
import SplitColumnMarkerContext from '../../split/SplitColumnMarkerContext';

function StackScreen({
  children,
  // Control
  screenKey,
  // Events
  onWillAppear,
  onWillDisappear,
  onDidAppear,
  onDidDisappear,
  // Configuration
  preventNativeDismiss,
  animation,
  replaceAnimation,
}: StackScreenProps) {
  const componentRef = useRenderDebugInfo(
    React.useMemo(() => `StackScreen (${screenKey})`, [screenKey]),
  );

  const isSplitColumnContent =
    React.useContext(SplitColumnMarkerContext) && Platform.OS === 'ios';

  return (
    <StackScreenNativeComponent
      // @ts-ignore - debug only
      ref={componentRef}
      style={StyleSheet.absoluteFill}
      // Control
      screenKey={screenKey}
      // Events
      onWillAppear={onWillAppear}
      onDidAppear={onDidAppear}
      onWillDisappear={onWillDisappear}
      onDidDisappear={onDidDisappear}
      // Configuration
      preventNativeDismiss={preventNativeDismiss}
      animation={animation}
      replaceAnimation={replaceAnimation}
      reportsFrameToShadowTree={isSplitColumnContent}>
      <SplitColumnMarkerContext.Provider value={false}>
        {children}
      </SplitColumnMarkerContext.Provider>
    </StackScreenNativeComponent>
  );
}

export default StackScreen;
