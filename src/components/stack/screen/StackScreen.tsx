import React from 'react';
import { Platform, StyleSheet } from 'react-native';
import StackScreenNativeComponent from '../../../fabric/stack/StackScreenNativeComponent';
import type { NativeEventHandler } from '../../shared/types';
import type {
  OnDismissEventPayload,
  StackScreenProps,
} from './StackScreen.types';
import { useRenderDebugInfo } from '../../../private';
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

  // In a Split column the screen reports the frame of the native column to
  // the shadow tree, so that its content is laid out in that frame. The host
  // of this screen reads the same context.
  const isSplitColumnContent =
    React.useContext(SplitColumnMarkerContext) && Platform.OS === 'ios';

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
      replaceAnimation={replaceAnimation}
      reportsFrameToShadowTree={isSplitColumnContent}>
      <SplitColumnMarkerContext.Provider value={false}>
        {children}
      </SplitColumnMarkerContext.Provider>
    </StackScreenNativeComponent>
  );
}

export default StackScreen;
