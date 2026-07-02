'use client';

import type { CodegenTypes as CT, ColorValue, ViewProps } from 'react-native';
import { codegenNativeComponent } from 'react-native';

// eslint-disable-next-line @typescript-eslint/ban-types
type GenericEmptyEvent = Readonly<{}>;

type DetentChangedEvent = Readonly<{
  index: CT.Int32;
}>;

interface NativeProps extends ViewProps {
  // General
  isOpen?: CT.WithDefault<boolean, false>;
  detents?: CT.Double[] | undefined;
  prefersGrabberVisible?: CT.WithDefault<boolean, false>;
  preferredCornerRadius?: CT.WithDefault<CT.Float, -1.0>;
  largestUndimmedDetentIndex?: CT.WithDefault<CT.Int32, -1>;
  initialDetentIndex?: CT.WithDefault<CT.Int32, 0>;
  prefersScrollingExpandsWhenScrolledToEdge?: CT.WithDefault<boolean, true>;
  preventNativeDismiss?: CT.WithDefault<boolean, false>;
  nativeContainerBackgroundColor?: ColorValue | undefined;
  // Events
  onWillAppear?: CT.DirectEventHandler<GenericEmptyEvent> | undefined;
  onDidAppear?: CT.DirectEventHandler<GenericEmptyEvent> | undefined;
  onWillDisappear?: CT.DirectEventHandler<GenericEmptyEvent> | undefined;
  onDidDisappear?: CT.DirectEventHandler<GenericEmptyEvent> | undefined;
  onDismiss?: CT.DirectEventHandler<GenericEmptyEvent> | undefined;
  onNativeDismiss?: CT.DirectEventHandler<GenericEmptyEvent> | undefined;
  onNativeDismissPrevented?:
    | CT.DirectEventHandler<GenericEmptyEvent>
    | undefined;
  onDetentChanged?: CT.DirectEventHandler<DetentChangedEvent> | undefined;

  // Workaround helper that triggers a synchronous event to flush a pending
  // shadow-node state update in the current event beat. Mirrors iOS's
  // `EventQueue::UpdateMode::unstable_Immediate`, which Android does not expose
  // to Java/Kotlin as of now.
  // TODO: Remove when a synchronous state update API is exposed on Android.
  // https://github.com/facebook/react-native/pull/56311
  onSyncFlush?: CT.DirectEventHandler<GenericEmptyEvent> | undefined;
}

export default codegenNativeComponent<NativeProps>('RNSFormSheetHost', {
  interfaceOnly: true,
});
