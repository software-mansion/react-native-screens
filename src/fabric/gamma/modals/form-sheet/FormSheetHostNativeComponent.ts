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
}

export default codegenNativeComponent<NativeProps>('RNSFormSheetHost', {
  interfaceOnly: true,
  excludedPlatforms: ['android'],
});
