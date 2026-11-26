import React from 'react';
import { Platform, StyleSheet } from 'react-native';
import StackHostNativeComponent from '../../../fabric/stack/StackHostNativeComponent';
import type { NativeEventHandler } from '../../shared/types';
import type {
  StackHostProps,
  StackNativeDismissPreventedEvent,
  StackNavStateChangedEvent,
  StackNavStateRequestRejectedEvent,
  StackScreensReleasedEvent,
} from './StackHost.types';
import SplitColumnMarkerContext from '../../split/SplitColumnMarkerContext';

function StackHost(props: StackHostProps) {
  const {
    children,
    ref,
    direction,
    onNavStateChanged,
    onNavStateRequestRejected,
    onScreensReleased,
    onNativeDismissPrevented,
    ...restProps
  } = props;

  // RN's `direction` style sets the native View's layoutDirection, which the
  // stack's native subtree inherits. iOS needs a trait override instead.
  const directionStyle = Platform.OS === 'android' ? { direction } : undefined;

  const headlessModeEnabled =
    React.useContext(SplitColumnMarkerContext) && Platform.OS === 'ios';

  const onNavStateChangedWrapper = React.useCallback<
    NativeEventHandler<StackNavStateChangedEvent>
  >(event => onNavStateChanged?.(event.nativeEvent), [onNavStateChanged]);

  const onNavStateRequestRejectedWrapper = React.useCallback<
    NativeEventHandler<StackNavStateRequestRejectedEvent>
  >(
    event => onNavStateRequestRejected?.(event.nativeEvent),
    [onNavStateRequestRejected],
  );

  const onScreensReleasedWrapper = React.useCallback<
    NativeEventHandler<StackScreensReleasedEvent>
  >(event => onScreensReleased?.(event.nativeEvent), [onScreensReleased]);

  const onNativeDismissPreventedWrapper = React.useCallback<
    NativeEventHandler<StackNativeDismissPreventedEvent>
  >(
    event => onNativeDismissPrevented?.(event.nativeEvent),
    [onNativeDismissPrevented],
  );

  return (
    <StackHostNativeComponent
      ref={ref}
      style={[
        styles.container,
        directionStyle,
        headlessModeEnabled && styles.headless,
      ]}
      {...restProps}
      onNavStateChanged={onNavStateChangedWrapper}
      onNavStateRequestRejected={onNavStateRequestRejectedWrapper}
      onScreensReleased={onScreensReleasedWrapper}
      onNativeDismissPrevented={onNativeDismissPreventedWrapper}
      headlessModeEnabled={headlessModeEnabled}>
      {children}
    </StackHostNativeComponent>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  headless: {
    display: 'contents',
  },
});

export default StackHost;
